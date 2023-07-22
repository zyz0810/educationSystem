<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="客户经理名称">
        <el-input v-model.trim="listQuery.cherkName"
                  @change="extensionList"
                  clearable
                  placeholder="客户经理名称" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="extensionList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="extensionList">查询</el-button>
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
import { queryExtensionList } from "@/api/salesStatistics";
import goodsDetails from "./goodsDetails"
import orders from './orders'
export default {
  components: {
    container,
  },
  data () {
    return {
      listQuery: {
        cherkName: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10,
        scope: "",
      },
      total: 0,
      listLoading: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      userId: '',
      customerName: '',
      showGoodsDetailsDialog: false,
      datail: {},
      activeName: "all",
    };
  },
  mounted () {
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
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    }
  },
  methods: {
    queryExtensionList () {
      this.$refs.child.queryExtensionList();
    },
    extensionList () {
      this.listQuery.page = 1
      this.$refs.child.queryExtensionList();
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        cherkName: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10,
      });
      this.queryExtensionList();
    },
  },
};
</script>

<style lang="scss" scoped>
.border-card {
  margin-top: 20px;
  padding-bottom: 10px !important;
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
