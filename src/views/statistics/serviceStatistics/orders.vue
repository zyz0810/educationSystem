<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="服务业绩订单列表">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">服务商名称：{{datail.providerName}}</div>
        <div class="e-name">日期：{{datail.orderCreateTime}}</div>
      </div>
      <el-form-item label="订单编号">
        <el-input v-model.trim="listQuery.sn"
                  @change="queryProviderSaleOrderDetailV2"
                  clearable
                  placeholder="订单编号" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.clientName"
                  @change="queryProviderSaleOrderDetailV2"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model.trim="listQuery.mobile"
                  @change="queryProviderSaleOrderDetailV2"
                  clearable
                  placeholder="手机号" />
      </el-form-item>
      <!--
        <el-form-item label="订单状态">
        <el-select placeholder="订单状态"
                   @change="queryProviderSaleOrderDetailV2"
                   v-model="listQuery.orderStatus"
                   clearable>
          <el-option label="全部"
                     :value="0"></el-option>
          <el-option label="待付款"
                     :value="1"></el-option>
          <el-option label="待审核"
                     :value="2"></el-option>
          <el-option label="待发货"
                     :value="3"></el-option>
          <el-option label="已发货"
                     :value="4"></el-option>
          <el-option label="已完成"
                     :value="5"></el-option>
          <el-option label="已取消"
                     :value="6"></el-option>
          <el-option label="已付款"
                     :value="7"></el-option>
        </el-select>
      </el-form-item>
      -->
      <el-form-item>
        <el-button class="filter-item"
                   type="primary"
                   icon="el-icon-search"
                   @click="queryProviderSaleOrderDetailV2">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   icon="el-icon-refresh"
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
                height="300"
                ref="activityTable"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column label="订单编号"
                         align="center"
                         prop="sn"
                         width="180"></el-table-column>
        <el-table-column label="客户名称"
                         align="center"
                         width="160"
                         show-overflow-tooltip
                         prop="clientName">
        </el-table-column>
        <el-table-column label="手机号"
                         align="center"
                         width="100"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="商品金额"
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
        <el-table-column label="收益金额"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="平台收益金额"
                         align="center"
                         width="100"
                         prop="providerProfitAmount"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         prop="orderStatusStr"></el-table-column>
        <el-table-column label="下单时间"
                         align="center"
                         width="140"
                         :formatter="formatTime"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="orderLDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
        <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="queryProviderSaleOrderDetailV2" />
    -->
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
    <!--查看订单详情-->
    <ordersDetail :showDialog.sync="showrderDetailDialog"
                  :datail='datail'
                  :orderDetail='orderDetail'></ordersDetail>
  </my-dialog>
</template>

<script>
import { queryProviderSaleOrderDetailV2 } from "@/api/salesStatistics";
import ordersDetail from './ordersDetail'
export default {
  components: {
    ordersDetail
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    datail: {
      required: true,
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      listQuery: {
        sn: '',
        clientName: '',
        mobile: '',
        limit: 10,
        page: 1,
      },
      tableHeight: 400,
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      showrderDetailDialog: false,
      orderDetail: {},//订单详情
      textMap: {
        service: "查看结算审核详情",
        goods: "查看收益详情",
      },
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },
  mounted () {
    this.getToday()
  },
  methods: {
    // 订单详情
    orderLDetail (val) {
      this.showrderDetailDialog = true
      this.orderDetail = val
    },
    save () {
      const arr = this.selectList.goodName;
      this.$emit("insertWares", arr);
      this.dialogVisible = false;
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        mobile: '',
        limit: 10,
        page: 1,
      });
      this.queryProviderSaleOrderDetailV2();
    },
    queryProviderSaleOrderDetailV2 () {
      queryProviderSaleOrderDetailV2(this.listQuery)
        .then((res) => {
          this.dataList = res.data;
          this.total = res.data.count;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch((err) => console.log(err));
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    getToday () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.today = year + "-" + month + "-" + day;
    },
    open () {
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
      this.listQuery.providerId = this.datail.providerId
      this.listQuery.startTime = this.datail.orderCreateTime + ' 00:00:00'
      this.listQuery.endTime = this.datail.orderCreateTime + ' 23:59:59'
      this.queryProviderSaleOrderDetailV2()
    },
    close () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        mobile: "",
        limit: 10,
        page: 1,
      });
      this.selectList = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: center;
  // margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    width: 160px;
    height: 40px;
  }
  .el-button:nth-child(2) {
    margin-left: 30px;
  }
}
.el-form {
  padding: 0 20px;
}
.search_box {
  .x-title {
    margin: 10px 0px 0px;
    .e-name {
      display: inline-block;
      margin: 0px 40px 0px 0px;
      line-height: 1.8em;
    }
  }
}
/deep/.el-table {
  height: 450px;
  overflow-y: scroll !important;
}
/deep/.el-dialog__body {
  padding-top: 0px;
}
</style>
