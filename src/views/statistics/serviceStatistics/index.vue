<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="服务商名称"
                    v-if="permissions.includes('admin')">
        <el-input v-model.trim="listQuery.providerName"
                  @change="serviceList"
                  clearable
                  placeholder="服务商名称" />
      </el-form-item>
      <el-form-item label="手机号"
                    v-if="permissions.includes('admin')">
        <el-input v-model.trim="listQuery.telephone"
                  @change="serviceList"
                  clearable
                  placeholder="手机号" />
      </el-form-item>
      <el-form-item label="联系人"
                    v-if="permissions.includes('admin')">
        <el-input v-model.trim="listQuery.linkman"
                  @change="serviceList"
                  clearable
                  placeholder="联系人" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="serviceList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="serviceList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="container">
      <div id="name"
           class="myChart"
           ref='chart'
           style="width:100%;height:500px"></div>
      <div class="total-box">
        <div>实付总额：<span>￥{{ providerOrderPayPrice || 0}}</span>元 </div>
        <div class="ml_20">服务商收益总额：<span>￥{{ providerAmount || 0}}</span>元</div>
        <div class="ml_20">平台收益总额：<span>￥{{ providerProfitAmount || 0}}</span>元</div>
      </div>
      <el-table v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="日期"
                         align="center"
                         width="100"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="服务商名称"
                         align="center"
                         v-if="permissions.includes('admin')"
                         min-width="120"
                         show-overflow-tooltip
                         prop="providerName"></el-table-column>
        <el-table-column label="联系人"
                         align="center"
                         show-overflow-tooltip
                         v-if="permissions.includes('admin')"
                         min-width="120"
                         prop="linkman"></el-table-column>
        <el-table-column label="手机号"
                         v-if="permissions.includes('admin')"
                         width="100"
                         align="center"
                         prop="telephone"></el-table-column>
        <el-table-column label="总销量"
                         align="center"
                         prop="totalQuantity"></el-table-column>
        <el-table-column label="总额"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="实付总额"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="供应商优惠金额"
                         align="center"
                         width="115"
                         prop="discountAmount"></el-table-column>
        <el-table-column label="余额抵扣"
                         align="center"
                         prop="useRebatePrice"></el-table-column>
        <el-table-column label="退款金额"
                         align="center"
                         prop="refundAmount"></el-table-column>
        <el-table-column label="服务商收益总额"
                         align="center"
                         width="120"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="平台收益总额"
                         align="center"
                         width="100"
                         prop="providerProfitAmount"></el-table-column>
        <el-table-column label="操作"
                         width="100"
                         fixed="right"
                         v-if="permissions.includes('admin') || permissions.includes('service:review:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'service:review:view' }"
                       @click.stop="goDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right m-b30"
                  @pagination="queryServiceList" />
    </div>
    <!--查看订单详情-->
    <orders :showDialog.sync="showGoodsDetailsDialog"
            :datail='datail'></orders>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { queryServiceList, queryProviderSaleEcharts } from "@/api/salesStatistics";
import orders from './orders'
import echarts from "echarts";
export default {
  components: {
    orders
  },
  data () {
    return {
      listQuery: {
        providerName: '',
        telephone: '',
        linkman: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      listLoading: false,
      tableHeight: 532,
      selectList: [],
      dataList: [],
      userId: '',
      showGoodsDetailsDialog: false,
      datail: {},
      echartData: [{
        clerkId: null,
        customerStoreId: null,
        deptId: 257,
        deptName: "康药多测试",
        orderCnt: 9,
        orderId: null,
        payPrice: 403.01,
        refundOrderCnt: null,
        refundPrice: 0,
      }],
      providerAmount: '',
      providerProfitAmount: '',//平台收益总额
      providerOrderPayPrice: '',
    };
  },
  mounted () {
    this.queryServiceList();
    this.$nextTick(function () {
      this.drawLine()
      // 图表自适应
      let _this = this
      window.onresize = function () {
        _this.charts.resize();
      };
    });
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    dateTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    }
  },
  methods: {
    drawLine () {
      queryProviderSaleEcharts(this.listQuery)
        .then((res) => {
          // 基于准备好的dom，初始化echarts实例
          this.charts = echarts.init(document.getElementById('name'));
          // 绘制图表
          this.charts.setOption({
            title: {
              text: '',
              subtext: ''
            },
            tooltip: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              top: '5%',
              bottom: '5%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: res.data.providerName
            },
            series: [
              {
                type: 'bar',
                data: res.data.providerAmount,
                barWidth: '30px',
                itemStyle: {
                  normal: {
                    color: "#1890ff",
                    borderColor: "#1890ff"
                  }
                }
              },
            ]
          });
        })
        .catch((err) => console.log(err));
    },
    // 订单详情
    goDetail (val) {
      this.datail = val
      this.showGoodsDetailsDialog = true
    },
    //推广收益明细
    incomeDetails () {
      this.$router.push({
        path: "/details",
        query: {
          userId: this.selectList[0].customerId,
          customerName: this.selectList[0].customerUserName,
        },
      });
    },
    serviceList () {
      this.listQuery.page = 1
      this.queryServiceList()
      this.drawLine()
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        providerName: '',
        telephone: '',
        linkman: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10,
      });
      this.queryServiceList();
      this.drawLine()
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 获取客户列表
    queryServiceList () {
      queryServiceList(this.listQuery)
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count || 0;
          this.providerAmount = res.data.providerAmount
          this.providerProfitAmount = res.data.providerProfitAmount //平台收益总额
          this.providerOrderPayPrice = res.data.providerOrderPayPrice
        })
        .catch((err) => console.log(err));
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
    margin: 10px 10px 10px 0;
  }
}
.el-icon-question {
  color: #fe9400;
}
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.total-box {
  // display: flex;
  padding-bottom: 20px;
  div {
    display: inline-block;
    span {
      font-weight: bold;
      padding: 0 4px;
    }
  }
}
.m-b30 {
  margin-bottom: 30px;
}
</style>
