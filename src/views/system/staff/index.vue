<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="姓名">
        <el-input v-model.trim="listQuery.nickname"
                  @change="qureyList"
                  clearable
                  placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model.trim="listQuery.mobile"
                  @change="qureyList"
                  clearable
                  placeholder="请输入手机" />
      </el-form-item>
      <el-form-item label="直属上级">
        <el-select placeholder="请选择直属上级"
                   filterable
                   v-model.trim="listQuery.leaderId"
                   @change="qureyList"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="部门"
                    prop="deptId">
        <el-cascader :options="paementIds"
                     change-on-select
                     v-model="listQuery.deptId"
                     :props="propsParm"
                     @change="depart"
                     clearable></el-cascader>
      </el-form-item> 
       -->
      <el-form-item label="部门"
                    prop="departIds">
        <el-cascader :options="deptList"
                     filterable
                     @change="getDepartId"
                     :props="cascaderProps"
                     :show-all-levels="false"
                     v-model="departIds"></el-cascader>
      </el-form-item>
      <el-form-item label="职务">
        <el-select filterable
                   @change="qureyList"
                   v-model="listQuery.roleId"
                   placeholder="请选择职务"
                   clearable>
          <el-option v-for="(item, index) in rolesList"
                     :key="index"
                     :label="item.roleName"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工状态">
        <el-select v-model="listQuery.enabled"
                   @change="qureyList"
                   placeholder="请选择员工状态"
                   filterable
                   clearable>
          <el-option label="启用"
                     value="0"></el-option>
          <el-option label="禁用"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推广状态">
        <el-select v-model="listQuery.advertisementStatus"
                   @change="qureyList"
                   placeholder="请选择推广状态"
                   filterable
                   clearable>
          <el-option label="开启"
                     value="0"></el-option>
          <el-option label="关闭"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateTime"
                        format="yyyy - MM - dd "
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        filterable
                        @change="qureyList"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="qureyList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 p_10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-plus"
                 v-rules="{admin:'admin',ordinary:'sysuser:add'}"
                 @click="addStaff('add')">新增员工</el-button>
      <el-button class="filter-item"
                 v-rules="{admin:'admin',ordinary:'sysuser:update:dept'}"
                 icon="iconfont icon-ziyuanldpi"
                 :disabled="isDisabled"
                 @click="updateDepartment('修改部门', 'department')">修改部门</el-button>
      <el-button class="filter-item"
                 icon="iconfont icon-qunzuduoren"
                 :disabled="isDisabled"
                 v-rules="{admin:'admin',ordinary:'sysuser:update:role'}"
                 @click="updateDepartment('修改职务', 'job')">修改职务</el-button>
      <el-button class="filter-item"
                 icon="iconfont icon-times-circle"
                 :disabled="isDisabled"
                 v-rules="{admin:'admin',ordinary:'sysuser:enable'}"
                 @click="updateDepartment('禁用', 'disable')">禁用</el-button>
      <el-button class="filter-item"
                 icon="iconfont icon-duihao2"
                 :disabled="isDisabled"
                 v-rules="{admin:'admin',ordinary:'sysuser:enable'}"
                 @click="updateDepartment('启用', 'enable')">启用</el-button>
      <el-button class="filter-item"
                 icon="iconfont icon-pencil"
                 :disabled="isDisabled"
                 v-rules="{admin:'admin',ordinary:'sysuser:edit'}"
                 @click="addStaff('update')">编辑</el-button>
      <el-button class="filter-item"
                 icon="iconfont icon-zhongzhimima"
                 :disabled="isDisabled"
                 v-rules="{admin:'admin',ordinary:'sysuser:reset:password'}"
                 @click="updateDepartment('重置密码', 'resetPassword')">重置密码</el-button>
      <el-button class="filter-item"
                 icon="el-icon-delete"
                 v-rules="{admin:'admin',ordinary:'sysuser:del'}"
                 :disabled="isDisabled"
                 @click="deleteRow()">删除</el-button>
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                border
                :height="tableHeight"
                ref="activityTable"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column label="姓名"
                         min-width="120"
                         show-overflow-tooltip
                         align="center"
                         prop="nickname"></el-table-column>
        <el-table-column label="性别"
                         align="center"
                         prop="sex"
                         :formatter="formatPrint"></el-table-column>
        <el-table-column label="部门"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
                         prop="deptName"></el-table-column>
        <el-table-column label="职务"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
                         prop="roleName"></el-table-column>
        <el-table-column label="手机"
                         width="100"
                         align="center"
                         prop="username"></el-table-column>
        <el-table-column label="直属上级"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
                         prop="leaderName"></el-table-column>
        <el-table-column label="所在地区"
                         min-width="160"
                         show-overflow-tooltip
                         align="center"
                         prop="areaName"></el-table-column>
        <el-table-column label="服务商级别"
                         align="center"
                         min-width="100"
                         prop="providerType"
                         show-overflow-tooltip
                         :formatter="formatterType"></el-table-column>
        <el-table-column label="服务商类型"
                         align="center"
                         min-width="100"
                         prop="providerCategory"
                         :formatter="formatterProviderCategory"></el-table-column>
        <el-table-column label="员工状态"
                         align="center"
                         prop="status"
                         :formatter="formatStatus"></el-table-column>
        <el-table-column label="入职时间"
                         align="center"
                         width="140"
                         prop="joinDate"
                         :formatter="formatTime">
          <template slot-scope="scope">
            <div>{{parseTime(scope.row.joinDate )|| parseTime(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="最后登录"
                         align="center"
                         width="140"
                         prop="loginDate"
                         :formatter="formatTime"></el-table-column>
        <el-table-column width="140"
                         label="创建时间"
                         align="center"
                         prop="createTime"
                         :formatter="formatTime"></el-table-column>
        <el-table-column label="推广状态"
                         align="center"
                         fixed="right"
                         width="120"
                         v-if="permissions.includes('admin') || permissions.includes('sysuser:extension:status') "
                         prop="advertisementStatus">
          <template slot-scope="scope">
            <div @click.stop>
              <el-switch v-rules="{admin:'admin',ordinary:'sysuser:extension:status'}"
                         v-model="scope.row.advertisementStatus"
                         @change="handelState(scope.$index, scope.row)"
                         :active-value="0"
                         :inactive-value="1"></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="160"
                         align="center"
                         prop="remarks"
                         v-if="permissions.includes('admin') || permissions.includes('sysuser:edit') || permissions.includes('sysuser:enable') || permissions.includes('sysuser:del')"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'sysuser:edit'}"
                       @click.stop="addStaff('update',scope.row.id,scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 0"
                       icon="el-icon-circle-close-outline"
                       type="text"
                       v-rules="{admin:'admin',ordinary:'sysuser:enable'}"
                       @click.stop="updateDepartment('禁用', 'disable',scope.row)">禁用</el-button>
            <el-button v-else
                       type="text"
                       v-rules="{admin:'admin',ordinary:'sysuser:enable'}"
                       @click="updateDepartment('启用', 'enable')">启用</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'sysuser:del'}"
                       @click.stop="deleteRow(scope.row.id, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="getList"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
      <addStaff ref="child"
                :showDialog.sync="showAddDialog"
                :selectList="selectList"
                @modify="getList"
                :areaList="areaList"
                :departmentList="departmentList"
                :rolesList="rolesList"
                :dataListAll="dataListAll"
                :option="optionType" />
      <updateDepartment :title="title"
                        :role="role"
                        :rolesList="rolesList"
                        @modify="getList"
                        :selectList="selectList"
                        :departmentList="departmentList"
                        :showDialog.sync="showDepartmentDialog" />
    </div>
  </div>
</template>

<script>
import addStaff from "./add";
import updateDepartment from "./updateDepartment";
import { findAreaTree } from "@/api/area";
import { getCascaderOptions } from "@/utils/common";
import {
  getUsers,
  getRoles,
  deleteSysUser,
  findDeptTree,
  advertisementStatusOpenOrClose
} from "@/api/system/staff";
import { getUsersByRole } from "@/api/common";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import { mapState } from "vuex";
export default {
  components: {
    addStaff,
    updateDepartment
  },
  data () {
    return {
      optionType: "",
      showAddDialog: false,
      showDepartmentDialog: false,
      listQuery: {
        nickname: "",
        mobile: "",
        leaderId: "",//员工上级id
        deptId: "", //部门id
        roleId: "", //职务id
        enabled: "", //账号状态
        startTime: "",
        endTime: "",
        advertisementStatus: '',
        limit: 10,
        page: 1
      },
      total: 0,
      listLoading: false,
      title: "",
      role: "",
      selectList: [],
      dataList: [],
      dataListAll: [],
      rolesList: [],
      dialogFormVisible: false,
      deptName: "",
      time: "",
      dialogComponents: false,
      titlleDialog: "",
      contentDialog: "",
      departmentList: [],
      paementIds: [],
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      tableHeight: 400,
      areaList: [],
      userOptions: [],
      // 部门插件 
      departIds: [],
      cascaderProps: {
        checkStrictly: true
      },
      deptList: [],
    };
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
    this.listQuery.deptId = this.$route.query.deptId; //部门
    this.listQuery.roleId = this.$route.query.roleId; //职务
    this.getList(); // 获取用户列表
    this.getListAll(); // 获取用户列表
    this.getRoles(); //获取职位
    this.getUsersByRole();//上级职务
    this.findDeptTree()
    this.getFindDeptTree()
    this.findAreaTree() //获取地区
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    isDisabled () {
      return this.selectList.length < 1;
    },
    dateTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0];
          this.listQuery.endTime = v[1];
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    }
  },
  methods: {
    getDepartId (val) {
      if (val != '') {
        this.listQuery.deptId = this.departIds.slice(-1).toString();
      }
      this.qureyList();
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;
          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    handelState (index, row) {
      let flag = row.advertisementStatus; //保存点击之后v-modeld的值(true，false)
      row.advertisementStatus = !row.advertisementStatus; //保持switch点击前的状态
      let providerStatus = flag == 0 ? 'OPEN' : 'CLOSE'
      let paras = {
        id: row.id,
        providerStatus: providerStatus
      };
      advertisementStatusOpenOrClose(paras)
        .then(res => {
          if (res.resp_code == 0) {
            row.advertisementStatus = !row.advertisementStatus;
            this.getList();
            // 逻辑处理
            this.$message({ message: res.resp_msg, type: "success" });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => { });
    },
    //`STAFF(0,"业务员"),
    // CITY_PARTNER(1,"合伙人"),
    // REGIONAL_AGENTS(2,"服务商")
    formatterType (row, column, cellValue, index) {
      return cellValue == 0
        ? "业务员"
        : cellValue == 1
          ? "合伙人"
          : cellValue == 2
            ? "服务商"
            : "";
    },
    // 服务商类型 0是个人 1是企业
    formatterProviderCategory (row, column, cellValue, index) {
      return cellValue == 0
        ? "个人"
        : cellValue == 1
          ? "企业"
          : "";
    },
    // 获取省市区
    findAreaTree () {
      findAreaTree()
        .then(res => {
          this.areaList = getCascaderOptions(res.data, []);
        })
        .catch(err => {
        });
    },
    // 部门
    depart (value) {
      if (value) {
        this.listQuery.deptId = value[value.length - 1];
        this.getList();
      }
    },
    // 部门筛选
    department (list, ids) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        ids.push(data);
      });
      return ids;
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.listQuery.deptId = val.id;
    },
    // 获取职位
    getRoles () {
      getRoles({
        limit: 1000000,
        page: 1
      })
        .then(res => {
          this.rolesList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    // 获取用户列表
    getList () {
      getUsers(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    // 获取所有的用户列表
    getListAll () {
      this.listQuery.limit = 10000000;
      getUsers(this.listQuery)
        .then(res => {
          this.dataListAll = res.data.data;
        })
        .catch(err => console.log(err));
      this.listQuery.limit = 10;
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
    deleteRow (id, index) {
      let arrs = this.selectList;
      let b = [];
      arrs.forEach((item, index) => {
        b.push(item.id);
      });
      this.id = id || b;
      let data = {
        ids: this.id
      };
      this.hint("确定要删除选中员工？").then(res => {
        if (res) {
          deleteSysUser(data).then(res => {
            this.$message({ message: res.resp_msg, type: "success" });
            if (data.ids.length > 1) {
              this.getList();
            } else {
              this.dataList.splice(index, 1);
            }
          });
        }
      });
    },
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then(res => {
          this.departmentList = res.data;
          this.paementIds = this.department(this.departmentList, []);
        })
        .catch(err => console.log(err));
    },
    // 选择部门
    getFindDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    // 性别转化
    formatPrint (row, column, sex, index) {
      return sex == 0 ? "男" : sex == 1 ? "女" : "--";
    },
    // 时间格式话
    formatTime (row, column, value, index) {
      return value ? this.$moment(value).format("YYYY-MM-DD HH:mm:ss") : "暂无";
    },
    // 状态格式化
    formatStatus (row, column, value, index) {
      return value == 0 ? "启用" : value == 1 ? "禁用" : "--";
    },
    qureyList () {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置
    resetList () {
      this.listQuery = {
        nickname: "",
        mobile: "",
        leaderId: "",//员工上级id
        deptId: "", //部门id
        roleId: "", //职务id
        enabled: "", //账号状态
        startTime: "",
        endTime: "",
        advertisementStatus: '',
        page: 1,
        limit: 10
      };
      this.departIds = ''
      this.deptName = this.time = "";
      this.getList();
    },
    // 新增编辑员工
    addStaff (val, id, val3) {
      if (id) {
        //操作中的编辑
        this.optionType = val;
        this.showAddDialog = true;
        this.$refs.child.parentMsg(id);
        this.selectList = [];
        this.selectList = [val3];
      } else {
        if (val != "add") {
          //菜单栏中的编辑
          if (this.selectList.length == 1) {
            this.optionType = val;
            this.showAddDialog = true;
            this.$refs.child.parentMsg(this.selectList[0].id);
          } else if (this.selectList.length > 1) {
            this.$message({
              message: "不能同时编辑多个员工信息",
              type: "warning"
            });
          }
        } else {
          this.optionType = val;
          this.showAddDialog = true;
        }
      }
    },
    // 其他操作
    updateDepartment (val, val2, val3) {
      if (val3) {
        //操作中的禁用
        this.selectList = [];
        this.selectList = [val3];
      } else {
      }
      this.showDepartmentDialog = true;
      this.title = val;
      this.role = val2;
    }
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
