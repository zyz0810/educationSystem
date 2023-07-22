<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-select placeholder="请选择"
                 class="slelct-box"
                 @change="queryTemporaryTasksList"
                 v-model="listQuery.timeStatus"
                 filterable
                 clearable>
        <el-option label="发布时间"
                   :value="1"></el-option>
        <el-option label="执行时间"
                   :value="2"></el-option>
        <el-option label="完成时间"
                   :value="3"></el-option>
        <el-option label="截止时间"
                   :value="4"></el-option>
      </el-select>
      <el-date-picker v-model="dateTime"
                      value-format="yyyy-MM-dd"
                      clearable
                      class="slelct-box"
                      @change="queryTemporaryTasksList"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"></el-date-picker>

      <el-form-item label="任务状态">
        <el-select placeholder="任务状态"
                   @change="queryTemporaryTasksList"
                   v-model="listQuery.taskStatus"
                   clearable>
          <el-option v-for="item in statusList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务商">
        <el-select placeholder="服务商"
                   @change="queryTemporaryTasksList"
                   v-model="listQuery.sysUserId"
                   filterable
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联客户">
        <el-select placeholder="关联客户"
                   filterable
                   v-model.trim="listQuery.storeId"
                   @change="queryTemporaryTasksList"
                   clearable>
          <el-option v-for="(item, index) in customerList"
                     :key="index"
                     :label="item.customerStoreName"
                     :value="item.customerStoreId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryTemporaryTasksList"
                   type="primary"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetQuery"
                   icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 pb15 p_10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-plus"
                 @click="addWork('add')"
                 v-rules="{admin:'admin',ordinary:'task-content:add'}">新增</el-button>
      <el-table ref="activityTable"
                class="mt_20"
                v-loading="listLoading"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                row-key="id"
                border
                fit
                :height="tableHeight"
                highlight-current-row>
        <el-table-column label="任务标题"
                         align="center"
                         prop="taskTitle"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="关联客户"
                         align="center"
                         prop="storeNameAll"
                         show-overflow-tooltip
                         min-width="200"></el-table-column>
        <el-table-column label="服务商(执行人)"
                         align="center"
                         prop="sysUserName"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="截止时间"
                         align="center"
                         prop="expirationTime"
                         show-overflow-tooltip
                         min-width="140"></el-table-column>
        <el-table-column label="执行时间"
                         align="center"
                         prop="executionTime"
                         show-overflow-tooltip
                         min-width="140"></el-table-column>
        <el-table-column label="完成时间"
                         align="center"
                         prop="finishTime"
                         show-overflow-tooltip
                         min-width="140"></el-table-column>
        <el-table-column label="任务状态"
                         align="center"
                         prop="taskStatus"
                         :formatter="formatterTaskStatus"
                         show-overflow-tooltip
                         min-width="80"></el-table-column>
        <el-table-column label="发布人"
                         align="center"
                         prop="createUserName"
                         show-overflow-tooltip
                         min-width="80"></el-table-column>
        <el-table-column label="发布时间"
                         align="center"
                         prop="createTime"
                         min-width="140"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="操作"
                         min-width="200"
                         fixed="right"
                         align="center">
          <template slot-scope="scope">
            <!-- 任务状态;1:待接收,2:已驳回,3:待提交,4:待审核,5:已完成,6:已超时-->
            <el-button type="text"
                       :disabled='scope.row.taskStatus != 4'
                       v-rules="{admin:'admin',ordinary:'task-content:del'}"
                       @click="addWork('toExamine',scope.row)">审核</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'task-content:enable'}"
                       @click="addWork('look', scope.row)">详情</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'task-content:enable'}"
                       @click="addWork('copy', scope.row)">复制</el-button>
            <el-button type="text"
                       :disabled='scope.row.taskStatus != 1'
                       v-rules="{admin:'admin',ordinary:'task-content:edit'}"
                       @click="addWork('update', scope.row)">编辑</el-button>
            <el-button type="text"
                       :disabled='scope.row.taskStatus != 1'
                       v-rules="{admin:'admin',ordinary:'task-content:del'}"
                       @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="temporaryList"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
      <addWork :showDialog.sync="showAddDialog"
               @insertTask='temporaryList'
               :treeList='treeList'
               :userOptions='userOptions'
               :optionsValue='optionsValue'></addWork>
    </div>
  </div>
</template>

<script> 
import {
  contentList,
  contentDelete,
  changeUseStatus,
  changeSort
} from "@/api/taskContent";
import addWork from './addWork'
import {
  findAreaTree,
} from "@/api/area";
import {
  temporaryList,
  taskDelete,
  selectCustomerPage,
  getUsersProviderByRole,
} from "@/api/temporaryTasks";
export default {
  components: {
    addWork
  },
  data () {
    return {
      // 任务状态;1:待接收,2:待提交,3:待审核,4:已完成,5:已驳回,6:已超时
      // 任务状态;1:待接收,2:已驳回,3:待提交,4:待审核,5:已完成,6:已超时
      statusList: [
        { label: '待接收', value: '1' },
        { label: '已驳回', value: '2' },
        { label: '待提交', value: '3' },
        { label: '待审核', value: '4' },
        { label: '已完成', value: '5' },
        { label: '已超时', value: '6' },
      ],
      listQuery: {
        limit: 10,
        page: 1,
        timeStatus: 1,
        endTime: "",
        startTime: "",
        taskStatus: '',
        sysUserId: '',
        storeId: '',
      },
      supplierList: [],
      userOptions: [],
      total: 0,
      listLoading: false,
      dataList: [],
      tableHeight: 400,
      showAddDialog: false,
      optionsValue: {},
      treeList: [],
      userOptions: [],
      customerList: [],
    };
  },
  mounted () {
    this.$nextTick(function () {
      let height =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 220;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height =
          window.innerHeight - self.$refs.activityTable.$el.offsetTop - 220;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
    this.temporaryList()
    this.selectCustomerPage()//关联客户列表
    this.getUsersProviderByRole() //服务商列表
    this.getArea()
  },
  computed: {
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
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
  },
  methods: {
    // 获取列表
    temporaryList () {
      temporaryList(this.listQuery)
        .then(res => {
          this.dataList = res.data.data
          this.total = res.data.count || 0;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch(() => { });
    },
    addWork (status, val) {
      this.optionsValue = {
        status: status,
        rowList: val
      }
      this.showAddDialog = true
    },
    // 所有下拉用户列表数据
    getUsersProviderByRole () {
      let data = {};
      getUsersProviderByRole(data)
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
    // 获取关联客户列表
    selectCustomerPage () {
      selectCustomerPage({ limit: 10000000, page: 1 })
        .then(res => {
          this.customerList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    // 获取三级联动地区
    getArea () {
      findAreaTree().then((res) => {
        this.treeList = res.data;
      });
    },
    // 删除
    deleteRow (row) {
      this.$confirm("确定删除此条内容吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          taskDelete({ id: row.id })
            .then(res => {
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
              this.temporaryList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    //查询
    queryTemporaryTasksList () {
      this.listQuery.page = 1
      this.temporaryList()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        timeStatus: 1,
        endTime: "",
        startTime: "",
        taskStatus: '',
        sysUserId: '',
        storeId: '',
      });
      this.dateTime = "";
      this.temporaryList();
    },
    // 任务状态;1:待接收,2:已驳回,3:待提交,4:待审核,5:已完成,6:已超时
    formatterTaskStatus (row, column, cellValue, index) {
      return cellValue == 1 ? "待接收"
        : cellValue == 2 ? "已驳回"
          : cellValue == 3 ? "待提交"
            : cellValue == 4 ? "待审核"
              : cellValue == 5 ? "已完成"
                : cellValue == 6 ? "已超时"
                  : "";
    }
  },
};
</script>

<style lang="scss" scoped>
.pb15 {
  padding-bottom: 15px;
  box-sizing: border-box;
}
.slelct-box {
  margin: 10px 10px 0px 0px;
}
</style>
