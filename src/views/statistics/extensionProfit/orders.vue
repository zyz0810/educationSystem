<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class=""
             @open="open"
             title="提成统计">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">客户经理：{{customerName}}</div>
        <div class="e-name">商品名称：{{orderList.goodName}}</div>
        <div class="e-name">商品规格：{{orderList.specification}}</div>
      </div>
      <el-form-item label="订单编码">
        <el-input v-model.trim="listQuery.orderSn"
                  @change="spreadOrderList"
                  clearable
                  placeholder="订单编码" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.clientName"
                  @change="spreadOrderList"
                  clearable
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model.trim="listQuery.telPhone"
                  @change="spreadOrderList"
                  clearable
                  placeholder="手机号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="spreadOrderList">查询</el-button>
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
                         width="180"></el-table-column>
        <el-table-column label="客户信息"
                         min-width="110"
                         :show-overflow-tooltip='true'
                         align="center"
                         prop="clientName">
          <template slot-scope="scope">
            <span v-html="showInfor(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="商品金额"
                         width="100"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="商品实付金额"
                         width="100"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="商品提成金额"
                         align="center"
                         min-width="100"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="订单状态"
                         align="center"
                         prop="orderStatus"></el-table-column>
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
                  @pagination="querySpreadOrderList" />
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
    <!--查看订单详情-->
    <ordersDetail :showDialog.sync="showrderDetailDialog"
                  :orderDetails='orderDetail'
                  :clerkIds='clerkIds'></ordersDetail>
  </my-dialog>
</template>

<script>
import { querySpreadOrderList } from "@/api/statistics";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    customerName: {
      required: false,
      type: String,
      default: '',
    },
    clerkIds: {
      required: false,
      type: [String, Number],
      default: '',
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
        skuSn: '',
        orderSn: '',
        clientName: '',
        telPhone: '',
        limit: 10,
        page: 1,
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      showrderDetailDialog: false,
      orderDetail: {},//订单详情
      tableHeight: 350
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
      return this.selectList.length != 1;
    },
  },
  methods: {
    showInfor (row) {
      return row.clientName + '&nbsp;&nbsp;' + row.telePhone
    },
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
    spreadOrderList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.querySpreadOrderList()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        skuSn: '',
        orderSn: '',
        clientName: '',
        telPhone: '',
        limit: 10,
        page: 1,
      });
      this.querySpreadOrderList();
    },
    querySpreadOrderList () {
      querySpreadOrderList(this.listQuery)
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
    open () {
      this.listQuery.clerkIds = [this.clerkIds]
      this.listQuery.skuSn = this.orderList.skuSn
      this.querySpreadOrderList()
    },
    close () {
      Object.assign(this.listQuery, {
        skuSn: '',
        orderSn: '',
        clientName: '',
        telPhone: '',
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
</style>
