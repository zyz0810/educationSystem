<template>
  <!--12.22 上线版本-->
  <div class="goods-service">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="商品编码"
                    prop="goodsSn">
        <el-input v-model.trim="listQuery.goodsSn"
                  clearable
                  placeholder="请输入商品编码"
                  @change="queryListByPage" />
      </el-form-item>
      <el-form-item label="商品名称"
                    prop="name">
        <el-input v-model.trim="listQuery.name"
                  clearable
                  placeholder="请输入商品名称"
                  @change="queryListByPage" />
      </el-form-item>
      <el-form-item label="生产厂家"
                    prop="manufacturerName">
        <el-input clearable
                  v-model.trim="listQuery.manufacturerName"
                  @change="queryListByPage"
                  placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item label="供应商名称"
                    prop="supplierName">
        <el-input v-model.trim="listQuery.supplierName"
                  placeholder="请输入供应商名称"
                  clearable
                  @change="queryListByPage" />
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="listQuery.agentCheckStatus"
                   @change="queryListByPage"
                   clearable
                   placeholder="请选择活动状态">
          <el-option label="待提交"
                     value="0"></el-option>
          <el-option label="待审核"
                     value="1"></el-option>
          <el-option label="已通过"
                     value="2"></el-option>
          <el-option label="未通过"
                     value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务状态">
        <el-select v-model="listQuery.agentServiceStatus"
                   @change="queryListByPage"
                   clearable
                   placeholder="请选择服务状态">
          <el-option label="待服务"
                     value="0"></el-option>
          <el-option label="已服务"
                     value="1"></el-option>
          <!--<el-option label="已撤销"
                     value="4"></el-option>
            <el-option label="运营商撤销成功"
                     value="2"></el-option>
          <el-option label="服务商撤销待审核"
                     value="3"></el-option>
          <el-option label="运营商审核撤销成功"
                     value="4"></el-option>
          <el-option label="运营商审核撤销失败"
                     value="5"></el-option>
         -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryListByPage">查询</el-button>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置 </el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 p_10 bg_white">
      <el-button class="filter-item ml_10"
                  v-if="['服务商'].includes(provider_type) && provider_status_foWeb == 0"
                 :disabled="isCanAudit"
                 icon="el-icon-plus"
                 v-rules="{admin:'admin',ordinary:'product:service:submit'}"
                 @click="handleAudit('more')">提交审核</el-button>
      <el-button class="filter-item ml_10"
                 v-if="['服务商'].includes(provider_type) && provider_status_foWeb == 0"
                 :disabled="isCanDown"
                 icon="el-icon-lock"
                 v-rules="{admin:'admin',ordinary:'product:service:revoke'}"
                 @click="putDown('more')">撤销服务</el-button>
      <!--"provider_type == '服务商'"-->
      <div v-if=" permissions.includes('admin') || (provider_type == '服务商' && provider_status_foWeb == 0)">
        <el-table v-loading="listLoading"
                  :data="dataList"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="(list) => selectListChange(list)"
                  border
                  @row-click="handleRowClick"
                  ref="activityTable"
                  highlight-current-row
                  :height="tableHeight">
          <el-table-column type="selection"
                           width="40"
                           v-if="permissions.includes('admin') == false"
                           align="center"></el-table-column>
          <el-table-column label="商品编码"
                           fixed
                           width="160"
                           align="center"
                           prop="goodsSn"></el-table-column>
          <el-table-column label="商品名称"
                           fixed
                           width="140"
                           show-overflow-tooltip
                           align="center"
                           prop="name"> </el-table-column>
          <el-table-column label="生产厂家"
                           align="center"
                           width="160"
                           show-overflow-tooltip
                           prop="manufacturerName"> </el-table-column>
          <el-table-column label="规格"
                           min-width="130"
                           show-overflow-tooltip
                           align="center"
                           prop="skuFullName"></el-table-column>
          <el-table-column label="供应商名称"
                           align="center"
                           min-width="140"
                           show-overflow-tooltip
                           prop="supplierName"></el-table-column>
          <el-table-column label="服务商名称"
                           align="center"
                           min-width="140"
                           show-overflow-tooltip
                           prop="providerName"></el-table-column>
          <el-table-column label="供应商售价"
                           width="120"
                           align="center"
                           prop="supplierRetailPrice"></el-table-column>
          <!--
            <el-table-column label="供应商底价"
                           width="120"
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
                           width="120"
                           align="center"
                           prop="agentSalePrice"></el-table-column>
          <el-table-column label="商品预计收益"
                           width="120"
                           align="center"
                           prop="agentProfitPrice"></el-table-column>
          <el-table-column label="审核状态"
                           align="center"
                           class="agentStatus">
            <template slot-scope="scope">
              <div :class="scope.row.agentCheckStatus=='3'?'agentCheckStatus':''"
                   @click.stop="scope.row.agentCheckStatus=='3'?showReason(scope.row.remark):''">
                {{agentCheckStatusList[scope.row.agentCheckStatus]}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="服务状态"
                           align="center"
                           :formatter="formatAdStatus"
                           prop="agentServiceStatus"></el-table-column>
          <el-table-column label="商品状态"
                           align="center"
                           :formatter="formatProductStatus"
                           prop="productStatus"></el-table-column>
          <el-table-column label="操作"
                           width="220"
                           v-if="!permissions.includes('admin') && (permissions.includes('product:service:edit') || permissions.includes('product:service:submit') || permissions.includes('product:service:revoke'))"
                           align="center"
                           fixed="right">
            <template slot-scope="scope">
              <!--审核状态 待提交0 待审核1 已通过2 不通过3-->
              <!--编辑可以操作的情况是审核状态已通过、不通过、待提交，且同时商品状态非下架的-->
              <el-button type="text"
                         v-rules="{admin:'admin',ordinary:'product:service:edit'}"
                         :disabled='[0].includes(scope.row.productStatus) || [1].includes(scope.row.agentCheckStatus)'
                         @click.stop="goView('update',scope.row)">编辑</el-button>
              <!--提交审核审核按钮可以点击的情况是审核状态为待提交的-->
              <el-button type="text"
                         v-rules="{admin:'admin',ordinary:'product:service:submit'}"
                         :disabled='[0].includes(scope.row.productStatus) || [1,2,3].includes(scope.row.agentCheckStatus)'
                         @click.stop="handleAudit('one',scope.row)">提交审核</el-button>
              <!--撤销按钮可以操作的情况是1 5-->
              <el-button type="text"
                         v-rules="{admin:'admin',ordinary:'product:service:revoke'}"
                         :disabled='[0].includes(scope.row.productStatus) || [0,2,3,4].includes(scope.row.agentServiceStatus)'
                         @click.stop="putDown('one',scope.row)">撤销服务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--普通-->
      <div v-else>
        <el-table v-loading="listLoading"
                  :row-style="{height:'54px'}"
                  :cell-style="{padding:'0px'}"
                  :data="dataList"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="(list) => selectListChange(list)"
                  border
                  @row-click="handleRowClick"
                  ref="activityTable"
                  highlight-current-row
                  :height="tableHeight">
          <el-table-column label="商品编码"
                           align="center"
                           prop="goodsSn"></el-table-column>
          <el-table-column label="商品名称"
                           align="center"
                           prop="name">
          </el-table-column>
          <el-table-column label="生产厂家"
                           align="center"
                           prop="manufacturerName">
          </el-table-column>
          <el-table-column label="规格"
                           align="center"
                           prop="skuFullName"></el-table-column>
          <el-table-column label="供应商名称"
                           align="center"
                           prop="supplierName"></el-table-column>
          <el-table-column label="服务商名称"
                           align="center"
                           prop="providerName"></el-table-column>
          <!--<el-table-column label="供应商售价"
                           align="center"
                           prop="supplierRetailPrice"></el-table-column>
          <el-table-column label="供应商底价"
                           align="center"
                           prop="supplierFloorPrice"></el-table-column>-->
          <el-table-column label="平台售价"
                           align="center"
                           prop="platformPrice"></el-table-column>
          <el-table-column label="商品预计收益"
                           align="center"
                           prop="agentProfitPrice"></el-table-column>
        </el-table>
      </div>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="listByPage"
                  class="text-right" />
      <addService v-show="showDialog"
                  :showDialog.sync="showDialog"
                  @insertMeal="listByPage"
                  :spreadData="spreadData" />
    </div>
    <!-- 审核不通过原因弹窗 -->
    <el-dialog title="审核失败原因"
               :visible.sync="dialogVisible">
      <div>{{failedReason}}</div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateAdvertisementStatus,
  updateAdvertisement,
  updateAdvertisementApprove,
  listByPage,
  modify,
  operatorProductServiceSearchLog
} from "@/api/goodsService";
import { mapGetters, mapState } from "vuex";
import addService from "./addService";
export default {
  name: "spreadList",
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        goodsSn: '',
        name: "",
        skuFullName: "",
        supplierName: "",
        manufacturerName: '',
        agentCheckStatus: '',
        agentServiceStatus: "",//服务状态
      },
      total: 0,
      dataList: [],
      selectList: [],
      listLoading: false,
      showDialog: false,
      tableHeight: 400,
      isActivated: false,
      spreadData: {
        id: "",
        options: "",
      },
      // providerType: '',
      agentCheckStatusList: {
        0: '待提交',
        1: '待审核',
        2: '通过',
        3: '未通过',
      },
      dialogVisible: false,
      failedReason: '',
    };
  },
  components: {
    addService,
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    //服务商服务状态:0为开启;1为关闭 provider_status_foWeb
    ...mapGetters(["provider_type", "provider_status_foWeb",]),
    // 提交审核
    isCanAudit () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some((item) => [0].includes(item.productStatus) || [1, 2, 3].includes(item.agentCheckStatus))
      );
    },
    // 撤销服务
    isCanDown () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some((item) => [0].includes(item.productStatus) || [0, 2, 3, 4].includes(item.agentServiceStatus))
      );
    },
    // SET_PROVIDER_TYPE
  },
  methods: {
    // 审核失败原因
    showReason (val) {
      this.failedReason = val || "--"
      this.dialogVisible = true
    },
    queryListByPage () {
      this.listQuery.page = 1
      this.listByPage()
    },
    resetList () {
      this.listQuery = {
        limit: 10,
        page: 1,
        goodsSn: '',
        skuFullName: "",
        supplierName: "",
        name: "",
        manufacturerName: '',
        agentCheckStatus: '',
        agentServiceStatus: "",//服务状态
      };
      this.listByPage();
    },
    listByPage () {
      const { adStatus } = this.listQuery;
      Object.assign(this.listQuery, {
        adStatus: adStatus == 0 ? "" : adStatus,
      });
      listByPage(this.listQuery).then((res) => {
        this.dataList = res.data.data;
        this.total = res.data.count;
        // if (this.dataList.length > 0) {
        //   this.providerType = res.data.data[0].providerType
        // }

        this.$nextTick(() => {
          this.$refs.activityTable.doLayout();
        });
      });
    },
    goView (options, val) {
      let id = "";
      let productId = "";
      if (options != "add") {
        id = val.advertisementId;
        productId = val.id;
      }
      Object.assign(this.spreadData, {
        options,
        productId,
        id,
      });
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
      this.showDialog = true;
    },
    showCause (value) {
      this.$confirm(value, "提示", {
        confirmButtonText: "确定",
        type: "warning",
      });
    },
    // 撤销服务
    putDown (val, val2) {
      this.hint("确定撤销服务吗?").then((res) => {
        if (res) {
          this.listLoading = true;
          let items = {}
          if (val == 'more') {
            items = this.selectList.map((item) => {
              return {
                id: item.id,
              };
            });
          } else {
            items = [{
              id: val2.id,
            }]
          }
          modify({
            items,
            operatorType: 'cancelCPS',//cancelCPS撤销审核
          }).then(
            (res) => {
              this.listLoading = false;
              this.listByPage();
              this.$message({
                message: res.resp_msg,
                type: "success",
              });
            }
          );
        }
      });
    },
    // 提交审核
    handleAudit (val, val2) {
      this.hint("确定要提交审核？").then((res) => {
        if (res) {
          let items = {}
          // 单个操作
          if (val == 'one' && (Number(val2.agentSalePrice) > Number(val2.highestPrice)
            || Number(val2.agentSalePrice) < Number(val2.lowestPrice))) {
            this.$message({
              message: '服务商售价不能低于最低售价，不能高于最高售价',
              type: "warning",
            });
            return
          }
          // 多个操作 
          const boo = this.selectList.every((item) => {
            if (Number(item.agentSalePrice) < Number(item.lowestPrice) || Number(item.agentSalePrice) > Number(item.highestPrice)) {
              return false
            } else {
              return true;
            }
          });
          if (!boo) {
            this.$message({ message: "服务商售价不能低于最低售价，不能高于最高售价", type: "warning" });
            return;
          }
          if (val == 'more') {
            items = this.selectList.map((item) => {
              return {
                id: item.id,
              };
            });
          } else {
            items = [{
              id: val2.id,
            }]
          }
          modify({
            items,
            operatorType: 'submitCheckCPS',
          }).then((res) => {
            this.listByPage();
            this.$message({
              message: res.resp_msg,
              type: "success",
            });
          });
        }
      });
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).catch();
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    selectListChange (val) {
      this.selectList = val
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "待提交"
        : cellValue == 1
          ? "待审核"
          : cellValue == 2
            ? "通过"
            : cellValue == 3
              ? "未通过"
              : "";
    },
    formatAdStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "待服务"
        : cellValue == 1
          ? "已服务"
          : cellValue == 2
            ? "运营商撤销成功"
            : cellValue == 3
              ? "服务商撤销待审核"
              : cellValue == 4
                ? "运营商审核撤销成功"
                : cellValue == 5
                  ? "运营商审核撤销失败"
                  : "";
    },
    // 商品状态
    // OFF (0,"下架"), ON (1,"上架"),  SOLD_OUT (2,"售罄"), DELETED (3,"删除")
    formatProductStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "下架"
        : cellValue == 1
          ? "上架"
          : cellValue == 2
            ? "售罄"
            : cellValue == 3
              ? "删除"
              : "";
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      };
    });
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
    this.listByPage();
  },
};
</script>

<style scoped lang="scss">
.goods-service {
  box-sizing: border-box;
  padding: 15px;
}
.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
.agentStatus {
  color: red;
}
.agentCheckStatus {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}
// /deep/.el-table__fixed-body-wrapper {
//   top: 63px !important;
// }
/deep/.el-table__fixed,
.el-table__fixed-right {
  height: 100% !important; //设置高优先，以覆盖内联样式
}
</style>
