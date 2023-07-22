<template>
  <div>
    <el-button class="filter-item"
               icon="el-icon-plus"
               v-rules="{ admin: 'admin', ordinary: 'visit:task:add' }"
               @click="addVisitTask('add')">添加</el-button>
    <el-button class="filter-item"
               icon="el-icon-delete"
               v-rules="{ admin: 'admin', ordinary: 'visit:task:del' }"
               @click="delTask('all')"
               :disabled="isDisabled">删除任务</el-button>
    <el-table ref="activityTable"
              v-loading="listLoading"
              class="mt_20"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              :height="tableHeight"
              @row-click="
        (row, column, event) => {
          $refs.activityTable.toggleRowSelection(row);
        }
      "
              highlight-current-row>
      <el-table-column type="selection"
                       width="55"
                       align="center"></el-table-column>
      <el-table-column label="优先级"
                       align="center">
        <template slot-scope="scope">
          <span class="priority_dot one"
                v-if="scope.row.priority == 1"></span>
          <span class="priority_dot two"
                v-if="scope.row.priority == 2"></span>
          <span class="priority_dot three"
                v-if="scope.row.priority == 3"></span>
          <span class="priority_dot four"
                v-if="scope.row.priority == 4"></span>
          {{ scope.row.priority | filtersPriority }}
        </template>
      </el-table-column>
      <el-table-column label="任务名称"
                       min-width="110"
                       show-overflow-tooltip
                       align="center"
                       prop="visitContent">
        <template slot-scope="scope">
          <a class="link"
             type="text"
             @click.stop="detail('view', scope.row)">{{
            scope.row.visitContent
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="任务状态"
                       align="center">
        <template slot-scope="scope">{{
          scope.row.visitStatus | filtersStatus
        }}</template>
      </el-table-column>
      <el-table-column label="超时时间"
                       align="center"
                       min-width="110"
                       prop="timeOut">
        <template slot-scope="scope">
          <div class="red">{{ scope.row.timeOut }}</div>
        </template>
      </el-table-column>
      <el-table-column label="拜访客户"
                       align="center"
                       show-overflow-tooltip
                       min-width="180"
                       prop="storeName">
        <template slot-scope="scope">
          <a class="link"
             type="text"
             @click.stop="associatedVisit('view', scope.row)">{{ scope.row.storeName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="拜访人"
                       min-width="90"
                       show-overflow-tooltip
                       align="center"
                       prop="visitUser"></el-table-column>
      <el-table-column label="拜访时间"
                       width="140"
                       align="center"
                       prop="visitStartTime"
                       :formatter="formatTime">
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       min-width="150"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.stop="detail('view', scope.row)">详情</el-button>
          <el-button type="text"
                     :disabled="[2, 3, 4, 5].includes(scope.row.visitStatus)"
                     v-rules="{ admin: 'admin', ordinary: 'visit:task:edit' }"
                     @click.stop="addVisitTask('update', scope.row)">编辑</el-button>
          <el-button type="text"
                     :disabled="[2, 3, 4, 5, 6].includes(scope.row.visitStatus)"
                     v-rules="{ admin: 'admin', ordinary: 'visit:task:del' }"
                     @click.stop="delTask('one', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getTaskList"
                class="text-right" />
    <!--新增编辑任务-->
    <addVisitTask :showDialog.sync="showAddDialog"
                  :typeOptions="typeOptions"
                  @insertTask="getTaskList"></addVisitTask>
    <!--详情-->
    <taskDetail :showDialog.sync="showDetailDialog"
                @delTask="getTaskList"
                :visitTaskId="visitTaskId"
                :signType='signType'></taskDetail>
  </div>
</template>

<script>
import addVisitTask from "./addVisitTask";
import taskDetail from "./taskDetail";
import { queryVisitTask, removeVisitTask } from "@/api/visitTask";
import { mapGetters } from "vuex";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    visitTaskSearchType: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  components: {
    addVisitTask,
    taskDetail
  },
  data () {
    return {
      tableHeight: 520,
      listLoading: false,
      taskType: "",
      showAddDialog: false,
      showTaskDialog: false,
      showFollowDialog: false,
      showTransferDialog: false,
      showDistributionDialog: false, //转移客户弹窗
      dialogVisible: false,
      dataList: [],
      total: 0,
      selectList: [],
      dialogComponents: false,
      typeOptions: {
        type: "",
        optionType: "",
        option: {}
      },
      levelOptions: [],
      sourceOptions: [],
      showDetailDialog: false, //详情弹窗
      visitTaskId: "",
      signType: '',
    };
  },
  filters: {
    filtersPriority: function (value) {
      let StatusArr = { 1: "高", 2: "中", 3: "低", 4: "无" };
      return StatusArr[value];
    },
    filtersStatus: function (value) {
      let StatusArr = {
        1: "未开始",
        2: "进行中",
        3: "已完成",
        4: "未完成",
        5: "已取消",
        6: "已超时"
      };
      return StatusArr[value];
    }
  },
  computed: {
    isDisabled () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some(item => [2, 3, 4].includes(item.visitStatus))
      );
    },
    ...mapGetters(["permission_routes"])
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 380;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 380;
      };
    });
    this.getTaskList(); // 获取任务列表
  },
  methods: {
    //关联跳转
    associatedVisit (val, val2) {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          // customerName: val2.storeName,
          customerStoreId: val2.customerStoreId,
        }
      });
      const arr = this.permission_routes.find(item => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    // 详情
    detail (val, val2) {
      this.visitTaskId = val2.id;
      this.showDetailDialog = true;
    },
    //日期比较的方法
    compare (date1, date2) {
      let dates1 = new Date(date1);
      let dates2 = new Date(date2);
      if (dates1 > dates2) {
        return false;
      } else {
        return true;
      }
    },
    open () { },
    // 获取客户列表
    getTaskList () {
      queryVisitTask({
        ...this.listQuery,
        visitTaskSearchType: this.visitTaskSearchType
      })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    addVisitTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },
    completeTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let ids = this.selectList.map(item => item.id);
          taskComplete({ ids: ids })
            .then(res => {
              this.listLoading = false;
              this.getTaskList();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    delTask (type, val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let visitTaskIds;
          if (type == "one") {
            visitTaskIds = val.id;
          } else if (type == "all") {
            visitTaskIds = this.selectList.map(item => item.id);
          }
          removeVisitTask({ visitTaskIds: visitTaskIds })
            .then(res => {
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
              this.getTaskList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    }
  }
};
</script>

<style lang="less" scope>
.priority_dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  &.one {
    background: rgb(248, 47, 55);
  }
  &.two {
    background: rgb(250, 151, 38);
  }
  &.three {
    background: rgb(107, 155, 202);
  }
  &.four {
    background: rgb(153, 153, 153);
  }
}
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.priority_dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  &.one {
    background: rgb(248, 47, 55);
  }
  &.two {
    background: rgb(250, 151, 38);
  }
  &.three {
    background: rgb(107, 155, 202);
  }
  &.four {
    background: rgb(153, 153, 153);
  }
}
.red {
  color: red;
}
</style>
