<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="10vh"
             class="dialogContainer"
             @open="open"
             title="月度任务目标及执行情况明细">
    {{targetInfo}}
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="客户编号">
        <el-input v-model.trim="listQuery.customerName"
                  clearable
                  @change=""
                  placeholder="客户编号" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model.trim="listQuery.customerName"
                  clearable
                  @change=""
                  placeholder="客户名称" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   type="primary"
                   @click="queryList"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table class="moving-pin-box"
              :data="dataList"
              border
              height="300">
      <el-table-column prop="levelStore"
                       label="客户等级"
                       align="center"></el-table-column>
      <el-table-column prop="levelStore"
                       label="客户编号"
                       align="center"></el-table-column>
      <el-table-column prop="levelStore"
                       label="客户名称"
                       align="center"></el-table-column>
      <el-table-column prop="levelStore"
                       label="任务类型"
                       align="center"></el-table-column>
      <el-table-column prop="levelStore"
                       label="目标拜访次数"
                       min-width="110"
                       align="center"></el-table-column>
      <el-table-column prop="levelStore"
                       label="有效拜访次数"
                       min-width="110"
                       align="center"></el-table-column>
      <el-table-column prop="target"
                       align="center"
                       min-width="110"
                       label="实际拜访次数"></el-table-column>
      <el-table-column prop="target"
                       align="center"
                       min-width="130"
                       label="目标—单店销售额"></el-table-column>
      <el-table-column prop="realComplate"
                       align="center"
                       min-width="130"
                       label="有效—单店销售额">
        <template slot-scope="scope">
          <div>{{scope.row.realComplate || 0}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="completeRate"
                       align="center"
                       min-width="110"
                       label="实际销售额">
        <template slot-scope="scope">
          {{Number(scope.row.completeRate * 100).toFixed(2) || 0}}%
        </template>
      </el-table-column>
      <el-table-column prop="weight"
                       align="center"
                       min-width="110"
                       label="支付订单数">
        <template slot-scope="scope">
          {{scope.row.weight}}%
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getDetail"
                class="text-right" />
    <div class="total">
      <div>总计</div>
    </div>
    <div class="summary">
      <div class="y-left">
        业绩目标（总目标，含本月新客户）：￥100,000 已完成：￥89,000<br>
        拜访目标（当前查询）：232 已完成：120<br>
        动销率目标（当前查询）：65% 已完成：3%<br>
        销售额目标（当前查询）：￥23,000 已完成：￥21,000
      </div>
      <div class="y-right">
        业绩目标：￥100,000 已完成：￥89,000<br>
        拜访目标：232 已完成：120<br>
        动销率目标：- 目前动销率：-<br>
        销售额目标：￥23,000 已完成：￥21,000
      </div>
    </div>
    <span slot="footer"
          class="page_footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script> 
export default {
  components: {
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    targetInfo: {
      required: true,
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      total: 0,
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
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.getDetail();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        page: 1,
        limit: 10
      });
      this.getDetail()
    },
    // 获取详情
    getDetail () {

    },
    open () {
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
.summary {
  margin: 15px 0px 0px 0px;
  display: flex;
  justify-content: space-between;
  line-height: 1.6em;
  color: #666;
}
</style>