<template>
  <div>
    <el-form :inline="true"
             class="search_box serarch">
      <el-form-item label="盘点单号">
        <el-input v-model.trim="listQuery.checkSn"
                  clearable
                  @change="querySelectCustomerCheck"
                  placeholder="盘点单号" />
      </el-form-item>
      <el-form-item label="制单时间">
        <el-date-picker v-model="createTime"
                        value-format="yyyy-MM-dd"
                        clearable
                        type="daterange"
                        @change="querySelectCustomerCheck"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="querySelectCustomerCheck"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table class="mt_20"
              :data="dataList"
              v-loading="listLoading"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              ref="activityTable"
              @row-click="
        (row, column, event) => {$refs.activityTable.toggleRowSelection(row);}"
              height="290"
              highlight-current-row>
      <el-table-column label="盘点单号"
                       align="center"
                       width="160"
                       prop="checkSn"></el-table-column>
      <el-table-column label="商品种类（种）"
                       align="center"
                       prop="productTypeNum"></el-table-column>
      <el-table-column label="制单人"
                       align="center"
                       prop="userName"></el-table-column>
      <el-table-column label="制单时间"
                       align="center"
                       :formatter="formatTime"
                       prop="createTime"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="90">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="getDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="selectCustomerCheck" />
    <dishSpotDetail :showDialog.sync="showDialog"
                    :checkId="checkId" />
  </div>
</template>

<script>
import {
  selectCustomerCheck,
} from "@/api/customer/customer";
import dishSpotDetail from "./dishSpotDetail";
export default {
  props: {
    customerStoreId: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  components: {
    dishSpotDetail
  },
  data () {
    return {
      dataList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        createTime: '',
        endTime: '',
        checkSn: '',
      },
      listLoading: false,
      showDialog: false,
      dataInfo: {},
      checkId: "",
    };
  },
  computed: {
    createTime: {
      get () {
        if (this.listQuery.createTime && this.listQuery.endTime) {
          return [this.listQuery.createTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.createTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.createTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
  },
  mounted () {
    this.selectCustomerCheck();
  },
  methods: {
    getCreateTime (e) {
      this.listQuery.createTime = e + ' 23:59:59'
      this.selectCustomerCheck();
    },
    selectCustomerCheck () {
      this.listLoading = true;
      selectCustomerCheck({
        ...this.listQuery,
        customerStoreId: this.customerStoreId
      }).then(res => {
        this.listLoading = false;
        const data = res.data;
        this.dataList = data.data;
        Object.assign(this.dataInfo, data);
        this.total = data.count;
      });
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    getDetail (row) {
      const { id } = row;
      this.checkId = id;
      this.showDialog = true;
    },
    querySelectCustomerCheck () {
      this.listQuery.page = 1
      this.selectCustomerCheck()
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        page: 1,
        limit: 10,
        createTime: '',
        endTime: '',
        checkSn: '',
      });
      this.selectCustomerCheck();
    },
  }
};
</script>

<style lang="scss" scope>
.serarch {
  padding: 0px 0px !important;
}
</style>
