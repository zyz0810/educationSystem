<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="查看订单列表">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">客户经理名称：{{datail.clerkName}}</div>
        <div class="e-name">日期：{{datail.orderCreateTime}}</div>
        <div class="e-name">商品名称：{{option.operatorType.fullName}}</div>
        <div class="e-name">生产厂家：{{option.operatorType.manufacturerName}}</div>
        <div class="e-name">商品规格：{{option.operatorType.specification}}</div>
      </div>
      <el-form-item label="订单编码">
        <el-input v-model.trim="listQuery.sn"
                  @change="QueOrderDetail"
                  clearable
                  placeholder="订单编码" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.clientName"
                  @change="QueOrderDetail"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select placeholder="订单状态"
                   @change="QueOrderDetail"
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
                   @click="QueOrderDetail">查询</el-button>
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
                :height="tableHeight"
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
                         width="170"></el-table-column>
        <el-table-column label="客户名称"
                         min-width="160"
                         show-overflow-tooltip
                         align="center"
                         prop="clientName">
        </el-table-column>
        <el-table-column label="商品金额"
                         width="100"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="商品实付金额"
                         width="100"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="商品收益金额"
                         width="100"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         width="100"
                         prop="orderStatusStr"></el-table-column>
        <el-table-column label="下单时间"
                         align="center"
                         width="140"
                         :formatter="formatTime"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="付款时间"
                         width="140"
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
                  @pagination="queryOrderDetail" />
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
    <!--查看订单详情-->
    <ordersDetail :showDialog.sync="showrderDetailDialog"
                  :orderDetails='orderDetail'></ordersDetail>
  </my-dialog>
</template>

<script>
import { queryOrderDetail } from "@/api/salesStatistics";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    option: {
      required: false,
      type: Object,
      default: {
        operatorType: "service",
        option: {}
      }
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
        orderCreateTime: '',
        orderStatus: '',
        startTime: '',
        endTime: "",
        skuId: '',
        cherkId: '',
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
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    QueOrderDetail () {
      this.listQuery.page = 1
      this.queryOrderDetail()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        orderCreateTime: '',
        orderStatus: '',
        // startTime: '',
        // endTime: "",
        // skuId: '',
        // cherkId: '',
        limit: 10,
        page: 1,
      });
      this.queryOrderDetail();
    },
    queryOrderDetail () {
      queryOrderDetail(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          // 防止table错位
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
      Object.assign({})
      this.listQuery.cherkId = this.datail.clerkId
      this.listQuery.startTime = this.datail.orderCreateTime + ' 00:00:00'
      this.listQuery.endTime = this.datail.orderCreateTime + ' 23:59:59'
      this.listQuery.skuId = this.option.operatorType.skuId
      this.queryOrderDetail()
    },
    close () {
      Object.assign(this.listQuery, {
        sn: '',
        clientName: '',
        orderCreateTime: '',
        orderStatus: '',
        startTime: '',
        endTime: "",
        skuId: '',
        cherkId: '',
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
// /deep/.el-table__fixed,
// .el-table__fixed-right {
//   height: auto !important; // 此处的important表示优先于element.style
//   bottom: 0px !important; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
// }
</style>
