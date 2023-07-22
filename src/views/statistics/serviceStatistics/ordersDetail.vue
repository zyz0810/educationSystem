<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="服务业绩订单详情">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">服务商名称：{{dataList.providerName}}</div>
        <div class="e-name">客户名称：{{orderDetail.clientName}}</div>
        <div class="e-name">订单编号：{{orderDetail.sn}}</div>
        <div class="e-name">下单时间：{{this.$moment(orderDetail.orderCreateTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
        <div class="e-name">收益金额：{{orderDetail.spreadAmount}}</div>
      </div>
    </el-form>
    <div class="container">
      <el-table v-loading="listLoading"
                :data="dataList.providerSaleDTOS"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                :summary-method="getSummaries"
                :show-summary="true"
                :height="tableHeight"
                ref="activityTable"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);}"
                highlight-current-row>
        <el-table-column label="商品编码"
                         align="center"
                         prop="goodsSn"
                         min-width="150"></el-table-column>
        <el-table-column label="SKU编码"
                         align="center"
                         min-width="150"
                         prop="skuSn"></el-table-column>
        <el-table-column label="商品名称"
                         align="center"
                         min-width="150"
                         show-overflow-tooltip
                         prop="fullName"> </el-table-column>
        <el-table-column label="规格"
                         align="center"
                         min-width="130"
                         show-overflow-tooltip
                         prop="specification"></el-table-column>
        <el-table-column label="类型"
                         align="center"
                         :formatter="formatOrderItemType"
                         prop="orderItemType"></el-table-column>
        <el-table-column label="数量"
                         align="center"
                         prop="totalQuantity"></el-table-column>
        <el-table-column label="单价"
                         align="center"
                         prop="price"></el-table-column>
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
        <el-table-column label="应付金额"
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
      </el-table>
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { queryProviderSaleProductDetailV2 } from "@/api/salesStatistics";
export default {
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
    },
    orderDetail: {
      required: true,
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      listQuery: {
        startTime: '',
        endTime: "",
        providerId: '',
        orderIds: [],
        limit: 10,
        page: 1,
      },
      tableHeight: 400,
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      showrderDetailDialog: false,
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
    // 总计
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          !values.every((value) => isNaN(value)) &&
          (column.property == "refundAmount" ||
            column.property == "spreadAmount" ||
            column.property == 'providerProfitAmount')
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number(prev) + curr;
              } else {
                return Number(prev);
              }
            }, 0)
            .toFixed(2);
        } else if (column.property == "totalQuantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + curr;
            } else {
              return Number(prev);
            }
          }, 0);
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        orderCreateTime: '',
        orderStatus: '',
        telePhone: '',
        limit: 10,
        page: 1,
      });
      this.queryProviderSaleProductDetailV2();
    },
    queryProviderSaleProductDetailV2 () {
      queryProviderSaleProductDetailV2(this.listQuery)
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
    // 订单项类型0普通1套餐2赠品3 预团购 4 代客下单"
    formatOrderItemType (row, column, value, index) {
      return value == 0
        ? "普通"
        : value == 1
          ? "套餐"
          : value == 2
            ? "赠品"
            : value == 3
              ? "预团购"
              : value == 4
                ? "代客下单"
                : "--";
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
      this.listQuery.orderIds = [this.orderDetail.orderId]
      // this.listQuery.startTime = this.datail.orderCreateTime + ' 00:00:00'
      // this.listQuery.endTime = this.datail.orderCreateTime + ' 23:59:59'
      // this.listQuery.skuId = this.option.operatorType.skuId
      this.queryProviderSaleProductDetailV2()
    },
    close () {
      Object.assign(this.listQuery, {
        startTime: '',
        endTime: "",
        providerId: '',
        orderIds: [],
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
</style>
