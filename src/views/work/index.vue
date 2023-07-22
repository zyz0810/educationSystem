<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="任务名称">
        <el-input v-model.trim="listQuery.taskName"
                  @change="queryGetTaskList"
                  clearable
                  placeholder="任务名称" />
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="listQuery.priority"
                   @change="queryGetTaskList"
                   placeholder="任务名称"
                   clearable>
          <el-option label="全部"
                     value></el-option>
          <el-option label="高"
                     value="1"></el-option>
          <el-option label="中"
                     value="2"></el-option>
          <el-option label="低"
                     value="3"></el-option>
          <el-option label="无"
                     value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="listQuery.taskStatus"
                   placeholder="任务状态"
                   @change="queryGetTaskList"
                   clearable>
          <el-option v-for="(item, index) in statusOption"
                     :label="item.name"
                     :value="item.id"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="queryGetTaskList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryGetTaskList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             class="m-t10"
             v-model="activeName">
      <el-tab-pane label="全部任务"
                   name="all">
        <container ref="child"
                   v-if="activeName == 'all'"
                   claimType="ALL"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我负责的"
                   name="responsible">
        <container v-if="activeName == 'responsible'"
                   claimType="CHARGE"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我参与的"
                   name="partake">
        <container v-if="activeName == 'partake'"
                   claimType="TAKE_PART"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属负责的"
                   name="subordinate">
        <container v-if="activeName == 'subordinate'"
                   claimType="UNDERLING"
                   :listQuery="listQuery" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import container from "./view";
import {
  taskList,
  taskDetail,
  taskSave,
  taskDel,
  taskComplete
} from "@/api/task";
export default {
  data () {
    return {
      // 任务类型 1普通 2跟进
      taskOption: [
        {
          id: 1,
          name: "普通"
        }
        //   {
        //   id:2,
        //   name:'跟进'
        // }
      ],
      // 任务状态 0 未开始 1 进行中 2已完成
      statusOption: [
        {
          id: 1,
          name: "进行中"
        },
        {
          id: 2,
          name: "已完成"
        }
      ],
      listQuery: {
        taskType: 1,
        taskName: "",
        priority: "",
        taskStatus: "",
        startTime: '',
        endTime: "",
        page: 1,
        limit: 10
      },
      total: 0,
      listLoading: false,
      activeName: "all"
    };
  },
  components: {
    container
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
      },
    },
  },
  methods: {
    //     ALL(0, "全部"),
    // CHARGE(1, "负责的"),
    //   UNDERLING(2, "下属"),
    //   TAKE_PART(3, "参与");
    // getTime (e) {
    //   this.listQuery.endTime = e + ' 23:59:59'
    //   this.getTaskList()
    // },
    queryGetTaskList () {
      this.listQuery.page = 1
      this.getTaskList()
    },
    getTaskList () {
      this.$refs.child.getTaskList();
    },
    // 重置
    resetList () {
      Object.assign(this.listQuery, {
        taskType: 1,
        taskName: "",
        priority: "",
        taskStatus: "",
        startTime: '',
        endTime: "",
        page: 1,
        limit: 10
      });
      this.listQuery.endTime = ''
      this.getTaskList()
    }

  }
};
</script>

<style lang="scss" scoped>
.m-t10 {
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
