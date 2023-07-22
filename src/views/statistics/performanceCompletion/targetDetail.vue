<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="15vh"
             class="dialogContainer"
             @open="open"
             title="目标详情">
    <el-table v-loading="listLoading"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              highlight-current-row>
      <el-table-column label="时间"
                       align="center"
                       prop="month"></el-table-column>
      <el-table-column label="目标金额"
                       align="center"
                       prop="total"></el-table-column>
      <el-table-column label="成交金额"
                       align="center"
                       prop="compelet"></el-table-column>
      <el-table-column label="成交订单"
                       align="center"
                       prop="compeletOrder">
        <template slot-scope="scope">
          <div>
            <el-link type="primary"
                     v-if="scope.row.compeletOrder != 0"
                     @click="scope.row.compeletOrder != 0 ? finishOrder(scope.row) : ''"
                     :disabled='scope.row.compeletOrder == 0'>{{scope.row.compeletOrder}}</el-link>
            <div class=""
                 v-if="scope.row.compeletOrder == 0">0</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="完成率"
                       align="center"
                       prop="compeletPercent"></el-table-column>
    </el-table>
    <div class="page_footer">
      <el-button @click="cancel">关闭</el-button>
    </div>
    <finishOrder :showDialog.sync="finishOrderDialog"
                 :orderDetail="orderDetail" />
  </my-dialog>
</template>

<script>
import finishOrder from "./finishOrder";
import { achievementByMonth } from "@/api/performanceCompletion";
export default {
  components: {
    finishOrder
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    detailData: {
      required: true,
      type: [Object, Array],
      default: {
        year: "",
        performanceEnum: "",
        ids: '',
      }
    }
  },
  data () {
    return {
      //  performanceEnum: 'USER',//DEPT: 对应部门   USER: 对应员工
      listQuery: {
        limit: 10,
        page: 1,
        year: "",
        performanceEnum: "",
        ids: '',
      },
      dataList: [],
      listLoading: false,
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
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  methods: {
    // 订单详情弹窗
    finishOrder (row) {
      let yearMonth = row.month.split('-')
      let year = yearMonth[0]
      let month = yearMonth[1]
      function mGetDate (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }
      var totalDay = mGetDate(year, month);
      Object.assign(this.orderDetail, {
        startTime: year + '-' + month + '-' + '01' + ' 00:00:00',
        endTime: year + '-' + month + '-' + totalDay + ' 23:59:59',
        month: row.month,
        performanceEnum: this.listQuery.performanceEnum,
        ids: [this.listQuery.ids],
      });
      this.finishOrderDialog = true;
    },
    // 获取详情信息
    achievementByMonth () {
      this.listLoading = true;
      achievementByMonth(this.listQuery)
        .then(res => {
          this.dataList = res.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    },
    open () {
      Object.assign(this.listQuery, this.detailData);
      this.achievementByMonth();
    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        year: "",
        performanceEnum: "",
        ids: '',
      });
      this.dataList = [];
      this.dialogVisible = false;
    }
  },
  mounted () { }
};
</script>

<style scoped lang="scss">
.link {
  color: #1890ff;
}
</style>
