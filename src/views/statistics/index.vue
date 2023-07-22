<template>
  <div class="app-container">
    <el-tabs type="border-card"
             v-model="activeTab"
             class="border-card"
             @tab-click="tabsChange">
      <el-tab-pane label="全部业绩"
                   name="department">
        <department v-if="activeTab == 'department'" />
      </el-tab-pane>
      <el-tab-pane label="我的业绩"
                   name="my">
        <my v-if="activeTab == 'my'"
            orderType="1" />
      </el-tab-pane>
      <el-tab-pane label="下属业绩"
                   name="subordinate">
        <subordinate v-if="activeTab == 'subordinate'"
                     orderType="2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import my from "./my";
import subordinate from "./subordinate";
import department from "./department";
export default {
  data () {
    return {
      listQuery: {},
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      activeTab: "department"
    };
  },
  components: {
    my,
    subordinate,
    department
  },
  mounted () { },
  methods: {
    open () { },
    tabsChange () { }
  }
};
</script>

<style lang="scss" scoped>
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
.app-container {
  .el-tabs {
    min-width: 1200px;
    overflow: auto;
  }
}
</style>
