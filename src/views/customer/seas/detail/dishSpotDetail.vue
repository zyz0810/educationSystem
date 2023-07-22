<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="85%"
             @close="close"
             top="10vh"
             title="盘点详情"
             :append-to-body="true"
             class="dialogContainer"
             @open="open">
    <div class="titleInfo">
      <div><span class="dis_box">已完成</span><span>{{ dataInfo.checkSn || "--" }}</span></div>
      <div><span class="dis_box">制单人</span><span>{{ dataInfo.userName || "--" }}</span></div>
      <div><span class="dis_box">制单时间</span><span> {{$moment(dataInfo.createTime).format("YYYY-MM-DD HH:MM:SS") || "--"}}</span></div>
      <div><span class="dis_box">备注</span><span>{{ dataInfo.remarks || "--" }}</span></div>
    </div>
    <div class="titleInfo m-tb20">
      <span class="dis_box">商品信息</span>
      <span> 盘点商品{{dataInfo.productTypeNum || 0}}种，实盘库存{{dataInfo.productPieceNum || 0}}件</span>
    </div>
    <el-table :data="wareslist"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              height="450"
              highlight-current-row
              ref="detailsList"
              :max-height="tableHeight">
      <el-table-column label="商品编码"
                       align="center"
                       prop="skuSn"></el-table-column>
      <el-table-column label="商品名称"
                       align="center"
                       prop="productName"></el-table-column>
      <el-table-column label="规格"
                       align="center"
                       prop="specification"></el-table-column>
      <el-table-column label="单价"
                       align="center"
                       prop="price"></el-table-column>
      <!--
      <el-table-column label="账面库存"
                       align="center"
                       prop="bookCheckStock">
        <template slot-scope="scope">
          <div>{{scope.row.bookCheckStock != null  ? scope.row.bookCheckStock : '-'}}</div>
        </template>
      </el-table-column>
    -->
      <el-table-column label="实盘库存"
                       align="center"
                       prop="realCheckStock"></el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="selectCheckItemPage" />
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  selectCheckItemPage,
} from "@/api/customer/customer";
export default {
  name: "orderView",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    checkId: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  data () {
    return {
      wareslist: [],
      listLoading: false,
      dataInfo: {},
      tableHeight: 400,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        checkId: '',
      },
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
    selectCheckItemPage () {
      this.listLoading = true;
      selectCheckItemPage(this.listQuery)
        .then(res => {
          if (res.resp_code == 0) {
            Object.assign(this.dataInfo, res.data);
            this.wareslist = res.data.data;
            this.total = res.data.count;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    tabClose () {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        window.onresize = () => {
          this.tableHeight =
            window.innerHeight - this.$refs.activityTable.$el.offsetTop - 260;
        };
      });
      this.dialogVisible = false;
    },
    open () {
      this.listQuery.checkId = this.checkId
      this.selectCheckItemPage();
    },
    formatType (row, column, cellValue, index) {
      return cellValue == 0
        ? "普通"
        : cellValue == 1
          ? "套餐"
          : cellValue == 2
            ? "赠品"
            : "";
    },
    close () {
      Object.assign(this.dataInfo, {});
      this.wareslist = [];
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>

.titleInfo {
  line-height: 25px;
  font-family: "Arial Normal", "Arial";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #666666;
  .dis_box {
    display: inline-block;
    width: 100px;
  }
}
.m-tb20 {
  margin: 20px 0px 10px 0px;
}
</style>
