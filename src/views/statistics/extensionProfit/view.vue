<template>
  <div class="">
    <el-table v-loading="listLoading"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="(list) => (selectList = list)"
              border
              ref="activityTable"
              :height="tableHeight"
              @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row);}"
              highlight-current-row>
      <el-table-column label="客户经理"
                       align="center"
                       min-width="120"
                       :show-overflow-tooltip="true"
                       prop="customerUserName">
        <template slot-scope="scope">
          <span v-html="show(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="商品总额"
                       align="center"
                       min-width="100"
                       prop="saleAmount"></el-table-column>
      <el-table-column label="商品实付总额"
                       min-width="100"
                       align="center"
                       prop="realPayAmount"></el-table-column>
      <el-table-column label="商品收益总额"
                       min-width="100"
                       align="center"
                       prop="spreadAllAmount"></el-table-column>
      <el-table-column label="商品应退总额"
                       min-width="100"
                       align="center"
                       prop="refoundAmount"></el-table-column>
      <el-table-column label="已提现总额"
                       min-width="100"
                       align="center"
                       prop="spreadWithdrawAmount"></el-table-column>
      <el-table-column label="剩余可提现总额"
                       min-width="120"
                       align="center"
                       prop="validWithdrawAmount"></el-table-column>
      <el-table-column label="最后申请提现时间"
                       width="160"
                       align="center"
                       :formatter="formatTime"
                       prop="withdrawTime"></el-table-column>
      <el-table-column label="操作"
                       width="100"
                       fixed="right"
                       v-if="permissions.includes('admin') || permissions.includes('extension:profit:review:view')"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     v-rules="{ admin: 'admin', ordinary: 'extension:profit:review:view' }"
                     @click.stop="goDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="profitListByPage" />
    <Details :showDialog.sync="showDetailsDialog"
             :orderType='orderType'></Details>
  </div>
</template>

<script>
import { profitListByPage } from "@/api/statistics";
import Details from "./details";
import { mapGetters, mapState } from "vuex";
export default {
  components: {
    Details,
  },
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    scope: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      // listQuery: {
      //   customerName: '',
      //   endTime: "",
      //   page: 1,
      //   limit: 10,
      // },
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
      showDetailsDialog: false
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 350;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 350;
      };
    });
    this.profitListByPage();
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
  },
  methods: {
    show (row) {
      return row.customerId == 0 ? '公海业绩' : row.customerUserName
    },
    //推广收益明细
    goDetail (val) {
      this.orderType = {
        userId: val.customerId,
        customerName: val.customerUserName,
        option: {},
      }
      this.showDetailsDialog = true
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
    toDetail (row) {
      this.showDetailDialog = true;
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 获取客户列表
    profitListByPage () {
      profitListByPage({ ...this.listQuery, scope: this.scope })
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          // 防止table错位
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
.border-card {
  margin-top: 20px;
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
