<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="5vh"
             class="dialogContainer"
             @open="open"
             title="选择商品">
    <div class="filter-container">
      <el-form :inline="true"
               :model="listQuery"
               class="search_form"
               :label="280">
        <el-form-item label="商品编码">
          <el-input v-model="listQuery.goodsSn"
                    placeholder="请输入商品编码"
                    @change="getProductList"
                    clearable />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="listQuery.name"
                    placeholder="请输入商品名称"
                    @change="getProductList"
                    clearable />
        </el-form-item>
        <el-form-item label="助记码">
          <el-input v-model="listQuery.mnemonicCode"
                    @change="getProductList"
                    clearable
                    placeholder="请输入助记码" />
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="listQuery.skuCode"
                    @change="getProductList"
                    clearable
                    placeholder="请输入SKU编码" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="getProductList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading"
              :data="dataList"
              ref="activityTable"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="(list) => (selectList = list)"
              border
              @row-click="handleRowClick"
              highlight-current-row>
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="商品编码"
                       width="150"
                       align="center"
                       prop="goodsSn"></el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       prop="name"></el-table-column>
      <el-table-column label="生产厂家"
                       align="center"
                       prop="manufacture.name"></el-table-column>
      <el-table-column label="规格"
                       align="center"
                       prop="specificationValue"></el-table-column>
      <el-table-column label="SKU编码"
                       align="center"
                       width="150"
                       prop="skuCode"></el-table-column>
      <el-table-column label="库存"
                       align="center"
                       prop="stock"></el-table-column>
      <el-table-column label="单价"
                       align="center"
                       prop="retailPrice"></el-table-column>
      <el-table-column label="推广费"
                       align="center"
                       prop="isMarketable"></el-table-column>
    </el-table>
    <pagination :total="total"
                :page.sync="listQuery.page"
                class="text-right m20"
                :limit.sync="listQuery.limit"
                @pagination="getProductList" />
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="close">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { productSkuList } from "@/api/goodsService";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        name: "",
        goodsSn: "",
        mnemonicCode: "",
        isMarketable: 1,
        result: 1,
        skuCode: "",
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },
  methods: {
    save () {
      const arr = this.selectList;
      this.$emit("insertWares", arr);
      this.dialogVisible = false;
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },
    getProductList () {
      this.listLoading = true;
      productSkuList(this.listQuery)
        .then((res) => {
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
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        name: "",
        skuCode: "",
        mnemonicCode: "",
        goodsSn: "",
        isMarketable: 1,
      });
      this.selectList = [];
      this.dialogVisible = false;
    },
  },
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
