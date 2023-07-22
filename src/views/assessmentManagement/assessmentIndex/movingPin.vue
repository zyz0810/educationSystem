<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="10vh"
             class="dialogContainer"
             @open="open"
             title="门店动销数完成率详情">
    <el-table class="moving-pin-box"
              :data="dataList"
              border
              height="300">
      <el-table-column label="指标"
                       width="140"
                       align="right">
        <el-table-column prop="levelStr"
                         label="级别"
                         width="120"
                         align="left"></el-table-column>
      </el-table-column>
      <el-table-column prop="levelStore"
                       label="客户数"
                       align="center"></el-table-column>
      <el-table-column prop="target"
                       align="center"
                       label="动销率">
        <template slot-scope="scope">
          {{scope.row.target}}%
        </template>
      </el-table-column>
      <el-table-column prop="storeNum"
                       align="center"
                       label="目标数"></el-table-column>
      <el-table-column prop="realComplate"
                       align="center"
                       label="实际完成">
        <template slot-scope="scope">
          <div>{{scope.row.realComplate || 0}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="completeRate"
                       align="center"
                       label="完成率">
        <template slot-scope="scope">
          {{Number(scope.row.completeRate * 100).toFixed(2) || 0}}%
        </template>
      </el-table-column>
      <el-table-column prop="weight"
                       align="center"
                       label="权重">
        <template slot-scope="scope">
          {{scope.row.weight}}%
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { queryProviderSaleProductDetailV2 } from "@/api/serviceProfit";
import { providerAssessment } from "@/api/workCompletion";
export default {
  components: {
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    storeSalesInfo: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      listQuery: {
        orderIds: [],
        page: 1,
        limit: 10,
      },
      dataList: []
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
    open () {
      this.dataList = this.storeSalesInfo
    },
    close () {
      Object.assign(this.listQuery, {
        orderIds: [],
        page: 1,
        limit: 10,
      });
      this.dataList = []
      this.dialogVisible = false;
    },

  },
};
</script>

 <style scope>
.moving-pin-box thead.is-group th {
  background: none;
}
.moving-pin-box thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.moving-pin-box thead.is-group tr:first-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px;
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-57deg);
  transform-origin: top;
}
.moving-pin-box thead.is-group tr:last-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px;
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-56deg);
  transform-origin: bottom;
}
</style>