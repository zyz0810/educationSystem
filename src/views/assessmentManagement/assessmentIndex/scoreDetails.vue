<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             :append-to-body="true"
             top="10vh"
             class="dialogContainer"
             @open="open"
             title="员工考核得分详情">
    <div class="staff-title">{{scoreInfo.userName}} {{scoreInfo.month}} </div>
    <div class="collapse tab-name">
      <div class="b-border">
        <div class="e-box"
             @click="showTabDialog = !showTabDialog">
          <div class="list-title">
            <div class="t-div2 t-width">
              <div>本月业绩/月度业绩目标：</div>
              <div>￥{{performance.complete || 0.00}}/￥{{performance.target || 0.00}}</div>
            </div>
            <div class="t-div">
              <div>权重：</div>
              <el-input disabled
                        v-model="performance.weight">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最低完成率：</div>
              <el-input disabled
                        v-model="performance.minProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div style="width:175px"></div>
            </div>
            <div class="t-div">
              <div>得分：</div>
              <el-input disabled
                        v-model="performance.score">
              </el-input>
            </div>
          </div>
          <div class="list-title">
            <div class="t-div t-width">客户拜访得分统计</div>
            <div class="t-div">
              <div>权重：</div>
              <el-input disabled
                        v-model="customerVisit.weight">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最低完成率：</div>
              <el-input disabled
                        v-model="customerVisit.minProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最高完成率：</div>
              <el-input disabled
                        v-model="customerVisit.maxProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>得分：</div>
              <el-input disabled
                        v-model="customerVisit.score">
              </el-input>
            </div>
          </div>
          <i class='icon'
             :class="!showTabDialog ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></i>
        </div>
        <div v-if='showTabDialog'
             class="e-table">
          <el-table :data="customerVisitDetailList"
                    ref="activityTable"
                    :row-class-name="tableRowClassName"
                    @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row);}"
                    :summary-method="getSummaries"
                    :show-summary="true"
                    border>
            <el-table-column prop="customerLevelName"
                             align="center"
                             label="客户等级"></el-table-column>
            <el-table-column prop="customerQuantity"
                             align="center"
                             label="客户数"></el-table-column>
            <el-table-column prop="target"
                             align="center"
                             min-width="140"
                             label="单客户目标(次)"></el-table-column>
            <el-table-column prop="totalTarget"
                             align="center"
                             min-width="140"
                             label="总目标(次)">
              <template slot-scope="scope">
                <div>{{scope.row.totalTarget || 0}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="validVisit"
                             align="center"
                             min-width="140"
                             label="有效拜访(次)">
              <template slot="header">
                <span>有效拜访(次)</span>
                <el-tooltip popper-class="tooltip"
                            placement="top">
                  <i class="el-icon-question"></i>
                  <div slot="content"
                       class="tooltip-content">
                    <div>有效拜访次数为目标内的拜访次数，</div>
                    <div>超过的部分不算</div>
                  </div>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <div>{{scope.row.validVisit || 0}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="weight"
                             align="center"
                             label="权重%">
              <template slot-scope="scope">
                {{scope.row.weight}}
              </template>
            </el-table-column>
            <el-table-column prop="score"
                             align="center"
                             label="得分"></el-table-column>

          </el-table>
        </div>
      </div>
      <div class="b-border">
        <div class="e-box"
             @click="showTabDialog2 = !showTabDialog2">
          <div class="list-title">
            <div class="t-div t-width">动销率得分</div>
            <div class="t-div">
              <div>权重：</div>
              <el-input disabled
                        v-model="storeSales.weight">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最低完成率：</div>
              <el-input disabled
                        v-model="storeSales.minProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最高完成率：</div>
              <el-input disabled
                        v-model="storeSales.maxProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>得分：</div>
              <el-input disabled
                        v-model="storeSales.score">
              </el-input>
            </div>
          </div>
          <i class='icon'
             :class="!showTabDialog2 ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></i>
        </div>
        <div v-if='showTabDialog2'
             class="e-table">
          <el-table class="moving-pin-box"
                    :data="storeSalesDetailList"
                    :row-class-name="tableRowClassName"
                    ref="activityTable"
                    @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row);}"
                    :summary-method="getSummaries2"
                    :show-summary="true"
                    border>
            <el-table-column prop="customerLevelName"
                             align="center"
                             label="客户等级"></el-table-column>
            <el-table-column prop="customerQuantity"
                             align="center"
                             label="客户数"></el-table-column>
            <el-table-column prop="storeSalesRate"
                             min-width="140"
                             align="center"
                             label="动销率目标(%)"></el-table-column>
            <el-table-column prop="storeSalesTarget"
                             align="center"
                             min-width="140"
                             label="门店动销目标（个）">
              <template slot-scope="scope">
                <div>{{scope.row.storeSalesTarget || 0}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="storeSalesComplete"
                             align="center"
                             min-width="140"
                             label="完成门店动销（个）">
              <template slot-scope="scope">
                <div>{{scope.row.storeSalesComplete || 0}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="weight"
                             align="center"
                             label="权重%">
              <template slot-scope="scope">
                {{scope.row.weight || 0}}
              </template>
            </el-table-column>
            <el-table-column prop="score"
                             align="center"
                             label="得分"></el-table-column>

          </el-table>
        </div>
      </div>
      <div class="b-border">
        <div class="e-box"
             @click="showTabDialog3 = !showTabDialog3">
          <div class="list-title">
            <div class="t-div t-width">单店销售额得分</div>
            <div class="t-div">
              <div>权重：</div>
              <el-input disabled
                        v-model="storeAverage.weight">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最低完成率：</div>
              <el-input disabled
                        v-model="storeAverage.minProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>最高完成率：</div>
              <el-input disabled
                        placeholder=""
                        v-model="storeAverage.maxProportion">
              </el-input>%
            </div>
            <div class="t-div">
              <div>得分：</div>
              <el-input disabled
                        placeholder=""
                        v-model="storeAverage.score">
              </el-input>
            </div>
          </div>
          <i class='icon'
             :class="!showTabDialog3 ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></i>
        </div>
        <div v-if='showTabDialog3'
             class="e-table">
          <el-table class="moving-pin-box"
                    :data="storeAverageDetailList"
                    :row-class-name="tableRowClassName"
                    ref="activityTable"
                    @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row);}"
                    :summary-method="getSummaries3"
                    :show-summary="true"
                    border>
            <el-table-column prop="customerLevelName"
                             align="center"
                             label="客户等级"></el-table-column>
            <el-table-column prop="customerQuantity"
                             align="center"
                             label="客户数"></el-table-column>
            <el-table-column prop="target"
                             align="center"
                             min-width="140"
                             label="单店销售目标(元)"></el-table-column>
            <el-table-column prop="totalTarget"
                             align="center"
                             min-width="140"
                             label="单店销售总目标(元)">
            </el-table-column>
            <el-table-column prop="complete"
                             align="center"
                             min-width="140"
                             label="完成总销售额（元）">
            </el-table-column>
            <el-table-column prop="weight"
                             align="center"
                             label="权重%">
            </el-table-column>
            <el-table-column prop="score"
                             align="center"
                             label="得分"></el-table-column>

          </el-table>
        </div>
      </div>
    </div>
    <div class="total-score">
      <span>总得分：</span>
      <el-input v-model="scoreInfo.totalScore"
                disabled
                placeholder="请输入内容"></el-input>
    </div>
    <!--
   <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
 -->
  </my-dialog>
</template>

<script>
import { queryPermonceDetail } from "@/api/workCompletion";
export default {
  components: {
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    scoreInfo: {
      required: true,
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      listQuery: {
        assessmentDate: '',
        assessmentType: '',
        providerId: '',
        page: 1,
        limit: 10,
      },
      dataList: [{}, {}, {}, {}],
      dataValue: {},
      activeNames: [],
      totalScore: '999',
      input: 1,
      showTabDialog: false,
      showTabDialog2: false,
      showTabDialog3: false,
      performance: {},//销售业绩
      customerVisit: {},//客户拜访
      storeSales: {}, //门店动销率
      storeAverage: {}, //单店销售额
      performanceDetailList: [],
      customerVisitDetailList: [],
      storeSalesDetailList: [],
      storeAverageDetailList: [],
    };
  },
  mounted () {

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
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    // 总计
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          !values.every((value) => isNaN(value)) &&
          (column.property == "score")
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number(prev) + curr;
              } else {
                return Number(prev);
              }
            }, 0)
            .toFixed(2);
        } else if (column.property == "customerQuantity" || column.property == "totalTarget" ||
          column.property == 'validVisit') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + curr;
            } else {
              return Number(prev);
            }
          }, 0);
        } else if (column.property == "target" || column.property == "weight") {
          sums[index] = '-';
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getSummaries2 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          !values.every((value) => isNaN(value)) &&
          (column.property == "score")
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number(prev) + curr;
              } else {
                return Number(prev);
              }
            }, 0)
            .toFixed(2);
        } else if (column.property == "customerQuantity" || column.property == "storeSalesTarget" ||
          column.property == "storeSalesComplete") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + curr;
            } else {
              return Number(prev);
            }
          }, 0);
        } else if (column.property == "storeSalesRate" || column.property == "weight") {
          sums[index] = '-';
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    getSummaries3 (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          !values.every((value) => isNaN(value)) &&
          (column.property == "totalTarget" ||
            column.property == "complete" || column.property == "score")
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return Number(prev) + curr;
              } else {
                return Number(prev);
              }
            }, 0)
            .toFixed(2);
        } else if (column.property == "customerQuantity") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + curr;
            } else {
              return Number(prev);
            }
          }, 0);
        } else if (column.property == "target" || column.property == "weight") {
          sums[index] = '-';
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    handleChange (val) {
      console.log(val);
    },
    // 查询销售业绩详情
    queryPermonceDetail () {
      this.dataList = [{}, {}, {}, {}];
    },
    open () {
      console.log(this.scoreInfo)
      this.performance = this.scoreInfo.performance//销售业绩
      this.customerVisit = this.scoreInfo.customerVisit//客户拜访
      this.storeSales = this.scoreInfo.storeSales //门店动销率
      this.storeAverage = this.scoreInfo.storeAverage //单店销售额
      // this.performanceDetailList = this.scoreInfo.performance.detailList
      this.customerVisitDetailList = this.scoreInfo.customerVisit.detailList
      this.storeSalesDetailList = this.scoreInfo.storeSales.detailList
      this.storeAverageDetailList = this.scoreInfo.storeAverage.detailList
    },
    close () {
      Object.assign(this.listQuery, {
        assessmentDate: '',
        assessmentType: '',
        providerId: '',
        page: 1,
        limit: 10,
      });
      this.dataValue = {}
      this.dataList = []
      this.dialogVisible = false;
    },

  },
};
</script>

 <style lang='scss' scope>
/deep/.el-dialog__body {
  padding: 20px 20px 0px;
}
.dialog-title {
  display: flex;
  div {
    padding-right: 20px;
    margin: 0px 0px 20px 0px;
  }
}
.staff-title {
  margin: 0px 0px 20px 0px;
  border-bottom: 2px solid #1890ff;
  padding: 0px 0px 15px 0px;
}
.total-score {
  display: flex;
  align-items: center;
  margin: 20px 0px 0px 0px;
  .el-input {
    width: 200px;
  }
}
.tab-name {
  height: 55vh;
  overflow-y: scroll;
}
.b-border {
  border-bottom: 1px solid #dedede;
  margin-bottom: 15px;
  padding-bottom: 15px;
}
.e-box {
  position: relative;
  box-sizing: border-box;
  .list-title {
    color: #666;
    display: flex;
    align-items: center;
    margin: 0px 0px 15px 0px;
    .t-div {
      display: flex;
      margin: 0px 20px 0px 0px;
      align-items: center;
      .el-input {
        width: 80px;
        flex: 1;
        box-shadow: 0px 12px 6px -10px #d0cbcb;
        // box-shadow: 1px 1px 5px #d0cbcb;
      }
    }
    .t-width {
      width: 200px;
    }
    .t-div2 {
      margin: 0px 20px 0px 0px;
    }
  }
  .icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%, -50%);
  }
}
.e-table {
  margin: 0px 15px 0px 0px;
}
.el-table .warning-row {
  background: #f4f9ff;
}

.el-table .success-row {
  background: #f4f9ff;
}
.el-table__footer-wrapper {
  /deep/td {
    background: white !important;
  }
}
</style>