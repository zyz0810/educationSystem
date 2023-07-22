<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="服务收益订单详情 ">
    <el-form class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">客户名称：{{orderDetail.clientName}}</div>
        <div class="e-name">订单编号：{{orderDetail.sn}}</div>
        <div class="e-name">下单时间：{{this.$moment(orderDetail.orderCreateTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
        <div class="e-name">客户经理：{{orderDetail.clerkName}}</div>
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
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="商品编码"
                         align="center"
                         prop="goodsSn"
                         width="150"></el-table-column>
        <el-table-column label="SKU编码"
                         align="center"
                         width="150"
                         prop="skuSn"> </el-table-column>
        <el-table-column label="商品名称"
                         align="center"
                         show-overflow-tooltip
                         width="150"
                         prop="fullName"> </el-table-column>
        <el-table-column label="规格"
                         align="center"
                         min-width="110"
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
        <el-table-column label="实付金额"
                         align="center"
                         prop="payPrice"></el-table-column>
        <el-table-column label="退款金额"
                         align="center"
                         prop="refundAmount"></el-table-column>
        <el-table-column label="收益金额"
                         align="center"
                         prop="spreadAmount"></el-table-column>
      </el-table>
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { queryProviderSaleProductDetailV2 } from "@/api/serviceProfit";
import orders from './orders'
export default {
  components: {
    orders
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    orderDetail: {
      required: true,
      type: Object,
      default: () => { },
    }
  },
  data () {
    return {
      listQuery: {
        providerId: '',
        orderIds: [],
        page: 1,
        limit: 10,
      },
      total: 0,
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      showrderDetailDialog: false,
      clerkIds: '',
      skuSn: '',
      customerName: '',
      orderList: {},
      orderOption: {
        operatorType: "",
        option: {}
      }
    };
  },
  mounted () {

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
            column.property == "spreadAmount")
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
        providerId: '',
        orderIds: [],
        page: 1,
        limit: 10,
      });
      this.queryProviderSaleProductDetailV2();
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
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
    open () {
      this.listQuery.providerId = this.orderDetail.providerId
      this.listQuery.orderIds = [this.orderDetail.orderId]
      this.queryProviderSaleProductDetailV2()
    },
    close () {
      Object.assign(this.listQuery, {
        providerId: '',
        orderIds: [],
        page: 1,
        limit: 10,
      });
      this.selectList = [];
      this.dialogVisible = false;
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
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  height: 38px;
}
.container {
  background: #ffffff;
  padding: 15px;
}
.search_box {
  .x-title {
    .e-name {
      padding: 10px 0px 0px 0px;
      display: inline-block;
      margin: 0px 40px 0px 0px;
    }
  }
}
/deep/.el-dialog__body {
  padding: 0px 20px 20px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.el-form {
  padding: 0 20px;
}

/*注意deep两侧都要有空格*/
/deep/.el-table__row {
  td:not(.is-hidden):last-child {
    right: -1px;
  }
}
/deep/thead > tr {
  th:not(.is-hidden):last-child {
    right: -1px;
  }
}
</style>
