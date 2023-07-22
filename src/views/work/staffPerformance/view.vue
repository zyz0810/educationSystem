<template>
  <div>
    <el-table ref="activityTable"
              v-loading="listLoading"
              :row-style="{height:'45px'}"
              :cell-style="{padding:'0px'}"
              class="mt_20 tableClass"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              :height="tableHeight"
              @row-click="(row,column,event)=>{$refs.activityTable.toggleRowSelection(row)}"
              highlight-current-row>
      <el-table-column label="员工"
                       min-width="100"
                       show-overflow-tooltip
                       align="center"
                       prop="name"></el-table-column>
      <el-table-column label="所属部门"
                       align="center"
                       show-overflow-tooltip
                       min-width="130"
                       prop="deptName"></el-table-column>
      <el-table-column label="新增客户"
                       align="center"
                       prop="addCustomer">
        <template slot-scope="scope">
          <div>
            <el-link type="primary"
                     @click.stop="scope.row.addCustomer!= 0 ? customerInfor('add',scope.row) : ''"
                     :disabled='scope.row.addCustomer== 0'> {{scope.row.addCustomer == 0 ? '' : scope.row.addCustomer}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="成交客户"
                       align="center"
                       prop="completeCustomer">
        <template slot-scope="scope">
          <div>
            <el-link type="primary"
                     @click.stop="scope.row.completeCustomer!= 0 ? customerInfor('deal',scope.row) : ''"
                     :disabled='scope.row.completeCustomer== 0'> {{scope.row.completeCustomer == 0 ? '' : scope.row.completeCustomer}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户转化率"
                       align="center"
                       min-width="90"
                       prop="rate">
        <template slot-scope="scope">
          <div>{{scope.row.rate || 0}}%</div>
        </template>
      </el-table-column>
      <el-table-column label="新增订单"
                       align="center"
                       prop="addOrder">
        <template slot-scope="scope">
          <div>
            <el-link type="primary"
                     @click.stop="scope.row.addOrder!= 0 ? finishOrder(0,scope.row) : ''"
                     :disabled='scope.row.addOrder== 0'> {{scope.row.addOrder == 0 ? '' : scope.row.addOrder}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="成交订单"
                       align="center"
                       prop="complateOrder">
        <template slot-scope="scope">
          <div>
            <el-link type="primary"
                     @click.stop="scope.row.complateOrder!= 0 ? finishOrder(5,scope.row) : ''"
                     :disabled='scope.row.complateOrder== 0'> {{scope.row.complateOrder == 0 ? '' : scope.row.complateOrder}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="签到次数"
                       align="center"
                       prop="sign"></el-table-column>
      <el-table-column label="跟进次数"
                       align="center"
                       prop="follow"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="statisticsCustomer"
                class="text-right" />
    <finishOrder :showDialog.sync="finishOrderDialog"
                 :orderDetail="orderDetail" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  statisticsCustomer,
} from "@/api/staffPerformance";
import finishOrder from "../../statistics/performanceCompletion/finishOrder";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    searchType: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  components: {
    finishOrder
  },
  data () {
    return {
      listLoading: false,
      taskType: "",
      showAddDialog: false,
      showTaskDialog: false,
      showFollowDialog: false,
      showTransferDialog: false,
      showDistributionDialog: false, //转移客户弹窗
      dialogVisible: false,
      dataList: [],
      total: 0,
      selectList: [],
      dialogComponents: false,
      typeOptions: {
        type: "",
        optionType: "",
        option: {}
      },
      levelOptions: [],
      sourceOptions: [],
      showMapDialog: false,
      showMapTrackDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
      showDetailDialog: false,
      tableHeight: 400,
      finishOrderDialog: false,
      orderDetail: {
        startTime: "",
        endTime: "",
        month: '',
        performanceEnum: "",
        id: '',
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 320;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 320;
      };
    });
    this.statisticsCustomer(); // 获取任务列表
  },
  computed: {
    ...mapGetters(["permission_routes"]),
  },
  methods: {
    // 订单详情弹窗
    finishOrder (val, row) {
      Object.assign(this.orderDetail, {
        startTime: this.listQuery.startTime, //开始时间
        endTime: this.listQuery.endTime, //结束时间
        month: '',
        orderStatus: val,//0全部 1 待付款 2 待审核 3 待发货 4 已发货 5 已完成 -6 已取消 7 已付款（待审核+待发货+已发货+已完成
        performanceEnum: "USER",
        ids: [row.id],
      });
      this.finishOrderDialog = true;
    },
    // 客户信息 
    customerInfor (status, row) {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          rStartTime: this.listQuery.startTime, //开始时间
          rEndTime: this.listQuery.endTime, //结束时间
          bargain: status == 'add' ? '' : '已成交',
          staffId: row.id
        }
      });
      const arr = this.permission_routes.find(item => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    // 详情
    detail (va1, val2) {
      this.showDetailDialog = true
      this.visitTaskId = val2.visitTaskId
    },
    //关联跳转
    associatedVisit (val, val2) {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          customerName: val2.storeName,
        },
      });
      const arr = this.permission_routes.find((item) => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    // 获取客户列表
    statisticsCustomer () {
      statisticsCustomer({
        ...this.listQuery,
        searchType: this.searchType,
      })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count || res.data.total || 0;
        })
        .catch(err => console.log(err));
    },
  }
};
</script>

<style lang="scss" scope>
/deep/.tableClass .cell {
  padding: 0 !important;
  height: 50px;
  line-height: 50px !important;
}
</style>
