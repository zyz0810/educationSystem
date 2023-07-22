<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   v-model.trim="listQuery.userId"
                   @change="qureyList"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门"
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
                 v-rules="{admin:'admin',ordinary:'examine-setting:add'}"
                 @click="getDetail('add')">新增</el-button>
      <el-table class="mt10 "
                v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                :summary-method="getSummaries"
                :show-summary="true"
                ref="activityTable"
                :height="tableHeight"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="姓名"
                         align="center"
                         width="120"
                         :show-overflow-tooltip="true"
                         prop="userName"></el-table-column>
        <el-table-column label="部门"
                         align="center"
                         :show-overflow-tooltip="true"
                         width="130"
                         prop="departmentName"></el-table-column>
        <el-table-column label="A"
                         align="center"
                         width="100"
                         prop="A">
          <template slot-scope="scope">
            <div>{{scope.row.levelTargetList[0] || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="B"
                         align="center"
                         width="100"
                         prop="B">
          <template slot-scope="scope">
            <div>{{scope.row.levelTargetList[1] || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="C"
                         align="center"
                         width="100"
                         prop="C">
          <template slot-scope="scope">
            <div>{{scope.row.levelTargetList[2] || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="D"
                         align="center"
                         width="100"
                         prop="D">
          <template slot-scope="scope">
            <div>{{scope.row.levelTargetList[3] || 0}}</div>
          </template>
        </el-table-column>
        <el-table-column label="销售业绩"
                         align="center">
          <el-table-column label="业绩目标（元）"
                           align="center"
                           min-width="120"
                           prop="performanceTargetAmount">
            <template slot-scope="scope">
              <div>{{scope.row.performanceTargetAmount || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重%"
                           align="center"
                           prop="performanceWeight">
            <template slot-scope="scope">
              <div>{{scope.row.performanceWeight || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="客户拜访"
                         align="center">
          <el-table-column label="客户拜访（次）"
                           align="center"
                           min-width="120"
                           prop="visitQuantity">
            <template slot-scope="scope">
              <div>{{scope.row.visitQuantity || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重%"
                           align="center"
                           prop="visitQuantityWeight">
            <template slot-scope="scope">
              <div>{{scope.row.visitQuantityWeight || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="门店动销率"
                         align="center">
          <el-table-column label="门店动销(个)"
                           align="center"
                           min-width="120"
                           prop="storeSaleQuantity">
            <template slot-scope="scope">
              <div>{{scope.row.storeSaleQuantity || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重%"
                           align="center"
                           prop="storeSalesRateWeight">
            <template slot-scope="scope">
              <div>{{scope.row.storeSalesRateWeight || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="单店销售额"
                         align="center">
          <el-table-column label="总单店销售（元）"
                           align="center"
                           min-width="140"
                           prop="storeAverageAmount">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverageAmount || 0}}</div>
            </template>
          </el-table-column>
          <el-table-column label="权重%"
                           align="center"
                           prop="storeAverageWeight">
            <template slot-scope="scope">
              <div>{{scope.row.storeAverageWeight || 0}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="修改人"
                         min-width="100"
                         show-overflow-tooltip
                         align="center"
                         prop="updateUserName">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         min-width="180"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'examine-setting:edit' }"
                       @click.stop="getDetail('update',scope.row)">编辑</el-button>
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'examine-setting:view' }"
                       @click.stop="getDetail('view',scope.row)">查看</el-button>
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'examine-setting:copy' }"
                       @click.stop="getDetail('copy',scope.row)">复制</el-button>
            <el-button type="text"
                       v-rules="{ admin: 'admin', ordinary: 'examine-setting:journal' }"
                       @click="goLog('goods',scope.row)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="settingPage"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
      <addStaff ref="child"
                :showDialog.sync="showAddDialog"
                :rowInfo="rowInfo"
                @modify='settingPage'
                :userOptions='userOptions' />
      <log :showDialog.sync="dialogLogVisible"
           :logData="logData" />
    </div>
  </div>
</template>

<script>
import addStaff from "./add";
import log from "./log";
import { getCascaderOptions } from "@/utils/common";
import {
  getUsers,
  deleteSysUser,
  findDeptTree,
  advertisementStatusOpenOrClose
} from "@/api/system/staff";
import { getUsersByRole } from "@/api/common";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import { mapState } from "vuex";
import {
  settingPage,
  statistical
} from "@/api/appraisalIndicatorSetting";
export default {
  components: {
    addStaff,
    log
  },
  data () {
    return {
      optionType: "",
      showAddDialog: false,
      showDepartmentDialog: false,
      listQuery: {
        userId: '',
        departmentId: "", //部门id 
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
      dialogLogVisible: false,
      logData: {},
      rowInfo: {},
      statisticalInfo: {},
      levelTargetList: {}
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
      };
    });
    this.settingPage(); // 获取用户列表
    this.getListAll(); // 获取用户列表
    this.getUsersByRole();//上级职务
    this.findDeptTree()
    this.getFindDeptTree()
    this.statistical()
    // 防止table错位
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
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
  updated () {
    this.$refs.activityTable.doLayout()
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
  },
  methods: {
    getDetail (status, rowInfo) {
      this.rowInfo = {
        operatorType: status,
        optionInfor: rowInfo
      }
      this.showAddDialog = true
    },
    // 查看日志
    goLog (val, rowInfor) {
      this.logData = {
        type: val,
        rowInfor: rowInfor,
      };
      this.dialogLogVisible = true;
    },
    // 总计
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "查询总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == "A") {
          sums[index] = this.levelTargetList[0];
        } else if (column.property == "B") {
          sums[index] = this.levelTargetList[1];
        } else if (column.property == "C") {
          sums[index] = this.levelTargetList[2];
        } else if (column.property == "D") {
          sums[index] = this.levelTargetList[3];
        } else if (column.property == "performanceTargetAmount") {
          sums[index] = this.statisticalInfo.performanceTargetAmount;
        } else if (column.property == "storeAverageAmount") {
          sums[index] = this.statisticalInfo.storeAverageAmount;
        } else if (column.property == "storeSaleQuantity") {
          sums[index] = this.statisticalInfo.storeSaleQuantity;
        } else if (column.property == "visitQuantity") {
          sums[index] = this.statisticalInfo.visitQuantity;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getDepartId (val) {
      if (val != '') {
        this.listQuery.departmentId = this.departIds.slice(-1).toString();
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
    // 部门
    depart (value) {
      if (value) {
        this.listQuery.departmentId = value[value.length - 1];
        this.settingPage();
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
      this.listQuery.departmentId = val.id;
    },
    // 获取用户列表
    settingPage () {
      settingPage(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch(err => console.log(err));
    },
    // 统计
    statistical () {
      statistical(this.listQuery)
        .then(res => {
          this.statisticalInfo = res.data
          this.levelTargetList = res.data.levelTargetList
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
              this.settingPage();
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
    qureyList () {
      this.listQuery.page = 1
      this.settingPage()
    },
    // 重置
    resetList () {
      this.listQuery = {
        userId: '',
        departmentId: "", //部门id 
        page: 1,
        limit: 10
      };
      this.departIds = ''
      this.settingPage();
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
