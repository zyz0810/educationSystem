<template>
  <div class=" ">
    <div class="">
      <el-table v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column label="时间"
                         align="center"
                         min-width="90"
                         prop="orderCreateTime"></el-table-column>
        <el-table-column label="客户经理名称"
                         min-width="120"
                         show-overflow-tooltip
                         align="center"
                         prop="clerkName"></el-table-column>
        <el-table-column label="联系人"
                         min-width="100"
                         show-overflow-tooltip
                         align="center"
                         prop="linkman"></el-table-column>
        <el-table-column label="手机号"
                         min-width="100"
                         align="center"
                         prop="telephone"></el-table-column>
        <el-table-column label="商品总销量"
                         min-width="90"
                         align="center"
                         prop="totalQuantity"></el-table-column>
        <el-table-column label="商品总额"
                         align="center"
                         prop="orderPrice"></el-table-column>
        <el-table-column label="商品实付总额"
                         width="100"
                         align="center"
                         prop="paymentPrice"></el-table-column>
        <el-table-column label="商品应退总额"
                         min-width="100"
                         align="center"
                         prop="refundAmount"></el-table-column>
        <el-table-column label="商品收益总额"
                         min-width="100"
                         align="center"
                         prop="spreadAmount"></el-table-column>
        <el-table-column label="平台收益总额"
                         min-width="100"
                         align="center"
                         prop="providerProfitAmount"></el-table-column>
        <el-table-column label="操作"
                         width="160"
                         fixed="right"
                         v-if="permissions.includes('admin') || permissions.includes('extension:review:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'extension:review:view' }"
                       @click.stop="goDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="queryExtensionList" />
    </div>
    <!--查看订单详情-->
    <goodsDetails :showDialog.sync="showGoodsDetailsDialog"
                  :datail='datail'></goodsDetails>
  </div>
</template>

<script>
import { queryExtensionList } from "@/api/salesStatistics";
import goodsDetails from "./goodsDetails"
import orders from './orders'
import { mapState } from "vuex";
export default {
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
  components: {
    goodsDetails
  },
  data () {
    return {
      // listQuery: {
      //   cherkName: '',
      //   startTime: "",
      //   endTime: "",
      //   page: 1,
      //   limit: 10,
      // },
      total: 0,
      listLoading: false,
      tableHeight: 400,
      selectList: [],
      dataList: [],
      userId: '',
      customerName: '',
      showGoodsDetailsDialog: false,
      datail: {},
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
    this.queryExtensionList();
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
    // 订单详情
    goDetail (val) {
      this.datail = val
      this.showGoodsDetailsDialog = true
    },
    //推广收益明细
    incomeDetails () {
      this.$router.push({
        path: "/details",
        query: {
          userId: this.selectList[0].customerId,
          customerName: this.selectList[0].customerUserName,
        },
      });
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
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 获取客户列表
    queryExtensionList () {
      queryExtensionList({ ...this.listQuery, scope: this.scope })
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
