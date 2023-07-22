<template>
  <div class="">
    <el-form :inline="true"
             :model="listQuery"
             class="search-inline">
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
                   multiple
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
                class="mt_20"
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
                         prop="providerName"></el-table-column>
        <el-table-column label="部门"
                         align="center"
                         width="130"
                         prop="deptName"></el-table-column>
        <el-table-column label="销售业绩（元）"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="performanceTarget">
            <template slot-scope="scope">
              <div>{{scope.row.performanceTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="performanceKPI.compelet">
            <template slot-scope="scope">
              <div>{{scope.row.performanceKPI.compelet || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           width="90"
                           prop="">
            <template slot-scope="scope">
              <el-button @click.native.prevent="salesCompletion(scope.row)"
                         type="text"
                         size="small">
                {{(scope.row.performanceKPI.compeletPercent * 100).toFixed(2) || 0}} %
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="performanceWeight">
            <template slot-scope="scope">
              <div>{{scope.row.performanceWeight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际达成率"
                           width="90"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <span>{{(scope.row.performanceKPI.realCompletePercent * 100).toFixed(2) || 0}} %</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="客户拜访（次）"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="customerVisitTarget">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisitTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="customerVisit.compelet">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisit.compelet || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <span>{{(scope.row.customerVisit.compeletPercent * 100).toFixed(2) || 0}} %</span>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="customerVisitWeight">
            <template slot-scope="scope">
              <div>{{scope.row.customerVisitWeight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际达成率"
                           width="90"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <span>{{(scope.row.customerVisit.realCompletePercent * 100).toFixed(2) || 0}} %</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="门店动销数（个）"
                         align="center">
          <!--
          <el-table-column label="目标"
                           align="center"
                           prop="providerStoreSalesTarget">
            <template slot-scope="scope">
              <div>{{scope.row.providerStoreSalesTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="storeSales.compelet">
            <template slot-scope="scope">
              <div>{{scope.row.storeSales.compelet || 0}}</div>
            </template>
          </el-table-column>
          -->
          <el-table-column label="完成率"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <el-button @click.native.prevent="movingPinFinish(scope.row)"
                         type="text"
                         size="small">
                {{(scope.row.storeSales.compeletPercent * 100).toFixed(2)  || 0}} %
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="storeSalesWeight">
            <template slot-scope="scope">
              <div>{{scope.row.storeSalesWeight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际达成率"
                           width="90"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <span>{{(scope.row.storeSales.realCompletePercent * 100).toFixed(2) || 0}} %</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="平均单店销售（元）"
                         align="center">
          <!--
          <el-table-column label="目标"
                           align="center"
                           prop="averageStoreTarget">
            <template slot-scope="scope">
              <div>{{scope.row.averageStoreTarget || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="averageStore.compelet">
            <template slot-scope="scope">
              <div>{{scope.row.averageStore.compelet || 0}}</div>
            </template>
          </el-table-column>
          -->
          <el-table-column label="完成率"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <el-button @click.native.prevent="StoreOutputFinish(scope.row)"
                         type="text"
                         size="small">
                {{(scope.row.averageStore.compeletPercent * 100).toFixed(2) || 0}} %
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="权重"
                           align="center"
                           prop="averageStoreWeight">
            <template slot-scope="scope">
              <div>{{scope.row.averageStoreWeight || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="实际达成率"
                           width="90"
                           align="center"
                           prop="">
            <template slot-scope="scope">
              <span>{{(scope.row.averageStore.realCompletePercent* 100).toFixed(2) || 0}} %</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总达成率"
                         align="center"
                         prop="totalProportion">
          <template slot-scope="scope">
            <span>{{(scope.row.totalProportion * 100).toFixed(2) || 0}} %</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="providerAssessment"
                  class="text-right" />
    </div>
    <salesPerformance :showDialog.sync="showSalesPerformanceDialog"
                      :salesCompletionValue='salesCompletionValue'
                      :preamVal='preamVal'></salesPerformance>
    <movingPin :showDialog.sync="showMovingPinDialog"
               :storeSalesInfo='storeSalesInfo'></movingPin>
    <storeOutput :showDialog.sync="showStoreOutputDialog"
                 :averageStoreInfo='averageStoreInfo'></storeOutput>
  </div>
</template>

<script>
import { getUsersByRole, findProviderDept } from "@/api/common";
import { providerAssessment } from "@/api/workCompletion";
import { mapGetters, mapState } from "vuex";
import salesPerformance from './salesPerformance.vue'
import movingPin from './movingPin.vue'
import storeOutput from './storeOutput.vue'
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
        assessmentType: 2,//1服务商 2员工
        providerIds: [],
        assessmentDate: '',
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
      showSalesPerformanceDialog: false,
      showMovingPinDialog: false,
      showStoreOutputDialog: false,
      averageStoreInfo: [],//平均客户门店分级
      storeSalesInfo: [],//门店动销分级
      salesCompletionValue: {},
      preamVal: {},
    };
  },
  components: {
    salesPerformance,
    movingPin,
    storeOutput
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
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 250;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 250;
      };
    });
    this.listQuery.providerIds = (this.provider_type == '服务商' || this.provider_type == '合伙人') ? [this.provider_id] : ''
    this.getMonth()
    this.getUsersByRole()
    // this.findProviderDept()
  },
  methods: {
    // 销售业绩的完成率
    salesCompletion (val) {
      this.salesCompletionValue = val
      this.preamVal = {
        assessmentDate: this.listQuery.assessmentDate,
        assessmentType: this.listQuery.assessmentType,
        providerId: val.providerId,
      }
      this.showSalesPerformanceDialog = true
    },
    // 门店动销完成率详情
    movingPinFinish (val) {
      this.storeSalesInfo = val.storeSalesInfo
      this.showMovingPinDialog = true
    },
    StoreOutputFinish (val) {
      this.averageStoreInfo = val.averageStoreInfo
      this.showStoreOutputDialog = true
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
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    getMonth () {
      this.listQuery.assessmentDate = this.$moment(new Date()).format("yyyy-MM");
      this.providerAssessment();
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.providerAssessment();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        assessmentType: 2,//1服务商 2员工
        providerIds: [],
        assessmentDate: '',
        page: 1,
        limit: 10
      });
      this.getMonth()
      this.query();

    },
    // 业绩目标设置
    providerAssessment () {
      providerAssessment({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.count || 0;
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
  // padding: 5px 15px 15px 15px;
}
</style>
