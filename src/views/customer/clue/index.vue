<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="线索名称">
        <el-input v-model.trim="listQuery.name"
                  clearable
                  @change="queryClueList"
                  placeholder="线索名称" />
      </el-form-item>
      <el-form-item label="线索状态">
        <el-select filterable
                   @change="queryClueList"
                   v-model="listQuery.status"
                   placeholder="线索状态"
                   clearable>
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="待转客户"
                     value="WAIT"></el-option>
          <el-option label="已转客户"
                     value="COMPLETE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机">
        <el-input @change="queryClueList"
                  v-model.trim="listQuery.telephone"
                  clearable
                  placeholder="手机" />
      </el-form-item>
      <el-form-item label="负责人员"
                    prop="userId">
        <el-select placeholder="负责人员"
                   filterable
                   @change="queryClueList"
                   v-model="listQuery.userId"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="datasTimes"
                        clearable
                        type="daterange"
                        @change="queryClueList"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="queryClueList"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             v-model="activeName"
             class="border-card">
      <el-tab-pane label="全部线索"
                   name="ALL">
        <container ref="child"
                   @typeValue="getUsable"
                   @levelValue="getLevel"
                   v-if="activeName == 'ALL'"
                   :searchType="'ALL'"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我的线索"
                   name="CHARGE">
        <container ref="child"
                   v-if="activeName == 'CHARGE'"
                   :searchType="'CHARGE'"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属的线索"
                   name="UNDERLING">
        <container ref="child"
                   v-if="activeName == 'UNDERLING'"
                   :searchType="'UNDERLING'"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <!--searchType 查询类型 默认0全部，1负责的 2下属,可用值:ALL,CHARGE,UNDERLING,TAKE_PART-->
    </el-tabs>
  </div>
</template>

<script>
import container from "./view";
import { getUsersByRole } from "@/api/common";
export default {
  data () {
    return {
      listQuery: {
        name: "",
        status: "",
        telephone: '',
        userId: '',
        startTime: "",
        endTime: "",
        limit: 10,
        page: 1,
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      typeOptions: [],
      levelOptions: [],
      activeName: "ALL",
      userOptions: [],
    };
  },
  components: {
    container,
  },
  computed: {
    datasTimes: {
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
  mounted () {
    this.getUsable();
    this.getUsersByRole()
  },
  methods: {
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;
            // this.$emit("modify");
          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 获取客户类型
    getUsable (val) {
      this.typeOptions = val;
    },
    getLevel (val) {
      this.levelOptions = val;
    },
    //条件查询  
    queryClueList () {
      this.listQuery.page = 1;
      this.$refs.child.clueList();
    },
    // 查询列表
    clueList () {
      this.$refs.child.clueList();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        name: "",
        status: "",
        telephone: '',
        userId: '',
        startTime: "",
        endTime: "",
        limit: 10,
        page: 1,
      });
      this.clueList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.border-card {
  margin-top: 10px !important;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
/deep/.el-tabs--border-card > .el-tabs__content {
  padding: 0px 15px 15px 15px !important;
}
</style>
