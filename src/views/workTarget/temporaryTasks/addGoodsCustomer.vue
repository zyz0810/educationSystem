<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             :append-to-body="true"
             @close="close"
             top="8vh"
             class="dialogContainer"
             @open="open"
             title="客户设置">
    <div class="filter-container">
      <el-form :inline="true"
               :model="listQuery"
               class="search_form"
               :label="280">
        <el-form-item label="客户编码">
          <el-input v-model="listQuery.customerStoreSn"
                    @change="queryGetCustomerSupplierList"
                    placeholder="请输入客户编码"
                    clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="listQuery.customerStoreName"
                    @change="queryGetCustomerSupplierList"
                    placeholder="请输入客户名称"
                    clearable />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="queryGetCustomerSupplierList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item"
                     icon="el-icon-refresh"
                     @click="resetListQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box-flex">
      <div class="left">
        <addAreaStr :treeList="treeList"
                    @insertAreas="insertAreas"
                    ref="mychild"
                    :showDialog.sync="showAreaDialog"></addAreaStr>
      </div>
      <div class="right">
        <el-table :data="dataList"
                  ref="activityTable"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="handleSelectionChange"
                  :height="tableHeight"
                  border
                  :row-key=" (row) => { return row.id; }  "
                  @row-click="handleRowClick"
                  highlight-current-row>
          <el-table-column :reserve-selection="true"
                           fixed
                           type="selection"></el-table-column>
          <el-table-column label="区域"
                           min-width="180"
                           show-overflow-tooltip
                           align="center">
            <template slot-scope="scope">
              {{  scope.row.address ||  scope.row.areaName }}
            </template>
          </el-table-column>
          <el-table-column label="客户类型"
                           align="center"
                           show-overflow-tooltip
                           prop="customerTypeStr"></el-table-column>
          <el-table-column width="160"
                           :show-overflow-tooltip="true"
                           label="客户编码"
                           align="center"
                           prop="customerStoreSn">
            <template slot-scope="scope">
              <span class="blue pointer"
                    @click.stop="showTerminal(scope.row.customerStoreId)">{{scope.row.customerStoreSn}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户名称"
                           align="center"
                           width="160"
                           :show-overflow-tooltip="true"
                           prop="customerStoreName"></el-table-column>
          <el-table-column label="客户状态"
                           align="center"
                           prop="status"></el-table-column>
        </el-table>
        <pagination :total="total"
                    :page.sync="listQuery.page"
                    class="text-right m20"
                    :limit.sync="listQuery.limit"
                    @pagination="getCustomerSupplierList" />
      </div>
    </div>
    <div class="checked-box">
      <div class="x-left">已选客户：</div>
      <div class="x-right">
        <span v-for='(item,index) in selectList'
              :key='index'> {{item.customerStoreName}}
          <i @click="del(item.customerStoreId)"
             class="el-icon-close"></i>
        </span>
      </div>
    </div>
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
import addAreaStr from "./addAreaStr";
import { findAreaTree } from "@/api/area";
// import {
//   getCustomerSupplierListAll,
// } from "@/api/supplier";
//  <terminalDetail :showDialog.sync="showTerminalDialog"
// :customerId="customerId" />
import {
  selectCustomerPage,
} from "@/api/temporaryTasks";
// import terminalDetail from "@/views/terminal/view";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    sysUserId: {
      required: true,
      type: [Number, String],
      default: 0,
    },
    checkedAreaList: {
      required: false,
      type: [Array, Number],
      default: [],
    },
    // 选中的客户id  
    customerStoreIdNotInList: {
      required: true,
      type: [Array, Number],
      default: [],
    },
    treeList: {
      required: false,
      type: Array,
      default: [],
    },
  },
  components: {
    addAreaStr,
    // terminalDetail,
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        customerStoreSn: "",
        customerStoreName: "",
        areaIdList: [],//区域筛选
        sysUserId: '',//选择服务商
        customerStoreIdNotInList: [],
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      tableHeight: 200,
      showAreaDialog: true,
      checked: true,
      price: '',
      showTerminalDialog: false,
      customerId: "",
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
    handleSelectionChange (val) {
      this.selectList = val
    },
    // 删除勾选
    del (val) {
      const arr = this.selectList.filter((item, indx) => item.customerStoreId != val)
      this.$refs.activityTable.clearSelection(); //清除
      if (arr.length > 0) {
        arr.forEach(row => {
          this.$refs['activityTable'].toggleRowSelection(row, true)
        })
      }
    },
    showTerminal (id) {
      this.customerId = id;
      this.showTerminalDialog = true;
    },
    // 区域回调
    insertAreas (arr) {
      this.listQuery.areaIdList = arr
      this.listQuery.page = 1;
      this.getCustomerSupplierList();
    },
    // 获取地区接口
    findAreaTree () {
      findAreaTree().then((res) => {
        this.treeList = res.data;
        const arr = this.treeList.map((item) => item.id);
      });
    },
    save () {
      if (this.checked == true) {
        const arr = this.dataListAll.map((item, index) => {
          return {
            price: this.price,
            ...item,
          }
        })
        this.$emit("insertSustomer", arr);
      } else {
        const arr = this.selectList.map((item, index) => {
          return {
            price: this.price,
            ...item,
          }
        })
        this.$emit("insertSustomer", arr);
      }
      this.dialogVisible = false;
    },
    // 条件查询
    queryGetCustomerSupplierList () {
      this.listQuery.page = 1;
      this.getCustomerSupplierList();
    },
    resetListQuery () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        customerStoreSn: "",
        customerStoreName: "",
        areaIdList: [],//区域筛选
        sysUserId: this.sysUserId,//选择服务商
        customerStoreIdNotInList: [],
      });
      this.$refs.mychild.childmethod()
      this.$refs.activityTable.clearSelection();
      this.getCustomerSupplierList();
    },
    handleRowClick (row, column, event) {
      this.$refs.activityTable.toggleRowSelection(row);
    },

    // getCustomerSupplierList() {
    //   this.listLoading = true;
    //   getCustomerSupplierList(this.listQuery)
    //     .then(res => {
    //       const data = res.data;
    //       this.total = Number(data.count);
    //       this.dataList = data.data;
    //       this.listLoading = false;
    //     })
    //     .catch(() => {
    //       this.listLoading = false;
    //     });
    // },

    getCustomerSupplierList () {
      this.listLoading = true;
      const areaIds = this.checkedAreaList;
      selectCustomerPage({
        ...this.listQuery,
        // areaIds,
        // areaType: 3,
        // customerTypes,
      })
        .then((res) => {
          const data = res.data;
          this.total = Number(data.count);
          this.dataList = data.data;
          this.listLoading = false;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 全部
    // getCustomerSupplierListAll () {
    //   this.listLoading = true;
    //   selectCustomerPage({
    //     ...this.listQuery,
    //     limit: 100000,
    //   })
    //     .then((res) => {
    //       this.dataListAll = res.data.data;
    //       this.listLoading = false;

    //     })
    //     .catch(() => {
    //       this.listLoading = false;
    //     });
    // },
    formatEnabled (row, column, cellValue, index) {
      return cellValue == 1 ? "启用" : cellValue == 0 ? "冻结" : "";
    },
    open () {
      this.checked = false
      this.listQuery.customerStoreIdNotInList = this.customerStoreIdNotInList
      this.listQuery.sysUserId = this.sysUserId
      this.getCustomerSupplierList();
      this.$nextTick(function () {
        let height =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 340;
        if (height > 100) {
          this.tableHeight = height;
        } else {
          this.tableHeight = 100;
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function () {
          let height =
            window.innerHeight - self.$refs.activityTable.$el.offsetTop - 340;
          if (height > 100) {
            self.tableHeight = height;
          } else {
            self.tableHeight = 100;
          }
        };
      });

    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        customerStoreSn: "",
        customerStoreName: "",
        areaIdList: [],//区域筛选
        sysUserId: '',//选择服务商
        customerStoreIdNotInList: [],
      });
      this.price = ''
      this.checked = false
      this.$refs.mychild.childmethod()
      this.$refs.activityTable.clearSelection();
      this.selectList = [];
      this.dialogVisible = false;
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "启用"
        : cellValue == 1
          ? "禁用"
          : "";
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
  margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button:nth-child(2) {
    margin-left: 30px;
  }
}
.el-form {
  padding: 0 20px;
}
.box-flex {
  display: flex;
  height: 55vh;
  .left {
    width: 240px;
  }
  .right {
    margin: 0px 20px;
    flex: 1;
    overflow-y: auto;
  }
}
.checked-box {
  margin: 10px 0px 10px 260px;
  display: flex;
  .x-left {
    padding-right: 10px;
    margin-top: 3px;
  }
  .x-right {
    margin-right: 20px;
    flex: 1;
    span {
      margin: 0px 20px 0px 0px;
      line-height: 1.8em;
      margin: 0px 20px 10px 0px;
      line-height: 1.8em;
      background: #f5f5f5;
      padding-right: 40px;
      padding: 2px 40px 2px 5px;
      position: relative;
      i {
        position: absolute;
        right: 3px;
        top: 3px;
      }
    }
  }
  .x-div {
    display: block;
    width: 100px;
    margin: 10px 0px 0px 0px;
  }
}
</style>
