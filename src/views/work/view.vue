<template>
  <div>
    <el-button class="filter-item"
               icon="el-icon-plus"
               v-rules="{admin:'admin',ordinary:'task:add'}"
               @click="addTask('add')">添加</el-button>
    <!--    第二版新建任务按钮开始-->
    <!--    <el-dropdown class="filter-item" @command="addTask">-->
    <!--      <el-button type="primary">添加<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
    <!--      <el-dropdown-menu slot="dropdown">-->
    <!--        <el-dropdown-item command="1">普通任务</el-dropdown-item>-->
    <!--        <el-dropdown-item command="2">跟进任务</el-dropdown-item>-->
    <!--      </el-dropdown-menu>-->
    <!--    </el-dropdown>-->
    <!--    第二版新建任务按钮结束-->
    <el-button class="filter-item"
               icon="el-icon-success"
               :disabled='isDisabled'
               v-rules="{admin:'admin',ordinary:'task:update:status'}"
               @click="completeTask">更改任务状态</el-button>
    <el-button class="filter-item"
               icon="el-icon-delete"
               :disabled='isDisabled'
               v-rules="{admin:'admin',ordinary:'task:del'}"
               @click="delTask('all')">删除任务</el-button>
    <el-table ref="activityTable"
              :height="tableHeight"
              v-loading="listLoading"
              class="mt_20"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              @row-click="(row,column,event)=>{$refs.activityTable.toggleRowSelection(row)}"
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
          {{scope.row.priority | filtersPriority}}
        </template>
      </el-table-column>
      <el-table-column label="任务名称"
                       align="center"
                       show-overflow-tooltip
                       prop="taskName">
        <template slot-scope="scope">
          <a class="link"
             @click.stop="addTask('view',scope.row)">
            {{ scope.row.taskName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="任务状态"
                       align="center">
        <template slot-scope="scope">{{scope.row.taskStatus | filtersStatus}}</template>
      </el-table-column>
      <el-table-column label="负责人"
                       align="center"
                       min-width="80"
                       show-overflow-tooltip
                       prop="userName"></el-table-column>
      <el-table-column label="截止时间"
                       min-width="80"
                       align="center"
                       prop="endTime">
        <template slot-scope="scope">
          <span :class="{'red01':compare(scope.row.endTime, $moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'))}">{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       min-width="120"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.stop="addTask('view',scope.row)">详情</el-button>
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'task:edit'}"
                     @click.stop="addTask('update',scope.row)">编辑</el-button>
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'task:del'}"
                     @click.stop="delTask('one',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    <pagination-->
    <!--      v-show="total > 0"-->
    <!--      :total="total"-->
    <!--      :page.sync="listQuery.page"-->
    <!--      :limit.sync="listQuery.limit"-->
    <!--      class="text-right"-->
    <!--    />-->
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getTaskList"
                class="text-right" />
    <addTask :showDialog.sync="showAddDialog"
             :typeOptions="typeOptions"
             @insertTask="getTaskList" />
  </div>
</template>

<script>
import {
  taskList,
  taskDetail,
  taskSave,
  taskDel,
  taskComplete
} from "@/api/task";
import addTask from "./addTask";
import { mapState } from "vuex";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    claimType: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  components: {
    addTask
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
      titlleDialog: "您确定要将客户放入公海吗？",
      contentDialog: "转移到公海后此客户数据将属于公共资源",
      typeOptions: {
        type: "",
        optionType: "",
        option: {}
      },
      levelOptions: [],
      sourceOptions: []
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    isDisabled () {
      return this.selectList.length < 1;
    },
  },
  filters: {
    filtersPriority: function (value) {
      let StatusArr = { 1: "高", 2: "中", 3: "低", 4: "无" };
      return StatusArr[value];
    },
    // 任务状态 0 未开始 1 进行中 2已完成
    filtersStatus: function (value) {
      let StatusArr = { 0: "未开始", 1: "进行中", 2: "已完成" };
      return StatusArr[value];
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 330;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 330;
      };
    });
    this.getTaskList(); // 获取任务列表
  },
  methods: {
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
      // if (this.listQuery.endTime) {
      //   this.listQuery.endTime = this.listQuery.endTime + ' 00:00:00'
      // }
      taskList({ ...this.listQuery, claimType: this.claimType })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    addTask (type, val) {
      // debugger;
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
          this.listLoading = true;
          let ids;
          if (type == "one") {
            ids = val.id;
          } else if (type == "all") {
            ids = this.selectList.map(item => item.id);
          }
          taskDel({ ids: ids })
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
    }
  }
};
</script>

<style lang="scss" scope>
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
}
</style>
