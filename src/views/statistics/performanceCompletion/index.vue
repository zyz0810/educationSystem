<template>
  <div class="app-container">
    <el-tabs type="border-card"
             v-model="activeTab"
             class="border-card"
             @tab-click="tabsChange">
      <el-tab-pane label="员工目标"
                   name="staffTarget">
        <staffTarget v-if="activeTab == 'staffTarget'"
                     orderType="2" />
      </el-tab-pane>
      <el-tab-pane label="部门目标"
                   name="departTarget">
        <departTarget v-if="activeTab == 'departTarget'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import staffTarget from "./staffTarget";
import departTarget from "./departTarget";
export default {
  data () {
    return {
      listQuery: {},
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      activeTab: "staffTarget"
    };
  },
  components: {
    staffTarget,
    departTarget
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
