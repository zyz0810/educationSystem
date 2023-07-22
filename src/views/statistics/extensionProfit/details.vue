<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="推广收益明细">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <div class="x-title">
        <div class="e-name">客户经理：{{customerName}}</div>
      </div>
      <el-form-item label="商品编码">
        <el-input v-model.trim="listQuery.goodsSn"
                  @change="queryAdvertisementIncomeDetails"
                  clearable
                  placeholder="商品编码" />
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model.trim="listQuery.goodsName"
                  @change="queryAdvertisementIncomeDetails"
                  clearable
                  placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model.trim="listQuery.storeName"
                  @change="queryAdvertisementIncomeDetails"
                  clearable
                  placeholder="供应商名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryAdvertisementIncomeDetails">查询</el-button>
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
                         prop="goodsSn"
                         show-overflow-tooltip
                         width="150"></el-table-column>
        <el-table-column label="SKU编码"
                         width="150"
                         show-overflow-tooltip
                         align="center"
                         prop="skuSn"></el-table-column>
        <el-table-column label="商品名称"
                         show-overflow-tooltip
                         width="150"
                         align="center"
                         prop="goodName"></el-table-column>
        <el-table-column label="规格"
                         show-overflow-tooltip
                         align="center"
                         prop="specification"></el-table-column>
        <el-table-column label="供应商名称"
                         width="150"
                         show-overflow-tooltip
                         align="center"
                         prop="storeName"></el-table-column>
        <el-table-column label="商品总额"
                         align="center"
                         prop="totalPriceGoods"></el-table-column>
        <el-table-column label="商品实付总额"
                         width="120"
                         align="center"
                         prop="totalpaymentPrice"></el-table-column>
        <el-table-column label="商品应退总额"
                         width="120"
                         align="center"
                         prop="totalRefundPrice"></el-table-column>
        <el-table-column label="商品收益总额"
                         width="120"
                         align="center"
                         prop="totalProfitPrice"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="100"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="goOrderList(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="advertisementIncomeDetails" />
    </div>
    <orders :showDialog.sync="showrderDetailDialog"
            :option="orderOption"
            :customerName="customerName"
            :clerkIds='clerkIds'
            :orderList="orderList">
    </orders>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { advertisementIncomeDetails } from "@/api/statistics";
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
    orderType: {
      required: true,
      type: Object,
      default: () => { },
    }
  },
  data () {
    return {
      listQuery: {
        goodsSn: "",
        goodsName: '',
        manufacturerName: '',//生产厂家
        specification: '',//商品规格
        storeName: '', //供应商名称
        page: 1,
        limit: 10,
        userIds: this.orderType.userId//客户经理id
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
    goOrderList (val) {
      this.clerkIds = this.orderType.userId
      this.orderList = val
      this.showrderDetailDialog = true
    },
    queryAdvertisementIncomeDetails () {
      this.listQuery.page = 1
      this.advertisementIncomeDetails()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        goodsSn: "",
        goodsName: '',
        manufacturerName: '',//生产厂家
        specification: '',//商品规格
        storeName: '', //供应商名称
        page: 1,
        limit: 10
      });
      this.advertisementIncomeDetails();
    },
    toDetail (row) {
      this.showDetailDialog = true;
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    advertisementIncomeDetails () {
      advertisementIncomeDetails(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch((err) => console.log(err));
    },
    open () {
      Object.assign({})
      this.listQuery.userIds = this.orderType.userId
      this.customerName = this.orderType.customerName
      this.advertisementIncomeDetails()
    },
    close () {
      Object.assign(this.listQuery, {
        goodsSn: "",
        goodsName: '',
        manufacturerName: '',//生产厂家
        specification: '',//商品规格
        storeName: '', //供应商名称
        page: 1,
        limit: 10,
        userIds: ''//客户经理id 
      });
      this.selectList = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
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
.search_box {
  .x-title {
    .e-name {
      padding: 20px 0px 10px 0px;
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
