<template>
  <div>
    <div class="calculation">共有 {{categoryTotal || 0}} 种 {{skuTotal || 0}} 件</div>
    <el-tabs v-model="listQuery.productStatus"
             @tab-click="customerProductPageList">
      <el-tab-pane label="全部"
                   name="ALL"></el-tab-pane>
      <el-tab-pane label="销售中"
                   name="ON_SALE"></el-tab-pane>
      <el-tab-pane label="已售罄"
                   name="SELL_OUT"></el-tab-pane>
    </el-tabs>
    <el-table class=""
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
              height="255"
              highlight-current-row>
      <el-table-column label="商品编码"
                       align="center"
                       width="160"
                       prop="skuSn"></el-table-column>
      <el-table-column label="商品名称"
                       show-overflow-tooltip
                       align="center"
                       min-width="220"
                       prop="productName"></el-table-column>
      <el-table-column label="规格"
                       align="center"
                       show-overflow-tooltip
                       min-width="150"
                       prop="specification"></el-table-column>
      <el-table-column label="单价"
                       align="center"
                       prop="price"></el-table-column>
      <el-table-column label="账面库存"
                       align="center"
                       prop="bookCheckStock"></el-table-column>
      <el-table-column label="实盘库存"
                       align="center"
                       prop="realCheckStock">
        <template slot-scope="scope">
          <div>{{scope.row.realCheckStock != null  ? scope.row.realCheckStock : '-'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="最近盘点时间"
                       width="160"
                       align="center"
                       :formatter="formatTime"
                       prop="checkStockTime"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="customerProductPageList" />
  </div>
</template>

<script>
import {
  customerProductPageList,
} from "@/api/customer/customer";
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
        limit: 10,
        skuSn: '',
        productName: '',
        // ALL (0, "全部"), ON_SALE (1, "销售中"), SELL_OUT (2, "售罄")
        productStatus: 'ALL',
      },
      listLoading: false,
      showDialog: false,
      dataInfo: {},
      orderId: "",
      activeName: 'first',
      skuTotal: '',
      categoryTotal: '',
    };
  },
  mounted () {
    this.customerProductPageList();
  },
  methods: {
    // handleClick (val) {
    //   this.listQuery.productStatus = val.name
    //   this.customerProductPageList()
    // },
    customerProductPageList () {
      this.listLoading = true;
      customerProductPageList({
        ...this.listQuery,
        customerStoreId: this.customerStoreId
      }).then(res => {
        this.listLoading = false;
        const data = res.data;
        this.dataList = res.data.productPageData.data;
        this.skuTotal = res.data.skuTotal;
        this.categoryTotal = res.data.categoryTotal;
        this.total = res.data.productPageData.count || 0;
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
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        page: 1,
        limit: 10,
        skuSn: '',
        productName: '',
      });
      this.customerProductPageList();
    },
  }
};
</script>

<style lang="scss" scope>
/deep/.el-form {
  padding: 0 !important;
}
/deep/.orderInfo {
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
.calculation {
  margin: 10px 0px;
  font-weight: 600;
}
</style>
