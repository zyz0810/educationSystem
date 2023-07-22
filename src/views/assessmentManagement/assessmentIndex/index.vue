<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="选择时间">
        <el-date-picker v-model="listQuery.selectTime"
                        type="month"
                        value-format="yyyy-MM"
                        @change="queryList"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   v-model.trim="listQuery.userId"
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
        <el-table-column label="员工"
                         align="center"
                         width="120"
                         show-overflow-tooltip
                         prop="userName"></el-table-column>
        <el-table-column label="部门"
                         show-overflow-tooltip
                         align="center"
                         width="130"
                         prop="userName"></el-table-column>
        <el-table-column :label="item.levelName"
                         v-for='(item,index) in customerLevelQuantityList'
                         :key='index'
                         align="center"
                         width="100">
          <template slot-scope="scope">
            <div>{{scope.row.customerLevelQuantityList[index].quantity}}</div>
          </template>
        </el-table-column>
        <el-table-column label="销售业绩"
                         align="center">
          <el-table-column label="业绩目标"
                           align="center"
                           prop="performance.target">
            <template slot-scope="scope">
              <div>{{scope.row.performance.target || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="performance.weight">
            <template slot-scope="scope">
              <div>{{scope.row.performance.weight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成情况"
                           width="90"
                           align="center"
                           prop="performance.complete">
            <template slot-scope="scope">
              <div>{{scope.row.performance.complete || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="得分"
                           align="center"
                           prop="performance.score">
            <template slot-scope="scope">
              <div>{{scope.row.performance.score || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="客户拜访"
                         align="center">
          <el-table-column label="拜访目标"
                           align="center"
                           prop="customerVisit.target">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisit.target || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="customerVisit.weight">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisit.weight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成情况"
                           width="90"
                           align="center"
                           prop="customerVisit.complete">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisit.complete || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="得分"
                           align="center"
                           prop="customerVisit.score">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisit.score || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="门店动销率"
                         align="center">
          <el-table-column label="动销(个)"
                           align="center"
                           prop="storeSales.target">
            <template slot-scope="scope">
              <div>{{scope.row. storeSales.target || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="storeSales.weight">
            <template slot-scope="scope">
              <div>{{scope.row.storeSales.weight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成情况"
                           width="90"
                           align="center"
                           prop="storeSales.complete">
            <template slot-scope="scope">
              <div>{{scope.row.storeSales.complete || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="得分"
                           align="center"
                           prop="storeSales.score">
            <template slot-scope="scope">
              <div>{{scope.row.storeSales.score || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="单店销售额"
                         align="center">
          <el-table-column label="总销售额"
                           align="center"
                           prop="storeAverage.target">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverage.target || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="storeAverage.weight">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverage.weight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际达成率"
                           width="90"
                           align="center"
                           prop="storeAverage.complete">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverage.complete || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="得分"
                           align="center"
                           prop="storeAverage.score">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverage.score || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总得分"
                         align="center"
                         prop="totalScore">
          <template slot-scope="scope">
            <div>{{scope.row.totalScore || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         min-width="160"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'examine-finish:view'}"
                       @click.stop="scoreDetail(scope.row)">得分详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="achievementList"
                  class="text-right" />
    </div>
    <scoreDetails :showDialog.sync="showScoreDialog"
                  :scoreInfo='scoreInfo'></scoreDetails>
    <targetDetails :showDialog.sync="showTargetDialog"
                   :targetInfo='targetInfo'></targetDetails>
  </div>
</template>

<script>
import { getUsersByRole, } from "@/api/common";
import { mapGetters, mapState } from "vuex";
import scoreDetails from './scoreDetails.vue'
import targetDetails from './targetDetails.vue'
import {
  achievementList
} from '@/api/assessmentIndex'
export default {
  props: {
  },
  data () {
    return {
      activeName: "serviceProvider",
      tableHeight: 400,
      listLoading: false,
      dataList: [],
      total: 0,
      showDialog: false,
      listQuery: {
        userId: '',
        selectTime: '',
        page: 1,
        limit: 10
      },
      echartData: {
        name: []
      },
      deptList: [],
      userList: [],
      deptIdList: [],
      userOptions: [],
      providerList: [],
      showScoreDialog: false,
      showMovingPinDialog: false,
      showTargetDialog: false,
      targetInfo: {},
      scoreInfo: {},
      storeSalesInfo: [],//门店动销分级
      salesCompletionValue: {},
      preamVal: {},
      customerLevelQuantityList: [],
    };
  },
  components: {
    scoreDetails,
    targetDetails
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions,
      crm_id: (state) => state.user.crm_id,
    }),
    ...mapGetters(["provider_id", "provider_type",]),
  },
  mounted () {
    this.$nextTick(function () {
      // this.$refs.filter-container.offsetHeight
      let height =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 160;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height =
          window.innerHeight - self.$refs.activityTable.$el.offsetTop - 160;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
    this.getMonth()
    this.getUsersByRole()
  },
  methods: {
    // 目标详情
    targetDetail (val) {
      this.targetInfo = val.targetInfo
      this.showTargetDialog = true
    },
    // 得分详情
    scoreDetail (val) {
      this.scoreInfo = val
      this.showScoreDialog = true
    },
    // 门店动销完成率详情
    movingPinFinish (val) {
      this.storeSalesInfo = val.storeSalesInfo
      this.showMovingPinDialog = true
    },
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
      this.listQuery.selectTime = this.$moment(new Date()).format("yyyy-MM");
      this.achievementList();
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.achievementList();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        userId: '',
        selectTime: '',
        page: 1,
        limit: 10
      });
      this.getMonth()
      this.queryList();
    },
    // 业绩目标设置
    achievementList () {
      achievementList({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data;
        this.customerLevelQuantityList = this.dataList[0].customerLevelQuantityList
        // this.total = res.data.count;
      });
    },
  }
};
</script>

<style lang="scss" scope>
.search-inline {
  background: white;
  // padding: 15px 15px 0px 15px;
  margin: 10px -10px -12px;
}
.container {
  background: #ffffff;
  padding: 15px;
}
</style>
