<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="结算单明细">
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
        <el-table-column label="SKU编码"
                         align="center"
                         prop="skuCode"></el-table-column>
        <el-table-column label="商品名称"
                         align="center"
                         prop="productName"></el-table-column>
        <el-table-column label="生产厂家"
                         align="center"
                         prop="manufacturerName"></el-table-column>
        <el-table-column label="供应商名称"
                         align="center"
                         prop="supplierName"></el-table-column>
        <el-table-column label="商品总额"
                         align="center"
                         prop="productPrice"></el-table-column>
        <el-table-column label="商品实付总额"
                         align="center"
                         prop="realPayPrice"></el-table-column>
        <el-table-column label="商品应退总额"
                         align="center"
                         prop="refundPrice"></el-table-column>
        <el-table-column label="商品收益总额"
                         align="center"
                         prop="profitPrice"></el-table-column>
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
                  @pagination="productDetail" />
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">关闭</el-button>
    </span>
    <orders :showDialog.sync="showrderDetailDialog"
            :settlementDetail="settlementDetail"
            :orderList="orderList">
    </orders>
  </my-dialog>
</template>

<script>
import {
  productDetail,
  detailExport
} from "@/api/settlementAccount";
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
    settlementDetail: {
      required: true,
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
      // 0待审核1审核通过2审核不通过3未提交审核
      checkOption: {
        0: "待审核",
        1: "审核通过",
        2: "审核不通过",
        3: "未提交审核"
      },
      listQuery: {
        balanceSn: '',
        page: 1,
        limit: 10,
      },
      total: 0,
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [{}],
      showrderDetailDialog: false,
      clerkIds: '',
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
    isCanView () {
      // return this.selectList.length != 1;
    },
  },
  methods: {
    exportView () {
      let ids = []
      this.selectList.forEach((item, index) => {
        ids.push(item.id);
      });
      detailExport({
        ids
      }).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "结算单";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      });
    },
    save () {
      this.dialogVisible = false;
    },
    // 导出
    detailExport () {
      let ids = []
      this.selectList.forEach((item, index) => {
        ids.push(item.id);
      });
      detailExport({
        ids
      }).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "结算单";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      });
    },
    //订单详情
    orderLDetail (val) {
      this.orderList = val
      this.showrderDetailDialog = true
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        balanceSn: '',
        page: 1,
        limit: 10,
      });
      this.productDetail();
    },
    toDetail (row) {
      this.showDetailDialog = true;
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    productDetail () {
      productDetail(this.listQuery)
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
      this.$nextTick(() => {
        this.$refs.activityTable.doLayout();
      });
      this.listQuery.balanceSn = this.settlementDetail.balanceSn
      this.productDetail();
    },
    close () {
      Object.assign(this.listQuery, {
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
.border-card {
  margin-top: 20px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
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
.el-icon-question {
  color: #fe9400;
}
.link {
  color: #1890ff;
  text-decoration: underline;
}
.search_box {
  .x-title {
    .e-name {
      display: inline-block;
      margin: 0px 40px 0px 0px;
      line-height: 1.8em;
    }
  }
}
/deep/.el-dialog__body {
  padding: 0px 20px 20px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
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
/deep/.el-table {
  height: 450px;
  overflow: scroll;
}
</style>
