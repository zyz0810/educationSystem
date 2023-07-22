<template>
  <div class="app-container">
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
        <el-table-column label="内容名称"
                         align="center"
                         prop="contentName"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="操作说明"
                         align="center"
                         prop="taskContentTypeStr"
                         show-overflow-tooltip
                         min-width="120"></el-table-column>
        <el-table-column label="排序"
                         align="center"
                         prop="sort"
                         class-name="sourceAllowDrag">
          <template>
            <i class="iconfont icon-bars move-icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         align="center"
                         prop="isEnable"
                         :formatter="formatterIsEnable"
                         show-overflow-tooltip
                         min-width="80"></el-table-column>
        <el-table-column label="操作"
                         min-width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-if='scope.row.isEnable == 1'
                       v-rules="{admin:'admin',ordinary:'task-content:enable'}"
                       @click="enableDisable('enable', scope.row)">启用</el-button>
            <el-button type="text"
                       v-if='scope.row.isEnable == 0'
                       v-rules="{admin:'admin',ordinary:'task-content:enable'}"
                       @click="enableDisable('disable', scope.row)">禁用</el-button>
            <!--canDelete 0不能删除，1可以删除-->
            <el-button type="text"
                       :disabled='scope.row.canDelete == 0'
                       v-rules="{admin:'admin',ordinary:'task-content:edit'}"
                       @click="addWork('update', scope.row)">编辑</el-button>
            <el-button type="text"
                       :disabled='scope.row.canDelete == 0'
                       v-rules="{admin:'admin',ordinary:'task-content:del'}"
                       @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addWork :showDialog.sync="showAddDialog"
               @insertTask='contentList'
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
import Sortable from "sortablejs";
export default {
  components: {
    addWork
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
      dictCode: '',
    };
  },
  mounted () {
    this.$nextTick(function () {
      let height =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 170;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height =
          window.innerHeight - self.$refs.activityTable.$el.offsetTop - 170;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
    this.contentList()
    this.sourceSort()
  },
  computed: {
    isDisabled () {
      return this.selectList.length < 1;
    },
  },
  methods: {
    sourceSort () {
      const el = this.$refs.activityTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = Sortable.create(el, {
        handle: ".sourceAllowDrag",
        onEnd: evt => {
          const targetRow = this.dataList.splice(evt.oldIndex, 1)[0];
          this.dataList.splice(evt.newIndex, 0, targetRow);
          for (let index in this.dataList) {
            this.dataList[index].dictSort = parseInt(index) + 1;
          }
          // let i;
          // if (parseInt(evt.oldIndex + 1) > parseInt(targetRow.sort)) {
          //   i = targetRow.sort;
          // } else if (
          //   parseInt(evt.oldIndex + 1) < parseInt(targetRow.sort)
          // ) {
          //   i = targetRow.sort + 1;
          // }
          let formData = {
            sort: evt.newIndex,
            id: targetRow.id,
          };
          changeSort(formData)
            .then(res => {
              this.contentList();
            })
            .catch(() => { });
        }
      });
    },
    // 获取列表
    contentList () {
      contentList(this.listQuery)
        .then(res => {
          this.dataList = res.data
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
            this.contentList();
          })
          .catch(err => console.log(err));
      } else {//禁用
        changeUseStatus({ id: rowInfor.id, isEnable: 1 })
          .then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.contentList();
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
          contentDelete({ id: row.id })
            .then(res => {
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
              this.contentList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
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
