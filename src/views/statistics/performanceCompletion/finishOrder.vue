<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             :append-to-body="true"
             width="80%"
             @close="close"
             top="15vh"
             class="dialogContainer"
             @open="open"
             title="">
    <div class="dialog-title">
      <span>日期：{{orderDetail.month}}</span>
      <span>订单总数：{{orderCnt}}</span>
      <span>支付金额：{{predictOrderPrice}}</span>
      <span>实际成交额：{{completedOrderPrice}}</span>
    </div>
    <el-table v-loading="listLoading"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              highlight-current-row>
      <el-table-column label="订单编号"
                       align="center"
                       min-width="120"
                       prop="orderSn"></el-table-column>
      <el-table-column label="客户名称"
                       min-width="120"
                       show-overflow-tooltip
                       align="center"
                       prop="customerName"></el-table-column>
      <el-table-column label="手机号"
                       min-width="90"
                       align="center"
                       prop="customerMobile"></el-table-column>
      <el-table-column label="订单金额"
                       align="center"
                       prop="orderPrice"></el-table-column>
      <el-table-column label="实付金额"
                       align="center"
                       prop="paymentPrice"></el-table-column>
      <el-table-column label="下单时间"
                       min-width="100"
                       align="center"
                       :formatter="formatTime"
                       prop="createTime"></el-table-column>
      <el-table-column label="客户经理"
                       show-overflow-tooltip
                       min-width="120"
                       align="center"
                       prop="clerkName"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="achievementByOrder"
                class="text-right" />
    <div class="page_footer">
      <el-button @click="cancel">关闭</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { achievementByOrder } from "@/api/performanceCompletion";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    orderDetail: {
      required: true,
      type: [Object, Array],
      default: {
        startTime: "",
        endTime: "",
        performanceEnum: "",
        ids: '',
        month: "",
      }
    }
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        ids: '',
        endTime: "",
        startTime: ""
      },
      total: 0,
      dataList: [],
      listLoading: false,
      orderCnt: '',//订单数量
      predictOrderPrice: '',//预计成交额
      completedOrderPrice: '',//实际成交额，已经签收的
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
    achievementByOrder () {
      this.listLoading = true;
      achievementByOrder(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          this.orderCnt = res.data.orderCnt//订单数量
          this.predictOrderPrice = res.data.predictOrderPrice//预计成交额
          this.completedOrderPrice = res.data.completedOrderPrice//实际成交额，已经签收的
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    open () {
      Object.assign(this.listQuery, this.orderDetail);
      this.achievementByOrder();
    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        ids: '',
        month: '',
        endTime: "",
        startTime: "",
        performanceEnum: '',
      });
      this.dataList = [];
      this.dialogVisible = false;
    }
  },
  mounted () { }
};
</script>

<style scoped lang="scss">
.dialog-title {
  margin: 0px 0px 20px 0px;
  span {
    margin: 0px 20px 0px 0px;
  }
}
</style>
