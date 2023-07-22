<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="10vh"
             title="商品服务"
             class="dialogContainer"
             @open="open">
    <el-table v-loading="listLoading"
              class="mt_10 sumTable"
              :data="products"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="(list) => (selectList = list)"
              border
              @row-click="handleRowClick"
              ref="activityTable"
              highlight-current-row>
      <el-table-column label="商品编码"
                       width="150"
                       align="center"
                       prop="goodsSn"></el-table-column>
      <el-table-column label="SKU编码"
                       width="150"
                       align="center"
                       prop="skuCode"></el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       prop="name"></el-table-column>
      <el-table-column label="生产厂家"
                       align="center"
                       prop="manufacturerName"></el-table-column>
      <el-table-column label="规格"
                       align="center"
                       prop="skuFullName"></el-table-column>
      <el-table-column label="供应商售价"
                       width="100"
                       align="center"
                       prop="supplierRetailPrice"></el-table-column>
      <!--
        <el-table-column label="供应商底价"
                       width="100"
                       align="center"
                       prop="supplierFloorPrice"></el-table-column>
     -->
      <el-table-column label="平台售价"
                       align="center"
                       prop="platformPrice"></el-table-column>
      <el-table-column label="最高售价"
                       align="center"
                       prop="highestPrice"></el-table-column>
      <el-table-column label="最低售价"
                       align="center"
                       prop="lowestPrice"></el-table-column>
      <el-table-column label="服务商售价"
                       align="center"
                       width="120"
                       prop="agentSalePrice"
                       v-if="spread.allSetting == false">
        <template slot-scope="scope">
          <!--
          <el-input v-model.trim="scope.row.agentSalePrice == '0.00' ?'' : scope.row.agentSalePrice"
                    :disabled="isCanView"
                    placeholder="请输入"></el-input>
         -->
          <input class="tableInput"
                 type="number"
                 placeholder="请输入"
                 onkeyup="value=value.replace(/[^(\d+)(\.\d+)?]/g,'')"
                 v-model.trim="scope.row.agentSalePrice" />
        </template>
      </el-table-column>
      <el-table-column label="商品预计收益"
                       width="100"
                       align="center"
                       prop="agentProfitPrice">
        <!--（服务商售价-供应商底价）x（100-平台费率）/100 -->
        <template slot-scope="scope">
          <!-- <div>
            {{scope.row.agentSalePrice == 0 ? '0' : 
            ((scope.row.agentSalePrice - scope.row.supplierFloorPrice) * (100 - scope.row.platformServiceRate)/100) < 0 ? '0'  
            : (scope.row.agentSalePrice - scope.row.supplierFloorPrice) * (100 - scope.row.platformServiceRate)/100  }}
          </div>
         -->
          <div v-if="scope.row.agentSalePrice != 0 ">
            {{(((scope.row.agentSalePrice - scope.row.supplierFloorPrice) * (100 - scope.row.platformServiceRate))/100).toFixed(2)}}
          </div>
          <div v-else>
            {{(((scope.row.platformPrice - scope.row.supplierFloorPrice) * (100 - scope.row.platformServiceRate))/100).toFixed(2)}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_footer">
      <el-button type="primary"
                 :loading="isSave"
                 @click="editor"
                 :disabled="isCanView">保 存</el-button>
      <el-button class="ml_20"
                 @click="cancel">取消</el-button>
    </div>
    <div class="audit">
      <!--agentServiceStatus  == 1 已服务  5运营商审核撤销失败-->
      <el-checkbox :disabled="[1,5].includes(agentServiceStatus)"
                   v-model="spread.submitCheck">提交审核</el-checkbox>
    </div>
    <addWares :showDialog.sync="showWaresDialog"
              :spread="spread"
              @insertWares="insertWares" />
  </my-dialog>
</template>

<script>
import {
  saveAdvertisement,
  updateAdvertisement,
  getProductServeById,
  modify
} from "@/api/goodsService";
import addWares from "./addWares";

export default {
  name: "addMeal",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    spreadData: {
      required: false,
      type: Object,
      default: {
        options: "",
        id: "",
      },
    },
  },
  data () {
    return {
      spread: {
        startTime: "",
        submitCheck: false,
        allSetting: false,
        endTime: "",
        status: 4,
        id: "",
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      unifyPrice: "",
      isSave: false,
      showWaresDialog: false,
      currentStep: 0,
      products: [],
      selectList: [],
      listLoading: false,
      rules: {
        startTime: [
          { required: true, message: "请选择推广时间", trigger: "blur" },
        ],
      },
      id: '',
      agentServiceStatus: '',
    };
  },
  components: {
    addWares,
  },
  computed: {
    isCanView () {
      return this.spreadData.options == "view";
    },
    isEditor () {
      return this.spreadData.options == "update";
    },
    dateTime: {
      get () {
        if (this.spread.startTime && this.spread.endTime) {
          return [this.spread.startTime, this.spread.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.spread.startTime = v[0];
          this.spread.endTime = v[1];
        } else {
          this.spread.startTime = "";
          this.spread.endTime = "";
        }
      },
    },
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },
  methods: {
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    getProductServeById () {
      this.listLoading = true;
      getProductServeById({ id: this.id })
        .then((res) => {
          this.products = res.data;
          this.agentServiceStatus = res.data[0].agentServiceStatus
          this.spread.submitCheck = [1, 5].includes(res.data[0].agentServiceStatus) ? true : '' //默认选
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    allSettingChange () {
      this.unifyPrice = "";
      this.products.forEach((item) => (item.agentSalePrice = ""));
    },
    // 编辑保存
    editor () {
      // highestPrice
      // lowestPrice
      const { startTime, endTime, id, allSetting, submitCheck } = this.spread;
      if (this.products.some((item) => !item.agentSalePrice)) {
        this.$message({
          message: '请设置服务商售价费用',
          type: "warning",
        });
        return;
      }
      if (Number(this.products[0].agentSalePrice) > Number(this.products[0].highestPrice)
        || Number(this.products[0].agentSalePrice) < Number(this.products[0].lowestPrice)) {
        this.$message({
          message: '服务商售价不能低于最低售价，不能高于最高售价',
          type: "warning",
        });
        return;
      }
      let items = [];
      if (allSetting) {
        items = this.products.map((item) => {
          return {
            productId: item.productId,
            skuId: item.skuId,
            id: item.id,
            agentSalePrice: this.unifyPrice,
            supplierFloorPrice: item.supplierFloorPrice
          };
        });
      } else {
        items = this.products.map((item) => {
          return {
            productId: item.productId,
            skuId: item.skuId,
            id: item.id,
            agentSalePrice: item.agentSalePrice,
            supplierFloorPrice: item.supplierFloorPrice
          };
        });
      }
      this.isSave = true;
      modify({
        items,
        submitCheck: submitCheck ? 'yes' : 'no',
        operatorType: 'updateCPS',//编辑
      })
        .then((res) => {
          this.isSave = false;
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
            this.$emit("insertMeal");
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          this.isSave = false;
        });
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        confirmButtonText: "确定",
        type: "info",
      }).catch();
    },
    save () {
      const { startTime, endTime, id, allSetting, submitCheck } = this.spread;
      // if (!this.products.length) {
      //   this.hint("请至少选择一件商品");
      //   return;
      // }
      if (allSetting == false && this.products.some((item) => !item.agentSalePrice)) {
        this.hint("请设置推广费");
        return;
      }
      // if (allSetting == true && !this.unifyPrice) {
      //   this.hint("请设置推广费");
      //   return;
      // }
      let list = [];
      if (allSetting) {
        list = this.products.map((item) => {
          return {
            productId: item.id,
            skuId: item.skuId,
            submitCheck: submitCheck ? 'yes' : 'no',
            agentSalePrice: this.unifyPrice,
          };
        });
      } else {
        list = this.products.map((item) => {
          return {
            productId: item.id,
            skuId: item.skuId,
            agentSalePrice: item.agentSalePrice,
          };
        });
      }
      this.isSave = true;
      saveAdvertisement({
        list,
        startTime,
        allSetting,
        endTime,
        submitCheck: submitCheck ? 1 : 0,
        operatorType: 'updateCPS',//编辑
      })
        .then((res) => {
          this.isSave = false;
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
            this.$emit("insertMeal");
            this.dialogVisible = false;
          }
        })
        .catch(() => {
          this.isSave = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    },
    insertWares (arr) {
      const current = this.products.map((item) => item.skuId);
      const data = arr.filter((item) => !current.includes(item.skuId));
      this.products = this.products.concat(data);
    },
    handleDelete () {
      const ids = this.selectList.map((item) => item.skuId);
      const arr = this.products.filter((item) => !ids.includes(item.skuId));
      this.products = arr;
    },
    nextStep () {
      if (this.isCanView) {
        this.currentStep = 1;
      }
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          this.currentStep = 1;
        }
      });
    },
    open () {
      this.id = this.spreadData.productId;
      this.getProductServeById();
    },
    close () {
      Object.assign(this.spread, {
        startTime: "",
        endTime: "",
        id: "",
      });
      Object.assign(this.spreadData, {
        id: "",
        options: "",
      });
      this.products = [];
      this.selectList = [];
      this.isSave = false;
      this.currentStep = 0;
      this.unifyPrice = "";
      this.agentServiceStatus = '';
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 100px);
  box-sizing: border-box;
  overflow: auto;
}
.dialogBox {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.audit {
  text-align: center;
}
.unify {
  padding: 10px 0;
  .el-input {
    width: 200px;
  }
}
.tableInput {
  height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  width: 100%;
}
</style>
