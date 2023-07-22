<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="查看销售业绩详情">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">客户经理名称：{{datail.clerkName}}</div>
        <div class="e-name">日期：{{datail.orderCreateTime}}</div>
      </div>
      <el-form-item label="商品名称">
        <el-input v-model.trim="listQuery.fullName"
                  @change="queryGoodstDetail"
                  clearable
                  placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="生产厂家">
        <el-input v-model.trim="listQuery.manufacturerName"
                  @change="queryGoodstDetail"
                  clearable
                  placeholder="生产厂家" />
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model.trim="listQuery.supplierUserName"
                  @change="queryGoodstDetail"
                  clearable
                  placeholder="供应商名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryGoodstDetail">查询</el-button>
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
        <el-table-column label="商品编码"
                         align="center"
                         width="160"
                         prop="goodsSn"></el-table-column>
        <el-table-column label="SKU编码"
                         width="160"
                         align="center"
                         prop="skuSn"></el-table-column>
        <el-table-column label="商品名称"
                         min-width="120"
                         show-overflow-tooltip
                         align="center"
                         prop="fullName"></el-table-column>
        <el-table-column label="生产厂家"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="manufacturerName"></el-table-column>
        <el-table-column label="规格"
                         align="center"
                         min-width="130"
                         show-overflow-tooltip
                         prop="specification"></el-table-column>
        <el-table-column label="供应商名称"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
                         prop="supplierUserName"></el-table-column>
        <el-table-column label="商品总销量"
                         width="100"
                         align="center"
                         prop="totalQuantity"></el-table-column>
        <el-table-column label="商品总额"
                         width="100"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="商品实付总额"
                         width="120"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="商品应退总额"
                         width="120"
                         align="center"
                         prop="refundAmount"></el-table-column>
        <el-table-column label="商品收益总额"
                         width="120"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         min-width="80"
                         fixed='right'>
          <template slot-scope="scope">
            <el-button type="text"
                       @click="orderLDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="goodstDetail" />
    </div>
    <orders :showDialog.sync="showrderDetailDialog"
            :option="orderOption"
            :datail="datail">
    </orders>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { goodstDetail } from "@/api/salesStatistics";
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
    datail: {
      required: true,
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      listQuery: {
        fullName: '',
        manufacturerName: '',//生产厂家
        specification: '',
        supplierUserName: '',
        cherkId: "",
        startTime: '',
        endTime: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      today: '',
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      showrderDetailDialog: false,
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
  mounted () {
    this.getToday()
  },
  methods: {
    //订单详情
    orderLDetail (val) {
      this.orderOption = {
        operatorType: val,
        option: {
        }
      }
      this.showrderDetailDialog = true
    },
    queryGoodstDetail () {
      this.listQuery.page = 1
      this.goodstDetail()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        fullName: '',
        manufacturerName: '',//生产厂家
        specification: '',
        supplierUserName: '',
        page: 1,
        limit: 10,
      });
      this.goodstDetail();
    },
    toDetail (row) {
      this.showDetailDialog = true;
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    goodstDetail () {
      goodstDetail(this.listQuery)
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
      this.listQuery.cherkId = this.datail.clerkId
      this.listQuery.startTime = this.datail.orderCreateTime + ' 00:00:00'
      this.listQuery.endTime = this.datail.orderCreateTime + ' 23:59:59'
      this.goodstDetail()
    },
    close () {
      Object.assign(this.listQuery, {
        fullName: '',
        manufacturerName: '',//生产厂家
        specification: '',
        supplierUserName: '',
        cherkId: "",
        startTime: '',
        endTime: "",
        page: 1,
        limit: 10,
      });
      this.selectList = [];
      this.dialogVisible = false;
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
.search {
  border-color: rgb(233, 233, 233);
  background: #ffffff;
  overflow: hidden;
  padding: 0 !important;
  .el-form-item {
    float: left;
    margin: 10px 10px 10px 0;
  }
}
/deep/.el-dialog__body {
  padding: 0px 20px 20px;
}
.el-form {
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
