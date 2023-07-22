<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="10vh"
             :title="textMap[priceData.operatorType]"
             class="dialogContainer"
             @open="open">
    <el-steps :active="firstStep"
              process-status="success"
              class="mb_10"
              simple>
      <el-step title="基本信息"></el-step>
      <el-step title="设置商品"></el-step>
      <el-step title="设置客户"></el-step>
    </el-steps>
    <div v-show="firstStep == 0"
         class="dialogBox">
      <el-form ref="firstForm"
               :model="formData"
               label-width="100px"
               class="dialog_form mt_10"
               :rules="rules">
        <el-form-item label="名称"
                      prop="name"
                      class="ml_10">
          <el-input v-model.trim="formData.name"
                    :disabled="isCanView"
                    placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="开始时间"
                      prop="startTime"
                      class="ml_10">
          <el-date-picker v-model="formData.startTime"
                          type="datetime"
                          :disabled="isCanView"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="startDatePicker"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间"
                      prop="endTime"
                      class="ml_10">
          <el-date-picker v-model="formData.endTime"
                          :disabled="isCanView"
                          type="datetime"
                          placeholder="选择日期时间"
                          default-time="23:59:59"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :picker-options="endDatePicker"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="page_footer">
        <el-button type="primary"
                   @click="nextStep1">下一步</el-button>
        <el-button class="ml_20"
                   @click="cancel">取消</el-button>
      </div>
    </div>
    <div v-show="firstStep == 1">
      <div class="flex">
        <el-button class="filter-item"
                   type="primary"
                   :disabled="isCanView"
                   @click="showWaresDialog = true">添加商品</el-button>
        <el-button class="filter-item ml_10"
                   type="warning"
                   :disabled="isCanDelete || isCanView"
                   @click="handleDelete">删除商品</el-button>
      </div>
      <el-table v-loading="listLoading"
                class="mt_10 sumTable"
                :data="products"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                border
                @selection-change="(list) => (selectList = list)"
                @row-click="handleProductClick"
                ref="activityTable"
                highlight-current-row>
        <el-table-column type="selection"
                         width="40"></el-table-column>
        <el-table-column label="商品编码"
                         align="center"
                         min-width="160"
                         show-overflow-tooltip
                         prop="goodsSn"></el-table-column>
        <el-table-column label="SKU编码"
                         min-width="160"
                         show-overflow-tooltip
                         align="center"
                         prop="skuCode"></el-table-column>
        <el-table-column label="商品名称"
                         align="center"
                         min-width="140"
                         show-overflow-tooltip
                         prop="name"></el-table-column>
        <el-table-column label="生产厂家"
                         align="center"
                         min-width="140"
                         show-overflow-tooltip
                         prop="manufacturerName"></el-table-column>
        <el-table-column label="规格"
                         align="center"
                         min-width="130"
                         show-overflow-tooltip
                         prop="skuFullName"></el-table-column>
        <el-table-column label="供应商售价"
                         align="center"
                         min-width="100"
                         prop="supplierRetailPrice"></el-table-column>
        <!--
          <el-table-column label="供应商底价"
                         align="center"
                         min-width="100"
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
                         min-width="100"
                         prop="agentSalePrice"></el-table-column>
      </el-table>
      <div class="page_footer">
        <el-button type="primary"
                   @click="firstStep = 0">上一步</el-button>
        <el-button type="primary"
                   @click="nextStep">下一步</el-button>
        <el-button class="ml_20"
                   @click="cancel">取消</el-button>
      </div>
    </div>
    <div v-show="firstStep == 2">
      <el-form :rules="rules">
        <el-form-item label="区域价格策略"
                      prop="cusTypeList"></el-form-item>
      </el-form>
      <div class="flex">
        <el-button class="filter-item"
                   type="primary"
                   :disabled="isCanView"
                   @click="addCustomerPrice">新增</el-button>
        <el-button class="filter-item ml_10"
                   type="warning"
                   :disabled="cusTypeisCanDelete || isCanView"
                   @click="deleteCustomerPrice()">移除</el-button>
        <el-button class="filter-item ml_10"
                   type="primary"
                   :disabled="cusTypeisCanUpdate || isCanView"
                   @click="updateArea">编辑区域</el-button>
      </div>
      <el-table v-loading="listLoading"
                class="mt_20 sumTable"
                :data="cusTypeList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectTypeList = list)"
                border
                :row-class-name="rouClassNameFn"
                @row-click="handleRowClick"
                ref="cusTypeTable"
                highlight-current-row>
        <el-table-column type="selection"
                         width="40"></el-table-column>
        <el-table-column label="类型"
                         align="center"
                         prop="customerStoreId">
          <template slot-scope="scope">
            <el-select v-model="scope.row.customerTypeId"
                       filterable
                       placeholder="请选择"
                       @visible-change="chooseCustomerType"
                       :disabled="isCanView">
              <el-option v-for="item in customerOptiona"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                         :disabled="item.disabled"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="售价"
                         align="center"
                         prop="discount">
          <template slot-scope="scope">
            <el-input type="number"
                      v-model.trim="scope.row.discount"
                      :disabled="isCanView"
                      placeholder="请输入售价"
                      @change="updateDiscount('custype')" />
          </template>
        </el-table-column>
        <el-table-column label="区域"
                         align="center"
                         prop="areaIds"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div style="max-height: 120px; overflow-y: auto">
              <p v-for="(item,index) in scope.row.areaItems"
                 style="margin: 0"
                 :key="index">
                {{ item.fullName }}
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item label="指定客户价格策略"></el-form-item>
      </el-form>
      <el-tabs v-model="activeTab"
               type="border-card">
        <el-tab-pane label="指定参与客户"
                     name="1">
          <!--          <addClient v-model="takeConstomers" :isCanView="isCanView" :list="giveConstomers" />-->
          <addClient v-model="takeConstomers"
                     that="specify"
                     ref="specify"
                     @getParentData="getParentData"
                     :isCanView="isCanView"
                     :list="giveConstomers" />
        </el-tab-pane>
        <el-tab-pane label="指定不参与客户"
                     name="2">
          <!--          <addClient v-model="giveConstomers" :isCanView="isCanView" :list="takeConstomers" />-->
          <addClient ref="no_specify"
                     that="no_specify"
                     v-model="giveConstomers"
                     @getParentData="getParentData"
                     :isCanView="isCanView"
                     :list="takeConstomers" />
        </el-tab-pane>
      </el-tabs>
      <div class="page_footer">
        <el-button type="primary"
                   @click="firstStep = 1">上一步</el-button>
        <el-button type="primary"
                   v-if="!isCanView"
                   class="ml_20"
                   :loading="isSave"
                   @click="save">保存</el-button>
        <el-button class="ml_20"
                   @click="cancel">取消</el-button>
      </div>
    </div>
    <addWares :showDialog.sync="showWaresDialog"
              @insertWares="insertWares" />
    <!--    <addArea :showDialog.sync="showAreaDialog" :treeList="treeList" :checkTreeList="checkTreeList" @insertAreas="insertAreas" />-->
    <addArea :showDialog.sync="showAreaDialog"
             :treeList="treeList"
             :checkTreeList="checkTreeList"
             @insertAreas="insertAreas" />
  </my-dialog>
</template>

<script>
// import {
//   handleMealActivity,
//   getMealDetail,
//   getCustomerStoreCategoryList
// } from "@/api/activity";
import {
  productPriceAdd,
  productPriceUpdate,
  productPriceView,
} from "@/api/productPriceSale";
import { findAreaTree } from "@/api/area";
import { mapGetters } from "vuex";
import addWares from "./addWares";
import addClient from "./addClient";
import addArea from "./addArea";
import ScrollPane from "@/layout/components/TagsView/ScrollPane";
import { usable } from "@/api/customer/customer"; // waves directive


function hasValidRange (rule, value, callback, list) {
  if (list && list.length > 0) {
    callback();
  } else {
    callback(new Error("请选择区域"));
  }
}
export default {
  name: "addPrice",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    priceData: {
      required: true,
      type: Object,
      default: {
        option: "",
        operatorType: "add",
        id: "",
      },
    },
  },
  data () {
    return {
      cusTypeList: [
        {
          areaIds: [],
          discount: "",
          customerTypeId: "",
        },
      ],
      textMap: {
        update: "编辑价格策略",
        add: "新增价格策略",
        view: "查看价格策略",
      },
      customerOption: [],
      formData: {
        id: "",
        name: "",
        startTime: "",
        endTime: "",
        productList: "",
        customerPriceList: [],
        cusTypeList: [],
      },
      current: 0,
      isSave: false,
      treeList: [],
      checkTreeList: [],
      activeTab: "1",
      takeConstomers: [],
      giveConstomers: [],
      props: {
        label: "name",
        children: "childrens",
        disabled: this.checkDisabled,
      },
      showWaresDialog: false,
      showAreaDialog: false,
      firstStep: 0,
      time: "",
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      products: [],
      selectList: [],
      selectTypeList: [],
      customerCategoryList: [],
      listLoading: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
        // cusTypeList: [
        //   { required: true, message: "请输入价格策略", trigger: "blur" },
        // ],
        // customerType: [
        //   { required: true, message: "请选择客户类型", trigger: "blur" },
        // ],
      },
      currentRowIndex: "",
      // chooseCustomerOption:[],
      customerOptiona: [],
    };
  },
  components: {
    ScrollPane,
    addWares,
    addArea,
    addClient,
  },
  computed: {
    defaultTime () {
      return '23' + ':' + '59' + ':' + '59';
    },
    isCanDelete () {
      return this.selectList.length < 1;
    },
    isCanView () {
      return this.priceData.operatorType == "view";
    },
    cusTypeisCanDelete () {
      return this.selectTypeList.length < 1;
    },
    cusTypeisCanUpdate () {
      return this.selectTypeList.length != 1;
    },
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
    chooseCustomerOption: {
      get () {
        let arr = this.cusTypeList.map((item) => item.customerTypeId);
        // this.customerOption.push(...arr)//或者
        // let arr1 = [...this.customerOption,...arr]
        // //去重
        // const arr3 = Array.from(new Set(arr1))   //let arr3 = [...new Set(arr1)]
        // this.customerOptiona = arr3
        let brr = JSON.parse(JSON.stringify(this.customerOption));
        let crr = [];
        arr.forEach((item) => {
          brr.forEach((child) => {
            if (child.id == item.id) {
              let json = {
                id: child.id,
                name: child.name,
                disabled: true,
              };
              crr.push(json);
            } else {
              crr.push(child);
            }
          });
        });
        this.customerOptiona = crr;
      },
      set (v) { },
    },
  },
  filters: {
    filtersMarket: function (value) {
      let StatusArr = { 0: "下架", 1: "上架", 2: "售罄", 3: "删除" };
      return StatusArr[value];
    },
  },
  methods: {
    updateDiscount (type) {
      if (type == "custype") {
      }
    },
    chooseCustomerType (e) {
      this.chooseCustomerOption = this.cusTypeList.map(
        (item) => item.customerTypeId
      );
    },
    updateArea () {
      this.checkTreeList = this.cusTypeList[
        this.selectTypeList[0].index
      ].areaIds;
      this.showAreaDialog = true;
    },
    getParentData (value) {
      let a = [];
      this.cusTypeList.map(function (value, index, array) {
        a = a.concat(value.areaIds);
      });
      let areaArrList = new Set(a);
      const checkedAreaList = Array.from(areaArrList);
      // const { customerTypeId, customerRangeType } = this.form;
      const customerTypeId = this.cusTypeList.map(
        (item) => item.customerTypeId
      );
      // const customerRangeType = this.form.areaRange
      if (value == "no_specify") {
        this.$refs.no_specify.callback(checkedAreaList, customerTypeId);
      } else if (value == "specify") {
        this.$refs.specify.callback([], []);
      } else {
        this.$refs.specify.callback([], []);
      }
    },
    addCustomerPrice () {
      this.cusTypeList.push({
        areaIds: [],
        discount: "",
        customerTypeId: "",
      });
    },
    deleteCustomerPrice () {
      // this.cusTypeList
      const ids = this.selectTypeList.map((item) => item.index);
      const arr = this.cusTypeList.filter((item) => !ids.includes(item.index));
      this.cusTypeList = arr;
    },

    getCustomerCategory () {
      usable({ page: 1, limit: 9999 }).then((res) => {
        if (res.resp_code == 0) {
          this.customerOption = res.data.data.map((item) => {
            let json = {
              id: item.id,
              name: item.name,
              disabled: false,
            };
            return json;
          });
          this.customerOptiona = JSON.parse(
            JSON.stringify(this.customerOption)
          );
        }
      });
    },
    resetList () {
      this.listQuery = {
        startTime: "",
        endTime: "",
        mealStatus: "",
      };
    },
    checkDisabled (data, note) {
      return this.isCanView;
    },
    findAreaTree () {
      findAreaTree().then((res) => {
        this.treeList = res.data;
        const arr = this.treeList.map((item) => item.id);
      });
    },
    rouClassNameFn ({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    handleRowClick (row, column, event) {
      this.currentRowIndex = row.index;
      this.$refs.cusTypeTable.toggleRowSelection(row);
    },
    handleProductClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    getPriceDetail () {
      const { id } = this.formData;
      this.listLoading = true;
      productPriceView({ id })
        .then((res) => {
          const {
            productList,
            cusTypeList,
            productCustomerPriceList,
          } = res.data;
          const startTime = this.$moment(res.data.startTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const endTime = this.$moment(res.data.endTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.takeConstomers = productCustomerPriceList.filter(
            (item) => item.type == 1
          );
          this.giveConstomers = productCustomerPriceList.filter(
            (item) => item.type == 0
          );
          this.cusTypeList = cusTypeList;
          this.chooseCustomerOption = cusTypeList.map(
            (item) => item.customerTypeId
          );
          this.formData = {
            name: res.data.name,
            startTime: startTime,
            endTime: endTime,
            productList: "",
            customerPriceList: [],
            cusTypeList: [],
          };
          this.products.splice(0, productList.length, ...productList);
          // this.takeConstomers = constomers.filter(
          //   (item) => item.customerRange == 1
          // );
          // this.giveConstomers = constomers.filter(
          //   (item) => item.customerRange == 2
          // );
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        confirmButtonText: "确定",
        type: "info",
      }).catch();
    },
    radioChange (value) {
      const arr = this.treeList.map((item) => item.id);
      if (value == 0) {
        this.$refs.tree.setCheckedKeys(arr);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    save () {
      const productIds = this.products.map((item) => item.productId);
      let warningConstomer = "";
      const warnArr = this.takeConstomers.filter((item) => {
        if (item.discount == "") {
          warningConstomer = "请输入指定客户售价";
          return item;
        } else if (item.discount <= 0) {
          warningConstomer = "售价必须大于0";
          return item;
        }
      });
      if (warnArr.length > 0) {
        this.$alert(warningConstomer, "提示", {
          confirmButtonText: "确定",
        });
        return;
      }
      const arr = this.takeConstomers.map((item) => {
        return {
          type: 1,
          customerStoreId: item.customerStoreId,
          discount: item.discount,
        };
      });
      const brr = this.giveConstomers.map((item) => {
        return {
          type: 0,
          customerStoreId: item.customerStoreId,
          // discount: 100,
        };
      });
      // let customerType = JSON.parse(JSON.stringify(this.cusTypeList));
      // if (customerType.length < 1) {
      //   this.$alert("请添加区域价格策略", "提示", {
      //     confirmButtonText: "确定",
      //   });
      //   return;
      // } else {
      //   let warning = "";
      //   let arr = customerType.filter((item) => {
      //     if (item.customerTypeId == "") {
      //       warning = "请选择客户类型";
      //       return item;
      //     }
      //     if (item.discount == "") {
      //       warning = "请输入折扣";
      //       return item;
      //     } else if (item.discount <= 0) {
      //       warning = "折扣必须大于0";
      //       return item;
      //     }
      //     if (item.areaIds.length < 1) {
      //       warning = "请选择区域";
      //       return item;
      //     }
      //   });
      //   if (arr.length > 0) {
      //     this.$alert(warning, "提示", {
      //       confirmButtonText: "确定",
      //     });
      //     throw new Error("区域价格策略没有填写完整！");
      //   }
      // }



      // let customerType = JSON.parse(JSON.stringify(this.cusTypeList)); // 区域价格策略
      // let customerArr = arr.concat(brr) //客户价格策略
      // let arrLength = customerType.filter(item=>{
      //   if(item.customerTypeId == '' && item.discount == '' && item.areaIds.length < 1){
      //
      //   }else{
      //     return item;
      //   }
      // })
      // if(customerArr.length<1){//指定不指定为空
      //   if(arrLength.length < 1){//区域价格策略为空
      //     this.$alert("区域价格策略和指定客户价格策略不能同时为空", "提示", {
      //       confirmButtonText: "确定"
      //     });
      //     return;
      //   }else{//区域价格策略不为空
      //     let warning = '';
      //     let arr = customerType.filter(item => {
      //       if (item.customerTypeId == '') {
      //         warning = '请选择客户类型'
      //         return item;
      //       }
      //       if (item.discount == '') {
      //         warning = '请输入折扣'
      //         return item;
      //       } else if (item.discount <= 0) {
      //         warning = '折扣必须大于0'
      //         return item;
      //       }
      //       if (item.areaIds.length < 1) {
      //         warning = '请选择区域'
      //         return item;
      //       }
      //     })
      //     if (arr.length > 0) {
      //       this.$alert(warning, "提示", {
      //         confirmButtonText: "确定"
      //       });
      //       throw new Error("区域价格策略没有填写完整！");
      //     }
      //   }
      // }else {//指定不指定不为空
      //   if(arrLength.length > 1 ){//区域价格策略为空
      //     let warning = '';
      //     let arr = customerType.filter(item => {
      //       if (item.customerTypeId == '') {
      //         warning = '请选择客户类型'
      //         return item;
      //       }
      //       if (item.discount == '') {
      //         warning = '请输入折扣'
      //         return item;
      //       } else if (item.discount <= 0) {
      //         warning = '折扣必须大于0'
      //         return item;
      //       }
      //       if (item.areaIds.length < 1) {
      //         warning = '请选择区域'
      //         return item;
      //       }
      //     })
      //     if (arr.length > 0) {
      //       this.$alert(warning, "提示", {
      //         confirmButtonText: "确定"
      //       });
      //       throw new Error("区域价格策略没有填写完整！");
      //     }
      //     return;
      //   }else{
      //     customerType = []
      //   }
      // }
      let customerType = JSON.parse(JSON.stringify(this.cusTypeList)); // 区域价格策略
      let customerArr = arr.concat(brr) //客户价格策略
      let arrLength = customerType.filter(item => {
        if (item.customerTypeId == '' && item.discount == '' && item.areaIds.length < 1) {

        } else if (item.customerTypeId !== '' && item.discount !== '' && item.areaIds.length > 0) {

        } else {
          return item;
        }
      })
      let brrLength = customerType.filter(item => {
        if (item.customerTypeId !== '' && item.discount !== '' && item.areaIds.length > 0) {
          return item;
        }
      })
      if (customerArr.length < 1) {//指定不指定为空
        if (brrLength.length < 1) {//区域价格策略为空
          this.$alert("区域价格策略和指定客户价格策略不能同时为空", "提示", {
            confirmButtonText: "确定"
          });
          return;
        } else {//区域价格策略不为空
          let warning = '';
          let arr = customerType.filter(item => {
            if (item.customerTypeId == '') {
              warning = '请选择客户类型'
              return item;
            }
            if (item.discount == '') {
              warning = '请输入售价'
              return item;
            } else if (item.discount <= 0) {
              warning = '售价必须大于0'
              return item;
            }
            if (item.areaIds.length < 1) {
              warning = '请选择区域'
              return item;
            }
          })
          if (arr.length > 0) {
            this.$alert(warning, "提示", {
              confirmButtonText: "确定"
            });
            throw new Error("区域价格策略没有填写完整！");
          }
        }
      } else {//指定不指定不为空
        if (arrLength.length > 0) {//区域价格策略为空
          let warning = '';
          let arr = customerType.filter(item => {
            if (item.customerTypeId == '') {
              warning = '请选择客户类型'
              return item;
            }
            if (item.discount == '') {
              warning = '请输入售价'
              return item;
            } else if (item.discount <= 0) {
              warning = '售价必须大于0'
              return item;
            }
            if (item.areaIds.length < 1) {
              warning = '请选择区域'
              return item;
            }
          })
          if (arr.length > 0) {
            this.$alert(warning, "提示", {
              confirmButtonText: "确定"
            });
            throw new Error("区域价格策略没有填写完整！");
          }
          // return;
        } else if (brrLength.length > 0) {
          customerType = brrLength
        } else {
          customerType = []
        }
      }

      const cusTypeList = customerType.map((item) => {
        this.$delete(item, "areaItems");
        this.$delete(item, "createTime");
        this.$delete(item, "updateTime");
        this.$delete(item, "index");
        return item;
      });
      let formData = {
        name: this.formData.name,
        productIds,
        customerPriceList: arr.concat(brr),
        cusTypeList: cusTypeList,
        startTimeStr: this.formData.startTime,
        endTimeStr: this.formData.endTime,
      };
      if (this.priceData.operatorType == "update") {
        this.$set(formData, "id", this.priceData.id);
        this.isSave = true;
        productPriceUpdate(formData)
          .then((res) => {
            this.isSave = false;
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.$emit("insertPrice");
              this.dialogVisible = false;
            }
          })
          .catch(() => {
            this.isSave = false;
          });
      } else {
        this.isSave = true;
        productPriceAdd(formData)
          .then((res) => {
            this.isSave = false;
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.$emit("insertPrice");
              this.dialogVisible = false;
            }
          })
          .catch(() => {
            this.isSave = false;
          });
      }
    },
    cancel () {
      this.dialogVisible = false;
    },
    getcustomerStoreCategory () {
      getCustomerStoreCategoryList().then((res) => {
        this.customerCategoryList = res.data.filter((item) => item.status == 0);
      });
    },

    beginDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.endTime) {
            return new Date(self.formData.endTime).getTime() < time.getTime();
          }
        },
      };
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.startTime) {
            return new Date(self.formData.startTime).getTime() > time.getTime();
          }
        },
      };
    },
    insertWares (arr) {
      // const current = this.products.map((item) => item.skuId);
      // const data = arr.filter((item) => !current.includes(item.skuId));
      // this.products = this.products.concat(data);
      if (arr.length > 0) {
        this.products = arr
      }
    },
    insertAreas (arr) {
      let json = {
        discount: this.cusTypeList[this.selectTypeList[0].index].discount,
        customerTypeId: this.cusTypeList[this.selectTypeList[0].index]
          .customerTypeId,
        areaIds: arr.map((item) => item.id),
        areaItems: arr,
      };
      this.$set(this.cusTypeList, this.selectTypeList[0].index, {
        discount: this.cusTypeList[this.selectTypeList[0].index].discount,
        customerTypeId: this.cusTypeList[this.selectTypeList[0].index]
          .customerTypeId,
        areaIds: arr.map((item) => item.id),
        areaItems: arr,
      });
    },
    handleDelete () {
      const ids = this.selectList.map((item) => item.skuId);
      const arr = this.products.filter((item) => !ids.includes(item.skuId));
      this.products = arr;
    },
    nextStep1 () {
      if (this.isCanView) {
        this.firstStep = 1;
      }
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          this.firstStep = 1;
        }
      });
    },
    nextStep () {
      if (this.isCanView) {
        this.firstStep = 2;
      }
      // this.$refs.secondForm.validate(valid => {
      //   if (valid) {
      if (!this.products.length) {
        this.$alert("请添加商品", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }
      // const boo = this.products.every(item => !item.quantity);
      // if (boo) {
      //   this.$alert("请给添加的商品增加数量", "提示", {
      //     confirmButtonText: "确定"
      //   });
      //   return;
      // }
      this.firstStep = 2;
      //   }
      // });
    },
    open () {
      const { id, operatorType, option } = this.priceData;
      this.formData.id = id;
      if (operatorType != "add") {
        // this.getMealDetail();
        this.getPriceDetail();
      }
      this.getCustomerCategory();
      this.findAreaTree();
      this.$nextTick(function () {
        this.$refs.firstForm.clearValidate();
      });
    },
    close () {
      this.cusTypeList = [
        {
          areaIds: [],
          discount: "",
          customerTypeId: "",
        },
      ];
      this.textMap = {
        update: "编辑价格策略",
        add: "新增价格策略",
        view: "查看价格策略",
      };
      this.customerOption = [];
      this.activeTab = "1";
      this.formData = {
        id: "",
        name: "",
        startTime: "",
        endTime: "",
        productList: "",
        customerPriceList: [],
        cusTypeList: [],
      };
      this.current = 0;
      this.isSave = false;
      this.treeList = [];
      this.takeConstomers = [];
      this.giveConstomers = [];
      this.props = {
        label: "name",
        children: "childrens",
        disabled: this.checkDisabled,
      };
      this.showWaresDialog = false;
      this.showAreaDialog = false;
      this.firstStep = 0;
      this.time = "";
      this.startDatePicker = this.beginDate();
      this.endDatePicker = this.processDate();
      this.products = [];
      this.selectList = [];
      this.customerCategoryList = [];
      this.listLoading = false;
      this.rules = {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
        // customerType: [
        //   { required: true, message: "请选择客户类型", trigger: "blur" },
        // ],
      };
      this.currentRowIndex = "";
      this.$refs.firstForm.clearValidate();
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_form .el-input {
  width: 200px;
}
.treeBox {
  height: 140px;
  overflow: auto;
  border: 1px solid #c8e0f0;
  margin-right: 40px;
}
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
</style>
