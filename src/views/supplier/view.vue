<!--<template>-->
<!--  <div class="content">-->
<!--    <el-form :inline="true"-->
<!--             :model="listQuery"-->
<!--             class="search_box">-->
<!--      <el-form-item label="订单编号">-->
<!--        <el-input placeholder="请输入订单编号"-->
<!--                  @change="queryOrderList"-->
<!--                  v-model.trim="listQuery.sn"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="订单状态">-->
<!--        <el-select placeholder="订单状态"-->
<!--                   @change="queryOrderList"-->
<!--                   v-model="listQuery.orderStatus"-->
<!--                   clearable>-->
<!--          <el-option label="全部"-->
<!--                     :value="0"></el-option>-->
<!--          <el-option label="待付款"-->
<!--                     :value="1"></el-option>-->
<!--          <el-option label="待审核"-->
<!--                     :value="2"></el-option>-->
<!--          <el-option label="待发货"-->
<!--                     :value="3"></el-option>-->
<!--          <el-option label="已发货"-->
<!--                     :value="4"></el-option>-->
<!--          <el-option label="已完成"-->
<!--                     :value="5"></el-option>-->
<!--          <el-option label="已付款"-->
<!--                     :value="7"></el-option>-->
<!--          <el-option label="已取消"-->
<!--                     :value="6"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="下单时间">-->
<!--        <el-date-picker v-model="dateTime"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        clearable-->
<!--                        @change="queryOrderList"-->
<!--                        type="daterange"-->
<!--                        range-separator="至"-->
<!--                        start-placeholder="开始日期"-->
<!--                        end-placeholder="结束日期"></el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="支付方式">-->
<!--        <el-select placeholder="支付方式"-->
<!--                   @change="queryOrderList"-->
<!--                   v-model="listQuery.paymentTypeId"-->
<!--                   clearable>-->
<!--          <el-option label="全部"-->
<!--                     value></el-option>-->
<!--          <el-option label="在线支付"-->
<!--                     :value="1"></el-option>-->
<!--          <el-option label="线下支付"-->
<!--                     :value="5"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="客户名称">-->
<!--        <el-input placeholder="请输入客户名称"-->
<!--                  @change="queryOrderList"-->
<!--                  v-model.trim="listQuery.clientName"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="手机">-->
<!--        <el-input placeholder="请输入手机"-->
<!--                  @change="queryOrderList"-->
<!--                  v-model.trim="listQuery.customerMobile"></el-input>-->
<!--      </el-form-item>-->
<!--      &lt;!&ndash;-->
<!--        <el-form-item label="客户经理">-->
<!--        <el-input placeholder="请输入客户经理"-->
<!--                  @change="queryOrderList"-->
<!--                  v-model.trim="listQuery.clerkName"></el-input>-->
<!--      </el-form-item>-->
<!--     &ndash;&gt;-->
<!--      <el-form-item label="客户经理">-->
<!--        <el-select placeholder="选择客户经理"-->
<!--                   filterable-->
<!--                   v-model.trim="listQuery.clerkId"-->
<!--                   @change="queryOrderList"-->
<!--                   clearable>-->
<!--          <el-option v-for="(item, index) in userOptions"-->
<!--                     :key="index"-->
<!--                     :label="item.nickname"-->
<!--                     :value="item.id" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="订单类型">-->
<!--        <el-select placeholder="订单类型"-->
<!--                   @change="queryOrderList"-->
<!--                   v-model="listQuery.orderActivityType"-->
<!--                   clearable>-->
<!--          <el-option label="全部"-->
<!--                     :value="0"></el-option>-->
<!--          <el-option label="普通订单"-->
<!--                     :value="1"></el-option>-->
<!--          <el-option label="预团购订单"-->
<!--                     :value="3"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="退款状态">-->
<!--        <el-select placeholder="退款状态"-->
<!--                   @change="queryOrderList"-->
<!--                   v-model="listQuery.refundStatus"-->
<!--                   clearable>-->
<!--          <el-option label="有"-->
<!--                     :value="2"></el-option>-->
<!--          <el-option label="无"-->
<!--                     :value="1"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="供应商名称">-->
<!--        <el-select placeholder="供应商名称"-->
<!--                   @change="queryOrderList"-->
<!--                   v-model="listQuery.supplierIds"-->
<!--                   multiple-->
<!--                   clearable>-->
<!--          <el-option v-for="item in supplierList"-->
<!--                     :key="item.id"-->
<!--                     :label="item.name"-->
<!--                     :value="item.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="queryOrderList"-->
<!--                   type="primary"-->
<!--                   icon="el-icon-search">查询</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="resetQuery"-->
<!--                   icon="el-icon-refresh">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <div class="price">-->
<!--      <div class="e-left">-->
<!--        <div>-->
<!--          订单总数：-->
<!--          <span>{{ dataInfo.orderCnt || 0 }}</span>-->
<!--        </div>-->
<!--        <div class="ml_20">-->
<!--          支付金额：-->
<!--          <span>{{ dataInfo.predictOrderPrice || 0 }}</span>-->
<!--        </div>-->
<!--        <div class="ml_20">-->
<!--          成交额：-->
<!--          <span>{{ dataInfo.completedOrderPrice || 0 }}</span>-->
<!--        </div>-->
<!--        &lt;!&ndash;-->
<!--        <div class="ml_20">-->
<!--          退款总金额：-->
<!--          <span>{{ dataInfo.refundAmount || 0 }}</span>-->
<!--        </div>-->
<!--        <div class="ml_20">-->
<!--          退款总订单：-->
<!--          <span>{{ dataInfo.refundOrderCnt || 0 }}</span>-->
<!--        </div>-->
<!--      &ndash;&gt;-->
<!--      </div>-->
<!--      <el-button class="filter-item button_box"-->
<!--                 v-rules="{ admin: 'admin', ordinary: 'order:export' }"-->
<!--                 icon="iconfont icon-daochu"-->
<!--                 @click="exportFile">导出选中</el-button>-->
<!--    </div>-->
<!--    <el-table v-loading="listLoading"-->
<!--              ref="activityTable"-->
<!--              :data="dataList"-->
<!--              :header-cell-style="{ background: '#f5f7fa' }"-->
<!--              element-loading-text="拼命加载中"-->
<!--              @selection-change="(list) => (selectList = list)"-->
<!--              border-->
<!--              :row-key="(row) => {return row.orderId}"-->
<!--              :height="tableHeight"-->
<!--              @row-click=" (row, column, event) => { $refs.activityTable.toggleRowSelection(row);} "-->
<!--              highlight-current-row>-->
<!--      <el-table-column type="selection"-->
<!--                       :reserve-selection="true"-->
<!--                       width="55"-->
<!--                       fixed></el-table-column>-->
<!--      <el-table-column label="订单编号"-->
<!--                       align="center"-->
<!--                       min-width="200"-->
<!--                       prop="orderSn">-->
<!--        <template slot-scope="scope">-->
<!--          <div :class="scope.row.groupPurchaseId ? 'label_box' :'' ">-->
<!--            <span>{{ scope.row.orderSn }}</span>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="客户编号"-->
<!--                       align="center"-->
<!--                       min-width="140"-->
<!--                       prop="customerId">-->
<!--      </el-table-column>-->
<!--      <el-table-column label="客户名称"-->
<!--                       min-width="160"-->
<!--                       align="center"-->
<!--                       show-overflow-tooltip-->
<!--                       prop="customerName"></el-table-column>-->
<!--      <el-table-column label="供应商名称"-->
<!--                       min-width="160"-->
<!--                       show-overflow-tooltip-->
<!--                       align="center"-->
<!--                       prop="storeName"></el-table-column>-->
<!--      <el-table-column label="手机号"-->
<!--                       width="100"-->
<!--                       align="center"-->
<!--                       prop="customerMobile"></el-table-column>-->
<!--      <el-table-column label="订单金额"-->
<!--                       align="center"-->
<!--                       prop="orderPrice"></el-table-column>-->
<!--      <el-table-column label="优惠金额"-->
<!--                       align="center"-->
<!--                       prop="totalDiscountPrice"></el-table-column>-->
<!--      <el-table-column label="余额抵扣"-->
<!--                       align="center"-->
<!--                       prop="useRebatePrice"></el-table-column>-->
<!--      <el-table-column label="实付金额"-->
<!--                       align="center"-->
<!--                       prop="paymentPrice"></el-table-column>-->
<!--      <el-table-column label="预计返利金"-->
<!--                       width="90"-->
<!--                       align="center"-->
<!--                       prop="rebateDiscount"></el-table-column>-->
<!--      <el-table-column label="累计退款金额"-->
<!--                       width="100"-->
<!--                       align="center"-->
<!--                       prop="refundAmount"></el-table-column>-->
<!--      <el-table-column label="退款状态"-->
<!--                       align="center"-->
<!--                       prop="refundStatus"></el-table-column>-->
<!--      <el-table-column label="订单状态"-->
<!--                       align="center"-->
<!--                       prop="orderStatus"></el-table-column>-->
<!--      <el-table-column label="下单平台"-->
<!--                       align="center"-->
<!--                       prop="orderPlatform"-->
<!--                       :formatter="formaOrderPlatform"></el-table-column>-->
<!--      <el-table-column label="支付方式"-->
<!--                       align="center"-->
<!--                       min-width="100"-->
<!--                       show-overflow-tooltip-->
<!--                       prop="paymentMethodName"></el-table-column>-->
<!--      <el-table-column label="下单时间"-->
<!--                       width="140"-->
<!--                       align="center"-->
<!--                       :formatter="formatTime"-->
<!--                       prop="createTime"></el-table-column>-->
<!--      <el-table-column label="付款时间"-->
<!--                       width="140"-->
<!--                       align="center"-->
<!--                       :formatter="formatTime"-->
<!--                       prop="paymentTime"></el-table-column>-->
<!--      <el-table-column label="客户经理"-->
<!--                       width="110"-->
<!--                       show-overflow-tooltip-->
<!--                       align="center"-->
<!--                       fixed="right"-->
<!--                       prop="clerkName"></el-table-column>-->
<!--      <el-table-column label="联系方式"-->
<!--                       width="100"-->
<!--                       align="center"-->
<!--                       fixed="right"-->
<!--                       prop="clerkMobile"></el-table-column>-->
<!--      <el-table-column label="操作"-->
<!--                       align="center"-->
<!--                       width="90"-->
<!--                       v-if="permissions.includes('admin') || permissions.includes('order:detail')"-->
<!--                       fixed="right">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text"-->
<!--                     v-rules="{admin:'admin',ordinary:'order:detail'}"-->
<!--                     @click="getDetail(scope.row)">详情</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <pagination v-show="total > 0"-->
<!--                :total="total"-->
<!--                :page.sync="listQuery.page"-->
<!--                :limit.sync="listQuery.limit"-->
<!--                @pagination="orderList"-->
<!--                class="text-right" />-->
<!--    &lt;!&ndash;-->
<!--      <detail :showDialog.sync="showDialog"-->
<!--            :orderId="orderId" />-->
<!--    &ndash;&gt;-->
<!--    &lt;!&ndash;查看订单详情&ndash;&gt;-->
<!--    <ordersDetail :showDialog.sync="showDialog"-->
<!--                  :orderDetails="orderDetail"></ordersDetail>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { queryOrderList, exportOrderDetail } from "@/api/order";-->
<!--import { getSupplier, } from "@/api/common";-->
<!--import { mapState } from "vuex";-->
<!--import detail from "./detail";-->
<!--import { getUsersByRole } from "@/api/common";-->
<!--export default {-->
<!--  props: {-->
<!--    orderType: {-->
<!--      required: true,-->
<!--      type: [String, Number],-->
<!--      default: "",-->
<!--    },-->
<!--  },-->
<!--  components: {-->
<!--    detail,-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState({-->
<!--      roles: (state) => state.user.roles,-->
<!--      permissions: state => state.user.permissions-->
<!--    }),-->
<!--    isDisabled () {-->
<!--      return this.selectList.length < 1;-->
<!--    },-->
<!--    dateTime: {-->
<!--      get () {-->
<!--        if (this.listQuery.startTime && this.listQuery.endTime) {-->
<!--          return [this.listQuery.startTime, this.listQuery.endTime];-->
<!--        } else {-->
<!--          return [];-->
<!--        }-->
<!--      },-->
<!--      set (v) {-->
<!--        if (v) {-->
<!--          this.listQuery.startTime = v[0] + ' 00:00:00';-->
<!--          this.listQuery.endTime = v[1] + ' 23:59:59';-->
<!--        } else {-->
<!--          this.listQuery.startTime = "";-->
<!--          this.listQuery.endTime = "";-->
<!--        }-->
<!--      },-->
<!--    },-->
<!--  },-->
<!--  data () {-->
<!--    return {-->
<!--      userOptions: [],-->
<!--      listLoading: false,-->
<!--      dataList: [],-->
<!--      total: 0,-->
<!--      dataInfo: {},-->
<!--      tableHeight: 400,-->
<!--      showDialog: false,-->
<!--      selectList: [],-->
<!--      orderId: "",-->
<!--      listQuery: {-->
<!--        page: 1,-->
<!--        endTime: "",-->
<!--        startTime: "",-->
<!--        clientName: "",-->
<!--        orderStatus: "",-->
<!--        limit: 10,-->
<!--        customerMobile: "",-->
<!--        clerkName: "",-->
<!--        paymentTypeId: "",-->
<!--        sn: "",-->
<!--        clerkId: '',-->
<!--        orderActivityType: '', //订单类型-->
<!--        refundStatus: '',//退款状态-->
<!--        supplierIds: [],//供应商名称-->
<!--      },-->
<!--      orderDetail: {}, //订单详情-->
<!--      supplierList: [],-->
<!--    };-->
<!--  },-->
<!--  mounted () {-->
<!--    this.$nextTick(() => {-->
<!--      this.tableHeight =-->
<!--        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 275;-->
<!--      window.onresize = () => {-->
<!--        this.tableHeight =-->
<!--          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 275;-->
<!--      };-->
<!--    });-->
<!--    this.orderList();-->
<!--    this.getSupplier()//供应商名称-->
<!--    this.getUsersByRole()-->
<!--  },-->
<!--  methods: {-->
<!--    // 所有下拉用户列表数据-->
<!--    getUsersByRole () {-->
<!--      let data = {};-->
<!--      getUsersByRole(data)-->
<!--        .then(res => {-->
<!--          if (res.resp_code == 0) {-->
<!--            this.userOptions = res.data;-->
<!--          } else {-->
<!--            this.$message({-->
<!--              message: res.data.resp_msg,-->
<!--              type: "warning"-->
<!--            });-->
<!--          }-->
<!--        })-->
<!--        .catch(err => console.log(err));-->
<!--    },-->
<!--    getSupplier () {-->
<!--      getSupplier().then(-->
<!--        (res) => {-->
<!--          this.supplierList = res.data-->
<!--        }-->
<!--      );-->
<!--    },-->
<!--    // 平台支付方式0 康药多  1  康药麦麦-->
<!--    formaOrderPlatform (row, column, cellValue, index) {-->
<!--      return cellValue == 0 ? "康药多" : cellValue == 1 ? "康药麦麦" : "";-->
<!--    },-->
<!--    // 文件导出-->
<!--    exportFile () {-->
<!--      const ids = this.selectList.map((item) => item.orderId);-->
<!--      const {-->
<!--        endTime,-->
<!--        startTime,-->
<!--        clientName,-->
<!--        orderStatus,-->
<!--        customerMobile,-->
<!--        clerkName,-->
<!--        paymentTypeId,-->
<!--        sn,-->
<!--        clerkId,-->
<!--        orderActivityType, //订单类型-->
<!--        refundStatus,//退款状态-->
<!--        supplierIds,//供应商名称-->
<!--      } = this.listQuery;-->
<!--      exportOrderDetail({-->
<!--        ids,-->
<!--        endTime,-->
<!--        startTime,-->
<!--        clientName,-->
<!--        orderStatus,-->
<!--        customerMobile,-->
<!--        clerkName,-->
<!--        paymentTypeId,-->
<!--        sn,-->
<!--        clerkId,-->
<!--        orderActivityType, //订单类型-->
<!--        refundStatus,//退款状态-->
<!--        supplierIds,//供应商名称-->
<!--        orderType: this.orderType // 订单切换-->
<!--      }).then((res) => {-->
<!--        const blob = new Blob([res]);-->
<!--        let myDate = new Date();-->
<!--        let timename = myDate.toLocaleDateString().split("/").join("-");-->
<!--        const str = "订单";-->
<!--        const fileName = str + timename + ".xls";-->
<!--        const linkNode = document.createElement("a");-->
<!--        linkNode.download = fileName; //a标签的download属性规定下载文件的名称-->
<!--        linkNode.style.display = "none";-->
<!--        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL-->
<!--        document.body.appendChild(linkNode);-->
<!--        linkNode.click(); //模拟在按钮上的一次鼠标单击-->
<!--        URL.revokeObjectURL(linkNode.href); // 释放URL 对象-->
<!--        document.body.removeChild(linkNode);-->
<!--      });-->
<!--    },-->
<!--    resetQuery () {-->
<!--      Object.assign(this.listQuery, {-->
<!--        page: 1,-->
<!--        clientName: "",-->
<!--        orderStatus: "",-->
<!--        limit: 10,-->
<!--        endTime: "",-->
<!--        startTime: "",-->
<!--        customerMobile: "",-->
<!--        clerkName: "",-->
<!--        paymentTypeId: "",-->
<!--        sn: "",-->
<!--        clerkId: '',-->
<!--        orderActivityType: '', //订单类型-->
<!--        refundStatus: '',//退款状态-->
<!--        supplierIds: [],//供应商名称-->
<!--      });-->
<!--      this.dateTime = "";-->
<!--      this.orderList();-->
<!--      this.$refs.activityTable.clearSelection()  //清空选中-->
<!--    },-->
<!--    formatTime (row, column, cellValue, index) {-->
<!--      return cellValue-->
<!--        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")-->
<!--        : "暂无";-->
<!--    },-->
<!--    formatStatus (row, column, cellValue, index) {-->
<!--      return cellValue == 0-->
<!--        ? "待到账"-->
<!--        : cellValue == 1-->
<!--          ? "已到账"-->
<!--          : cellValue == 2-->
<!--            ? "已取消"-->
<!--            : "";-->
<!--    },-->
<!--    getDetail (row) {-->
<!--      const { orderId } = row;-->
<!--      this.orderId = orderId;-->
<!--      this.orderDetail = row;-->
<!--      this.showDialog = true;-->
<!--    },-->
<!--    // 条件查询-->
<!--    queryOrderList () {-->
<!--      this.listQuery.page = 1-->
<!--      this.orderList()-->
<!--    },-->
<!--    orderList () {-->
<!--      queryOrderList({ ...this.listQuery, orderType: this.orderType }).then(-->
<!--        (res) => {-->
<!--          const data = res.data;-->
<!--          this.dataList = data.data;-->
<!--          Object.assign(this.dataInfo, data);-->
<!--          this.total = data.count;-->
<!--        }-->
<!--      );-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style lang="scss" scope>-->
<!--.price {-->
<!--  color: #666666;-->
<!--  display: flex;-->
<!--  margin: 10px 0;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  .e-left {-->
<!--    display: flex;-->
<!--    span {-->
<!--      font-weight: bold;-->
<!--      padding: 0 4px;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--.search_box .el-form-item {-->
<!--  float: none !important;-->
<!--  margin: 10px 10px 10px 0;-->
<!--}-->
<!--</style>-->
