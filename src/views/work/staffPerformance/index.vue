<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="选择员工">
        <el-select filterable
                   @change="queryStatisticsCustomer"
                   v-model="listQuery.userId"
                   placeholder="请选择员工"
                   clearable>
          <el-option v-for="(item, index) in dataListAll"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="dateTime"
                        type="daterange"
                        clearable
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        @change="queryStatisticsCustomer"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryStatisticsCustomer">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             class="record-box"
             v-model="activeName">
      <el-tab-pane label="全部业绩"
                   name="all">
        <container ref="child"
                   v-if="activeName == 'all'"
                   searchType="ALL"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我的业绩"
                   name="responsible">
        <container ref="child"
                   v-if="activeName == 'responsible'"
                   searchType="CHARGE"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属业绩"
                   name="partake">
        <container ref="child"
                   v-if="activeName == 'partake'"
                   searchType="UNDERLING"
                   :listQuery="listQuery" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import container from "./view";
import {
  getUsers,
  findDeptTree,
} from "@/api/system/staff";
export default {
  data () {
    return {
      listQuery: {
        userId: "", //員工id
        startTime: "",
        endTime: "",
        limit: 10,
        page: 1,
      },
      listLoading: false,
      activeName: "all",
      dataListAll: [],//人员list 
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick (picker) {
              const end = new Date();
              const first = new Date();
              const start = new Date(first.setDate(1));
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  components: {
    container
  },
  mounted () {
    var date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1 //获取当前日(1-31)
    if (month < 10) month = '0' + month
    function mGetDate (year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    }
    var totalDay = mGetDate(year, month)
    this.listQuery.startTime = year + '-' + month + '-' + '01' + ' 00:00:00'
    this.listQuery.endTime = year + '-' + month + '-' + totalDay + ' 23:59:59'
    this.getListAll();//人员
    this.findDeptTree();//部门
    this.statisticsCustomer()
  },
  computed: {
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
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    }
  },
  methods: {
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then((res) => {
          this.departmentList = res.data;
          this.paementIds = this.department(this.departmentList, []);
        })
        .catch((err) => console.log(err));
    },
    // 部门
    depart (value) {
      if (value) {
        this.listQuery.deptId = value[value.length - 1];
        this.statisticsCustomer();
      }
    },
    // 部门筛选
    department (list, ids) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id,
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        ids.push(data);
      });
      return ids;
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.listQuery.deptId = val.id;
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
    queryStatisticsCustomer () {
      this.listQuery.page = 1
      this.statisticsCustomer()
    },
    statisticsCustomer () {
      this.$refs.child.statisticsCustomer();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        userId: "", //員工id
        startTime: "",
        endTime: "",
        limit: 10,
        page: 1,
      });
      this.time = "";
      var date = new Date();
      let year = date.getFullYear(); //获取完整的年份(4位)
      let month = date.getMonth() + 1 //获取当前日(1-31)
      if (month < 10) month = '0' + month
      function mGetDate (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }
      var totalDay = mGetDate(year, month)
      this.listQuery.startTime = year + '-' + month + '-' + '01' + ' 00:00:00'
      this.listQuery.endTime = year + '-' + month + '-' + totalDay + ' 23:59:59'
      this.statisticsCustomer();
    },
  }
};
</script>

<style lang="scss" scoped>
.record-box {
  margin-top: 10px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
</style>
