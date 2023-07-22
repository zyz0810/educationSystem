<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="15">
      <!--
        <el-col :xs="24"
              :sm="24"
              :lg="10">
        <div class="chart-wrapper">
          <div class="header-wrapper">
            <label class="label">业绩统计</label>
            <div class="btn_box">
              <el-select v-model="listQuery.flagScope"
                         @change="queryMainPageData"
                         clear
                         placeholder="请选择"
                         class="fr">
                <el-option label="我的业绩"
                           :value="1"></el-option>
                <el-option label="下属业绩"
                           :value="2"></el-option>
                <el-option label="全部业绩"
                           :value="0"></el-option>
              </el-select>
              <el-select v-model="listQuery.time"
                         @change="queryMainPageData"
                         placeholder="请选择"
                         class="fr ml_10">
                <el-option v-for="(item,index) in list"
                           :key="index"
                           :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="body-wrapper">
            <div class="content">
              <label class="label">支付金额</label>
              <div>{{tradingPrice || 0}}</div>
            </div>
            <div class="content">
              <label class="label">支付订单</label>
              <div>{{tradingOrderCnt || 0}}</div>
            </div>
          </div>
        </div>
      </el-col>
       {{permissions.includes('admin') || (provider_type == '服务商') }}
      -->
      <!-- v-rules="{admin:'admin',ordinary:'tesk:indicators'}" -->
      <!--
        :lg="permissions.includes('admin') || ( provider_status == 5 && provider_type == '服务商') || (provider_status == 5 && provider_type == '合伙人') ? 12 :24"
      -->
      <!--:lg="permissions.includes('admin')||permissions.includes('tesk:indicators')?12:24"-->
      <el-col :xs="24"
              :sm="24"
              :lg="24">
        <div class="chart-wrapper">
          <div class="header-wrapper">
            <label class="label">数据简报</label>
            <div class="btn_box">
              <el-select v-model="listQuery1.flagScope"
                         @change="queryMainPageData2"
                         clear
                         placeholder="请选择"
                         class="fr">
                <el-option label="我的业绩"
                           :value="1"></el-option>
                <el-option label="下属业绩"
                           :value="2"></el-option>
                <el-option label="全部业绩"
                           :value="0"></el-option>
              </el-select>
              <el-select v-model="listQuery1.time"
                         @change="queryMainPageData2"
                         placeholder="请选择"
                         class="fr ml_10">
                <el-option v-for="(item,index) in list"
                           :key="index"
                           :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="body-wrapper height300">
            <div class="content">
              <label class="label">新增客户</label>
              <div>{{ newCustomerCnt || 0}}</div>
            </div>
            <div class="content">
              <label class="label">新增订单</label>
              <div>{{newOrderCnt || 0}}</div>
            </div>
            <div class="content">
              <label class="label">新增签到</label>
              <div>{{newSignInCnt || 0}}</div>
            </div>
            <div class="content">
              <label class="label">支付金额</label>
              <div>{{tradingPrice || 0}}</div>
            </div>
            <div class="content">
              <label class="label">支付订单</label>
              <div>{{tradingOrderCnt || 0}}</div>
            </div>
          </div>
        </div>
      </el-col>
      <!--  v-if="permissions.includes('admin') || ( provider_status == 5 && provider_type == '服务商') || (provider_status == 5 && provider_type == '合伙人')" -->
      <!--
      <el-col v-rules="{admin:'admin',ordinary:'tesk:indicators'}"
              :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <div class="header-wrapper">
            <label class="label">任务指标</label>
            <div class="btn_box">
              <el-select v-model="listQuery5.type"
                         @change="taskTarget"
                         clear
                         placeholder="请选择"
                         class="fr">
                <el-option label="销售业绩"
                           value="performance"></el-option>
                <el-option label="客户拜访"
                           value="visit"></el-option>
                <el-option label="门店动销数"
                           value="sales"></el-option>
                <el-option label="平均单店销售"
                           value="average"></el-option>
              </el-select>
              <el-select placeholder="选择服务商"
                         filterable
                         class="fr ml_10"
                         clearable
                         v-model.trim="listQuery5.providerId"
                         @change="taskTarget">
                <el-option v-for="(item, index) in providerList"
                           :key="index"
                           :label="item.providerName"
                           :value="item.serviceProviderId" />
              </el-select>
              <el-date-picker class="fr ml_10"
                              v-model="listQuery5.queryDate"
                              type="month"
                              clear
                              align="right"
                              value-format="yyyy-MM"
                              @change="taskTarget"
                              unlink-panels
                              placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
          <div class="body-wrapper body-wrapper2 height300">
            <div class='r-div1'>
              <el-progress type="circle"
                           :stroke-width="12"
                           :percentage="taskPercent"></el-progress>
              <div class="v-p">完成度</div>
              <div class="v-p2">{{taskPercentShow}}%</div>
            </div>
            <div class="r-div2">
              <div class="v-title">目标{{(listQuery5.type == 'performance' || listQuery5.type == 'average')? '（元）' : listQuery5.type == 'visit' ? '（次）' : '（个）'}} </div>
              <div class="v-money m-b30">{{(listQuery5.type == 'performance' || listQuery5.type == 'average')? '¥' : ''}}{{taskTarger}}</div>
              <div class="v-title">完成{{(listQuery5.type == 'performance' || listQuery5.type == 'average')? '（元）' : listQuery5.type == 'visit' ? '（次）' : '（个）'}}</div>
              <div class="v-money">{{(listQuery5.type == 'performance' || listQuery5.type == 'average')? '¥' : ''}}{{taskFinish}}</div>
            </div>
          </div>
        </div>
      </el-col>
     -->
    </el-row>
    <el-row :gutter="15">
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <div class="header-wrapper">
            <label class="label">业绩目标</label>
            <div class="btn_box">
              <el-select v-model="listQuery2.performanceEnum"
                         @change="completionEchars"
                         clear
                         placeholder="请选择"
                         class="fr">
                <el-option label="员工目标"
                           value="USER"></el-option>
                <el-option label="部门目标"
                           value="DEPT"></el-option>
              </el-select>
              <el-date-picker class="fr ml_10"
                              v-model="listQuery2.yearChoose"
                              type="month"
                              clear
                              align="right"
                              value-format="yyyy-MM"
                              @change="completionEchars"
                              unlink-panels
                              placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
          <div class="body-wrapper body-wrapper2">
            <div class="target-tips"
                 v-if="listQuery2.performanceEnum == 'USER'">员工目标：统计本人及下属的数据，需要对应权限</div>
            <div class="target-tips"
                 v-if="listQuery2.performanceEnum == 'DEPT'">部门目标：统计本部门及下属部门的数据，需要对应权限</div>
            <div class='r-div1'>
              <el-progress type="circle"
                           :stroke-width="12"
                           :percentage="compeletPercent"></el-progress>
              <div class="v-p">完成度</div>
              <div class="v-p2">{{compeletPercentShow}}%</div>
            </div>
            <div class="r-div2">
              <div class="v-title">目标金额</div>
              <div class="v-money m-b30">¥{{performancePrice}}</div>
              <div class="v-title">完成金额</div>
              <div class="v-money">¥{{orderPrice}}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <div class="header-wrapper">
            <label class="label">业绩排行</label>
            <div class="btn_box">
              <el-select v-model="listQuery3.performanceEnum"
                         @change="achievementByOrderEchars"
                         clear
                         placeholder="请选择"
                         class="fr">
                <el-option label="员工排行"
                           value="USER"></el-option>
                <el-option label="部门排行"
                           value="DEPT"></el-option>
              </el-select>
              <el-date-picker class="fr ml_10"
                              v-model="listQuery3.yearChoose"
                              type="month"
                              clear
                              value-format="yyyy-MM"
                              @change="achievementByOrderEchars"
                              align="right"
                              unlink-panels
                              placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
          <div class="body-wrapper body-wrapper2">
            <ColumnChart :name="'myChart'"
                         :echartData='echartData'
                         style="width:100%;height: 340px;"></ColumnChart>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryMainPageData } from "@/api/statistics";
import { dashboard, completionEchars, taskTarget } from "@/api/dashboard";
import { achievementByOrderEchars } from "@/api/performanceCompletion";
import { getUsersByRole, findProviderDept } from "@/api/common";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Index",
  components: {},
  data () {
    return {
      value3: "",
      list: [
        { name: "今天", value: 1 },
        { name: "昨天", value: 2 },
        { name: "最近一周", value: 3 },
        { name: "本月", value: 4 },
        { name: "最近一个月", value: 5 },
        { name: "最近三个月", value: 6 }
      ],
      listQuery: {
        flagScope: 1,
        time: 4
      },
      listQuery1: {
        flagScope: 1,
        time: 4
      },
      listQuery2: {
        ids: '',
        performanceEnum: 'USER',//  DEPT: 对应部门   USER: 对应员工
        startTime: '',
        endTime: '',
        yearChoose: '',
        year: '',
      },
      listQuery3: {
        performanceEnum: 'USER',//  DEPT: 对应部门   USER: 对应员工
        startTime: '',
        endTime: '',
        yearChoose: '',
        year: '',
      },
      listQuery5: {
        providerId: '',
        queryDate: this.$moment(new Date()).format("YYYY-MM"),
        type: 'performance', //all:全都要;performance 销售业绩 ; visit 拜访数 ;sales 门店动销数 ;average 平均销售数
      },
      dataInfo: {
        newCustomerCnt: "",
        newCustomerFollowCnt: "",
        tradingOrderCnt: "",
        tradingPrice: "",
        newOrderCnt: "",
        newSignInCnt: '',
      },
      compeletPercent: 0,//compeletPercent
      compeletPercentShow: 0,
      performancePrice: 0,//目标金额
      orderPrice: 0,//完成金额
      echartData: {
        name: []
      },
      newCustomerCnt: 0,
      newOrderCnt: 0,
      newSignInCnt: '',
      tradingPrice: 0,
      tradingOrderCnt: 0,
      userOptions: [],
      providerList: [],
      // 任务指标
      taskPercent: 0,
      taskPercentShow: 0,//比例
      taskTarger: 0,//目标金额
      taskFinish: 0,//完成金额
    };
  },
  computed: {
    ...mapState({
      crm_id: (state) => state.user.crm_id,
      roles: (state) => state.user.roles,
      permissions: (state) => state.user.permissions,
    }),
    ...mapGetters(["provider_type", "provider_status", "provider_status_foWeb", 'provider_id']),
  },
  mounted () {
    this.listQuery5.providerId = (this.provider_type == '服务商' || this.provider_type == '合伙人') ? this.provider_id : ''
    // this.queryMainPageData();
    this.queryMainPageData2()
    this.getYear()
    this.getUsersByRole() //员工列表
    this.findProviderDept() //服务商列表
    // this.taskTarget()
  },
  methods: {
    // 任务指标
    taskTarget () {
      taskTarget(this.listQuery5)
        .then(res => {
          // performance 销售业绩 ; visit 拜访数 ;sales 门店动销数 ;average 平均销售数
          if (this.listQuery5.type == 'performance') {
            this.taskPercent = Number((res.data.performanceCompletionRate * 100).toFixed(2)) > 100 ? 100 : Number((res.data.performanceCompletionRate * 100).toFixed(2)) //比例
            this.taskPercentShow = Number((res.data.performanceCompletionRate * 100).toFixed(2)) || 0//比例
            this.taskTarger = res.data.performanceTargetAmount || 0//目标金额
            this.taskFinish = res.data.performanceRealAmount || 0//完成金额
          } else if (this.listQuery5.type == 'visit') {
            this.taskPercent = Number((res.data.customerVisitCompletionRate * 100).toFixed(2)) > 100 ? 100 : Number((res.data.customerVisitCompletionRate * 100).toFixed(2)) //比例
            this.taskPercentShow = Number((res.data.customerVisitCompletionRate * 100).toFixed(2)) || 0//比例
            this.taskTarger = res.data.customerVisitTargetNum || 0//目标金额
            this.taskFinish = res.data.customerVisitRealNum || 0//完成金额
          } else if (this.listQuery5.type == 'sales') {
            this.taskPercent = Number((res.data.storeSalesCompletionRate * 100).toFixed(2)) > 100 ? 100 : Number((res.data.storeSalesCompletionRate * 100).toFixed(2)) //比例
            this.taskPercentShow = Number((res.data.storeSalesCompletionRate * 100).toFixed(2)) || 0//比例
            // providerStoreTargetNum
            this.taskTarger = res.data.providerStoreTargetNum || 0//目标金额
            this.taskFinish = res.data.storeSalesRealNum || 0//完成金额
          } else if (this.listQuery5.type == 'average') {
            this.taskPercent = Number((res.data.averageStoreCompletionRate * 100).toFixed(2)) > 100 ? 100 : Number((res.data.averageStoreCompletionRate * 100).toFixed(2)) //比例
            this.taskPercentShow = Number((res.data.averageStoreCompletionRate * 100).toFixed(2)) || 0//比例
            this.taskTarger = res.data.averageStoreTargetAmount || 0//目标金额
            this.taskFinish = res.data.averageStoreRealAmount || 0//完成金额
          }
        })
        .catch(() => {
        });
    },
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;

          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    // echars 数据
    achievementByOrderEchars () {
      let yearMonth = this.listQuery3.yearChoose.split('-')
      let year = yearMonth[0]
      let month = yearMonth[1]
      function mGetDate (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }
      var totalDay = mGetDate(year, month);
      this.listQuery3.startTime = year + '-' + month + '-' + '01' + ' 00:00:00'
      this.listQuery3.endTime = year + '-' + month + '-' + totalDay + ' 23:59:59'
      this.listQuery3.year = year;
      achievementByOrderEchars(this.listQuery3).then(res => {
        this.echartData = res.data;
      });
    },
    getYear () {
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);   //获取年份
      this.listQuery2.yearChoose = this.$moment(date).format("YYYY-MM");
      this.listQuery3.yearChoose = this.$moment(date).format("YYYY-MM");
      this.listQuery2.year = this.$moment(date).format("YYYY");
      this.listQuery3.year = this.$moment(date).format("YYYY");
      this.completionEchars()
      this.achievementByOrderEchars()
    },
    // 进度条
    completionEchars () {
      let yearMonth = this.listQuery2.yearChoose.split('-')
      let year = yearMonth[0]
      let month = yearMonth[1]
      function mGetDate (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }
      var totalDay = mGetDate(year, month);
      this.listQuery2.startTime = year + '-' + month + '-' + '01' + ' 00:00:00'
      this.listQuery2.endTime = year + '-' + month + '-' + totalDay + ' 23:59:59'
      this.listQuery2.year = year;
      completionEchars(this.listQuery2)
        .then(res => {
          this.compeletPercent = Number((res.data.compeletPercent * 100).toFixed(2)) > 100 ? 100 : Number((res.data.compeletPercent * 100).toFixed(2)) //比例
          this.compeletPercentShow = Number((res.data.compeletPercent * 100).toFixed(2))//比例
          this.performancePrice = res.data.performancePrice//目标金额
          this.orderPrice = res.data.orderPrice//完成金额
        })
        .catch(() => {
        });
    },
    // 销售业绩统计
    // queryMainPageData () {
    //   const { time, flagScope } = this.listQuery;
    //   const data = this.formatTime(time);
    //   queryMainPageData({ flagScope, ...data })
    //     .then(res => {
    //       // Object.assign(this.dataInfo, res.data);
    //       this.tradingPrice = res.data.tradingPrice
    //       this.tradingOrderCnt = res.data.tradingOrderCnt
    //     })
    //     .catch(() => {
    //       Object.assign(this.dataInfo, {
    //         tradingOrderCnt: "",
    //         tradingPrice: "",
    //       });
    //     });
    // },
    // 数据简报
    queryMainPageData2 () {
      const { time, flagScope } = this.listQuery1;
      const data = this.formatTime(time);
      queryMainPageData({ flagScope, ...data })
        .then(res => {
          this.tradingPrice = res.data.tradingPrice
          this.tradingOrderCnt = res.data.tradingOrderCnt
          this.newCustomerCnt = res.data.newCustomerCnt
          this.newOrderCnt = res.data.newOrderCnt
          this.newSignInCnt = res.data.newSignInCnt
        })
        .catch(() => {
          Object.assign(this.dataInfo, {
            tradingOrderCnt: "",
            tradingPrice: "",
            newCustomerCnt: "",
            newOrderCnt: "",
            newSignInCnt: "",
          });
        });
    },
    formatTime (value) {
      let endTime = new Date();
      let startTime = new Date();
      let obj = {
        startTime: "",
        endTime: ""
      };
      switch (value) {
        //今天
        case 1:
          startTime = startTime.setTime(startTime.getTime());
          Object.assign(obj, {
            endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break;
        //昨天
        case 2:
          startTime = startTime.setTime(
            startTime.getTime() - 24 * 60 * 60 * 1000
          );
          Object.assign(obj, {
            endTime: this.$moment(startTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break; 1
        //最近一周
        case 3:
          startTime = startTime.setTime(
            startTime.getTime() - 3600 * 1000 * 24 * 7
          );
          Object.assign(obj, {
            endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break;
        //本月
        case 4:
          startTime = new Date(startTime.setDate(1));
          Object.assign(obj, {
            endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break;
        //最近一个月
        case 5:
          startTime = startTime.setTime(
            startTime.getTime() - 3600 * 1000 * 24 * 30
          );
          Object.assign(obj, {
            endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break;
        //最近三个月
        case 6:
          startTime = startTime.setTime(
            startTime.getTime() - 3600 * 1000 * 24 * 90
          );
          Object.assign(obj, {
            endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
            startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
          });
          break;
        default:
          break;
      }
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    margin-bottom: 15px;
    min-width: 400px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.header-wrapper {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(249, 249, 249, 1);
  padding: 16px 16px;
  border-bottom: rgba(233, 233, 233, 1);
}
.btn_box {
  display: flex;
}
.label {
  color: #666666;
  min-width: 100px;
}
.body-wrapper {
  display: flex;
  justify-content: space-around;
  height: 240px;
  align-items: center;
}
.body-wrapper2 {
  height: 400px;
  padding-bottom: 20px;
  /deep/.el-progress__text {
    display: none !important;
  }
  .target-tips {
    position: absolute;
    top: 80px;
    left: 40px;
    color: #999;
    font-size: 14px;
  }
  .r-div1 {
    position: relative;
    .v-p {
      position: absolute;
      top: 31%;
      left: 35%;
      color: #999;
      font-size: 14px;
    }
    .v-p2 {
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #999;
      font-size: 16px;
    }
  }
  .r-div2 {
    line-height: 1.8em;
    .v-title {
      color: #999;
    }
    .v-money {
      font-size: 24px;
      color: #666;
      &:nth-child(0) {
        margin-bottom: 30px;
      }
    }
    .m-b30 {
      margin-bottom: 30px;
    }
  }
}
.content {
  text-align: center;
  height: 100px;
  padding: 20px 0;
  line-height: 40px;
  div {
    color: #666666;
    font-size: 28px;
  }
}
/deep/.el-col {
  border-top: 0px solid #dcdfe6 !important;
  border-left: 0px solid #dcdfe6 !important;
}
/deep/.el-row:last-child {
  border-bottom: 0px solid #dcdfe6 !important;
}
// 修改圆柱样式
/deep/.el-progress--circle .el-progress__text {
  top: 58%;
}
// echarts样式
/deep/#myChart {
  div {
    &:first-child {
      width: 100% !important;
      canvas {
        width: 100% !important;
      }
    }
    &:nth-child(2) {
      line-height: 0.8em !important;
      padding: 0px 8px !important;
    }
  }
}
.height300 {
  height: 300px;
}
</style>
