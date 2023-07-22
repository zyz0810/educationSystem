<template>
  <div class="app-container">
    <el-tabs type="border-card"
             v-model="activeName"
             class="border-card">
      <el-tab-pane label="全部订单"
                   name="all">
        <container v-if="activeName == 'all'"
                   :orderType="0" />
      </el-tab-pane>
      <el-tab-pane label="我的订单"
                   name="my">
        <container v-if="activeName == 'my'"
                   :orderType="1" />
      </el-tab-pane>
      <el-tab-pane label="下属订单"
                   name="subordinate">
        <container v-if="activeName == 'subordinate'"
                   :orderType="2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import container from "./view";
export default {
  data () {
    return {
      listQuery: {},
      total: 0,
      listLoading: false,
      selectList: [],
      activeName: "all",
      dataList: []
    };
  },
  components: {
    container
  },
  mounted () { },
  methods: {
    open () { }
  }
};
</script>

<style lang="scss" scoped>
.border-card {
  margin-top: 20px;
  padding-bottom: 10px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
</style>
