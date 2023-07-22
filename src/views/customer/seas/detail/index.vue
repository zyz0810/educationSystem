<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="84%"
             @close="close"
             top="10vh"
             title="客户详情"
             class="dialogContainer"
             @open="open">
    <div class="detailInfo"
         v-loading="listLoading">
      <div class="titleInfo">
        {{ dataInfo.storeName || "--" }}
        <span class="status">{{dataInfo.bargain == 0 ? "未成交" : "已成交"}}</span>
      </div>
      <div class="flex">
        <div>客户级别： <span>{{ dataInfo.storeLevelStr || "--" }}</span></div>
        <div> 负责人：<span>{{ dataInfo.clerkName || "--" }}</span></div>
        <div>联系人：<span>{{ dataInfo.linkman || "--" }}</span></div>
        <!--
        <div>
          最后下单时间：
          <span>{{ dataInfo.orderTime || "--" }}</span>
        </div>
        -->
        <div>最后拜访时间：<span>{{ signTime || "--" }}</span></div>
      </div>
    </div>
    <div class="btn">
      <el-button class="filter-item"
                 icon="el-icon-edit"
                 v-if='customer == 1'
                 @click="editorNewFollow">写新跟进</el-button>
      <el-button class="filter-item"
                 icon="el-icon-plus"
                 v-if='customer == 1'
                 @click="followSave"
                 v-rules="{admin:'admin',ordinary:'customer:task:add'}">新建任务</el-button>
      <el-button class="filter-item"
                 icon="el-icon-view"
                 @click="transfer"
                 v-rules="{admin:'admin',ordinary:'customer:transfer'}">转移客户</el-button>
      <el-button class="filter-item"
                 icon="el-icon-view"
                 @click="highSeas"
                 v-if='customer == 1'
                 v-rules="{admin:'admin',ordinary:'customer:enter:highsee'}">放入公海</el-button>
      <el-button class="filter-item"
                 icon="el-icon-view"
                 v-if='customer == 1'
                 @click="bargain"
                 v-rules="{admin:'admin',ordinary:'customer:change:dealstatus'}">更改成交状态</el-button>
      <el-button class="filter-item"
                 v-if='customer == 1'
                 icon="el-icon-edit"
                 :disabled="dataInfo.result == 0"
                 @click="getDetail"
                 v-rules="{admin:'admin',ordinary:'customer:edit'}">编辑</el-button>
      <!--      <el-button :disabled="dataInfo.result == 1"-->
      <!--                 class="filter-item"-->
      <!--                 v-if='customer == 1'-->
      <!--                 icon="el-icon-delete"-->
      <!--                 @click="deleteCustomer"-->
      <!--                 v-rules="{admin:'admin',ordinary:'customer:del'}">删除</el-button>-->
    </div>
    <el-tabs class="border-card"
             v-model="tab">
      <el-tab-pane label="商品"
                   name="five">
        <goodsManagement :customerStoreId="customerStoreId"
                         v-if="tab == 'five'" />
      </el-tab-pane>
      <el-tab-pane label="商品分析"
                   name="seven">
        <goodsAnalysis :customerStoreId="customerStoreId"
                       :storeName="dataInfo.storeName"
                       v-if="tab == 'seven'" />
      </el-tab-pane>
      <el-tab-pane label="订单"
                   name="four">
        <orderLog :customerStoreId="customerStoreId"
                  v-if="tab == 'four'" />
      </el-tab-pane>
      <el-tab-pane label="盘点单"
                   name="six">
        <dishSpot :customerStoreId="customerStoreId"
                  v-if="tab == 'six'" />
      </el-tab-pane>
      <el-tab-pane label="客户动态"
                   name="first">
        <followLog :customerCrmId="customerCrmId"
                   v-if="tab == 'first'"
                   ref="followLog" />
      </el-tab-pane>
      <el-tab-pane label="资料详情"
                   name="second">
        <basic :customerStoreId="customerStoreId"
               :dataInfo="dataInfo"
               :customer='customer'
               v-if="tab == 'second'" />
      </el-tab-pane>
      <!--
        <el-tab-pane label="证件资料"
                   name="three">
        <documents :dataInfo="dataInfo"
                   v-if="tab == 'three'"
                   @success="getCustomerDetail" />
      </el-tab-pane>
     -->
    </el-tabs>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
    <addFollow :showDialog.sync="showFollowDialog"
               :customerCrmId="customerCrmId"
               :customerStoreId="customerStoreId"
               @success="callBack" />
    <allocation :showDialog.sync="showAllocationDialog"
                :customer="customer"
                :selectList="selectList" />
    <addTask :storeName="dataInfo.storeName"
             :showDialog.sync="showAddDialog"
             :customerStoreId="customerStoreId"
             :customerCrmId="customerCrmId"
             :typeOptions="typeOptions"
             @insertTask="callBack" />
    <editor :showDialog.sync="showEditorDialog"
            :customer="customer"
            @modify="getCustomerDetail"
            ref="child"
            :customerStoreId="customerStoreId"
            :id="id" />
  </my-dialog>
</template>

<script>
import {
  getCustomerDetail,
  followSave,
  highSeas,
  bargain,
  deleteCustomer
} from "@/api/customer/customer";
import allocation from "../allocation";
import followLog from "./followLog";
import addTask from "./addTask";
import basic from "./basic";
import documents from "./documents";
import editor from "./editor";
import orderLog from "./orderLog";
import goodsManagement from "./goodsManagement"
import dishSpot from './dishSpot'
import goodsAnalysis from './goodsAnalysis'
export default {
  name: "orderView",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    customerStoreId: {
      required: true,
      type: [Number, String],
      default: ""
    },
    customerCrmId: {
      required: true,
      type: [Number, String],
      default: ""
    },
    id: {
      required: false,
      type: [String, Number],
      default: ""
    },
    // 客户界面进入0公海1是客户
    customer: {
      required: false,
      type: Number,
      default: 0
    },
    signTime: {
      required: false,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      listLoading: false,
      showFollowDialog: false,
      showAddDialog: false,
      showAllocationDialog: false,
      showEditorDialog: false,
      dataInfo: {},
      selectList: [],
      tableHeight: 400,
      tab: "five",
      typeOptions: {
        type: "",
        optionType: "add",
        option: {}
      }
    };
  },
  components: {
    followLog,
    basic,
    addTask,
    documents,
    orderLog,
    editor,
    allocation,
    goodsManagement,
    dishSpot,
    goodsAnalysis
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  methods: {
    getDetail () {
      this.showEditorDialog = true
      this.$refs.child.parentMsg(this.customerCrmId);
    },
    open () {
      this.tab = "five";
      this.getCustomerDetail();
    },
    transfer () {
      this.selectList = [{ customerStoreId: this.customerStoreId, id: this.id }];
      this.showAllocationDialog = true;
    },
    editorNewFollow () {
      this.customerCrmId = this.dataInfo.id
      this.showFollowDialog = true;
    },
    callBack () {
      if (this.tab == "first") {
        this.$refs.followLog.getCustomerFollow();
      }
      this.getCustomerDetail();
    },
    async getCustomerDetail () {
      this.listLoading = true;
      // 客户界面进入0公海1是客户 
      let param = {
        id: this.id,
        claimSearchType: -1
      }
      if (this.customer == 1) {
        delete param.claimSearchType
      }
      getCustomerDetail(param).then(res => {
        this.listLoading = false;
        Object.assign(this.dataInfo, res.data);
      });
    },
    close () {
      Object.assign(this.dataInfo, {});
      this.tab = "";
      this.dataInfo = {}
      this.dialogVisible = false;
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    followSave (type = "add") {
      this.typeOptions = {
        optionType: 'add'
      };
      this.showAddDialog = true;
    },
    bargain () {
      this.hint("确定要更改成交状态？").then(res => {
        if (res) {
          bargain({ ids: this.id }).then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
          });
        }
      });
    },
    deleteCustomer () {
      this.hint("确定要更删除客户？").then(res => {
        if (res) {
          deleteCustomer({ storeIds: this.customerStoreId }).then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("deleteCustomer");
          });
        }
      });
    },
    highSeas () {
      this.hint("确定要放入公海？").then(res => {
        if (res) {
          highSeas({ ids: this.id }).then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px !important;
}
.detailInfo {
  span {
    font-weight: bold;
    margin-right: 30px;
  }
  .titleInfo {
    font-family: "微软雅黑 Bold", "微软雅黑";
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    line-height: 28px;
    .status {
      margin: 0px 10px;
      font-size: 14px;
      color: white;
      background: #1890ff;
      font-weight: 0;
      border-radius: 5px;
      padding: 0px 10px;
    }
  }
}
.btn {
  margin-top: 10px;
  .el-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
/deep/.follow {
  height: 403px;
  overflow-y: scroll;
}
</style>
