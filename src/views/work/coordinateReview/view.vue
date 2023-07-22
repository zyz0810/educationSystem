<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.customerStoreName"
                  clearable
                  @change="coordinatesAuditPage"
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item label="选择人员">
        <el-select placeholder="选择人员"
                   filterable
                   v-model.trim="listQuery.userId"
                   @change="coordinatesAuditPage"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select placeholder="选择审核状态"
                   filterable
                   v-model.trim="listQuery.state"
                   @change="coordinatesAuditPage"
                   clearable>
          <el-option v-for="(item, index) in statusList"
                     :key="index"
                     :label="item.status"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="dateTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="coordinatesAuditPage"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="coordinatesAuditPage">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card"
             class="m-t10">
      <div class="m-t10">
        <el-button class="filter-item"
                   icon="el-icon-plus"
                   v-rules="{ admin: 'admin', ordinary: 'office:point:verify:yes' }"
                   @click="approved('more','add')"
                   :disabled="isDisabled">审核通过</el-button>
        <el-button class="filter-item"
                   icon="el-icon-delete"
                   v-rules="{ admin: 'admin', ordinary: 'office:point:verify:no' }"
                   @click="auditFailed('more','add')"
                   :disabled="isDisabled">审核不通过</el-button>
        <el-table ref="activityTable"
                  v-loading="listLoading"
                  :data="dataList"
                  class="m-t20"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  element-loading-text="拼命加载中"
                  @selection-change="list => (selectList = list)"
                  border
                  :height="tableHeight"
                  @row-click="(row, column, event) => { $refs.activityTable.toggleRowSelection(row);} "
                  highlight-current-row>
          <el-table-column type="selection"
                           width="55"
                           align="center"></el-table-column>
          <el-table-column label="签到人员"
                           min-width="100"
                           show-overflow-tooltip
                           align="center"
                           prop="userName">
          </el-table-column>
          <el-table-column label="所属部门"
                           align="center"
                           min-width="130"
                           show-overflow-tooltip
                           prop="deptName">
          </el-table-column>
          <el-table-column label="签到地址"
                           align="center"
                           min-width="160"
                           show-overflow-tooltip
                           prop="signAddress">
            <template slot-scope="scope">
              <a class="link"
                 type="text"
                 @click.stop="checkInAddress(scope.row)">{{ scope.row.signAddress }}</a>
            </template>
          </el-table-column>
          <el-table-column label="关联客户"
                           align="center"
                           min-width="100"
                           show-overflow-tooltip
                           prop="customerStoreName">
            <template slot-scope="scope">
              <a class="link"
                 type="text"
                 @click.stop="associatedVisit( scope.row)">{{ scope.row.customerStoreName }}</a>
            </template>
          </el-table-column>
          <el-table-column label="申请内容"
                           show-overflow-tooltip
                           align="center"
                           min-width="160"
                           prop="applyContent"></el-table-column>
          <el-table-column label="申请时间"
                           width="140"
                           align="center"
                           prop="createTime"
                           :formatter="formatTime">
          </el-table-column>
          <el-table-column label="审核状态"
                           align="center"
                           prop="state">
            <template slot-scope="scope">
              <!--TO_AUDIT：待审核，SUCCESS：审核成功，FAIL：审核失败-->
              <a class="link"
                 type="text"
                 v-if='scope.row.state == "FAIL"'
                 @click.stop="auditFailed('one', 'look', scope.row)">审核失败</a>
              <div class=""
                   v-if='scope.row.state != "FAIL"'>
                {{scope.row.state == 'TO_AUDIT' ?'待审核' : scope.row.state == 'SUCCESS' ?'审核成功':'' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           min-width="150"
                           fixed="right">
            <template slot-scope="scope">
              <el-button type="text"
                         :disabled="['SUCCESS', 'FAIL', ].includes(scope.row.state)"
                         v-rules="{ admin: 'admin', ordinary: 'office:point:verify:yes' }"
                         @click.stop="approved('one','view', scope.row)">审核通过</el-button>
              <el-button type="text"
                         :disabled="['SUCCESS', 'FAIL', ].includes(scope.row.state)"
                         v-rules="{ admin: 'admin', ordinary: 'office:point:verify:no' }"
                         @click.stop="auditFailed('one', 'add',scope.row)">审核不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tabs>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="coordinatesAuditPage"
                class="text-right" />
    <!--审核不通过原因-->
    <addVisitTask :showDialog.sync="showAddDialog"
                  :typeOptions="typeOptions"
                  @insertTask="coordinatesAuditPage"></addVisitTask>
    <!--地图显示-->
    <checkInAddress :showDialog.sync='showMapDialog'
                    :mapInfor='mapInfor'></checkInAddress>
  </div>

</template>

<script>
import addVisitTask from "./addVisitTask";
import checkInAddress from "./checkInAddress";
import { coordinatesAuditPage, coordinatesAuditAudit } from "@/api/coordinateReview";
import { getUsersByRole } from "@/api/common";
import { mapGetters } from "vuex";
export default {
  props: {
  },
  components: {
    addVisitTask,
    checkInAddress
  },
  data () {
    return {
      tableHeight: 560,
      listLoading: false,
      taskType: "",
      showAddDialog: false,
      dataList: [],
      total: 0,
      selectList: [],
      typeOptions: {
        type: "",
        optionType: "",
        option: {},
        idList: [],
      },
      showMapDialog: false,
      visitTaskId: "",
      signType: '',
      listQuery: {
        customerStoreName: '',
        userId: '',
        state: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10
      },
      total: 0,
      listLoading: false,
      userOptions: [],
      statusList: [
        { status: '待审核', value: 'TO_AUDIT' },
        { status: '审核成功', value: 'SUCCESS' },
        { status: '审核失败', value: 'FAIL' },
      ],
      mapInfor: {},
    };
  },
  computed: {
    isDisabled () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some(item => ['SUCCESS', 'FAIL'].includes(item.state))
      );
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
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    },
    ...mapGetters(["permission_routes"])
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.tableHeight =
    //     window.innerHeight - this.$refs.activityTable.$el.offsetTop - 280;
    //   window.onresize = () => {
    //     this.tableHeight =
    //       window.innerHeight - this.$refs.activityTable.$el.offsetTop - 280;
    //   };
    // });
    let height =
      window.innerHeight - this.$refs.activityTable.$el.offsetTop - 280;
    if (height > 100) {
      this.tableHeight = height;
    } else {
      this.tableHeight = 100;
    }
    // 监听窗口大小变化
    const self = this;
    window.onresize = function () {
      let height =
        window.innerHeight - self.$refs.activityTable.$el.offsetTop - 280;
      if (height > 100) {
        self.tableHeight = height;
      } else {
        self.tableHeight = 100;
      }
    };
    this.coordinatesAuditPage(); // 获取任务列表
    this.getUsersByRole()
  },
  methods: {
    // 签到地址
    checkInAddress (val) {
      this.showMapDialog = true
      this.mapInfor = val
    },
    // 审核不通过
    auditFailed (status, type, val) {
      let idList = this.selectList.length == 0 ? [val.id] : this.selectList.map(item => item.id)
      this.typeOptions = {
        optionType: type,
        option: val,
        idList: idList
      };
      this.showAddDialog = true;
    },
    // 审核通过
    approved (status, val, val2) {
      let idList = this.selectList.length == 0 ? [val2.id] : this.selectList.map(item => item.id)
      this.hint("是否确认审核通过？").then(res => {
        if (res) {
          coordinatesAuditAudit({ idList: idList, state: 'SUCCESS' }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.coordinatesAuditPage();
          });
        }
      });
    },
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
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
    //关联跳转
    associatedVisit (val) {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          customerStoreId: val.customerStoreId,
        },
      });
      const arr = this.permission_routes.find((item) => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    // 办公-坐标审核-分页查询
    coordinatesAuditPage () {
      coordinatesAuditPage(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.total || res.data.count || 0;
        })
        .catch(err => console.log(err));
    },
    completeTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let ids = this.selectList.map(item => item.id);
          taskComplete({ ids: ids })
            .then(res => {
              this.listLoading = false;
              this.coordinatesAuditPage();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 重置
    resetList () {
      Object.assign(this.listQuery, {
        customerStoreName: '',
        userId: '',
        state: '',
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10
      });
      this.coordinatesAuditPage()
    }
  }
};
</script>

<style lang="less" scope>
.app-container {
  height: calc(100vh - 60px);
}
.m-t10 {
  margin-top: 10px;
}
.m-t20 {
  margin-top: 20px;
}
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.red {
  color: red;
}
.pagination-container {
  position: relative;
  height: 60px;
  margin-bottom: 10px;
  margin-top: -2px;
  padding: 10px 20px !important;
}
</style>
