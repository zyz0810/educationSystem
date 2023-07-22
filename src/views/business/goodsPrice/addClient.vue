<template>
  <div>
    <div class="flex">
      <el-button class="filter-item"
                 type="primary"
                 :disabled="isCanView"
                 @click="add">添加客户</el-button>
      <el-button class="filter-item ml_10"
                 type="warning"
                 :disabled="isCanDelete||isCanView"
                 @click="deleteSupplier">删除客户</el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="dataList"
              class="mt_10"
              :header-cell-style="{background:'#f5f7fa'}"
              element-loading-text="拼命加载中"
              @selection-change="list=>selectList=list"
              border
              ref="tempTable"
              @row-click="(row,column,event)=>{$refs.tempTable.toggleRowSelection(row)}"
              highlight-current-row>
      <el-table-column fixed
                       type="selection"
                       width="55"></el-table-column>
      <el-table-column fixed
                       label="客户编码"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="storeSn"></el-table-column>
      <el-table-column label="客户名称"
                       min-width="120"
                       show-overflow-tooltip
                       align="center"
                       prop="storeName"></el-table-column>
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
      <el-table-column label="售价"
                       align="center"
                       prop="discount"
                       v-if="that == 'specify'">
        <template slot-scope="scope">
          <el-input type="number"
                    v-model.trim="scope.row.discount"
                    :disabled="isCanView"
                    placeholder="请输入售价" />
        </template>
      </el-table-column>
    </el-table>
    <addSupplier :showDialog.sync="showDialog"
                 :checkedAreaList="checkedAreaList"
                 :customerTypeId="customerTypeId"
                 @insertSupplier="insertSupplier" />
  </div>
</template>

<script>
import addSupplier from "./addSupplier";
export default {
  props: ["value", "isCanView", "list", "that"],
  data () {
    return {
      customerTypeId: [],
      checkedAreaList: [],
      selectList: [],
      otherList: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false,
      dataList: this.value,
      showDialog: false
    };
  },
  components: {
    addSupplier
  },
  watch: {
    dataList () {
      this.$emit("input", this.dataList);
    },
    value () {
      this.dataList = this.value;
    },
    list () {
      this.otherList = this.list;
    }
  },
  computed: {
    isCanDelete () {
      return this.selectList.length < 1;
    }
  },
  methods: {
    insertSupplier (arr) {
      const current = this.dataList.map(item => item.customerStoreId);
      const other = this.otherList.map(item => item.customerStoreId);
      let data = [];
      const boo = arr.every(item => !other.includes(item.customerStoreId));
      if (boo) {
        data = arr.filter(item => !current.includes(item.customerStoreId));
      } else {
        data = [];
        this.$message({
          message: "该用户已在另一指定中存在。",
          type: "error"
        });
      }
      data.map(item => {
        this.$set(item, 'discount', '')
      })
      this.dataList = this.dataList.concat(data);
    },
    add () {
      this.$emit("getParentData", this.that);
    },
    callback (checkedAreaList, customerTypeId) {
      this.checkedAreaList = checkedAreaList;
      this.customerTypeId = customerTypeId;
      this.showDialog = true;
    },
    deleteSupplier () {
      const ids = this.selectList.map(item => item.customerStoreId);
      const arr = this.dataList.filter(item => !ids.includes(item.customerStoreId));
      this.dataList = arr;
    },
    formatEnabled (row, column, cellValue, index) {
      // return cellValue == 0 ? "启用" : cellValue == 1 ? "冻结" : "";
      return cellValue == 1 ? "启用" : cellValue == 0 ? "冻结" : "";
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
</style>
