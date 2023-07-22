<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class=""
             @open="open"
             title="查看服务收益详情">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">服务商：{{option.option.providerName}}</div>
        <!--<div class="e-name">服务商服务地区：{{option.option.providerAreaName}}</div>-->
        <div class="e-name">商品名称：{{orderList.fullName}}</div>
        <div class="e-name">生产厂家：{{orderList.manufacturerName}}</div>
        <div class="e-name">商品规格：{{orderList.specification}}</div>
      </div>
      <el-form-item label="订单编码">
        <el-input v-model.trim="listQuery.sn"
                  @change="queryProviderSaleOrderDetail"
                  clearable
                  placeholder="订单编码" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.clientName"
                  @change="queryProviderSaleOrderDetail"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="queryProviderSaleOrderDetail"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select placeholder="订单状态"
                   @change="queryProviderSaleOrderDetail"
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
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryProviderSaleOrderDetail">查询</el-button>
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
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column label="订单编号"
                         align="center"
                         prop="sn"
                         width="150"></el-table-column>
        <el-table-column label="客户信息"
                         width="110"
                         show-overflow-tooltip
                         align="center"
                         prop="clientName">
          <template slot-scope="scope">
            <div>{{scope.row.clientName}}{{scope.row.telePhone}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品金额"
                         width="100"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="商品实付金额"
                         min-width="100"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="商品收益金额"
                         min-width="100"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         width="100"
                         prop="orderStatusStr"></el-table-column>
        <el-table-column label="下单时间"
                         align="center"
                         width="160"
                         :formatter="formatTime"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="付款时间"
                         width="160"
                         align="center"
                         :formatter="formatTime"
                         prop="paymentTime"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="orderLDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="queryProviderSaleOrderDetail" />
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="save">返回</el-button>
    </span>
    <!--查看订单详情-->
    <ordersDetail :showDialog.sync="showrderDetailDialog"
                  :orderDetails='orderDetail'></ordersDetail>
  </my-dialog>
</template>

<script>
import { queryProviderSaleOrderDetail } from "@/api/serviceProfit";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    option: {
      required: true,
      type: Object,
      default: () => { },
    },
    orderList: {
      required: true,
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      listQuery: {
        sn: '',
        clientName: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
        providerId: '',
        skuId: '',
        limit: 10,
        page: 1,
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      showrderDetailDialog: false,
      orderDetail: {},//订单详情
      tableHeight: 350,
    };
  },
  computed: {
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
      }
    },
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
    isCanView () {
      return this.selectList.length != 1;
    },
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
        orderStatus: '',
        startTime: '',
        endTime: '',
        // providerId: '',
        // skuId: '',
        limit: 10,
        page: 1,
      });
      this.queryProviderSaleOrderDetail();
    },
    queryProviderSaleOrderDetail () {
      queryProviderSaleOrderDetail(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
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
    open () {
      Object.assign({})
      this.listQuery.providerId = this.option.option.providerId
      this.listQuery.skuId = this.orderList.skuId
      this.queryProviderSaleOrderDetail()
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
    },
    close () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        orderStatus: '',
        providerId: '',
        skuId: '',
        startTime: '',
        endTime: '',
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
    .e-name {
      padding: 20px 0px 10px 0px;
      display: inline-block;
      margin: 0px 40px 0px 0px;
    }
  }
}
/deep/.el-table {
  height: 450px;
  overflow-y: scroll !important;
}
/deep/.search_box .el-form-item {
  float: none !important;
}
</style>
