<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="服务商名称"
                    v-if="permissions.includes('admin')">
        <el-input v-model.trim="listQuery.providerName"
                  @change="providerSaleAmount"
                  clearable
                  placeholder="服务商名称" />
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model.trim="listQuery.sn"
                  @change="providerSaleAmount"
                  clearable
                  placeholder="订单编号" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.clientName"
                  @change="providerSaleAmount"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model.trim="listQuery.mobile"
                  @change="providerSaleAmount"
                  clearable
                  placeholder="手机号" />
      </el-form-item>
      <el-form-item label="客户经理">
        <el-select placeholder="客户经理"
                   filterable
                   v-model="listQuery.cherkId"
                   @change="providerSaleAmount"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker v-model="createTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="providerSaleAmount"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="providerSaleAmount">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="container">
      <el-table v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <!--
          <el-table-column label="服务地区"
                         align="center"
                         width="400"
                         prop="providerAreaName">
          <template slot-scope="scope">
            <el-popover placement="top-start"
                        width="800"
                        trigger="hover"
                        :disabled="scope.row.providerAreaName == null || scope.row.providerAreaName.length <= 30">
              <div>{{ scope.row.providerAreaName }}</div>
              <span slot="reference"
                    v-if="scope.row.providerAreaName == null || scope.row.providerAreaName.length <= 30">{{ scope.row.providerAreaName }}</span>
              <span slot="reference"
                    v-if="scope.row.providerAreaName != null && scope.row.providerAreaName.length > 30">{{ scope.row.providerAreaName.substr(0, 30) + "..." }}</span>
            </el-popover>
          </template>
        </el-table-column>
        -->
        <el-table-column label="服务商名称"
                         min-width="150"
                         show-overflow-tooltip
                         v-if="permissions.includes('admin')"
                         align="center"
                         prop="providerName"></el-table-column>
        <el-table-column label="客户经理"
                         show-overflow-tooltip
                         align="center"
                         width="120"
                         prop="clerkName"></el-table-column>
        <el-table-column label="订单编号"
                         align="center"
                         width="170"
                         prop="sn"></el-table-column>
        <el-table-column label="客户名称"
                         align="center"
                         width="150"
                         show-overflow-tooltip
                         prop="clientName"></el-table-column>
        <el-table-column label="手机号"
                         width="100"
                         align="center"
                         prop="mobile"></el-table-column>
        <el-table-column label="订单金额"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="供应商优惠金额"
                         width="120"
                         align="center"
                         prop="discountAmount"></el-table-column>
        <el-table-column label="余额抵扣"
                         align="center"
                         prop="useRebatePrice"></el-table-column>
        <el-table-column label="实付金额"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="退款金额"
                         align="center"
                         prop="refundAmount"></el-table-column>
        <el-table-column label="收益总额"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="下单时间"
                         align="center"
                         width="140"
                         :formatter="formatTime"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         prop="orderStatusStr"></el-table-column>
        <el-table-column label="申请结算时间"
                         align="center"
                         width="140"
                         :formatter="formatTime"
                         prop="checkTime"></el-table-column>
        <el-table-column label="操作"
                         min-width="100"
                         fixed="right"
                         v-if="permissions.includes('admin') || permissions.includes('service:profit:review:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'service:profit:review:view' }"
                       @click.stop="goDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="queryProviderSaleAmount" />
      <Details :showDialog.sync="showDetailsDialog"
               :orderDetail='orderDetail'></Details>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  queryProviderSaleAmount,
  getSelfAndChildUsers
} from "@/api/serviceProfit";
import Details from "./details";
import { getUsersByRole } from "@/api/common";
export default {
  components: {
    Details,
  },
  data () {
    return {
      listQuery: {
        providerName: "",
        sn: '',
        clientName: "",
        mobile: "",
        startTime: "",
        endTime: '',
        cherkId: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      userId: '',
      customerName: '',
      orderType: {
        userId: '',
        customerName: '',
        option: {},
      },
      showDetailsDialog: false,
      orderDetail: {},
      userOptions: [],//过滤掉禁用员工
    };
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
    this.queryProviderSaleAmount();
    this.getUsersByRole() //过滤禁用员工
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    createTime: {
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
  },
  methods: {
    // 过滤禁用员工
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;

          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    getCreateTime (e) {
      this.listQuery.createTime = e + ' 23:59:59'
      this.queryProviderSaleAmount();
    },
    //推广收益明细
    goDetail (val) {
      this.orderDetail = val
      this.showDetailsDialog = true
    },
    providerSaleAmount () {
      this.listQuery.page = 1
      this.queryProviderSaleAmount()
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        providerName: "",
        sn: '',
        clientName: "",
        mobile: "",
        startTime: "",
        endTime: '',
        cherkId: "",
        page: 1,
        limit: 10,
      });
      this.createTime = ''
      this.queryProviderSaleAmount();
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 获取客户列表
    queryProviderSaleAmount () {
      queryProviderSaleAmount(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch((err) => console.log(err));
    },
    // 订单状态 0:未审核1:已审核2.已完成3.已取消
    formatOrderStatus (row, column, value, index) {
      return value == 0
        ? "未审核"
        : value == 1
          ? "已审核"
          : value == 2
            ? "已完成"
            : value == 3
              ? "已取消"
              : "--";
    },
  },
}
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
    margin: 10px 10px 10px 0;
  }
}
.el-icon-question {
  color: #fe9400;
}
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
