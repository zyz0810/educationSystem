<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="10vh"
             title="查看日志"
             class="dialogContainer"
             @open="open">
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
                       prop="optUserName">
        <template slot-scope="scope">
          <span>{{ scope.row.optUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       align="center"
                       prop="createTime">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型"
                       align="center"
                       prop="optType"></el-table-column>
    </el-table>
    <pagination @pagination="getLogo"
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
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
} from "@/api/appraisalIndicatorSetting";
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
      logList: [],
      tableHeight: 200,
      logId: "",
      listLoading: false,
      listQuery: {
        id: '',
        limit: 10,
        page: 1,
      },
      total: 0,
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
    getLogo () {
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
      this.listQuery.id = this.logData.rowInfor.id;
      this.getLogo()
    },
    close () {
      this.logList = [];
      this.listQuery = {
        id: '',
        limit: 10,
        page: 1,
      },
        this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogBox {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/deep/.el-table {
  height: 55vh !important;
}
</style>
