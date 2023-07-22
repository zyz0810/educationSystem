<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="10vh"
             class="dialogContainer"
             @open="open"
             title="销售业绩完成详情">
    <div class="dialog-title">
      <div>时间：{{preamVal.assessmentDate}}</div>
      <div>目标金额：{{dataValue.performanceTarget || 0}}</div>
      <div>完成金额：{{dataValue.realPerformance || 0}}</div>
      <div>完成率：{{dataValue.compeletPercent}}</div>
    </div>
    <el-table class="moving-pin-box"
              :data="dataList"
              border
              height="300">
      <el-table-column prop="name"
                       min-width="110"
                       label="商品类目（发布分类）"
                       align="center"></el-table-column>
      <el-table-column prop="performanceTarget"
                       align="center"
                       label="目标金额（元）">
      </el-table-column>
      <el-table-column prop="realPerformance"
                       align="center"
                       label="成交金额（元）"></el-table-column>
      <el-table-column prop="performanceWeight"
                       align="center"
                       label="权重占比（%）">
        <template slot-scope="scope">
          <div>{{scope.row.performanceWeight || 0}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="compeletPercent"
                       align="center"
                       label="完成率">
      </el-table-column>
    </el-table>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
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
    salesCompletionValue: {
      required: true,
      type: Object,
      default: () => { },
    },
    preamVal: {
      required: true,
      type: Object,
      default: () => { },
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
      dataList: [],
      dataValue: {}
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
    // 查询销售业绩详情
    queryPermonceDetail () {
      queryPermonceDetail({
        ...this.listQuery,
      }).then(res => {
        this.dataValue = res.data
        this.dataList = res.data.performance;
        this.total = res.data.count || 0;
      });
    },
    open () {
      this.listQuery.assessmentDate = this.preamVal.assessmentDate
      this.listQuery.assessmentType = this.preamVal.assessmentType
      this.listQuery.providerId = this.preamVal.providerId
      this.queryPermonceDetail()
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
</style>