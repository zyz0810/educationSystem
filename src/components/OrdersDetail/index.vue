<template>
  <my-dialog :visible.sync="dialogVisible"
             append-to-body
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             @open="open"
             :top="'5vh'"
             title="订单详情">
    <div class="x-title">
      <div class="e-name">订单编号：<span :class="info.groupPurchaseId ? 'label_box' :'' ">{{info.orderSN||'--'}}</span></div>
      <div class="e-name">客户名称：{{info.clientName||'--'}}</div>
      <div class="e-name">订单来源：{{info.orderSourceStr}}</div>
    </div>
    <div class="x-title"
         v-if='info.groupPurchaseId'>
      <div class="e-name">预付定金（{{info.depositStatus == 0 ? '已支付' : '未支付'}})：{{ info.depositAmount ||'--'}}</div>
      <div class="e-name">成团状态：{{groupStatusType[info.groupStatus]}}</div>
      <div class="e-name">支付尾款（{{info.balanceStatus == 0 ? '已支付' : '未支付'}}）：{{info.balanceAmount|| '--'}}</div>
    </div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="订单详情"
                   name="first">
        <el-table v-loading="listLoading"
                  class="mt_20"
                  :data="info.commodityDetailList"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="list => (selectList = list)"
                  border
                  :height="tableHeight"
                  ref="activityTable"
                  @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                  highlight-current-row>
          <el-table-column label="主图"
                           align="center"
                           fixed>
            <template slot-scope="scope">
              <img :src="scope.row.mainImage"
                   class="product_img" />
            </template>
          </el-table-column>
          <el-table-column label="商品编码"
                           align="center"
                           prop="goodsSn"
                           min-width="160"
                           fixed></el-table-column>
          <el-table-column label="商品名称"
                           align="center"
                           min-width="150"
                           show-overflow-tooltip
                           prop="fullName"
                           fixed></el-table-column>
          <el-table-column label="类型"
                           align="center"
                           fixed
                           prop="orderItemType"
                           :formatter="formatType">
          </el-table-column>
          <el-table-column label="服务类型"
                           align="center"
                           fixed
                           prop="providerProductType"
                           :formatter="providerProduct">
          </el-table-column>
          <el-table-column label="规格"
                           align="center"
                           prop="specification"></el-table-column>
          <el-table-column label="sku编码"
                           min-width="130"
                           show-overflow-tooltip
                           align="center"
                           prop="skuCode"></el-table-column>
          <el-table-column label="数量"
                           align="center"
                           prop="amount"></el-table-column>
          <el-table-column label="单位"
                           align="center"
                           prop="unit"></el-table-column>
          <el-table-column label="单价"
                           align="center"
                           prop="unitPrice"></el-table-column>
          <el-table-column label="商品金额"
                           align="center"
                           prop="commodityPrice"></el-table-column>
          <el-table-column label="平台促销优惠金额"
                           align="center"
                           width="125"
                           prop="platformPromotionDiscount"></el-table-column>
          <el-table-column label="平台优惠券优惠金额"
                           align="center"
                           width="140"
                           prop="platformCouponDiscount"></el-table-column>
          <el-table-column label="商家促销优惠金额"
                           align="center"
                           width="125"
                           prop="promotionDiscount"></el-table-column>
          <el-table-column label="商家优惠券优惠金额"
                           align="center"
                           width="140"
                           prop="couponDiscount"></el-table-column>
          <el-table-column label="余额抵扣"
                           align="center"
                           prop="useRebatePrice"></el-table-column>
          <el-table-column label="预计返利金"
                           align="center"
                           width="100"
                           prop="rebateDiscount"></el-table-column>
          <el-table-column label="应付金额"
                           align="center"
                           prop="payPrice"></el-table-column>
        </el-table>
        <div class="flex">
          <div class="flex-center">
            <div class="order_info f12">
              <span>收货人：{{info.consignee || '--'}}</span>
              <span>联系方式：{{info.consigneePhone || '--'}}</span>
              <span>收货地址：{{info.consigneeAddress || '--'}}</span>
            </div>
            <div class="order_info f12"><span>客户备注：{{info.clientRemarks || '--'}}</span></div>
            <div class="order_info f12"><span>客服备注：{{info.serviceRemarks}}</span></div>
          </div>
          <div class="order_info f12 m20">
            <div v-if="info.couponDiscount">优惠金额：<span class="red01">-{{info.couponDiscount}}</span></div>
            <div v-if="info.freight">运费：<span class="red01">{{info.freight}}</span></div>
            <div v-if="info.payTotalPrice">应付金额：<span class="red01">{{info.payTotalPrice}}</span></div>
          </div>
        </div>
        <div class="text-center m20">
          <el-button @click="back">关闭</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收款记录"
                   name="second">
        <div class="order_info grayBg p20 f12">
          <span>订单金额：{{paymentInfo.amount}}</span>
          <span>合计优惠：{{paymentInfo.discountPrice}}</span>
          <span>客户应付：{{paymentInfo.clientAmount}}</span>
          <span>实付金额：{{paymentInfo.payPrice}}</span>
        </div>
        <el-table v-loading="listLoading"
                  :data="paymentInfo.paymentRecordList"
                  :header-cell-style="{background:'#f5f7fa'}"
                  element-loading-text="拼命加载中"
                  border
                  fit
                  highlight-current-row>
          <el-table-column label="支付流水号"
                           align="center"
                           width="200"
                           prop="sn"></el-table-column>
          <el-table-column label="支付时间"
                           min-width="110"
                           align="center">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.payTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额"
                           align="center"
                           prop="payPrice"></el-table-column>
          <el-table-column label="支付方式"
                           align="center"
                           prop="payType"></el-table-column>
          <el-table-column label="支付平台"
                           align="center"
                           prop="orderPlatform"
                           :formatter="formaOrderPlatform"></el-table-column>
          <el-table-column label="支付人"
                           align="center"
                           prop="payerName"></el-table-column>
          <el-table-column label="收款状态"
                           align="center"
                           prop="payStatus"
                           :formatter="formatStatus">
          </el-table-column>
        </el-table>
        <div class="text-center"
             v-if="paymentInfo==''">暂时还没有记录哦~</div>
        <div class="text-center m20">
          <el-button @click="back">关闭</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="发货记录"
                   name="third">
        <div v-for="(item,index) in shippingInfo"
             :key='index'>
          <div class="order_info grayBg p20 f12">
            <span>发货单号：{{item.logisticsSn}}</span>
            <span>发货时间：{{item.shippingTime?$moment(item.shippingTime).format('YYYY-MM-DD HH:mm:ss'):'--'}}</span>
          </div>
          <el-table v-loading="listLoading"
                    class="mt_20"
                    :data="item.shippingItemDTOS"
                    :header-cell-style="{ background: '#f5f7fa' }"
                    element-loading-text="拼命加载中"
                    @selection-change="list => (selectList = list)"
                    border
                    :height="tableHeight"
                    ref="activityTable"
                    @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                    highlight-current-row>
            <el-table-column label="主图"
                             align="center">
              <template slot-scope="scope">
                <img :src="scope.row.mainUrl"
                     class="product_img" />
              </template>
            </el-table-column>
            <el-table-column label="商品编码"
                             align="center"
                             min-width="160"
                             prop="itemSn"></el-table-column>
            <el-table-column label="商品名称"
                             align="center"
                             min-width="160"
                             show-overflow-tooltip
                             prop="commodityName"></el-table-column>
            <el-table-column label="规格"
                             align="center"
                             min-width="130"
                             show-overflow-tooltip
                             prop="specification"></el-table-column>
            <el-table-column label="sku编码"
                             min-width=""
                             show-overflow-tooltip
                             align="center"
                             prop="skuSn"></el-table-column>
            <el-table-column label="订货数量"
                             align="center"
                             prop="buyQuantity"></el-table-column>
            <el-table-column label="发货数量"
                             align="center"
                             prop="shippedQuantity"></el-table-column>
            <el-table-column label="单位"
                             align="center"
                             min-width="50"
                             show-overflow-tooltip
                             prop="unit"></el-table-column>
            <el-table-column label="备注"
                             min-width="100"
                             show-overflow-tooltip
                             align="center"
                             prop="remarks"></el-table-column>
          </el-table>
          <div class="flex">
            <div class="flex-center">
              <div class="order_info f12">
                <span>收货人：{{item.consignee}}</span>
                <span>联系方式：{{item.phone}}</span>
                <span>收货地址：{{item.address}}</span>
              </div>
              <div class="order_info f12">
                <span>物流公司：{{item.deliveryCorp}}</span>
                <span>物流单号：{{item.logisticsSn}}</span>
              </div>
            </div>
          </div>
          <div>物流信息:</div>
          <el-timeline :reverse="true"
                       class="m20">
            <el-timeline-item v-for="(item, index) in item.deliveryInfoList"
                              :key="index"
                              placement="top"
                              :timestamp="item.expressTime?$moment(item.expressTime).format('YYYY-MM-DD HH:mm:ss'):''">
              {{item.context}}
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="text-center"
             v-if="!shippingInfo">暂时还没有记录哦~</div>
        <div class="text-center m20">
          <el-button @click="back">关闭</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客户签收记录"
                   name="fourth">
        <div v-for="(item,index) in signInfo"
             :key='index'>
          <div class="order_info grayBg p20 f12">
            <span>发货单号：{{item.shippingSn || '--'}}</span>
            <span>发货时间：{{$moment(item.shippingTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}</span>
            <span>签收状态：{{item.signStatus || '--'}}</span>
            <span>签收人：{{item.signClientName || '--'}}</span>
            <span>签收时间：{{item.signTime?$moment(item.signTime).format('YYYY-MM-DD HH:mm:ss'): '--'}}
            </span>
          </div>
          <el-table v-loading="listLoading"
                    class="mt_20"
                    :data="item.paymentSignItemDetail"
                    :header-cell-style="{ background: '#f5f7fa' }"
                    element-loading-text="拼命加载中"
                    @selection-change="list => (selectList = list)"
                    border
                    :height="tableHeight"
                    ref="activityTable"
                    @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                    highlight-current-row>
            <el-table-column label="主图"
                             align="center">
              <template slot-scope="scope">
                <img class="product_img"
                     :src="scope.row.mainUrl" />
              </template>
            </el-table-column>
            <el-table-column label="商品编码"
                             align="center"
                             prop="itemSn"></el-table-column>
            <el-table-column label="商品名称"
                             align="center"
                             prop="commodityName"></el-table-column>
            <el-table-column label="规格"
                             align="center"
                             prop="specification"></el-table-column>
            <el-table-column label="sku编码"
                             align="center"
                             prop="skuSn"></el-table-column>
            <el-table-column label="发货数量"
                             align="center"
                             prop="shippedQuantity"></el-table-column>
            <el-table-column label="签收数量"
                             align="center"
                             prop="shippedQuantity"></el-table-column>
            <el-table-column label="单位"
                             align="center"
                             prop="unit"></el-table-column>
            <el-table-column label="备注"
                             align="center"
                             prop="remarks"></el-table-column>
          </el-table>
          <div class="flex">
            <div class="flex-center">
              <div class="order_info f12">
                <span>收货人：{{item.paymentClientSignShippingInfo.consignee}}</span>
                <span>联系方式：{{item.paymentClientSignShippingInfo.phone}}</span>
                <span>收货地址：{{item.paymentClientSignShippingInfo.address}}</span>
              </div>
              <div class="order_info f12">
                <span>物流公司：{{item.paymentClientSignShippingInfo.deliveryCorp}}</span>
                <span>物流单号：{{item.paymentClientSignShippingInfo.logisticsSn}}</span>
              </div>
            </div>
          </div>
          <div>物流信息:</div>
          <el-timeline :reverse="true"
                       class="m20">
            <el-timeline-item v-for="(item, index) in item.paymentClientSignShippingInfo.deliveryInfoList"
                              :key="index"
                              placement="top"
                              :timestamp="item.expressTime?$moment(item.expressTime).format('YYYY-MM-DD HH:mm:ss'):''">
              {{item.context}}
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="text-center"
             v-if="!signInfo">暂时还没有记录哦~</div>
        <div class="text-center m20">
          <el-button @click="back">关闭</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作日志"
                   name="fiveth">
        <el-table v-loading="listLoading"
                  :data="info.operationRecords"
                  :header-cell-style="{background:'#f5f7fa'}"
                  element-loading-text="拼命加载中"
                  border
                  :max-height="tableHeight"
                  fit
                  height="300"
                  highlight-current-row>
          <!--          <el-table-column label="公司名称" align="center" prop="companyName"></el-table-column>-->
          <el-table-column label="操作人"
                           align="center"
                           prop="operationName"></el-table-column>
          <el-table-column label="时间"
                           align="center">
            <template slot-scope="scope">
              <span>{{$moment(scope.row.operationTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作类型"
                           align="center"
                           prop="operationTypeString"></el-table-column>
          <el-table-column label="操作日志"
                           align="center"
                           prop="operationRecord"></el-table-column>
        </el-table>
        <div class="text-center m20">
          <el-button @click="back">关闭</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </my-dialog>
</template>

<script>
import {
  orderDetail,
  collectionRecord,
  shippingRecord,
  signRecord,
} from "@/api/statistics";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    orderDetails: {
      required: true,
      type: Object,
      default: () => ({})
    },
    clerkIds: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        orderId: '',
        clerkIds: '',
      },
      total: 0,
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      dataList: [],
      activeName: 'first',
      dialogFormVisible: false,
      value1: '',
      // tableHeight: 200,
      dialogImageUrl: '',
      content: '',
      editorOption: {},
      list: null,
      listLoading: true,
      shippingListLoading: true,
      shippingInfo: [],
      signListLoading: true,
      signInfo: null,
      paymentInfo: {},
      info: {},
      dialogStatus: '',
      // 是否成团 0 未参团 1 参团中 2 已成团 3 未成团（订单取消）
      groupStatusType: {
        0: '未参团',
        1: '参团中',
        2: '已成团',
        3: '未成团（订单取消）',
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
      }
    },
  },
  methods: {
    // 平台支付方式0 康药多  1  康药麦麦
    formaOrderPlatform (row, column, cellValue, index) {
      return cellValue == 0 ? "康药多" : cellValue == 1 ? "康药麦麦" : "";
    },
    // tab切换 
    handleClick (tab, event) {
      if (tab.name == 'second') {//收款记录
        this.collectionRecord()
      } else if (tab.name == 'third') {//发货记录
        this.shippingRecord()
      } else if (tab.name == 'fourth') {//客户签收记录
        this.signRecord()
      } else {
        this.orderDetail()
      }
    },
    // 收款记录
    collectionRecord () {
      collectionRecord(this.listQuery)
        .then((res) => {
          this.paymentInfo = res.data
        })
        .catch((err) => console.log(err));
    },
    // 发货记录
    shippingRecord () {
      shippingRecord(this.listQuery)
        .then((res) => {
          this.shippingInfo = res.data
          this.shippingListLoading = false
        })
        .catch((err) => console.log(err));
    },
    // 客户签收记录
    signRecord () {
      signRecord(this.listQuery)
        .then((res) => {
          this.signInfo = res.data
          this.signListLoading = false
        })
        .catch((err) => console.log(err));
    },
    orderDetail () {
      orderDetail(this.listQuery)
        .then((res) => {
          this.info = res.data
          this.listLoading = false
          // 防止table错位
          // this.$nextTick(() => {
          //   this.$refs.activityTable.doLayout();
          // });
        })
        .catch((err) => console.log(err));
    },
    // 时间格式化
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 客户类型
    formatType (row, column, cellValue, index) {
      return cellValue == 0
        ? "普通"
        : cellValue == 1
          ? "套餐"
          : cellValue == 2
            ? "赠品"
            : "";
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "未收款"
        : cellValue == 1
          ? "已收款"
          : cellValue == 2
            ? "支付失败"
            : "";
    },
    // 服务商品类型
    providerProduct (row, column, cellValue, index) {
      return cellValue == 1
        ? "服务商品"
        : cellValue == 2
          ? "推广商品"
          : "";
    },
    // filters: {
    //   filtersType: function (value) {
    //     let StatusArr = { 0: '普通', 1: '套餐', 2: '赠品' }
    //     return StatusArr[value]
    //   },
    //   filtersPay: function (value) {
    //     let StatusArr = { 0: '未收款', 1: '已收款' }
    //     return StatusArr[value]
    //   }
    // },
    open () {
      this.listQuery.orderId = this.orderDetails.id || this.orderDetails.orderId
      this.orderDetail()
      // 防止table错位
      // this.$nextTick(() => {
      //   this.$refs.activityTable.doLayout();
      // });
    },
    back () {
      this.dialogVisible = false;
    },
    close () {
      // this.$refs.ruleForm.clearValidate();
      // Object.assign(this.formData, {});
      this.activeName = 'first',
        this.signInfo = null
      this.paymentInfo = {}
      this.info = {}
      this.shippingInfo = []
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 0px 20px 30px 20px;
}
.x-title {
  line-height: 1.8em;
  &:nth-last-child(2) {
    margin: 0px 0px 0px 0px;
  }
  .e-name {
    // padding: 20px 0px 30px 0px;
    display: inline-block;
    margin: 0px 40px 0px 0px;
  }
}
/deep/.container {
  background: #ffffff;
  padding: 0px 15px 15px;
  height: 500px;
  min-height: 500px;
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
.collection-box {
  display: flex;
  height: 40px;
  line-height: 30px;
  div {
    margin: 0px 30px 0px 0px;
  }
}
.mainImage {
  width: 80px;
  height: 80px;
}
.logistics {
  display: flex;
  flex-wrap: wrap;
  div {
    line-height: 1.8em;
    margin: 0px 30px 0px 0px;
  }
}
.app-container {
  height: calc(100vh - 86px);
  overflow: auto;
  box-sizing: border-box;
}
.order_info {
  line-height: 1.8em;
  span {
    margin-right: 20px;
  }
}
.product_form {
  .el-input,
  .el-select,
  .el-date-editor--date {
    width: 200px;
  }
  .el-textarea {
    width: 60%;
    .el-textarea__inner {
      height: 200px;
    }
  }
}
.product_img {
  width: 50px;
  height: 50px;
}
.ql-container {
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
}
.bottom-top {
  margin: 20px 0px 0px;
}
/deep/.el-table {
  overflow-y: scroll !important;
  overflow: auto !important;
}
/deep/.el-table__fixed,
.el-table__fixed-right {
  height: auto !important; // 此处的important表示优先于element.style
  bottom: 17px !important; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
}
.text-center {
  margin-top: 10px;
}
</style>
