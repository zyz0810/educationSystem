<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="10vh"
             title="查看业绩目标日志"
             class="dialogContainer"
             @open="open">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="员工姓名">
        <el-input v-model.trim="listQuery.userName"
                  placeholder="请输入员工姓名"
                  clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryDetail">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading"
              class="mt_10 sumTable"
              :data="logList"
              :header-cell-style="{ background: '#f5f7fa' }"
              :height="tableHeight"
              element-loading-text="拼命加载中"
              border
              ref="activityTable"
              highlight-current-row>
      <el-table-column label="操作人"
                       align="center"
                       show-overflow-tooltip
                       prop="optUserName">
        <template slot-scope="scope">
          <span>{{ scope.row.optUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       align="center"
                       min-width="110"
                       prop="createTime">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型"
                       align="center"
                       prop="optType"></el-table-column>
      <el-table-column label="员工姓名"
                       align="center"
                       show-overflow-tooltip
                       prop="userName"></el-table-column>
      <el-table-column label="年度"
                       align="center"
                       prop="year"></el-table-column>
      <el-table-column label="目标明细（1月-12月）"
                       min-width="200"
                       align="center"
                       prop="detail"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getDetail"
                class="text-right" />
    <div class="page_footer">
      <el-button class="ml_20"
                 @click="dialogVisible = false">返回</el-button>
    </div>
  </my-dialog>
</template>

<script>
import {
  logPage,
} from "@/api/performanceSetting";
export default {
  name: "log",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    logData: {
      required: true,
      type: Object,
      default: {
        type: "",
        rowInfor: {},
      },
    },
  },
  data () {
    return {
      total: 0,
      logList: [],
      tableHeight: 200,
      logId: "",
      listLoading: false,
      listQuery: {
        id: '',
        userName: '',
        limit: 10,
        page: 1,
      },
      userOptions: [],
    };
  },
  components: {
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.activityTable) {
        let height =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        if (height > 200) {
          this.tableHeight = height;
        } else {
          this.tableHeight = 200;
        }
      }

      window.onresize = () => {
        let height =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        if (height > 200) {
          this.tableHeight = height;
        } else {
          this.tableHeight = 200;
        }
      };
    });
  },
  methods: {
    // 查询
    queryDetail () {
      this.listQuery.page = 1
      this.getDetail();
    },
    // 重置
    resetList () {
      this.listQuery = {
        page: 1,
        limit: 10
      };
      this.getDetail();
    },
    formatType (row, column, cellValue, index) {
      return cellValue == 0
        ? "禁用"
        : cellValue == 1
          ? "启用"
          : cellValue == 2
            ? "新增"
            : cellValue == 3
              ? "编辑"
              : "";
    },
    getDetail () {
      this.listLoading = true;
      logPage(this.listQuery)
        .then((res) => {
          this.logList = res.data.data;
          this.total = res.data.count;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    open () {
      this.$nextTick(() => {
        if (this.$refs.activityTable) {
          let height =
            window.innerHeight - this.$refs.activityTable.$el.offsetTop - 350;

          if (height > 200) {
            this.tableHeight = height;
          } else {
            this.tableHeight = 200;
          }
        }
        window.onresize = () => {
          let height =
            window.innerHeight - this.$refs.activityTable.$el.offsetTop - 350;
          if (height > 200) {
            this.tableHeight = height;
          } else {
            this.tableHeight = 200;
          }
        };
      });
      if (this.logData.type == 'one') {
        this.listQuery.userName = this.logData.rowInfor.userName
        // this.listQuery.id = this.logData.rowInfor.id
      }
      this.getDetail()
    },
    close () {
      this.logList = [];
      this.listQuery = {
        id: '',
        userName: '',
        limit: 10,
        page: 1,
      }
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.treeBox {
  height: 140px;
  overflow: auto;
  border: 1px solid #c8e0f0;
  margin-right: 40px;
}
.app-container {
  height: calc(100vh - 100px);
  box-sizing: border-box;
  overflow: auto;
}
.dialogBox {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
