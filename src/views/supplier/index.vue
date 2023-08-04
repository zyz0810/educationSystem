<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.key"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="listQuery.key"
          @change="queryCustomerList"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">
          <el-option label="所有用户" value=""></el-option>
          <el-option v-for="(item, index) in userList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">
          <el-option label="邀请人" value=""></el-option>
          <el-option v-for="(item, index) in userList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="container mt_10">
      <el-table v-loading="listLoading"
                :data="dataList"
                :max-height="tableHeight"
                ref="activityTable"
                :header-cell-style="{ background: '#F8F9FA' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column label="咨询师"
                         fixed="left"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="storeName">
          <template slot-scope="scope">
            <a class="link link_a link_b"
               @click="toDetail(scope.row)">
              {{ scope.row.storeName }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="ID"
                         min-width="60"
                         align="center"
                         prop="storeSn">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="center"
                         show-overflow-tooltip
                         prop="linkman"></el-table-column>
        <el-table-column label="收入金额"
                         width="100"
                         align="center"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="本月汇总"
                         width="100"
                         align="center"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="注册日期"
                         width="100"
                         align="center"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="邀请人"
                         width="100"
                         align="center"
                         prop="mobile">
        </el-table-column>

      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="customerList"
                  class="text-right" />
    </div>

  </div>
</template>

<script>
  import {customerList,} from "@/api/customer/customer";

  export default {
    data () {
      return {
        userList:[],
        listQuery: {
          key: "",
          limit: 10,
          page: 1,
        },
        total: 0,
        listLoading: false,
        selectList: [],
        dataList: [],
        tableHeight: 520,
        showDetail: false,
        infoData: {
          type:'',
          option:{},
        },
      };
    },

    computed: {},
    mounted () {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
        window.onresize = () => {
          this.tableHeight =
            window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
        };
      });
      this.customerList();
    },
    methods: {
      // 获取客户列表
      customerList () {
        customerList({ ...this.listQuery, })
          .then(res => {
            // this.dataList = res.data.data;
            this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
            this.total = res.data.count;
          })
          .catch(err => console.log(err));
      },
      queryCustomerList () {
        this.listQuery.page = 1
        this.customerList()
      },
    },
  };
</script>

<style lang="scss" scoped>
  /deep/.border-card {
    margin-top: 10px !important;
  }
  .iconfont::before {
    margin-right: 4px;
    font-size: 12px;
  }
  .filter-item {
    height: 38px;
  }
  /deep/.search_box .el-form-item {
    float: none;
  }
</style>
