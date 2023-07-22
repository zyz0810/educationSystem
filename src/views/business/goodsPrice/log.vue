<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="10vh"
             title="操作日志"
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
                       prop="supplierUpdateUser">
        <template slot-scope="scope">
          <span>{{scope.row.supplierUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间"
                       align="center"
                       prop="createTime">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型"
                       align="center"
                       :formatter="formatType"
                       prop="opType"></el-table-column>
    </el-table>
    <div class="page_footer">
      <el-button class="ml_20"
                 @click="dialogVisible = false">返回</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { productPriceLog } from "@/api/productPriceSale";
import { mapGetters } from "vuex";
import ScrollPane from "@/layout/components/TagsView/ScrollPane";

export default {
  name: "log",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    logData: {
      required: true,
      type: Object,
      default: {
        name: "",
        operatorType: "add",
        id: ""
      }
    }
  },
  data () {
    return {
      logList: [],
      textMap: {
        update: "编辑价格策略",
        add: "新增价格策略",
        view: "查看价格策略"
      },
      tableHeight: 200,
      logId: '',
      listLoading: false,
    };
  },
  components: {
    ScrollPane,
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
  },
  mounted () {
    this.$nextTick(() => {

      if (this.$refs.activityTable) {
        let height =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
        if (height > 200) {
          this.tableHeight = height;
        } else {
          this.tableHeight = 200;
        }
      }


      window.onresize = () => {
        let height =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 250;
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
      return cellValue == 0 ? "禁用" : cellValue == 1 ? "启用" : cellValue == 2 ? "新增" : cellValue == 3 ? "编辑" : "";
    },
    getDetail () {
      this.listLoading = true;
      productPriceLog({ strategyId: this.logId })
        .then(res => {
          this.logList = res.data
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    open () {
      const { id, operatorType, option } = this.logData;
      this.logId = id;
      this.getDetail();
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

    },
    close () {
      this.logList = []
      this.dialogVisible = false;
    }
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
