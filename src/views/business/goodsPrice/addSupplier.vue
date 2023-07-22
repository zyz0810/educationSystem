<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             top="6vh"
             :append-to-body="true"
             class="dialogContainer"
             @open="open"
             title="客户设置">
    <div class="filter-container">
      <el-form :inline="true"
               :model="listQuery"
               class="search_form"
               :label="280">
        <el-form-item label="客户编码">
          <el-input v-model.trim="listQuery.customerSn"
                    @change="getCustomerSupplierList"
                    placeholder="请输入客户编码"
                    clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model.trim="listQuery.customerName"
                    @change="getCustomerSupplierList"
                    placeholder="请输入客户名称"
                    clearable />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="getCustomerSupplierList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-refresh"
                     @click="resetListQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading"
              :data="dataList"
              ref="activityTable"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              :height="400"
              @row-click="handleRowClick"
              highlight-current-row>
      <el-table-column type="selection"></el-table-column>
      <el-table-column fixed
                       label="客户编码"
                       align="center"
                       min-width="110"
                       prop="storeSn"></el-table-column>
      <el-table-column label="客户名称"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="storeName"></el-table-column>
      <!--      <el-table-column label="经营地址"-->
      <!--                       align="center"-->
      <!--                       prop="areaName"></el-table-column>-->
      <el-table-column label="经营地址"
                       align="center"
                       min-width="160"
                       show-overflow-tooltip
                       prop="areaName">
        <template slot-scope="scope">
          {{ scope.row.areaName + scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="客户类型"
                       align="center"
                       prop="customerTypeStr"></el-table-column>
      <el-table-column label="手机号"
                       align="center"
                       prop="mobile"></el-table-column>
      <el-table-column label="客户状态"
                       align="center"
                       :formatter="formatEnabled"
                       prop="enabled"></el-table-column>
    </el-table>
    <pagination :total="total"
                :page.sync="listQuery.page"
                class="text-right m20"
                :limit.sync="listQuery.limit"
                @pagination="getCustomerSupplierList" />
    <span slot="footer"
          class="page_footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="close">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { customerList } from "@/api/customer/customer";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    customerTypeId: {
      required: true,
      type: [Array, Number],
      default: []
    },
    checkedAreaList: {
      required: true,
      type: [Array, Number],
      default: []
    }
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        customerSn: "",
        customerName: ""
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false
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
    save () {
      this.$emit("insertSupplier", this.selectList);
      this.dialogVisible = false;
    },
    resetListQuery () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        customerSn: "",
        customerName: ""
      });
      this.getCustomerSupplierList();
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    getCustomerSupplierList () {
      this.listLoading = true;
      const areaIds = this.checkedAreaList;
      const customerTypes = this.customerTypeId;
      customerList({
        ...this.listQuery,
        areaIds,
        areaType: 3,
        customerTypes
      })
        .then(res => {
          const data = res.data;
          this.total = Number(data.count);
          this.dataList = data.data;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },


    formatEnabled (row, column, cellValue, index) {
      return cellValue == 1 ? "启用" : cellValue == 0 ? "冻结" : "";
    },
    open () {
      this.getCustomerSupplierList();
    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        customerSn: "",
        customerName: ""
      });
      this.selectList = [];
      this.dialogVisible = false;
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "下架"
        : cellValue == 1
          ? "上架"
          : cellValue == 2
            ? "售罄"
            : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: center;
  // margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    width: 160px;
    height: 40px;
  }
  .el-button:nth-child(2) {
    margin-left: 30px;
  }
}
.el-form {
  padding: 0 20px;
}
</style>
