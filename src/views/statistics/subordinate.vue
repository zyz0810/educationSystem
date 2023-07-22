<template>
  <div>
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="范围">
        <el-date-picker v-model="dateTime"
                        type="daterange"
                        clearable
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        @change="query"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择人员">
        <el-select v-model="listQuery.clerkId"
                   @change="query"
                   placeholder="选择人员"
                   clearable>
          <el-option label="全部"
                     value></el-option>
          <el-option :label="item.nickname"
                     v-for="(item,index) in userList"
                     :key="index"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="部门">
        <el-cascader
          :options="deptList"
          @change="query"
          :show-all-levels="false"
          v-model="deptIdList"
          clearable
        ></el-cascader>
      </el-form-item>-->
      <el-form-item>
        <el-button class="filter-item"
                   type="primary"
                   @click="query"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="broken">
      <brokenline :name="'Subordinate'"
                  ref="subordinate"
                  :echartData="echartData" />
      <!-- <histogram :name="'histogram'" /> -->
    </div>
    <div class="total">
      <div class="total-box">
        <div>
          支付金额：
          <span>￥{{dataInfo.completedOrderPrice || 0}}</span>元
        </div>
        <div class="ml_20">
          支付订单：
          <span>{{dataInfo.orderCnt || 0}}</span>
        </div>
      </div>
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                border
                :height="400"
                highlight-current-row>
        <el-table-column label="时间"
                         align="center"
                         prop="dayTime"></el-table-column>
        <el-table-column label="客户经理"
                         min-width="120"
                         :show-overflow-tooltip="true"
                         align="center"
                         prop="clerkName"></el-table-column>
        <el-table-column label="联系方式"
                         min-width="100"
                         align="center"
                         prop="clerkMobile"></el-table-column>
        <el-table-column label="部门"
                         min-width="120"
                         :show-overflow-tooltip="true"
                         align="center"
                         prop="deptName"></el-table-column>
        <el-table-column label="支付金额"
                         align="center"
                         prop="payPrice"></el-table-column>
        <el-table-column label="支付订单"
                         align="center"
                         prop="orderCnt"></el-table-column>
        <!--
      <el-table-column label="退款金额"
                       align="center"
                       prop="refundPrice"></el-table-column>
      <el-table-column label="退款订单"
                       align="center"
                       prop="refundOrderCnt"></el-table-column>
    -->
        <el-table-column label="操作"
                         v-if="permissions.includes('admin') || permissions.includes('sales:review:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="getDetail(scope.row)"
                       v-rules="{ admin: 'admin', ordinary: 'sales:review:view' }">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="queryOwnPerformance"
                  class="text-right" />
      <statisticsDetail :showDialog.sync="showDialog"
                        :detailData="detailData" />
    </div>
  </div>
</template>

<script>
import statisticsDetail from "./statisticsDetail";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import {
  queryOwnPerformance,
  getChildUsers,
  findDeptTree,
  queryWebOwnPerformanceEcharts
} from "@/api/statistics";
import { mapState } from "vuex";
export default {
  props: {
    orderType: {
      required: true,
      default: 0,
      type: [String, Number]
    }
  },
  data () {
    return {
      listLoading: false,
      dataList: [],
      dataInfo: {},
      total: 0,
      detailData: {
        clerkId: "",
        orderTime: ""
      },
      showDialog: false,
      listQuery: {
        startTime: "",
        endTime: "",
        clerkId: "",
        deptId: "",
        page: 1,
        limit: 10
      },
      echartData: [],
      deptList: [],
      userList: [],
      deptIdList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick (picker) {
              const end = new Date();
              const first = new Date();
              const start = new Date(first.setDate(1));
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  components: {
    statisticsDetail
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
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
  mounted () {
    const endTime = new Date();
    const first = new Date();
    const startTime = first.setDate(1);
    Object.assign(this.listQuery, {
      endTime: this.$moment(endTime).format("YYYY-MM-DD 23:59:59"),
      startTime: this.$moment(startTime).format("YYYY-MM-DD 00:00:00")
    });
    this.findDeptTree();
    this.getChildUsers();
    this.queryWebOwnPerformanceEcharts();
    this.queryOwnPerformance();
  },
  methods: {
    findDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    getDetail (row) {
      const { clerkId, dayTime } = row;
      Object.assign(this.detailData, {
        clerkId,
        orderTime: dayTime
      });
      this.showDialog = true;
    },
    query () {
      this.listQuery.page = 1
      this.queryWebOwnPerformanceEcharts();
      this.queryOwnPerformance();
    },
    getChildUsers () {
      getChildUsers({ limit: 999 }).then(res => {
        this.userList = res.data;
      });
    },
    resetQuery () {
      Object.assign(this.listQuery, {
        startTime: "",
        endTime: "",
        clerkId: "",
        deptId: ""
      });
      this.query();
    },
    queryOwnPerformance () {
      queryOwnPerformance({
        ...this.listQuery,
        orderType: this.orderType
      }).then(res => {
        const data = res.data;
        this.total = data.count || 0;
        this.dataList = data.data;
        Object.assign(this.dataInfo, {
          ...res.data
        });
      });
    },
    queryWebOwnPerformanceEcharts () {
      const list = this.deptIdList.slice(-1);
      Object.assign(this.listQuery, {
        deptId: list.length ? list[0] : ""
      });
      queryWebOwnPerformanceEcharts({
        ...this.listQuery,
        orderType: this.orderType
      }).then(res => {
        this.echartData = res.data;
        this.$nextTick(() => {
          this.$refs.subordinate.setData();
        });
      });
    }
  }
};
</script>

<style lang="scss" scope>
.broken {
  height: 400px;
  display: grid;
}
.total {
  color: #666666;
  font-family: "微软雅黑";
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  text-align: left;
  line-height: 22px;
  padding: 20px;
}
.total-box {
  // display: flex;
  div {
    display: inline-block;
    span {
      font-weight: bold;
      padding: 0 4px;
    }
  }
}
</style>
