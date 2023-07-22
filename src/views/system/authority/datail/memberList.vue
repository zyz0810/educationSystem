<template>
  <div>
    <div>成员列表</div>
    <el-table
      class="mt_20"
      v-loading="listLoading"
      :data="dataList"
      ref="activityTable"
      :header-cell-style="{ background: '#f5f7fa' }"
      element-loading-text="拼命加载中"
      border
      @row-click="
        (row, column, event) => {
          $refs.activityTable.toggleRowSelection(row);
        }
      "
      highlight-current-row
    >
      <el-table-column prop="nickname" label="姓名" width="180"></el-table-column>
      <el-table-column prop="deptName" label="部门" width="180"></el-table-column>
      <el-table-column prop="createTime" :formatter="formatTime" label="创建时间"></el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      class="text-right"
      @pagination="queryOrderList"
    />
  </div>
</template>

<script>
import { queryOrderList } from "@/api/order";
import { getRoleUsers } from "@/api/authority";
export default {
  props: {
    id: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  components: {},
  data() {
    return {
      dataList: [{}, {}],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false,
      showDialog: false,
      dataInfo: {},
      orderId: ""
    };
  },
  mounted() {
    this.queryOrderList();
  },
  methods: {
    queryOrderList() {
      this.listLoading = true;
      getRoleUsers({
        ...this.listQuery,
        roleId: this.id
      }).then(res => {
        this.listLoading = false;
        this.dataList = res.data;
        // Object.assign(this.dataInfo, data);
        // this.total = res.count;
      });
    },
    formatTime(row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    getDetail(row) {
      const { orderId } = row;
      this.orderId = orderId;
      this.showDialog = true;
    }
  }
};
</script>

<style lang="scss" scope>
.orderInfo {
  span {
    margin-right: 30px;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-family: "微软雅黑 Bold", "微软雅黑";
    font-style: normal;
    line-height: 18px;
  }
}
</style>
