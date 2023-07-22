<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title">
    <div class="table-box">
      <div class="x-header">
        <div class="r-title">考勤类型</div>
        <div class="r-title">考勤统计</div>
      </div>
      <div class="x-body">
        <div class="r-title">正常</div>
        <div class="r-title">{{statisticsInfor.normalDay || 0}}天</div>
      </div>
      <!--<div class="x-body">
        <div class="r-title">请假</div>
        <div class="r-title">{{statisticsInfor.vacationDay || 0}}天</div> 
      </div>
      <div class="x-body">
        <div class="r-title">出差</div>
        <div class="r-title">{{statisticsInfor.businessDay || 0}}天</div> 
      </div>-->
      <div class="x-body">
        <div class="r-title">迟到</div>
        <div class="r-title">{{statisticsInfor.lateDays || 0}}次(累计{{statisticsInfor.lateMinute || 0}}小时)</div>
      </div>
      <div class="x-body">
        <div class="r-title">早退</div>
        <div class="r-title">{{statisticsInfor.leaveDays || 0}}次(累计{{statisticsInfor.leaveMinute || 0}}小时)</div>
      </div>
      <div class="x-body">
        <div class="r-title">缺卡</div>
        <div class="r-title">{{statisticsInfor.cardShortages || 0}}次</div>
      </div>
      <div class="x-body">
        <div class="r-title">旷工</div>
        <div class="r-title">{{statisticsInfor.absenteeismDays || 0}}天</div>
      </div>
      <div class="x-body">
        <div class="r-title">工作时长</div>
        <div class="r-title">{{statisticsInfor.workingHours || 0}}小时</div>
      </div>
      <div class="x-body">
        <div class="r-title">平均每天</div>
        <div class="r-title">{{statisticsInfor.averageWorkingHours || 0}}小时</div>
      </div>
    </div>
  </my-dialog>
</template>

<script>
import { attendanceStatistics } from "@/api/attendanceStatistics";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    staffInfor: {
      required: false,
      type: Object,
      default: {}
    },
    yearMonth: {
      required: false,
      type: String,
      default: ''
    },
  },
  data () {
    return {
      title: '2019年4月赵小刚考勤统计',
      statisticsInfor: {
      },
      yearMonthFormat: '',
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  methods: {
    attendanceStatistics () {
      let year = this.yearMonth.replace(/年/, "-")
      this.yearMonthFormat = year.replace(/月/, "")
      let parm = {
        searchStartTime: `${this.yearMonthFormat}-01 00:00:00`,
        employeeId: this.staffInfor.employeeId
      }
      attendanceStatistics(parm)
        .then(res => {
          this.statisticsInfor = res.data
          this.statisticsInfor.lateMinute = (this.statisticsInfor.lateMinute / 60).toFixed(1)
          this.statisticsInfor.leaveMinute = (this.statisticsInfor.leaveMinute / 60).toFixed(1)
        })
        .catch(() => { });
    },
    open () {
      this.attendanceStatistics()
      this.title = `${this.yearMonth}，${this.staffInfor.employeeName}考勤统计 `
    },
    close () {
      this.dialogVisible = false;

    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
#image_slot {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.table-box {
  .x-header {
    display: flex;
    justify-content: space-around;
    background: rgb(245, 247, 250);
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    border: 1px solid #dedede;
  }
  .x-body {
    display: flex;
    justify-content: space-around;
    height: 50px;
    line-height: 50px;
    border: 1px solid #dedede;
    .r-title {
      width: 50%;
      text-align: center;
      &:first-of-type {
        border-right: 1px solid #dedede;
      }
    }
  }
}
</style>
