<template>
  <div>
    <div class="orderInfo">
      <div class="flex">
        <div>
          订单总数：
          <span>{{ dataInfo.orderCnt || "0" }}</span>
        </div>
        <div>
          支付金额：
          <span>{{ dataInfo.predictOrderPrice || "0" }}</span>
        </div>
        <div>
          成交额：
          <span>{{ dataInfo.completedOrderPrice || "0" }}</span>
        </div>
      </div>
    </div>
    <el-table class="mt_20"
              :data="dataList"
              v-loading="listLoading"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              ref="activityTable"
              @row-click="
        (row, column, event) => {
          $refs.activityTable.toggleRowSelection(row);
        }
      "
              height="322"
              highlight-current-row>
      <el-table-column label="订单编号"
                       align="center"
                       width="170"
                       prop="orderSn"></el-table-column>
      <el-table-column label="客户编号"
                       width="160"
                       align="center"
                       prop="customerId"></el-table-column>
      <el-table-column label="客户名称"
                       width="160"
                       align="center"
                       prop="customerName"></el-table-column>
      <el-table-column label="供应商名称"
                       width="160"
                       align="center"
                       prop="storeName"></el-table-column>
      <el-table-column label="手机号"
                       width="100"
                       align="center"
                       prop="customerMobile"></el-table-column>
      <el-table-column label="订单金额"
                       align="center"
                       prop="orderPrice"></el-table-column>
      <el-table-column label="优惠金额"
                       align="center"
                       prop="totalDiscountPrice"></el-table-column>
      <el-table-column label="实付金额"
                       align="center"
                       prop="paymentPrice"></el-table-column>
      <el-table-column label="订单状态"
                       align="center"
                       prop="orderStatus"></el-table-column>
      <el-table-column label="支付方式"
                       align="center"
                       prop="paymentMethodName"></el-table-column>
      <el-table-column label="下单时间"
                       width="140"
                       align="center"
                       :formatter="formatTime"
                       prop="createTime"></el-table-column>
      <el-table-column label="付款时间"
                       width="140"
                       align="center"
                       :formatter="formatTime"
                       prop="paymentTime"></el-table-column>
      <el-table-column label="客户经理"
                       width="150"
                       show-overflow-tooltip
                       align="center"
                       prop="clerkName"></el-table-column>
      <el-table-column label="联系方式"
                       width="100"
                       align="center"
                       prop="clerkMobile"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       fixed="right"
                       width="90">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="queryOrderList" />
    <detail :showDialog.sync="showDialog"
            :orderId="orderId" />
  </div>
</template>

<script>
import { queryOrderList } from "@/api/order";
import detail from "./detail";
export default {
  props: {
    customerStoreId: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  components: {
    detail
  },
  data () {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false,
      showDialog: false,
      dataInfo: {},
      orderId: ""
    };
  },
  mounted () {
    this.queryOrderList();
  },
  methods: {
    queryOrderList () {
      this.listLoading = true;
      queryOrderList({
        ...this.listQuery,
        customerStoreId: this.customerStoreId
      }).then(res => {
        this.listLoading = false;
        const data = res.data;
        this.dataList = data.data;
        Object.assign(this.dataInfo, data);
        this.total = data.count;
        // 防止table错位
        this.$nextTick(() => {
          this.$refs.activityTable.doLayout();
        });
      });
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    getDetail (row) {
      const { orderId } = row;
      this.orderId = orderId;
      this.showDialog = true;
    },
  }
};
</script>

<style lang="scss" scope>
.orderInfo {
  margin: 10px 0px;
  font-weight: 600;
  span {
    margin-right: 30px;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  .order_title {
    font-family: "微软雅黑 Bold", "微软雅黑";
    font-style: normal;
    line-height: 18px;
  }
}
</style>
