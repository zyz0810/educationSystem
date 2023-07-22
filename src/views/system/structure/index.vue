<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree :data="companyList"
                 :props="defaultProps"
                 @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="text-left">
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-plus"
                     v-rules="{admin:'admin',ordinary:'department:add'}"
                     @click="addStructure('add')">新增部门</el-button>
          <span class="ml_10 help"
                v-rules="{admin:'admin',ordinary:'department:add'}"
                @click="showHelpDialog = true">
            <i class="el-icon-question"></i>帮助提示
          </span>
        </div>
        <el-table v-loading="listLoading"
                  class="mt_20"
                  :data="dataList"
                  :height="tableHeight"
                  ref="activityTable"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="list => (selectList = list)"
                  border
                  @row-click="
            (row, column, event) => {
              $refs.activityTable.toggleRowSelection(row);
            }
          "
                  highlight-current-row>
          <el-table-column label="部门名称"
                           align="center"
                           min-width="120"
                           show-overflow-tooltip
                           prop="deptName"></el-table-column>
          <el-table-column label="成员数量"
                           align="center"
                           prop="userCount">
            <template slot-scope="scope">
              <a class="staff"
                 @click="staff(scope.row.id)">{{ scope.row.userCount || 0}}</a>
            </template>
          </el-table-column>
          <el-table-column label="负责人员"
                           align="center"
                           min-width="110"
                           show-overflow-tooltip
                           prop="leaderName"></el-table-column>
          <el-table-column label="部门描述"
                           align="center"
                           min-width="150"
                           show-overflow-tooltip
                           prop="remark"></el-table-column>
          <el-table-column min-width="140"
                           label="更新时间"
                           align="center"
                           :formatter="formatTime"
                           prop="updateTime"></el-table-column>
          <!-- v-if="permissions.includes('admin') || permissions.includes('department:edit') || permissions.includes('department:del') "-->
          <el-table-column label="操作"
                           v-if="permissions.includes('admin') || permissions.includes('department:edit') || permissions.includes('department:del')"
                           align="center"
                           min-width="100"
                           prop="remarks">
            <template slot-scope="scope">
              <el-button type="text"
                         v-rules="{admin:'admin',ordinary:'department:edit'}"
                         @click="addStructure('edit', scope.row)">编辑</el-button>
              <el-button type="text"
                         v-rules="{admin:'admin',ordinary:'department:del'}"
                         @click="deleteRow(scope.row.id, scope.$index,scope.row.userCount)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0"
                    :total="total"
                    @pagination="getDepts"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.limit"
                    class="text-right" />
        <!--新增编辑-->
        <addStructure :title="title"
                      :option="option"
                      :item="item"
                      @modify="getData"
                      :showDialog.sync="showAddDialog" />
        <el-dialog :visible.sync="showHelpDialog"
                   width="36%"
                   title="帮助提示">
          <div>
            <p>1、公司组织架构非常重要，部分管理功能以及数据权限是依赖于公司组织架构的，因此建议在正式使用产品前进行相关配置。</p>
            <p>2、部门组织架构支持多级，点击左侧层级列表可切换至查看对应部分的子级部门；</p>
            <p>3、需要删除部门时必须先清除该部分下的所有成员；</p>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button type="primary"
                       @click="showHelpDialog = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import addStructure from "./add";
import {
  findDeptTree,
  getDepts,
  deleteDept,
  updateEnabled
} from "@/api/structure";
export default {
  components: {
    addStructure
  },
  data () {
    return {
      showHelpDialog: false,
      showAddDialog: false,
      listQuery: {
        deptId: "",
        limit: 10,
        page: 1
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      companyList: [],
      defaultProps: {
        children: "childrens",
        label: "deptName"
      },
      dialogComponents: false,
      titlleDialog: "",
      contentDialog: "",
      option: "",
      title: "",
      item: {},
      tableHeight: 400
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 220;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 220;
      };
    });
    this.getDepts(); // 查询部门列表
    this.findDeptTree(); // 查询部门树
  },
  methods: {
    getData () {
      this.getDepts(); // 查询部门列表
      this.findDeptTree(); // 查询部门树
    },
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then(res => {
          this.companyList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 查询部门列表
    getDepts () {
      getDepts(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // 删除员工列表
    deleteRow (id, index, userCount) {
      userCount == undefined ? userCount = 0 : userCount = userCount
      if (userCount != 0) {
        this.$message({
          message: '该部门有成员，暂不能删除。',
          type: "warning"
        });
        return
      }
      let data = {
        deptId: id
      };
      this.hint("确定要删除该部门？").then(res => {
        if (res) {
          deleteDept(data).then(res => {
            this.$message({ message: res.resp_msg, type: "success" });
            this.dataList.splice(index, 1);
          });
        }
      });
    },
    // 用户状态修改
    handleStatusChange (row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        "确认要" + text + '"' + row.deptName + '"' + "用户吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function () {
          const { id, status } = row;
          return updateEnabled({ id, status });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 组织树切换
    handleNodeClick (data) {
      (this.listQuery.deptId = data.id), this.getDepts();
    },
    // 时间格式话
    formatTime (row, column, value, index) {
      return value ? this.$moment(value).format("YYYY-MM-DD HH:mm:ss") : "暂无";
    },
    addStructure (val, val2) {
      this.showAddDialog = true;
      this.option = val;
      this.item = val2;
      this.title = val == "add" ? "新增部门" : "编辑部门";
    },
    // 路由跳转
    staff (val) {
      this.$store.dispatch("set_sidebar_menu", "")
      this.$router.push({
        name: 'staff',
        query: {
          deptId: val
        }
      })
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/system/staff")
      })
    },
    open () { }
  }
};
</script>

<style lang="scss" scope>
.pagination-container {
  margin-top: 0px !important;
  padding: 30px 0px 0px;
  height: 45px;
}
.el-col {
  text-align: left !important;
  border-top: 0px !important;
  border-left: 0px !important;
}
.staff {
  color: #1890ff;
}
.help {
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  i {
    font-size: 14px;
    margin-right: 2px;
  }
}
//  部门树样式
.el-tree {
  padding: 10px 10px;
  .el-tree-node__content {
    line-height: 35px;
    height: 35px;
  }
}
</style>
