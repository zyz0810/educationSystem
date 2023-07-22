<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="客户等级">
        <el-select placeholder="客户等级"
                   filterable
                   v-model.trim="listQuery.levelId"
                   @change="queryList"
                   clearable>
          <el-option v-for="(item, index) in leaveList"
                     :key="index"
                     :label="item.dictName"
                     :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户编号">
        <el-input v-model.trim="listQuery.storeSn"
                  clearable
                  @change="queryList"
                  placeholder="客户编号" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.storeName"
                  clearable
                  @change="queryList"
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="listQuery.selectTime"
                        type="month"
                        :clearable=false
                        value-format="yyyy-MM"
                        @change="queryList"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   v-model.trim="listQuery.userId"
                   @change="queryList">
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
                :summary-method="getSummaries"
                :show-summary="true"
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="客户等级"
                         align="center"
                         width="80"
                         prop="levelName"></el-table-column>
        <el-table-column label="客户编号"
                         align="center"
                         min-width="150"
                         prop="storeSn"></el-table-column>
        <el-table-column label="客户名称"
                         align="center"
                         width="250"
                         show-overflow-tooltip
                         prop="customerStoreName"></el-table-column>
        <el-table-column label="支付订单数"
                         align="center"
                         width="180"
                         prop="payOrderCount"></el-table-column>
        <el-table-column label="任务类型"
                         align="center"
                         width="100"
                         prop="taskTypeName">
          <template slot-scope="scope">
            <div class="link"
                 @click="addWork('view', scope.row)">{{scope.row.taskTypeName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="目标拜访次数"
                         align="center"
                         min-width="120"
                         prop="targetVisitCount">
        </el-table-column>
        <el-table-column label="有效拜访次数"
                         min-width="120"
                         align="center"
                         prop="visitEffect">
          <template slot="header">
            <span>有效拜访次数</span>
            <el-tooltip popper-class="tooltip"
                        placement="top">
              <i class="el-icon-question"></i>
              <div slot="content"
                   class="tooltip-content">
                <div>有效拜访次数为目标内的拜访次数，</div>
                <div>超过的部分不算</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="实际拜访次数"
                         min-width="110"
                         align="center"
                         prop="visitComplete">
        </el-table-column>
        <el-table-column label="目标单店销售额"
                         min-width="120"
                         align="center"
                         prop="targetStoreSaleAmount">
        </el-table-column>
        <el-table-column label="有效单店销售额"
                         align="center"
                         min-width="150"
                         prop="storeAverageEffectAmount">
          <template slot="header">
            <span>有效单店销售额</span>
            <el-tooltip popper-class="tooltip"
                        placement="top">
              <i class="el-icon-question"></i>
              <div slot="content"
                   class="tooltip-content">
                <div>有效单店销售额为目标内的销售额，</div>
                <div>超过的部分不算</div>
              </div>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div>{{scope.row.storeAverageEffectAmount || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="实际单店销售额"
                         min-width="130"
                         align="center"
                         prop="storeAverageComplete">
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="monthTaskList"
                  class="text-right" />
    </div>
    <addType :showDialog.sync="showAddDialog"
             :optionsValue='optionsValue'></addType>
  </div>
</template>

<script>
import { getUsersByRole, findProviderDept } from "@/api/common";
import { mapGetters, mapState } from "vuex";
import {
  monthTaskList,
  getCountAll
} from '@/api/missionObjectives'
import { dict } from "@/api/common";
import addType from '../../workTarget/taskType/addType.vue'
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
        levelId: '',
        storeSn: '',
        storeName: '',
        selectTime: '',
        userId: '',
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
      leaveList: [],
      countStatisics: {}, //統計
      customerCount: 0,
      storeSalesRateAll: 0,
      storeSalesEffectAll: 0,
      targetVisitCountAll: 0,
      visitEffectAll: 0,
      visitCompleteAll: 0,
      targetStoreSaleAmountAll: '0.00',
      storeAverageCompleteAll: '0.00',
      storeAverageEffectAmountAll: '0.00',
      showAddDialog: false,
      optionsValue: {},
    };
  },
  components: {
    addType
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions,
      crm_id: (state) => state.user.crm_id,
    }),
    ...mapGetters(["provider_id", "provider_type",]),
  },
  updated () {
    this.$refs.activityTable.doLayout()
  },
  mounted () {
    this.$nextTick(function () {
      // this.$refs.filter-container.offsetHeight
      let height =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height =
          window.innerHeight - self.$refs.activityTable.$el.offsetTop - 200;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
    this.getMonth()
    this.getUsersByRole()
    this.getDict()
    // this.getCountAll()
    // this.findProviderDept()
  },
  methods: {
    addWork (status, val) {
      this.optionsValue = {
        status: status,
        rowList: val
      }
      this.showAddDialog = true
    },
    // 总计
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == "levelName") {
        } else if (column.property == "storeSn") {
          sums[index] = '客户数' + this.customerCount;
        } else if (column.property == "customerStoreName") {
          // sums[index] = '动销率目标(A/B/C/D)' + this.storeSalesRateAll;
        } else if (column.property == "payOrderCount") {
          sums[index] = `动销率${this.storeSalesEffectAll}%(动销数/总记录数)`;
        } else if (column.property == "taskTypeName") {
          sums[index] = '-';
        } else if (column.property == "targetVisitCount") {
          sums[index] = this.targetVisitCountAll;
        } else if (column.property == "visitEffect") {
          sums[index] = this.visitEffectAll;
        } else if (column.property == "visitComplete") {
          sums[index] = this.visitCompleteAll;
        } else if (column.property == "targetStoreSaleAmount") {
          sums[index] = this.targetStoreSaleAmountAll;
        } else if (column.property == "storeAverageEffectAmount") {
          sums[index] = this.storeAverageEffectAmountAll;
        } else if (column.property == "storeAverageComplete") {
          sums[index] = this.storeAverageCompleteAll;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getCountAll () {
      const param = {
        selectTime: this.listQuery.selectTime,
        userId: this.listQuery.userId,
        storeSn: this.listQuery.storeSn,
        storeName: this.listQuery.storeName,
        levelId: this.listQuery.levelId,
      }
      getCountAll(param).then(res => {
        this.countStatisics = res.data
        this.customerCount = this.countStatisics.customerCount || 0
        this.storeSalesRateAll = this.countStatisics.storeSalesRateAll || '0%/0%/0%/0%'
        this.storeSalesEffectAll = this.countStatisics.storeSalesEffectAll || 0
        this.targetVisitCountAll = this.countStatisics.targetVisitCountAll || 0
        this.visitEffectAll = this.countStatisics.visitEffectAll || 0
        this.visitCompleteAll = this.countStatisics.visitCompleteAll || 0
        this.targetStoreSaleAmountAll = this.countStatisics.targetStoreSaleAmountAll || '0.00'
        this.storeAverageCompleteAll = this.countStatisics.storeAverageCompleteAll || '0.00'
        this.storeAverageEffectAmountAll = this.countStatisics.storeAverageEffectAmountAll || '0.00'
      })
        .catch(err => console.log(err));
    },
    getDict () {
      dict().then(res => {
        const data = res.data
        this.leaveList = data.find(item => item.dictType == 'customer_level').dataList
      })
        .catch(err => console.log(err));
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;
            this.listQuery.userId = this.userOptions[0].id
            this.monthTaskList()
            this.getCountAll()
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
      this.listQuery.selectTime = this.$moment(new Date()).format("yyyy-MM");
      // this.monthTaskList();
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.monthTaskList();
      this.getCountAll()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        levelId: '',
        storeSn: '',
        storeName: '',
        selectTime: '',
        userId: '',
        page: 1,
        limit: 10
      });
      this.listQuery.userId = this.userOptions[0].id
      this.getMonth()
      this.queryList();
    },
    // 业绩目标设置
    monthTaskList () {
      monthTaskList({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.count
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
.link {
  cursor: pointer;
  color: #1890ff;
}
</style>
