<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="职务名称">
        <el-input v-model.trim="listQuery.roleName"
                  clearable
                  @change="queryGetRoles"
                  placeholder="请输入职务名称" />
      </el-form-item>
      <el-form-item label="上级职务"
                    prop="parentId">
        <el-select placeholder="请选择"
                   filterable
                   @change="queryGetRoles"
                   v-model="listQuery.parentId"
                   clearable>
          <el-option v-for="(item, index) in superiorPosition"
                     :key="index"
                     :label="item.roleName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择部门"
                    prop="departIds">
        <el-cascader :options="deptList"
                     filterable
                     @change="getDepartId"
                     :props="cascaderProps"
                     :show-all-levels="false"
                     v-model="departIds"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryGetRoles">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 pading10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 v-rules="{admin:'admin',ordinary:'role:add'}"
                 icon="el-icon-plus"
                 @click="addStructure">新增职务</el-button>
      <span class="ml_10 help"
            v-rules="{admin:'admin',ordinary:'role:add'}"
            @click="showHelpDialog = true">
        <i class="el-icon-question"></i>帮助提示
      </span>
      <el-table :height="tableHeight"
                ref="activityTable"
                v-loading="listLoading"
                class="mt_20"
                :data="dataList"
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
        <el-table-column label="职务名称"
                         align="center"
                         min-width="100"
                         show-overflow-tooltip
                         prop="roleName">
        </el-table-column>
        <el-table-column label="成员数量"
                         align="center"
                         prop="userCount">
          <template slot-scope="scope">
            <a class="staff"
               @click="staff(scope.row.id)">{{ scope.row.userCount || 0 }}</a>
          </template>
        </el-table-column>
        <el-table-column label="上级职务"
                         align="center"
                         min-width="100"
                         show-overflow-tooltip
                         prop="parentRoleName"></el-table-column>
        <el-table-column label="所属部门"
                         align="center"
                         min-width="130"
                         show-overflow-tooltip
                         prop="deptName"></el-table-column>
        <el-table-column label="职务描述"
                         align="center"
                         min-width="150"
                         show-overflow-tooltip
                         prop="remark"></el-table-column>
        <el-table-column label="更新时间"
                         :formatter="formatTime"
                         min-width="135"
                         align="center"
                         prop="updateTime"></el-table-column>
        <el-table-column label="操作"
                         width="270"
                         align="center"
                         v-if="permissions.includes('admin') || permissions.includes('role:user:add') || permissions.includes('role:edit') || permissions.includes('role:set') || permissions.includes('role:del')"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'role:user:add'}"
                       @click="operation('add', scope.row)">添加人员</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'role:edit'}"
                       @click="operation('editJob', scope.row)">编辑职务</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'role:set'}"
                       @click="toDetail(scope.row)">设置权限</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'role:del'}"
                       @click="deleteRow(scope.row.id, scope.$index,scope.row.userCount)">删除职务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="getRoles"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
    </div>
    <el-dialog :visible.sync="showHelpDialog"
               width="36%"
               title="帮助提示">
      <div>
        <p>
          1、职务代表操作权限和数据权限，操作权限是指具有该职务的用户是否能查看、新增、编辑、删除某些数据，数据权限是指具有该角色的用户能操作的数据的范围；
        </p>
        <p>2、需要删除职务时必须先清除该职务下的所有成员；</p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="showHelpDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增-->
    <addAuthority @modify="getRoles"
                  :showDialog.sync="showAddDialog"
                  :option="optionType" />
    <!--操作-->
    <operation @modify="getRoles"
               :showDialog.sync="operationDialog"
               :tittle="tittle"
               :status="status"
               :item="item"></operation>
    <!--权限管理-->
    <detail @modify="getRoles"
            :showDialog.sync="showDetailDialog"
            :id="id" />
  </div>
</template>

<script>
import addAuthority from "./add";
import operation from "./operation";
import { getRoles, deleteRole } from "@/api/authority";
import detail from "./datail/index";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import { getRolesByRole, findDeptTree } from "@/api/system/staff";
import { mapState } from "vuex";
export default {
  components: {
    addAuthority,
    operation,
    detail
  },
  data () {
    return {
      optionType: "",
      showHelpDialog: false,
      showAddDialog: false,
      listQuery: {
        roleName: "",
        parentId: '',//上级id
        deptId: '',//部门id
        limit: 10,
        page: 1
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      dialogComponents: false,
      operationDialog: false, //操作弹窗
      titlleDialog: "",
      contentDialog: "",
      id: "",
      index: "",
      tittle: "",
      status: "",
      item: {},
      showChildren: "",
      showDetailDialog: false,
      tableHeight: 400,
      superiorPosition: [],//上级职务 
      // 部门插件 
      departIds: [],
      cascaderProps: {
        checkStrictly: true
      },
      deptList: [],
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
    this.getRoles();
    this.getRolesByRole();//上级职务
    this.findDeptTree()
  },
  methods: {
    getDepartId (val) {
      if (val != '') {
        this.listQuery.deptId = this.departIds.slice(-1).toString();
      }
      this.queryGetRoles();
    },
    // 选择部门
    findDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    // 上级职务
    getRolesByRole () {
      getRolesByRole()
        .then(res => {
          this.superiorPosition = res.data;
        })
        .catch(err => console.log(err));
    },
    toDetail (row) {
      const { id } = row;
      this.id = id;
      this.showDetailDialog = true;
    },
    //操作
    operation (val, val2) {
      this.status = val;
      this.item = val2;
      if (this.status == "add") {
        this.tittle = "职务中添加人员";
        this.operationDialog = true;
      } else if (this.status == "editJob") {
        this.operationDialog = true;
        this.tittle = "编辑职务";
      }
    },
    // 开启停用操作
    handleCommand (command) {
      this.status = command;
      this.operationDialog = true;
      if (this.status == "start") {
        this.tittle = "停用职务";
      } else if (this.status == "stop") {
        this.tittle = "启用职务";
      }
    },
    // 新增职务
    addStructure () {
      this.optionType = "add";
      this.showAddDialog = true;
    },
    // 获取用户列表
    getRoles () {
      getRoles(this.listQuery)
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
    // 删除职务信息
    deleteRow (id, index, userCount) {
      userCount == undefined ? userCount = 0 : userCount = userCount
      if (userCount != 0) {
        this.$message({
          message: '该职位有成员，暂不能删除。',
          type: "warning"
        });
        return
      }
      let data = {
        roleId: id
      };
      this.hint("确定要删除该职务？").then(res => {
        if (res) {
          deleteRole(data).then(res => {
            if (res.resp_code == 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.dataList.splice(index, 1);
            } else {
              this.$message({
                message: res.data.resp_msg,
                type: "warning"
              });
            }
          });
        }
      });
    },
    // 时间格式话
    formatTime (row, column, value, index) {
      return value ? this.$moment(value).format("YYYY-MM-DD HH:mm:ss") : "暂无";
    },
    queryGetRoles () {
      this.listQuery.page = 1
      this.getRoles()
    },
    // 重置
    resetList () {
      this.listQuery = {
        roleName: "",
        parentId: '',//上级id
        deptId: '',//部门id
        page: 1,
        limit: 10
      };
      this.departIds = ''
      this.getRoles();
    },
    // 路由跳转
    staff (val) {
      this.$store.dispatch("set_sidebar_menu", "")
      this.$router.push({
        path: '/system/staff',
        query: {
          roleId: val
        }
      })
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/system/staff")
      })
    },
    handleNodeClick (data) { }
  }
};
</script>

<style lang="scss" scope>
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
// 停止启用样式
.parents {
  position: relative;
  .children {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99999;
    div {
      padding: 5px 5px;
      border: 1px solid #dedede;
      color: #333;
    }
  }
}
.pading10 {
  padding: 10px 10px 20px;
}
</style>
