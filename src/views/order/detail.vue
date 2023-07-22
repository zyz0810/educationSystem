<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             top="10vh"
             title="订单详情"
             class="dialogContainer"
             @open="open">
    <div class="titleInfo">
      <span>订单号：{{ dataInfo.orderSN || "--" }}</span>
      <span class="ml_20">客户名称：{{ dataInfo.clientName || "--" }}</span>
    </div>
    <el-table :data="wareslist"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              highlight-current-row
              ref="detailsList"
              :max-height="tableHeight">
      <el-table-column label="商品编码"
                       align="center"
                       width="130"
                       prop="goodsSn"></el-table-column>
      <el-table-column label="SKU编码"
                       align="center"
                       width="150"
                       prop="skuCode"></el-table-column>
      <el-table-column label="外部关联码"
                       min-width="120"
                       align="center"
                       prop="externalCode"></el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       width="150"
                       prop="fullName"></el-table-column>
      <el-table-column label="商品类型"
                       align="center"
                       width="150"
                       :formatter="formatType"
                       prop="type"></el-table-column>
      <el-table-column label="规格"
                       align="center"
                       prop="specification"></el-table-column>
      <el-table-column label="单位"
                       align="center"
                       prop="unit"></el-table-column>
      <el-table-column label="生产厂家"
                       align="center"
                       prop="manufacturerName"></el-table-column>
      <el-table-column label="数量"
                       align="center"
                       prop="amount"></el-table-column>
      <el-table-column label="单价"
                       align="center"
                       prop="unitPrice"></el-table-column>
      <el-table-column label="商品金额"
                       align="center"
                       prop="commodityPrice"></el-table-column>
      <el-table-column label="余额抵扣"
                       align="center"
                       prop="useRebatePrice"></el-table-column>
      <el-table-column label="优惠金额"
                       align="center"
                       prop="couponDiscount"></el-table-column>
      <el-table-column label="应付金额"
                       align="center"
                       prop="payPrice"></el-table-column>
    </el-table>
    <div class="titleInfo textRight">
      <div>优惠金额：{{ dataInfo.couponDiscount || "--" }}</div>
      <div>余额抵扣：{{ dataInfo.useRebatePrice || "--" }}</div>
      <div>运费：{{ dataInfo.freight || "--" }}</div>
      <div>实付金额：{{ dataInfo.payTotalPrice || "--" }}</div>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="close">返回</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { queryOrderDetail } from "@/api/order";
export default {
  name: "orderView",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    orderId: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  data () {
    return {
      wareslist: [],
      listLoading: false,
      dataInfo: {},
      tableHeight: 400
    };
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
    formatType (row, column, value, index) {
      return value == true ? "赠品" : value == false ? "普通" : "--";
    },
    queryOrderDetail () {
      this.listLoading = true;
      queryOrderDetail({ orderId: this.orderId })
        .then(res => {
          if (res.resp_code == 0) {
            Object.assign(this.dataInfo, res.data);
            const { commodityDetailList } = res.data;
            this.wareslist = commodityDetailList;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    tabClose () {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        window.onresize = () => {
          this.tableHeight =
            window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        };
      });
      this.dialogVisible = false;
    },
    open () {
      this.queryOrderDetail();
    },
    close () {
      Object.assign(this.dataInfo, {});
      this.wareslist = [];
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scope>
.app-container {
  height: calc(100vh - 90px);
  overflow: auto;
}
.titleInfo {
  line-height: 30px;
  font-family: "Arial Normal", "Arial";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #666666;
}
.textRight {
  text-align: right;
}
</style>
