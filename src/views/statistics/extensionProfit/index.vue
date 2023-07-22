<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="客户经理">
        <el-input v-model.trim="listQuery.customerName"
                  @change="queryProfitListByPage"
                  clearable
                  placeholder="客户经理" />
      </el-form-item>
      <el-form-item label="最后申请提现时间">
        <el-date-picker placeholder="选择日期"
                        v-model="listQuery.endTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="date"
                        @change="getTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryProfitListByPage">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             v-model="activeName"
             class="border-card">
      <el-tab-pane label="全部数据"
                   name="all">
        <container ref="child"
                   v-if="activeName == 'all'"
                   :scope="0"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我的数据"
                   name="my">
        <container ref="child"
                   v-if="activeName == 'my'"
                   :scope="1"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属数据"
                   name="subordinate">
        <container ref="child"
                   v-if="activeName == 'subordinate'"
                   :scope="2"
                   :listQuery="listQuery" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import container from "./view"
import { profitListByPage } from "@/api/statistics";
import Details from "./details";
export default {
  components: {
    container
  },
  data () {
    return {
      listQuery: {
        customerName: '',
        endTime: "",
        page: 1,
        limit: 10,
        scope: "",
      },
      total: 0,
      listLoading: false,
      showDetailDialog: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      userId: '',
      customerName: '',
      orderType: {
        userId: '',
        customerName: '',
        option: {},
      },
      showDetailsDialog: false,
      activeName: "all",
    };
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    getTime (e) {
      this.listQuery.endTime = e + ' 23:59:59'
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.$refs.child.profitListByPage();
    },
    profitListByPage () {
      this.$refs.child.profitListByPage();
    },
    queryProfitListByPage () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.profitListByPage();
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        customerName: '',
        endTime: "",
        page: 1,
        limit: 10,
      });
      this.profitListByPage();
    },
  },
};
</script>

<style lang="scss" scoped>
.border-card {
  margin-top: 20px;
  padding-bottom: 20px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
.container {
  background: #ffffff;
  padding: 15px;
}
.search {
  border-color: rgb(233, 233, 233);
  background: #ffffff;
  overflow: hidden;
  padding: 0 !important;
  .el-form-item {
    float: left;
    margin: 10px 10px 10px 0;
  }
}
.el-icon-question {
  color: #fe9400;
}
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
