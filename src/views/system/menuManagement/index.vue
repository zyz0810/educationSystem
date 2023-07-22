<template>
  <div class="app-container">

    <div class="p_10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-plus"
                 v-rules="{admin:'admin',ordinary:'menu:add'}"
                 @click="getDetail('add')">新增</el-button>

      <el-table class="mt10"
                v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{background:'#f5f7fa'}"
                element-loading-text="拼命加载中"
                border
                ref="activityTable"
                :height="tableHeight"
                fit
                highlight-current-row
                row-key="id"
                :indent="20"
                :tree-props="{children: 'childrens', hasChildren: 'hasChildren'}">
        <el-table-column fixed
                         label="菜单名称"
                         prop="name"></el-table-column>
        <el-table-column label="类型"
                         align="center"
                         prop="menuType"
                         :formatter="formatType"></el-table-column>
        <el-table-column label="排序"
                         align="center"
                         prop="sort"></el-table-column>
        <el-table-column label="权限标识"
                         align="center"
                         prop="permission"></el-table-column>
        <el-table-column label="更新时间"
                         align="center"
                         prop="updateTime"
                         :formatter="formatTime"></el-table-column>
        <!--        <el-table-column label="更新人" align="center" prop=""></el-table-column>-->
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="getDetail('addChild',scope.row)"
                       v-rules="{admin:'admin',ordinary:'menu:add'}">新增</el-button>

            <el-button type="text"
                       @click="getDetail('update',scope.row)"
                       v-rules="{admin:'admin',ordinary:'menu:eidt'}">编辑</el-button>
            <el-button type="text"
                       @click="handleDelete(scope.row)"
                       v-rules="{admin:'admin',ordinary:'menu:del'}">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addMenu ref="child"
               :showDialog.sync="showAddDialog"
               :rowInfo="rowInfo"
               @modify='getTreeList'
               :menuList="dataList" />

    </div>
  </div>
</template>

<script>
import addMenu from "./add";
import { findTreeList, deleteMenu } from "@/api/system/menu";
import { mapState } from "vuex";
export default {
  components: {
    addMenu,
  },
  data () {
    return {
      optionType: "",
      showAddDialog: false,
      listLoading: false,
      dataList: [],
      tableHeight: 400,
      rowInfo: {},
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 160;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 160;
      };
      this.$refs.activityTable.doLayout();
    });
    this.getTreeList()
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),


  },
  updated () {
    this.$refs.activityTable.doLayout()
  },
  methods: {
    // 菜单类型:0目录,1菜单,2按钮
    formatType (row, column, cellValue, index) {
      return cellValue == 0
        ? "目录"
        : cellValue == 1
          ? "菜单"
          : cellValue == 2
            ? "按钮"
            : "";
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    getTreeList () {
      this.listLoading = true;
      findTreeList().then(res => {
        this.dataList = res.data;
        this.listLoading = false;
      })
    },
    getDetail (status, rowInfo) {
      this.rowInfo = {
        operatorType: status,
        optionInfo: rowInfo
      }
      this.showAddDialog = true
    },


    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).catch();
    },
    // 删除
    handleDelete (row) {
      this.hint('是否确认删除名称为"' + row.name + '"的数据项？？').then(res => {
        if (res) {
          deleteMenu({ menuId: row.id }).then(res => {
            if (res.resp_code == 0) {
              this.getTreeList();
              this.$message({ message: res.resp_msg, type: "success" });
            }

          });
        }
      });
    },


  }
};
</script>

<style lang="scss" scoped>
.choose-input {
  border: 1px solid #dedede;
  padding: 0px 10px;
  box-sizing: border-box;
  height: 34px;
  width: 160px;
  line-height: 34px;
  color: #999;
  .span2 {
    color: #333;
  }
}
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
/deep/.iconfont {
  margin-right: 8px !important;
}
</style>
