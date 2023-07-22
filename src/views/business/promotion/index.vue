<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="商品名称">
        <el-input v-model.trim="listQuery.name"
                  @change="queryGetPromotionList"
                  clearable
                  placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="生产厂家">
        <el-input v-model.trim="listQuery.manufactureName"
                  @change="queryGetPromotionList"
                  clearable
                  placeholder="生产厂家" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model.trim="listQuery.supplierName"
                  @change="queryGetPromotionList"
                  clearable
                  placeholder="供应商" />
      </el-form-item>
      <el-form-item label="推广时间">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="queryGetPromotionList"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryGetPromotionList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             class="m-t20"
             v-model="activeName">
      <el-tab-pane label="综合排序"
                   name="all">
        <container ref="child"
                   v-if="activeName == 'all'"
                   claimType="0"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="预计提成"
                   name="responsible">
        <container v-if="activeName == 'responsible'"
                   claimType="1"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="销量"
                   name="partake">
        <container v-if="activeName == 'partake'"
                   claimType="2"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="结束时间"
                   name="subordinate">
        <container v-if="activeName == 'subordinate'"
                   claimType="3"
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
      listQuery: {
        name: '',
        fullName: '',
        manufactureName: '',
        supplierName: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 10
      },
      total: 0,
      listLoading: false,
      activeName: "all"
    };
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
  components: {
    container
  },
  methods: {
    queryGetPromotionList () {
      this.listQuery.page = 1
      this.getPromotionList()
    },
    getPromotionList () {
      this.$refs.child.getPromotionList();
    },
    // 重置
    resetList () {
      Object.assign(this.listQuery, {
        name: '',
        fullName: '',
        manufactureName: '',
        supplierName: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 10
      });
      this.getPromotionList()
    }

  }
};
</script>

<style lang="scss" scoped>
.m-t20 {
  margin-top: 10px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
/deep/.search_box > .el-form-item {
  float: none;
}
</style>
