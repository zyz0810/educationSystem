<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="任务名称">
        <el-input v-model.trim="listQuery.visitName"
                  clearable
                  @change="queryGetTaskList"
                  placeholder="任务名称" />
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="listQuery.priority"
                   @change="queryGetTaskList"
                   placeholder="任务名称"
                   clearable>
          <el-option label="全部"
                     value='0'></el-option>
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
        <el-select v-model="listQuery.visitStatus"
                   placeholder="任务状态"
                   @change="queryGetTaskList"
                   clearable>
          <el-option v-for="(item, index) in statusOption"
                     :label="item.name"
                     :value="item.id"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拜访客户">
        <el-input v-model.trim="listQuery.storeName"
                  clearable
                  @change="queryGetTaskList"
                  placeholder="拜访客户" />
      </el-form-item>
      <el-form-item label="拜访人">
        <el-input v-model.trim="listQuery.visitUser"
                  clearable
                  @change="queryGetTaskList"
                  placeholder="拜访人" />
      </el-form-item>
      <el-form-item label="拜访时间">
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
                   visitTaskSearchType="ALL"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我负责的"
                   name="responsible">
        <container v-if="activeName == 'responsible'"
                   visitTaskSearchType="CHARGE"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属负责的"
                   name="subordinate">
        <container v-if="activeName == 'subordinate'"
                   visitTaskSearchType="UNDERLING"
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
      // 任务状态 0未开始, 1进行中，2已完成，3未完成，4已取消
      statusOption: [
        {
          id: 1,
          name: "未开始"
        },
        {
          id: 2,
          name: "进行中"
        },
        {
          id: 3,
          name: "已完成"
        }, {
          id: 4,
          name: "未完成"
        },
        {
          id: 5,
          name: "已取消"
        },
        // {
        //   id: 6,
        //   name: "已超时"
        // }
      ],
      listQuery: {
        priority: '',
        startTime: "",
        endTime: "",
        visitName: '',
        visitStatus: '',
        storeName: '',
        visitUser: '',
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
      }
    }
  },
  methods: {
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
        priority: '',
        startTime: "",
        endTime: "",
        visitName: '',
        visitStatus: '',
        storeName: '',
        visitUser: '',
        page: 1,
        limit: 10
      });
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
