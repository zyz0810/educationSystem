<template>
  <div>
    <div class="flex">
      <el-form :inline="true"
               :model="listQuery"
               class="search_box">
        <el-form-item label="选择时间">
          <el-date-picker v-model.trim="listQuery.year"
                          type="year"
                          value-format="yyyy"
                          @change="querySelectPerformanceList"
                          placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择员工">
          <el-select placeholder="选择员工"
                     filterable
                     v-model.trim="listQuery.ids"
                     @change="querySelectPerformanceList"
                     clearable>
            <el-option v-for="(item, index) in userOptions"
                       :key="index"
                       :label="item.nickname"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="querySelectPerformanceList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh"
                     @click="resetList">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="setting-box">
        <p class="x-p"> 成交金额员工目标总计： <span>{{totalPerformance}}</span> 元</p>
        <el-button class="filter-item"
                   type="primary"
                   v-rules="{ admin: 'admin', ordinary: 'performance:setting:set' }"
                   @click="settingTarget('add',)">设置目标</el-button>
      </div>
    </div>
    <div class="staff-table">
      <el-button class="filter-item"
                 type="primary"
                 v-rules="{ admin: 'admin', ordinary: 'performance:setting:journal' }"
                 @click="goLog('more')">查看日志</el-button>
      <el-table ref="activityTable"
                v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                border
                :height="tableHeight"
                :cell-style="columnStyle"
                @row-click=" (row, column, event) => { $refs.activityTable.toggleRowSelection(row);}"
                highlight-current-row>
        <el-table-column label="姓名"
                         align="center"
                         min-width="120"
                         show-overflow-tooltip
                         prop="userName"></el-table-column>
        <el-table-column label="部门"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
                         prop="deptName"></el-table-column>
        <el-table-column label="全年"
                         type="index"
                         width="90"
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.yearly}}</div>
          </template>
        </el-table-column>
        <el-table-column label="第一季度"
                         type="index"
                         width="90"
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.firstQuarter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="第二季度"
                         type="index"
                         width="90"
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.secondQuarter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="第三季度"
                         type="index"
                         width="90"
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.thirdQuarter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="第四季度"
                         type="index"
                         width="90"
                         align="center">
          <template slot-scope="scope">
            <div>{{scope.row.fourthQuarter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="1月"
                         align="center"
                         prop="january"></el-table-column>
        <el-table-column label="2月"
                         align="center"
                         prop="february"></el-table-column>
        <el-table-column label="3月"
                         align="center"
                         prop="march"></el-table-column>
        <el-table-column label="4月"
                         align="center"
                         prop="april"></el-table-column>
        <el-table-column label="5月"
                         align="center"
                         prop="may"></el-table-column>
        <el-table-column label="6月"
                         align="center"
                         prop="june"></el-table-column>
        <el-table-column label="7月"
                         align="center"
                         prop="july"></el-table-column>
        <el-table-column label="8月"
                         align="center"
                         prop="august"></el-table-column>
        <el-table-column label="9月"
                         align="center"
                         prop="september"></el-table-column>
        <el-table-column label="10月"
                         align="center"
                         prop="october"></el-table-column>
        <el-table-column label="11月"
                         align="center"
                         prop="november"></el-table-column>
        <el-table-column label="12月"
                         align="center"
                         prop="december"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         min-width="150"
                         v-if="permissions.includes('admin') || permissions.includes('performance:setting:edit') 
                         || permissions.includes('performance:setting:del') || permissions.includes('performance:setting:journal')"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       :disabled="[2, 3, 4, 5].includes(scope.row.visitStatus)"
                       v-rules="{ admin: 'admin', ordinary: 'performance:setting:edit' }"
                       @click.stop="settingTarget('edit', scope.row)">编辑</el-button>
            <el-button type="text"
                       :disabled="[2, 3, 4, 5, 6].includes(scope.row.visitStatus)"
                       v-rules="{ admin: 'admin', ordinary: 'performance:setting:del' }"
                       @click.stop="deleteById(scope.row)">删除</el-button>
            <el-button type="text"
                       @click="goLog('one',scope.row)"
                       v-rules="{ admin: 'admin', ordinary: 'performance:setting:journal' }">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="selectPerformanceList"
                  class="text-right" />
    </div>
    <!--新增编辑任务-->
    <settingTarget :showDialog.sync="showAddDialog"
                   :typeOptions="typeOptions"
                   @insertTask="selectPerformanceList"></settingTarget>
    <log :showDialog.sync="dialogLogVisible"
         :logData="logData" />
  </div>
</template>

<script>
import settingTarget from "./settingTarget";
import log from "./log";
import { queryVisitTask, removeVisitTask } from "@/api/visitTask";
import { mapGetters } from "vuex";
import { getUsersByRole } from "@/api/common";
import { usersList, } from "@/api/task";
import {
  selectPerformanceList,
  deleteById
} from "@/api/performanceSetting";
import { mapState } from "vuex";
export default {
  props: {
  },
  components: {
    settingTarget,
    log
  },
  data () {
    return {
      tableHeight: 520,
      listLoading: false,
      showAddDialog: false,
      dataList: [],
      total: 0,
      selectList: [],
      typeOptions: {
        identity: "USER",
        optionType: "",
        option: {
        }
      },
      listQuery: {
        performanceEnum: 'USER', //DEPT: 对应部门 USER: 对应员工
        year: '',
        ids: '',
        page: 1,
        limit: 10
      },
      total: 0,
      userOptions: [],
      totalPerformance: 0,
      dialogLogVisible: false,
      logData: {},
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    isDisabled () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some(item => [2, 3, 4].includes(item.visitStatus))
      );
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 220;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 220;
      };
    });
    this.selectPerformanceList(); // 获取目标列表
    this.getUsersByRole();//所有下拉用户列表数据
  },
  methods: {
    goLog (val, rowInfor) {
      this.logData = {
        type: val,
        rowInfor: rowInfor,
      };
      this.dialogLogVisible = true;
    },
    // 给指定列加背景色
    columnStyle ({ row, column, rowIndex, columnIndex }) {
      if ([2, 3, 4, 5, 6].includes(columnIndex)) {   //第三第四列的背景色就改变了2和3都是列数的下标
        return 'background:rgba(150, 154, 184,0.05);'
      }
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
    // 获取目标列表
    selectPerformanceList () {
      selectPerformanceList({
        ...this.listQuery,
      })
        .then(res => {
          this.dataList = res.data.data;
          this.totalPerformance = res.data.totalPerformance || 0
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    settingTarget (type, val) {
      this.typeOptions = {
        identity: "USER",
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },
    // 删除员工目标
    deleteById (val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteById({ id: val.id })
            .then(res => {
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
              this.selectPerformanceList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    querySelectPerformanceList () {
      this.listQuery.page = 1
      this.selectPerformanceList()
    },
    // 重置
    resetList () {
      Object.assign(this.listQuery, {
        performanceEnum: 'USER', //DEPT: 对应部门 USER: 对应员工
        year: '',
        ids: '',
        page: 1,
        limit: 10
      });
      this.selectPerformanceList()
    }
  }
};
</script>

<style lang="less" scope>
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  .setting-box {
    margin: 0px 15px 0px 0px;
    .x-p {
      display: inline-block;
      margin-right: 20px;
      span {
        color: rgb(0, 121, 254);
      }
    }
  }
}
.staff-table {
  margin-top: 20px;
  background: white;
  padding: 15px 15px 20px 15px;
  box-sizing: border-box;
}
</style>
