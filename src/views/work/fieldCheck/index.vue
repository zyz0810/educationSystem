<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.customerStoreName"
                  clearable
                  @change="querySignList"
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="选择部门"
                    prop="departIds">
        <el-cascader :options="deptList"
                     @change="querySignList"
                     :props="cascaderProps"
                     :show-all-levels="false"
                     v-model="listQuery.departIds"
                     clearable></el-cascader>
      </el-form-item>
      <el-form-item label="选择人员">
        <el-select filterable
                   @change="querySignList"
                   v-model="listQuery.sysUserId"
                   placeholder="请选择人员"
                   clearable>
          <el-option v-for="(item, index) in dataListAll"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="签到类型">
        <el-select filterable
                   @change="querySignList"
                   v-model="listQuery.signType"
                   placeholder="请选择签到类型"
                   clearable>
          <el-option v-for="(item, index) in signTypeList"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签退补录状态">
        <el-select filterable
                   @change="recondList"
                   v-model="listQuery.supplement"
                   placeholder="请选择签退补录状态"
                   clearable>
          <el-option v-for="(item, index) in supplementList"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      -->
      <el-form-item label="时间范围">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="querySignList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="querySignList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="record-box">
      <container ref="child"
                 v-if="activeName == 'all'"
                 claimType="ALL"
                 :listQuery="listQuery" />
    </div>
    <!--<el-tabs type="border-card"
             class="record-box"
             v-model="activeName">

    
         <el-tab-pane label="全部记录"
                   name="all">
        <container ref="child"
                   v-if="activeName == 'all'"
                   claimType="ALL"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="我的记录"
                   name="responsible">
        <container ref="child"
                   v-if="activeName == 'responsible'"
                   claimType="CHARGE"
                   :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="下属记录"
                   name="partake">
        <container ref="child"
                   v-if="activeName == 'partake'"
                   claimType="UNDERLING"
                   :listQuery="listQuery" />
      </el-tab-pane>
    
    </el-tabs>  -->
  </div>
</template>

<script>
import container from "./view";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import {
  getUsers,
  findDeptTree,
} from "@/api/system/staff";
export default {
  data () {
    return {
      listQuery: {
        signType: '',
        customerStoreName: '',
        departIds: [],
        sysUserId: "", //員工id
        searchStartTime: '',
        searchEndTime: '',
        deptId: "",//部门id
        limit: 10,
        page: 1,
        supplement: '',
      },
      listLoading: false,
      activeName: "all",
      dataListAll: [],//人员list
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
        children: "childrens",
      },
      // VISIT(0, "拜访"), TASK (1, "任务"), TEMP (2, "临时");
      signTypeList: [
        { label: '拜访签到', value: 'VISIT' },
        { label: '任务签到', value: 'TASK' },
        { label: '临时签到', value: 'TEMP' },
      ],
      supplementList: [
        { label: '待审核', value: '0' },
        { label: '已同意', value: '1' },
      ],
      // 部门插件 
      cascaderProps: {
        checkStrictly: true
      },
      deptList: [],
    };
  },
  components: {
    container
  },
  mounted () {
    this.getListAll();//人员
    this.findDeptTree();//部门
  },
  computed: {
    dateTime: {
      get () {
        if (this.listQuery.searchStartTime && this.listQuery.searchEndTime) {
          return [this.listQuery.searchStartTime, this.listQuery.searchEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.searchStartTime = v[0] + ' 00:00:00';
          this.listQuery.searchEndTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.searchStartTime = "";
          this.listQuery.searchEndTime = "";
        }
      }
    }
  },
  methods: {
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then((res) => {
          this.departmentList = res.data;
          this.paementIds = this.department(this.departmentList, []);
        })
        .catch((err) => console.log(err));
    },
    // 部门
    depart (value) {
      if (value) {
        this.listQuery.departIds = value[value.length - 1];
        this.recondList();
      }
    },
    // 部门筛选
    department (list, ids) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id,
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        ids.push(data);
      });
      return ids;
    },
    // 获取部门
    getdepartIds (val) {
      this.deptName = val.deptName;
      this.listQuery.departIds = val.id;
    },
    findDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    // 获取所有的用户列表
    getListAll () {
      let parm = {
        limit: 10000000,
        page: 1,
      }
      getUsers(parm)
        .then((res) => {
          this.dataListAll = res.data.data
        })
        .catch((err) => console.log(err));
    },
    querySignList () {
      this.listQuery.page = 1
      this.recondList()
    },
    recondList () {
      if (this.listQuery.departIds != '') {
        this.listQuery.deptId = this.listQuery.departIds.slice(-1).toString();
      }
      this.$refs.child.recondList();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        signType: '',
        customerStoreName: '',
        departIds: [],
        sysUserId: "", //员工id 
        searchStartTime: '',
        searchEndTime: '',
        deptId: "", //部门id
        page: 1,
        limit: 10,
        supplement: '',
      });
      this.deptName = ''
      this.time = "";
      this.recondList();
    },
  }
};
</script>

<style lang="scss" scoped>
.record-box {
  margin-top: 10px;
  background: white;
  padding: 10px 10px 30px 10px;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
/deep/.search_box .el-form-item {
  float: none;
}
</style>
