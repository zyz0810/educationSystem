<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.customerName"
                  @change="queryHighSeasList"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model.trim="listQuery.mobile"
                  @change="queryHighSeasList"
                  clearable
                  placeholder="手机" />
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select filterable
                   placeholder="客户类型"
                   @change="queryHighSeasList"
                   v-model="listQuery.customerTypeId"
                   clearable>
          <el-option v-for="(item, index) in typeOptions"
                     :key="index"
                     :label="item.name"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户级别">
        <el-select v-model="listQuery.storeLevel"
                   filterable
                   @change="queryHighSeasList"
                   placeholder="客户级别"
                   clearable>
          <el-option :label="item.dictName"
                     :value="item.dictCode"
                     v-for="(item, index) in level_List"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成交状态">
        <el-select v-model="listQuery.bargain"
                   filterable
                   @change="queryHighSeasList"
                   placeholder="成交状态"
                   clearable>
          <el-option label="未成交"
                     value="0"></el-option>
          <el-option label="已成交"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <!--
        <el-form-item label="最后跟进">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="queryHighSeasList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      -->
      <el-form-item label="创建时间">
        <el-date-picker v-model="createTime"
                        clearable
                        type="daterange"
                        @change="queryHighSeasList"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryHighSeasList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="container">
      <el-form :inline="true"
               :model="listQuery"
               class="search">
        <el-form-item>
          <el-button icon="iconfont icon-jiaosefenpei"
                     @click="showAllocationDialog = true"
                     type="primary"
                     v-rules="{ admin: 'admin', ordinary: 'highsee:distribution' }"
                     :disabled="isCanAllocation">分配</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="iconfont icon-lingqukehu"
                     @click="claimCustomer"
                     :disabled="isReceive"
                     v-rules="{ admin: 'admin', ordinary: 'highsee:receive' }"
                     type="primary">领取</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="iconfont icon-daochu"
                     v-rules="{ admin: 'admin', ordinary: 'highsee:export' }"
                     @click="exportFile">导出全部</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column label="客户名称"
                         width="140"
                         show-overflow-tooltip
                         align="center"
                         prop="storeName"
                         fixed="left">
          <template slot-scope="scope">
            <a class="link"
               @click="toDetail(scope.row)">
              {{ scope.row.storeName }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="客户编号"
                         width="160"
                         align="center"
                         prop="storeSn">
        </el-table-column>
        <el-table-column label="联系人"
                         align="center"
                         width="110"
                         show-overflow-tooltip
                         prop="linkman"></el-table-column>
        <el-table-column label="手机号"
                         width="110"
                         align="center"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="联系方式"
                         width="110"
                         align="center"
                         prop="telephone">
        </el-table-column>
        <el-table-column label="客户类型"
                         width="100"
                         show-overflow-tooltip
                         align="center"
                         prop="customerTypeStr"></el-table-column>
        <el-table-column label="客户级别"
                         width="100"
                         show-overflow-tooltip
                         align="center"
                         prop="storeLevelStr"></el-table-column>
        <el-table-column label="客户来源"
                         align="center"
                         prop="sourceStr"></el-table-column>
        <el-table-column label="客户状态"
                         align="center"
                         :formatter="formatterEnabled"
                         prop="enabled"></el-table-column>
        <el-table-column label="审核状态"
                         align="center"
                         prop="result">
          <template slot-scope="scope">
            <div v-if="!scope.row.storeSn">未认证</div>
            <div v-else>
              <div v-if="scope.row.result == 0">审核中</div>
              <div v-if="scope.row.result == 1">已通过</div>
              <el-button type="text"
                         v-if="scope.row.result == 2"
                         @click.stop="showReason(scope.row.failedReason)">审核失败</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成交状态"
                         align="center"
                         width="100"
                         :formatter="formatBargain"
                         prop="bargain"></el-table-column>
        <el-table-column label="下单状态"
                         align="center"
                         :formatter="formatOrderStatus"
                         prop="orderStatus"></el-table-column>
        <el-table-column label="最后拜访时间"
                         width="140"
                         align="center"
                         prop="signTime"></el-table-column>
        <el-table-column label="最后下单时间"
                         width="140"
                         align="center"
                         prop="orderTime"></el-table-column>
        <el-table-column label="最后跟进时间"
                         align="center"
                         width="140"
                         prop="followTime"></el-table-column>
        <el-table-column label="更新时间"
                         width="140"
                         align="center"
                         prop="updateTime"></el-table-column>
        <el-table-column label="创建时间"
                         width="140"
                         align="center"
                         prop="createTime"></el-table-column>
        <el-table-column label="加入公海时间"
                         width="140"
                         align="center"
                         prop="highseasTime"></el-table-column>
        <el-table-column label="备注"
                         align="center"
                         prop="remark"></el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right m-t0"
                  @pagination="highSeasList" />
      <allocation :showDialog.sync="showAllocationDialog"
                  :selectList="selectList"
                  @success="highSeasList" />
      <detail :showDialog.sync="showDetailDialog"
              :customerStoreId="customerStoreId"
              :customerCrmId="customerCrmId"
              :id="id"
              @deleteCustomer="highSeasList" />
    </div>
    <!-- 审核不通过原因弹窗 -->
    <el-dialog title="审核失败原因"
               :visible.sync="dialogVisible">
      <div>{{failedReason}}</div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  highSeasList,
  claimCustomer,
  exportClaim,
  exportCustomer,
  usable,
} from "@/api/customer/customer";
import { mapActions, mapGetters } from "vuex";
import detail from "./detail/index";
import allocation from "./allocation";
export default {
  data () {
    return {
      dialogVisible: false,
      listQuery: {
        sortType: 4,//按更新时间倒叙
        customerName: "",
        mobile: "",
        customerTypeId: "",
        storeLevel: "",
        page: 1,
        endTime: "",
        claimSearchType: -1,
        startTime: "",
        rEndTime: '',
        rStartTime: '',
        limit: 10,
        bargain: "",
      },
      total: 0,
      customerStoreId: "",
      id: "",
      listLoading: false,
      showDetailDialog: false,
      showAllocationDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      typeOptions: [], //客户类型
      customerCrmId: "",
      failedReason: '',
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 190;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 190;
      };
    });
    this.highSeasList();
    this.getDict();
    this.usable();
  },
  computed: {
    isCanAllocation () {
      return this.selectList.length < 1;
    },
    isReceive () {
      return this.selectList.length > 0;
    },
    // 不可批量导出
    isExport () {
      return this.selectList.length >= 1;
    },
    ...mapGetters(["follow_List", "level_List"]),
    dateTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
    // 创建时间
    createTime: {
      get () {
        if (this.listQuery.rStartTime && this.listQuery.rEndTime) {
          return [this.listQuery.rStartTime, this.listQuery.rEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.rStartTime = v[0] + ' 00:00:00';
          this.listQuery.rEndTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.rStartTime = "";
          this.listQuery.rEndTime = "";
        }
      },
    },
  },
  components: {
    allocation,
    detail,
  },
  methods: {
    // 审核失败原因
    showReason (val) {
      this.dialogVisible = true
      this.failedReason = val || "--"
    },
    // 客户状态
    formatterEnabled (row, column, value, index) {
      return value == 0
        ? "禁用"
        : value == 1
          ? "启用"
          : "--";
    },
    ...mapActions(["getDict", "getBacklog"]),
    // 客户列表中客户类型接口
    usable () {
      usable()
        .then((res) => {
          this.typeOptions = res.data.data;
        })
        .catch((err) => console.log(err));
    },
    queryHighSeasList () {
      this.listQuery.page = 1
      this.highSeasList()
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        customerName: "",
        mobile: "",
        customerTypeId: "",
        storeLevel: "",
        endTime: "",
        startTime: "",
        rEndTime: '',
        rStartTime: '',
        page: 1,
        limit: 10,
        claimSearchType: -1,
        bargain: "",
      });
      this.highSeasList();
    },
    toDetail (row) {
      const { customerStoreId, id } = row;
      this.customerStoreId = customerStoreId;
      this.id = id;
      this.showDetailDialog = true;
    },
    // 获取客户列表
    highSeasList () {
      highSeasList(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch((err) => console.log(err));
    },
    formatBargain (row, column, cellValue, index) {
      return cellValue == 0 ? "未成交" : cellValue == 1 ? "已成交" : "--";
    },
    // 下单状态
    formatOrderStatus (row, column, value, index) {
      return value == 2 ? "未下单" : value == 1 ? "已下单" : "";
    },
    hint () {
      const h = this.$createElement;
      return new Promise((resolve, reject) => {
        this.$msgbox({
          title: "确认提示",
          iconClass: "el-icon-question",
          message: h("div", null, [
            h(
              "p",
              { style: "color: #666666;font-weight:bold" },
              "是否确认领取客户？"
            ),
            // h(
            //   "p",
            //   { style: "color: #666666" },
            //   "领取后*天后未跟进/成交，客户将自动放回公海"
            // ),
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              resolve(true);
              done();
            } else {
              resolve(false);
              done();
            }
          },
        });
      });
    },
    // 分配给我的客户
    claimCustomer () {
      this.hint().then((res) => {
        if (res) {
          claimCustomer().then((res) => {
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.highSeasList();
              this.getBacklog();
            }
          });
        }
      });
    },
    exportFile () {
      const userIds = this.selectList.map((item) => item.userId);
      const {
        customerName,
        mobile,
        customerTypeId,
        storeLevel,
        endTime,
        startTime,
        bargain,
      } = this.listQuery;
      let b = [];
      this.selectList.forEach((item, index) => {
        b.push(item.customerStoreId);
      });
      exportCustomer({
        claimSearchType: -1,
        customerName,
        mobile,
        storeIds: b,
        customerTypeId,
        storeLevel,
        endTime,
        startTime,
        bargain,
      }).then((res) => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate.toLocaleDateString().split("/").join("-");
        const str = "公海客户";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.border-card {
  margin-top: 20px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
.container {
  background: #ffffff;
  padding: 15px;
}
.search {
  border-color: rgb(233, 233, 233);
  background: #ffffff;
  overflow: hidden;
  padding: 0 !important;
  .el-form-item {
    float: left;
    margin: 0px 10px 15px 0px;
  }
}
.el-icon-question {
  color: #fe9400;
}
.link {
  color: #1890ff;
  text-decoration: underline;
}
/deep/.search_box .el-form-item {
  float: none;
}
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.m-t0 {
  margin-top: 0px;
}
</style>
