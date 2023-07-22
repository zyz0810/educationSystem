<template>
  <div>
    <el-table ref="activityTable"
              v-loading="listLoading"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="(list) => (selectList = list)"
              border
              :height="tableHeight"
              @row-click="(row, column, event) => { $refs.activityTable.toggleRowSelection(row)}"
              highlight-current-row>
      <el-table-column label="商品编码"
                       align="center"
                       min-width="150"
                       prop="goodsSn"></el-table-column>
      <el-table-column label="商品信息"
                       align="center"
                       min-width="140"
                       show-overflow-tooltip
                       prop="taskName">
        <template slot-scope="scope">
          <p>{{ scope.row.fullName }}</p>
          <p>{{ scope.row.manufactureName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="供应商"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="supplierName"></el-table-column>
      <el-table-column label="供应商售价"
                       align="center"
                       min-width="90"
                       prop="retailPrice"></el-table-column>
      <el-table-column label="商品预计收益"
                       align="center"
                       min-width="100"
                       prop="exceptedFee"></el-table-column>
      <el-table-column label="商品总销量"
                       min-width="90"
                       align="center"
                       prop="totalSaleCount"></el-table-column>
      <el-table-column label="推广开始时间"
                       align="center"
                       min-width="140"
                       prop="startTime"
                       :formatter="formatTime"></el-table-column>
      <el-table-column label="推广结束时间"
                       align="center"
                       min-width="140"
                       prop="endTime"
                       :formatter="formatTime"></el-table-column>
      <el-table-column label="推广状态"
                       align="center"
                       prop="status"
                       :formatter="formatAdStatus"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getPromotionList"
                class="text-right" />
  </div>
</template>

<script>
import { promotionList } from "@/api/promotion";

export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false,
    },
    claimType: {
      required: true,
      type: [String, Number],
      default: "",
    },
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
      titlleDialog: "您确定要将客户放入公海吗？",
      contentDialog: "转移到公海后此客户数据将属于公共资源",
      typeOptions: {
        type: "",
        optionType: "",
        option: {},
      },
      levelOptions: [],
      sourceOptions: [],
      tableHeight: 400,
    };
  },
  filters: {
    filtersPriority: function (value) {
      let StatusArr = { 1: "高", 2: "中", 3: "低", 4: "无" };
      return StatusArr[value];
    },
    // 任务状态 0 未开始 1 进行中 2已完成
    filtersStatus: function (value) {
      let StatusArr = { 0: "未开始", 1: "进行中", 2: "已完成" };
      return StatusArr[value];
    },
  },
  mounted () {
    this.getPromotionList(); // 获取任务列表
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 320;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 320;
      };
    });
  },
  methods: {
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    formatAdStatus (row, column, cellValue, index) {
      return cellValue == 4
        ? "待推广"
        : cellValue == 5
          ? "推广中"
          : cellValue == 6
            ? "已售罄"
            : cellValue == 7
              ? "已删除"
              : cellValue == 8
                ? "已过期"
                : "";
    },
    //日期比较的方法
    compare (date1, date2) {
      let dates1 = new Date(date1);
      let dates2 = new Date(date2);
      if (dates1 > dates2) {
        return false;
      } else {
        return true;
      }
    },
    open () { },
    // 获取客户列表
    getPromotionList () {
      promotionList({ ...this.listQuery, orders: this.claimType })
        .then((res) => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch((err) => console.log(err));
    },
    addTask (type, val) {
      // debugger;
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: val,
      };
      this.showAddDialog = true;
    },
    completeTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          let ids = this.selectList.map((item) => item.id);
          taskComplete({ ids: ids })
            .then((res) => {
              this.listLoading = false;
              this.getPromotionList();
              this.$message({
                message: res.resp_msg,
                type: "success",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch(() => { });
    },
    delTask (type, val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          let ids;
          if (type == "one") {
            ids = val.id;
          } else if (type == "all") {
            ids = this.selectList.map((item) => item.id);
          }
          taskDel({ ids: ids })
            .then((res) => {
              this.listLoading = false;
              this.getPromotionList();
              this.$message({
                message: res.resp_msg,
                type: "success",
              });
            })
            .catch((err) => console.log(err));
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scope>
</style>
