<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="结算单订单列表">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">结算单单号：{{settlementDetail.balanceSn}}</div>
        <div class="e-name">生成时间：{{$moment(settlementDetail.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="e-name">结算金额：{{settlementDetail.balancePrice}}</div>
        <div class="e-name">结算状态：{{balanceOption[settlementDetail.balanceStatus]}}</div>
        <div class="e-name">审核状态：{{checkOption[settlementDetail.checkStatus]}}</div>
      </div>
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
                         prop="orderSn"
                         width="170"></el-table-column>
        <el-table-column label="客户名称"
                         min-width="150"
                         show-overflow-tooltip
                         align="center"
                         prop="storeName">
        </el-table-column>
        <el-table-column label="手机号"
                         width="100"
                         align="center"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="支付方式"
                         width="100"
                         align="center"
                         prop="payType">
        </el-table-column>
        <el-table-column label="商品金额"
                         align="center"
                         prop="productPrice"></el-table-column>
        <el-table-column label="实付金额"
                         align="center"
                         prop="realPayPrice"></el-table-column>
        <el-table-column label="退款金额"
                         align="center"
                         prop="refundPrice"></el-table-column>
        <el-table-column label="收益金额"
                         align="center"
                         prop="profitPrice"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         prop="orderStatus"></el-table-column>
        <el-table-column label="下单时间"
                         align="center"
                         width="140"
                         :formatter="formatTime"
                         prop="orderTime"></el-table-column>
        <el-table-column label="付款时间"
                         width="140"
                         align="center"
                         :formatter="formatTime"
                         prop="payTime"></el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         align="center">
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
                  @pagination="orderDetail" />
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="save">返回</el-button>
    </span>
    <!--查看订单详情-->
    <ordersDetail :showDialog.sync="showrderDetailDialog"
                  :orderDetails='orderDetails'></ordersDetail>
  </my-dialog>
</template>

<script>
import { orderDetail } from "@/api/settlementAccount";
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
    settlementDetail: {
      required: true,
      type: Object,
      default: () => { },
    },
    orderList: {
      required: false,
      type: Object,
      default: () => ({})
    },
    settlementDetail: {
      required: false,
      type: Object,
      default: () => { },
    }
  },
  data () {
    return {
      // 结算状态【0-未结算 1-结算成功 2-待确定3-结算中4-结算失败】
      balanceOption: {
        0: "未结算",
        1: "结算成功",
        2: "待确定",
        3: "结算中",
        4: "结算失败",
      },
      // 0待审核1审核通过2审核不通过3待提交
      checkOption: {
        0: "待审核",
        1: "审核通过",
        2: "审核不通过",
        3: "未提交审核"
      },
      listQuery: {
        balanceSn: '', //结算单号
        limit: 10,
        page: 1,
      },
      total: 0,
      selectList: [],
      dataList: [],
      tableHeight: 400,
      listLoading: false,
      showrderDetailDialog: false,
      orderDetails: {},//订单详情
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
    isCanView () {
      // return this.selectList.length != 1 ;
    },
  },
  methods: {
    // 订单详情
    orderLDetail (val) {
      this.orderDetails = val
      this.showrderDetailDialog = true
    },
    save () {
      this.dialogVisible = false;
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        goodsSn: "",
        goodSName: '',
        manufacturerName: '',//生产厂家
        specification: '',//商品规格
        storeName: '', //供应商名称
        page: 1,
        limit: 10
      });
      this.orderDetail();
    },
    orderDetail () {
      orderDetail(this.listQuery)
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
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
      this.listQuery.balanceSn = this.settlementDetail.balanceSn
      this.orderDetail()
    },
    close () {
      Object.assign(this.listQuery, {
        balanceSn: "",
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
  padding: 0px;
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
.search_box {
  .x-title {
    padding-top: 15px;
    .e-name {
      // padding: 20px 0px 10px 0px;
      display: inline-block;
      margin: 0px 40px 0px 0px;
      line-height: 1.8em;
    }
  }
}
/deep/.el-dialog__body {
  padding: 0px 20px 20px;
}
</style>
