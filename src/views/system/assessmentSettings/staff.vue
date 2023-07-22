<template>
  <div class="">
    <el-form :inline="true"
             :model="listQuery"
             class="searchTop">
      <el-form-item label="选择时间">
        <el-date-picker v-model="listQuery.assessmentDate"
                        type="month"
                        value-format="yyyy-MM"
                        @change="queryList"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   v-model.trim="listQuery.providerIds"
                   @change="queryList"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   type="primary"
                   @click="queryList"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form :inline="true"
               :model="listQuery"
               class="search-right">
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     v-rules="{ admin: 'admin', ordinary: 'examine:employee:add' }"
                     @click.stop="addAassessment('add')"
                     icon="el-icon-plus">新建考核</el-button>
        </el-form-item>
      </el-form>
    </el-form>

    <div class="container">

      <el-table v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="员工名称"
                         align="center"
                         min-width="120"
                         show-overflow-tooltip
                         prop="providerName"></el-table-column>
        <el-table-column label="部门"
                         align="center"
                         mim-width="120"
                         show-overflow-tooltip
                         prop="deptName"></el-table-column>
        <el-table-column label="时间"
                         align="center"
                         prop="assessmentDate"></el-table-column>
        <el-table-column label="业绩考核指标"
                         align="center">
          <el-table-column label="销售业绩（元）"
                           align="center"
                           min-width="110"
                           prop="performanceTarget">
            <template slot-scope="scope">
              <div>{{scope.row.performanceTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="客户拜访（次）"
                           align="center"
                           min-width="110"
                           prop="customerVisitTarget">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisitTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="门店动销数（个）"
                           align="center"
                           min-width="110"
                           prop="providerStoreSalesTarget">
            <template slot-scope="scope">
              <!--<div>{{scope.row.providerStoreSalesTarget || 0}}</div>-->
              <div>--</div>
            </template>
          </el-table-column>
          <el-table-column label="平均单店销售（元）"
                           align="center"
                           min-width="120"
                           prop="averageStoreTarget">
            <template slot-scope="scope">
              <!--<div>{{scope.row.averageStoreTarget || 0}}</div>-->
              <div>--</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         min-width="120"
                         v-if="permissions.includes('admin') || permissions.includes('examine:employee:edit') || permissions.includes('examine:employee:view') || permissions.includes('examine:employee:del')"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       :disabled="[2, 3, 4, 5].includes(scope.row.visitStatus)"
                       v-rules="{ admin: 'admin', ordinary: 'examine:employee:view' }"
                       @click.stop="addAassessment('view', scope.row)">详情</el-button>
            <el-button type="text"
                       :disabled="[2, 3, 4, 5].includes(scope.row.visitStatus)"
                       v-rules="{ admin: 'admin', ordinary: 'examine:employee:edit' }"
                       @click.stop="addAassessment('update', scope.row)">编辑</el-button>
            <el-button type="text"
                       :disabled="[2, 3, 4, 5, 6].includes(scope.row.visitStatus)"
                       v-rules="{ admin: 'admin', ordinary: 'examine:employee:del' }"
                       @click.stop="deleteById(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="assessmentPageList"
                  class="text-right" />
      <!--新增编辑任务-->
      <addAassessment :showDialog.sync="showAddDialog"
                      @updated='assessmentPageList'
                      :role='role'
                      :typeOptions='typeOptions'></addAassessment>
    </div>
  </div>
</template>

<script>
import addAassessment from "./addAassessment";
import { assessmentPageList, modify } from "@/api/assessmentSettings";
import { findProviderDept, getUsersByRole } from "@/api/common";
import { mapGetters, mapState } from "vuex";
import { } from "@/api/common";
export default {
  components: {
    addAassessment,
  },
  data () {
    return {
      activeName: "serviceProvider",
      tableHeight: 400,
      listLoading: false,
      dataList: [],
      total: 0,
      showAddDialog: false,
      typeOptions: {
        identity: "USER",
        optionType: "",
        option: {
        }
      },
      listQuery: {
        assessmentType: 2,//1服务商 2员工
        providerIds: '',
        assessmentDate: '',
        page: 1,
        limit: 10
      },
      providerList: [],
      role: 'staff',
      userOptions: [],
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 265;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 265;
      };
    });
    this.getMonth()
    // this.assessmentPageList();
    // this.findProviderDept()
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
          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    getMonth () {
      this.listQuery.assessmentDate = this.$moment(new Date()).format("yyyy-MM");
      this.assessmentPageList();
    },
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.assessmentPageList();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        assessmentType: 2,//1服务商 2员工
        providerIds: "",
        assessmentDate: '',
        page: 1,
        limit: 10
      });
      this.getMonth()
      this.assessmentPageList()
    },
    // 统计列表
    assessmentPageList () {
      assessmentPageList({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.count || 0;
        // 防止table错位
        this.$nextTick(() => {
          this.$refs.activityTable.doLayout();
        });
      });
    },
    // 删除员工目标
    deleteById (val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          modify({ assessmentIds: [val.id], operatorType: 'forbidden' })
            .then(res => {
              this.$message({
                message: '删除成功',
                type: "success"
              });
              this.assessmentPageList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    addAassessment (type, val) {
      this.typeOptions = {
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },

  }
};
</script>

<style lang="scss" scope>
.search-right {
  position: absolute;
  right: 20px;
  top: 16px;
}
.container {
  background: #ffffff;
  // padding: 5px 15px 15px 15px;
}
</style>
