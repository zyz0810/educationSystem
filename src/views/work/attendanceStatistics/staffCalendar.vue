<template>
  <div class="app-container">
    <div class="content_box">
      <!--  <el-calendar v-model="value">
      </el-calendar>-->
      <el-calendar v-model="value">
        <template slot="dateCell"
                  slot-scope="{date, data}">
          <div slot="reference"
               class="div-Calendar"
               @click="calendarOnClick(data)"
               :class="data.isSelected ? 'is-selected' : ''">
            <div> {{ data.day.split('-').slice(1).join('-') }}</div>
            <div v-for=" (item,index)  in list"
                 :key='index'>
              <div v-if="item.date == data.day">
                <!--0-工作日，1-休息日"dateType-->
                <!--打卡签到类型：正常0，外勤1" type;-->
                <!-- 0-正常，1-出差，2-请假,3-旷工,4-异常 workStatus -->
                <!-- 上班打卡状态0-正常，1-迟到，2-上班缺卡 signStartStatus-->
                <!-- 下班打卡状态0-正常，1-早退，2-下班缺卡 signEndStatus-->
                <div v-if='item.dateType == 1'
                     class="abnormal weekday">
                  <div>休息日</div>
                  <div v-if="item.signStartTime">
                    {{item.type == 1 ? '外勤' :''}} 签到 {{$moment(item.signStartTime).format("HH:mm")}}
                  </div>
                  <div v-if="item.signEndTime">
                    {{item.type == 1 ? '外勤' :''}}签退 {{$moment(item.signEndTime).format("HH:mm")}}
                  </div>
                </div>
                <div v-if='item.dateType == 0'
                     class="calendar_box">
                  <!--
                 <div v-if="item.type == 0"
                     class="abnormal"></div>
                <div v-if="item.type == 1"
                     class="abnormal"></div>
                -->
                  <div @click="item.type == 1 ? workOutDetail(1,item) : ''"
                       :class="item.signStartStatus == 0 ? 'normal': (item.signStartStatus == 1 || item.signStartStatus == 2) ? 'abnormal':''">
                    <div v-if="item.signStartStatus == 0"
                         :class="item.type == 1 ? 'underLine':''">
                      {{item.type == 1 ? '外勤' :''}}签到 {{$moment(item.signStartTime).format("HH:mm")}}
                    </div>
                    <div v-else-if="item.signStartStatus == 1"
                         :class="item.type == 1 ? 'underLine':''">
                      {{item.type == 1 ? '外勤' :''}}签到 {{$moment(item.signStartTime).format("HH:mm")}} 迟到{{item.lateMinutes}}分钟
                    </div>
                    <div v-else-if="item.signStartStatus == 2"
                         :class="item.type == 1 ? 'underLine':''">
                      {{item.type == 1 ? '外勤' :''}}上班缺卡
                    </div>
                  </div>
                  <div @click="item.type == 1 ? workOutDetail(2,item) : ''"
                       :class="item.signEndStatus == 0 ? 'normal': (item.signEndStatus == 1 || item.signEndStatus == 2) ? 'abnormal':''">
                    <div :class="item.type == 1 ? 'underLine':''">
                      <div v-if="item.signEndStatus == 0"
                           :class="item.type == 1 ? 'underLine':''">
                        {{item.type == 1 ? '外勤' :''}}签退 {{$moment(item.signEndTime).format("HH:mm")}}
                      </div>
                      <div v-else-if="item.signEndStatus == 1"
                           :class="item.type == 1 ? 'underLine':''">
                        {{item.type == 1 ? '外勤' :''}}签退 {{$moment(item.signEndTime).format("HH:mm")}} 早退{{item.leaveMinutes}}分钟
                      </div>
                      <div v-else-if="item.signEndStatus == 2"
                           :class="item.type == 1 ? 'underLine':''">
                        {{item.type == 1 ? '外勤' :''}}下班缺卡
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <div class="footer_box">{{this.$moment(value).format("YYYY年MM月")}}考勤统计
      <span><i class="green"></i>正常：{{statisticsInfor.normalDay || 0}}天</span>
      <span><i class="red"></i>迟到：{{statisticsInfor.lateDays || 0}}次(累计{{statisticsInfor.lateMinute || 0}}小时)</span>
      <span><i class="red"></i>早退：{{statisticsInfor.leaveDays || 0}}次(累计{{statisticsInfor.leaveMinute || 0}}小时)</span>
      <span><i class="red"></i>缺卡：{{statisticsInfor.cardShortages || 0}}次</span>
      <span><i class="red"></i>旷工：{{statisticsInfor.absenteeismDays || 0}}天</span>
      <span>工作时长：{{statisticsInfor.workingHours || 0}}小时 平均每天：{{statisticsInfor.averageWorkingHours || 0}}小时</span>
    </div>
    <workOutDetail :showDialog.sync="showWorkOutDialog"
                   :detail="detail"
                   :status='status'></workOutDetail>
  </div>
</template>

<script>
// import calendar from '../../../utils/calendar'
import statistics from "./statistics";
import workOutDetail from './workOutDetail'
import { attendanceCalendar, attendanceStatistics } from "@/api/attendanceStatistics";
export default {
  components: {
    statistics,
    workOutDetail
  },
  data () {
    return {
      value: '2021.04.01',
      value: new Date(),
      list: [],
      listQuery: {
        employeeId: '',
        queryMonth: '',
      },
      yearMonthFormat: '',
      statisticsInfor: {
        normalDay: 0,
      },
      showWorkOutDialog: false,
      detail: {},
      status: 1,
      searchStartTime: '',
    };
  },
  created () {
    // 动态添加点击事件
    this.$nextTick(() => {
      // 点击上个月
      let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
      prevBtn.addEventListener('click', () => {
        this.listQuery.queryMonth = this.dateFormat('YYYY-mm', this.value)
        this.searchStartTime = this.dateFormat('YYYY-mm', this.value) + '-01 00:00:00'
        this.attendanceCalendar()//月份日历
        this.attendanceStatistics()
      })
      // 点击今天
      let currBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)');
      currBtn.addEventListener('click', () => {
        this.listQuery.queryMonth = this.dateFormat('YYYY-mm', this.value)
        this.searchStartTime = this.dateFormat('YYYY-mm', this.value) + '-01 00:00:00'
        this.attendanceCalendar()//月份日历
        this.attendanceStatistics()
      })
      // 点击下个月
      let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)');
      nextBtn.addEventListener('click', () => {
        this.listQuery.queryMonth = this.dateFormat('YYYY-mm', this.value)
        this.searchStartTime = this.dateFormat('YYYY-mm', this.value) + '-01 00:00:00'
        this.attendanceCalendar()//月份日历
        this.attendanceStatistics()
      })
    })
    // 当前路由活跃状态
    this.$nextTick(() => {
      this.$store.dispatch("set_sidebar_menu", "/work/attendanceStatistics")
    })
  },
  mounted () {
    this.getThisYearMonth()
    this.value = this.$moment(this.$route.query.queryMonth).format("YYYY-MM-DD");
    this.listQuery.queryMonth = this.$moment(this.$route.query.queryMonth).format("YYYY-MM");
    this.listQuery.employeeId = this.$route.query.id;
    this.attendanceCalendar()//月份日历
    this.attendanceStatistics()
  },
  computed: {

  },
  methods: {
    // 外勤弹窗
    workOutDetail (val, row) {
      this.detail = row
      this.status = val
      this.showWorkOutDialog = true
    },
    // 统计
    attendanceStatistics () {
      let year = this.yearMonth.replace(/年/, "-")
      this.yearMonthFormat = year.replace(/月/, "")
      this.searchStartTime = this.searchStartTime || `${this.yearMonthFormat}-01 00:00:00`
      let parm = {
        searchStartTime: this.searchStartTime,
        employeeId: this.listQuery.employeeId
      }
      attendanceStatistics(parm)
        .then(res => {
          if (res.data == null) {
            this.statisticsInfor = {}
          } else {
            this.statisticsInfor = res.data
            this.statisticsInfor.lateMinute = (this.statisticsInfor.lateMinute / 60).toFixed(1)
            this.statisticsInfor.leaveMinute = (this.statisticsInfor.leaveMinute / 60).toFixed(1)
          }
        })
        .catch(() => { });
    },
    // 月份日历
    attendanceCalendar () {
      attendanceCalendar(this.listQuery)
        .then(res => {
          this.list = res.data
        })
        .catch(() => { });
    },
    //点击日期块
    calendarOnClick (e) {
      this.listQuery.queryMonth = this.$moment(e.day).format("YYYY-MM")
      this.searchStartTime = this.$moment(e.day).format("YYYY-MM") + '-01 00:00:00'
      this.attendanceCalendar()//月份日历
      this.attendanceStatistics()
    },
    // 之间格式化
    dateFormat (fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
    },
    // 获取当前年月
    getThisYearMonth () {
      var date = new Date;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" + month : month);
      this.yearMonth = (year.toString() + '年' + month.toString() + '月');
    },
  },
};
</script>

<style lang="scss" scoped>
.is-selected {
  color: #1989fa;
}
.content_box {
  // background-color: red;
  // height: 100%;
  // width: 100%;
  // background-color: red !important ;
  // height: 92% !important ;
  // width: 100% !important ;
}
/deep/.el-calendar {
  background-color: white !important ;
  // height: 100% !important ;
  // width: 100% !important ;
}
._calendar .div-Calendar {
  height: 100%;
  background: gainsboro;
}
/deep/.div-Calendar {
  div {
    line-height: 1.8em;
    // &:nth-child(1) {
    //   // padding: 10px !important;
    //   // height: 24px;
    //   // line-height: 24px;

    //   // div {
    //   //   &:nth-child(1) {
    //   //     padding: 0px !important;
    //   //   }
    //   // }
    // }
  }
}
/deep/.el-calendar-day {
  height: 100px;
  .calendar_box {
    color: white;
    font-size: 12px;
    line-height: 1.4em;
    div {
      font-size: 12px;
      margin-bottom: 5px;
    }
    .normal {
      background-color: rgba(75, 206, 208, 1);
    }
    .abnormal {
      font-size: 12px;
      background-color: rgba(251, 98, 96, 0.8);
    }
  }
}
.weekday {
  font-size: 12px;
}
/deep/.el-calendar__body {
  padding: 12px 20px 15px !important;
}
.footer_box {
  background: white;
  padding: 0px 0px 20px 20px;
  color: #666;
  font-size: 14px;
  span {
    margin: 0px 0px 0px 0px;
    margin-right: 5px;
    font-size: 12px;
    padding: 2.5px 0px 5px 30px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    .red,
    .green {
      width: 10px;
      height: 10px;
      position: absolute;
      left: 15px;
      top: 3px;
      border-radius: 50%;
    }
    .red {
      background: red;
    }
    .green {
      background-color: rgba(75, 206, 208, 1);
    }
  }
}
.underLine {
  text-decoration: underline;
}
</style>
