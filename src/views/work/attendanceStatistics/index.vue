<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="选择部门"
                    prop="departIds">
        <el-cascader :options="deptList"
                     @change="queryAttendanceStatisticsAll"
                     :props="cascaderProps"
                     :show-all-levels="false"
                     v-model="listQuery.departIds"></el-cascader>
      </el-form-item>
      <el-form-item label="选择人员">
        <el-select filterable
                   @change="queryAttendanceStatisticsAll"
                   v-model="listQuery.employeeId"
                   placeholder="请选择人员"
                   clearable>
          <el-option v-for="(item, index) in dataListAll"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择月份">
        <el-date-picker v-model="listQuery.startTime"
                        type="month"
                        placeholder="选择月份"
                        format="yyyy-MM"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="getYearMonth"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryAttendanceStatisticsAll">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 p_10 bg_white">
      <div class="e-state">
        <span class=""><label class="icon-green"></label>正常</span>
        <!--<span class=""><label class="icon-yellow"></label>请假</span>
        <span class=""><label class="icon-blue"></label>出差</span>-->
        <span class=""><label class="icon-red"></label>异常</span>
      </div>
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                border
                :height="tableHeight"
                ref="activityTable"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="姓名"
                         align="center"
                         prop="employeeName"
                         fixed="left"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="考勤组"
                         align="center"
                         prop="sectionName"
                         fixed="left"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="所属部门"
                         align="center"
                         prop="deptName"
                         fixed="left"
                         show-overflow-tooltip
                         min-width="130"></el-table-column>
        <el-table-column align="center"
                         :uniqe-opened="true"
                         v-for="(items, index) in dateListChild"
                         :key="index"
                         :label="String(index + 1)">
          <template slot-scope="scope">
            <!--workStatus : 上班状态（0-正常，1-出差，2-请假  ,3-旷工(这个不展示),4-异常 -1 无）-->
            <label class="icon-green"
                   v-if="scope.row.dayDTOList[index].workStatus == 0"></label>
            <label class="icon-blue"
                   v-else-if="scope.row.dayDTOList[index].workStatus == 1"></label>
            <label class="icon-yellow"
                   v-else-if="scope.row.dayDTOList[index].workStatus == 2"></label>
            <label v-else-if="scope.row.dayDTOList[index].workStatus == 3"></label>
            <label class="icon-red"
                   v-else-if="scope.row.dayDTOList[index].workStatus == 4"></label>
            <label v-else></label>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         min-width="100"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="lookStatistics('update', scope.row)">统计</el-button>
            <el-button type="text"
                       @click="showStaffCalendar(scope.row)">日历</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="attendanceStatisticsAll"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
    </div>
    <statistics :showDialog.sync="showStatisticsDialog"
                :staffInfor="staffInfor"
                :yearMonth="yearMonth"></statistics>
  </div>
</template>

<script>
import { attendanceStatisticsAll } from "@/api/attendanceStatistics";
import { findAreaTree } from "@/api/area";
import { getCascaderOptions, getCascaderOptionsByDeptName } from "@/utils/common";
import statistics from "./statistics";
import {
  getUsers,
  getRoles,
  deleteSysUser,
  findDeptTree,
} from "@/api/system/staff";
export default {
  components: {
    statistics,
  },
  data () {
    return {
      optionType: "",
      showAddDialog: false,
      showDepartmentDialog: false,
      listQuery: {
        deptId: "", //部门id
        departIds: "",
        employeeId: "", //員工id
        limit: 10,
        page: 1,
        startTime: '',//月份
      },
      total: 0,
      listLoading: false,
      title: "",
      role: "",
      selectList: [],
      dataList: [],
      dataListAll: [],
      rolesList: [],
      dialogFormVisible: false,
      deptName: "",
      time: "",
      dialogComponents: false,
      titlleDialog: "",
      contentDialog: "",
      departmentList: [],
      paementIds: [],
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens",
      },
      tableHeight: 400,
      areaList: [],
      value1: "",
      showStatisticsDialog: false,
      dateListChild: 0,
      staffInfor: {},
      yearMonth: '',
      // 部门插件 
      cascaderProps: {
        checkStrictly: true
      },
      deptList: [],
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      };
      this.$refs.activityTable.doLayout();
    });
    this.getListAll(); // 获取用户列表
    this.findDeptTree();
    this.getThisYearMonth()
    this.getYear()

  },
  // 添加组件内的导航钩子，在跳转路由前，将函数清空
  beforeRouteLeave (to, from, next) {
    this.tableHeight = 500
    window.onresize = function () {
    }
    next()
  },
  computed: {
    isDisabled () {
      return this.selectList.length < 1;
    },
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
          this.listQuery.startTime = v[0];
          this.listQuery.endTime = v[1];
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
  },
  methods: {
    // 员工日历
    showStaffCalendar (row) {
      this.$store.dispatch("set_sidebar_menu", "")
      this.$router.push({
        name: 'staffCalendar',
        query: {
          id: row.employeeId,
          queryMonth: this.listQuery.startTime
        }
      })
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/work/attendanceStatistics")
      })
    },
    getYear () {
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);   //获取年份
      let year = this.$moment(date).format("yyyy-MM");
      this.listQuery.startTime = year + '-' + '01' + ' 00:00:00'
      this.attendanceStatisticsAll(); // 获取列表
    },
    // 获取列表
    attendanceStatisticsAll () {
      if (this.listQuery.departIds != '') {
        this.listQuery.deptId = this.listQuery.departIds.slice(-1).toString();
      }
      attendanceStatisticsAll(this.listQuery)
        .then(res => {
          this.dataList = res.data.data
          this.dateListChild = res.data.data[0].dayDTOList
          this.total = res.data.count;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch(() => { });
    },
    // 获取当前年月
    getThisYearMonth () {
      var date = new Date;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" + month : month);
      this.yearMonth = (year.toString() + '年' + month.toString() + '月');
    },
    // 获取年月
    getYearMonth (val) {
      var strs = new Array(); //定义一数组
      strs = val.split("-"); //字符分割
      this.dateListChild = [],
        this.$nextTick(() => {
          this.$refs.activityTable.doLayout();
        });
      this.listQuery.page = 1
      this.attendanceStatisticsAll()
      this.yearMonth = this.$moment(val).format("YYYY年MM月")
    },
    // 统计
    lookStatistics (val, val2) {
      this.staffInfor = val2
      this.showStatisticsDialog = true;
    },
    // 获取省市区
    findAreaTree () {
      findAreaTree()
        .then((res) => {
          this.areaList = getCascaderOptions(res.data, []);
        })
        .catch((err) => {
        });
    },
    // 部门 
    findDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    // 获取所有的用户列表
    getListAll () {
      let parm = {
        limit: 10000000,
        page: 1,
      }
      getUsers(parm)
        .then((res) => {
          this.dataListAll = res.data.data
        })
        .catch((err) => console.log(err));
    },
    queryAttendanceStatisticsAll () {
      this.listQuery.page = 1
      this.attendanceStatisticsAll()
    },
    // 重置
    resetList () {
      this.listQuery = {
        deptId: "", //部门id
        departIds: "",
        employeeId: "", //員工id
        limit: 10,
        page: 1,
        startTime: '',//月份
      };
      this.deptName = this.time = "";
      this.getYear();
    },
  },
};
</script>

<style lang="scss" scoped>
.choose-input {
  border: 1px solid #dedede;
  padding: 0px 10px;
  box-sizing: border-box;
  height: 34px;
  width: 160px;
  line-height: 34px;
  color: #999;
  .span2 {
    color: #333;
  }
}
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

label {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
  margin: 0px 10px;
}
.icon-green {
  background: #4bced0;
}
.icon-yellow {
  background: #ffa94c;
}
.icon-blue {
  background: #0079fe;
}
.icon-red {
  background: #fb6260;
}
</style>
