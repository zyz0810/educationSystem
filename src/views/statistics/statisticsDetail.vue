<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="80%"
             @close="close"
             top="15vh"
             class="dialogContainer"
             @open="open"
             title="详情">
    <el-table v-loading="listLoading"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              highlight-current-row>
      <el-table-column label="客户名称"
                       align="center"
                       prop="customerStoreName"></el-table-column>
      <el-table-column label="支付金额"
                       align="center"
                       prop="payPrice"></el-table-column>
      <el-table-column label="支付订单"
                       align="center"
                       prop="orderCnt"></el-table-column>
      <!--
      <el-table-column label="退款金额"
                       align="center"
                       prop="refundPrice"></el-table-column>
      <el-table-column label="退款订单"
                       align="center"
                       prop="refundOrderCnt"></el-table-column>
    -->
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="queryWebDetailByClerk"
                class="text-right" />
    <div class="page_footer">
      <el-button @click="cancel">关闭</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { queryWebDetailByClerk } from "@/api/statistics";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    detailData: {
      required: true,
      type: [Object, Array],
      default: {
        clerkId: "",
        orderTime: ""
      }
    }
  },
  data () {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        clerkId: "",
        orderTime: ""
      },
      total: 0,
      dataList: [],
      listLoading: false
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  methods: {
    queryWebDetailByClerk () {
      this.listLoading = true;
      queryWebDetailByClerk(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    cancel () {
      this.dialogVisible = false;
    },
    open () {
      Object.assign(this.listQuery, this.detailData);
      this.queryWebDetailByClerk();
    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        clerkId: "",
        orderTime: ""
      });
      this.dataList = [];
      this.dialogVisible = false;
    }
  },
  mounted () { }
};
</script>

<style scoped lang="scss">
</style>
