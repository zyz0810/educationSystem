<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             top="5vh"
             class="dialogContainer"
             :append-to-body="true"
             @open="open"
             title="选择商品">
    <div class="filter-container">
      <el-form :inline="true"
               :model="listQuery"
               class="search_form"
               :label="280">
        <el-form-item label="商品编码">
          <el-input v-model.trim="listQuery.goodsSn"
                    placeholder="请输入商品编码"
                    @change="queryGetProductList"
                    clearable />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model.trim="listQuery.name"
                    placeholder="请输入商品名称"
                    @change="queryGetProductList"
                    clearable />
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model.trim="listQuery.manufactureName"
                    @change="queryGetProductList"
                    clearable
                    placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model.trim="listQuery.skuCode"
                    @change="queryGetProductList"
                    clearable
                    placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="queryGetProductList">查询</el-button>
          <el-button class="filter-item"
                     icon="el-icon-refresh"
                     @click="resetListQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--    <el-table v-loading="listLoading"-->
    <!--              :data="dataList"-->
    <!--              ref="activityTable"-->
    <!--              :header-cell-style="{ background: '#f5f7fa' }"-->
    <!--              element-loading-text="拼命加载中"-->
    <!--              @selection-change="list => (selectList = list)"-->
    <!--              border-->
    <!--              :row-key="(row) => {return row.id}"-->
    <!--              height="400"-->
    <!--              @row-click="handleRowClick"-->
    <!--              highlight-current-row>-->

    <el-table v-loading="listLoading"
              :data="dataList"
              ref="activityTable"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="handleSelectionChange"
              @select-all="onSelectAll"
              border
              :row-key="(row) => {return row.id;}"
              :height="400"
              @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
              highlight-current-row>

      <el-table-column type="selection"
                       :reserve-selection="true"></el-table-column>
      <el-table-column label="商品编码"
                       min-width="160"
                       align="center"
                       prop="goodsSn"></el-table-column>
      <el-table-column label="SKU编码"
                       align="center"
                       min-width="160"
                       prop="skuCode"></el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       min-width="140"
                       show-overflow-tooltip
                       prop="name"></el-table-column>
      <el-table-column label="生产厂家"
                       align="center"
                       min-width="140"
                       show-overflow-tooltip
                       prop="manufacturerName"></el-table-column>
      <el-table-column label="规格"
                       min-width="130"
                       show-overflow-tooltip
                       align="center"
                       prop="skuFullName"></el-table-column>
      <el-table-column label="供应商售价"
                       align="center"
                       min-width="100"
                       prop="supplierRetailPrice"></el-table-column>
      <el-table-column label="平台售价"
                       align="center"
                       prop="platformPrice"></el-table-column>
      <el-table-column label="最高售价"
                       align="center"
                       prop="highestPrice"></el-table-column>
      <el-table-column label="最低售价"
                       align="center"
                       prop="lowestPrice"></el-table-column>
      <el-table-column label="服务商售价"
                       align="center"
                       min-width="100"
                       prop="agentSalePrice"></el-table-column>
      <!--
        <el-table-column label="供应商底价"
                       align="center"
                       min-width="100"
                       prop="supplierFloorPrice"></el-table-column>
      -->
      <el-table-column label="商品状态"
                       align="center"
                       prop="isMarketable"
                       :formatter="formatStatus"></el-table-column>
    </el-table>
    <pagination :total="total"
                :page.sync="listQuery.page"
                class="text-right m20"
                :limit.sync="listQuery.limit"
                @pagination="getProductList" />
    <span slot="footer"
          class="page_footer">
      <el-button type="primary"
                 class="filter-item"
                 @click="save">确 定</el-button>
      <el-button class="ml_30 filter-item"
                 @click="close">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { priceProductList } from "@/api/productPriceSale";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      listQuery: {
        name: "",
        goodsSn: "",
        manufactureName: "",
        skuCode: "",
        limit: 10,
        page: 1,
        filterStrategy: {
          platform: false,
          crm: true,
          supplier: false
        }
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
    handleSelectionChange (val) {
      if (val.length > 1) {
        this.$refs.activityTable.clearSelection()
        this.$refs.activityTable.toggleRowSelection(val.pop())
      } else {
        this.selectList = val;
      }
    },
    onSelectAll () {
      this.$refs.activityTable.clearSelection()
    },
    save () {
      this.$emit("insertWares", this.selectList);
      this.dialogVisible = false;
    },
    hint () {
      return this.$confirm("所选商品有已参与活动的，将无法加入", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    queryGetProductList () {
      this.listQuery.page = 1
      this.getProductList()
    },
    getProductList () {
      this.listLoading = true;
      priceProductList(this.listQuery)
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
    open () {
      this.getProductList();
    },
    resetListQuery () {
      Object.assign(this.listQuery, {
        name: "",
        goodsSn: "",
        manufactureName: "",
        skuCode: "",
        limit: 10,
        page: 1,
        filterStrategy: {
          platform: false,
          crm: true,
          supplier: false
        }
      });
      this.$refs.activityTable.clearSelection()  //清空选中
      this.getProductList();
    },
    close () {
      Object.assign(this.listQuery, {
        name: "",
        goodsSn: "",
        manufactureName: "",
        skuCode: "",
        limit: 10,
        page: 1,
        filterStrategy: {
          platform: false,
          crm: true,
          supplier: false
        }
      });
      this.selectList = [];
      this.$refs.activityTable.clearSelection()  //清空选中
      this.dialogVisible = false;
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "下架"
        : cellValue == 1
          ? "上架"
          : cellValue == 2
            ? "售罄"
            : cellValue == 3
              ? "删除"
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
  margin-top: 20px;
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
  // padding: 0 20px;
}
</style>
