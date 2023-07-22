<template>
  <div class="app-container">
    <staffTarget ref="child"
                 v-if="activeName == 'all'"
                 visitTaskSearchType="ALL" />
    <!--  <el-tabs type="border-card"
             class="m-t10"
             v-model="activeName">
        <el-tab-pane label="员工目标"
                   name="all">
        <staffTarget ref="child"
                     v-if="activeName == 'all'"
                     visitTaskSearchType="ALL" />
      </el-tab-pane>
      <el-tab-pane label="部门目标"
                   name="responsible">
        <departTarget v-if="activeName == 'responsible'"
                      visitTaskSearchType="CHARGE" />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import staffTarget from "./staffTarget";
import departTarget from "./departTarget";
import {
} from "@/api/task";
export default {
  data () {
    return {
      total: 0,
      listLoading: false,
      activeName: "all"
    };
  },
  components: {
    staffTarget,
    departTarget
  },
  computed: {
  },
  methods: {
    getTaskList () {
      this.$refs.child.getTaskList();
    },
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
