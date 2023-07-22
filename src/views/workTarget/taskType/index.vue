<template>
  <div class="app-container">
    <div class="mt10 pb15 p_10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-plus"
                 @click="addWork('add')"
                 v-rules="{admin:'admin',ordinary:'task-type:add'}">新增</el-button>
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                border
                :height="tableHeight"
                ref="activityTable"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="类型名称"
                         align="center"
                         prop="taskTypeName"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="任务内容"
                         align="center"
                         prop="contentStr"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="停留(分钟）"
                         align="center"
                         prop="residentMinute"
                         show-overflow-tooltip
                         min-width="90">
          <template slot-scope="scope">
            <div>{{(scope.row.residentMinute || scope.row.residentMinute == 0) ? scope.row.residentMinute : '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="适用客户等级"
                         align="center"
                         prop="customerLevelStr"
                         show-overflow-tooltip
                         min-width="100"></el-table-column>
        <el-table-column label="生成规则"
                         align="center"
                         prop="taskTypeRuleStr"
                         show-overflow-tooltip
                         min-width="80"></el-table-column>
        <el-table-column label="状态"
                         align="center"
                         prop="isEnable"
                         :formatter="formatterIsEnable"
                         show-overflow-tooltip
                         min-width="80"></el-table-column>
        <el-table-column label="是否有待办任务"
                         align="center"
                         prop="isToDo"
                         :formatter="formatIsToDo"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="操作"
                         min-width="120"
                         align="center"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       v-if='scope.row.isEnable == 1'
                       v-rules="{admin:'admin',ordinary:'task-type:enable'}"
                       @click="enableDisable('enable', scope.row)">启用</el-button>
            <el-button type="text"
                       v-if='scope.row.isEnable == 0'
                       v-rules="{admin:'admin',ordinary:'task-type:enable'}"
                       @click="enableDisable('disable', scope.row)">禁用</el-button>
            <!--v-if='scope.row.isToDo == 1'-->
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'task-type:edit'}"
                       @click="addWork('update', scope.row)">编辑</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'task-type:del'}"
                       @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="typeList"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
      <addType :showDialog.sync="showAddDialog"
               @insertTask='typeList'
               :optionsValue='optionsValue'></addType>
    </div>
  </div>
</template>

<script>

import {
  typeList,
  changeUseStatus,
  taskDelete
} from "@/api/taskType";
import addType from './addType'
export default {
  components: {
    addType
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      tableHeight: 400,
      showAddDialog: false,
      optionsValue: {},
    };
  },
  mounted () {
    this.$nextTick(function () {
      // this.$refs.filter-container.offsetHeight
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
    this.typeList()
  },
  computed: {
    isDisabled () {
      return this.selectList.length < 1;
    },
  },
  methods: {
    // 获取列表
    typeList () {
      typeList(this.listQuery)
        .then(res => {
          this.dataList = res.data.data
          this.total = res.data.count;
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
    // 启用禁用
    enableDisable (status, rowInfor) {
      if (status == 'enable') { //启用
        changeUseStatus({ id: rowInfor.id, isEnable: 0 })
          .then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.typeList();
          })
          .catch(err => console.log(err));
      } else {//禁用
        changeUseStatus({ id: rowInfor.id, isEnable: 1 })
          .then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.typeList();
          })
          .catch(err => console.log(err));
      }
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
              this.typeList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    // 是否有待办0：没有、1：有
    formatIsToDo (row, column, cellValue, index) {
      return cellValue == 0 ? "否" : cellValue == 1 ? "是" : "";
    },
    // 是否启用，0启用，1禁用
    formatterIsEnable (row, column, cellValue, index) {
      return cellValue == 0 ? "启用" : cellValue == 1 ? "禁用" : "";
    }
  },
};
</script>

<style lang="scss" scoped>
.pb15 {
  padding-bottom: 15px;
  box-sizing: border-box;
}
</style>
