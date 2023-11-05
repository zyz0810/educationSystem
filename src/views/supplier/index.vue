<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.search_key"
                  clearable suffix-icon="el-icon-search"
                  @change="queryList"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="listQuery.month" value-format="yyyy-MM"
          @change="queryList"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.user_type" clearable placeholder="请选择" @change="queryList">
<!--          <el-option label="所有用户" value=""></el-option>-->
          <el-option v-for="(item, index) in userList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="">-->
<!--        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">-->
<!--          <el-option label="邀请人" value=""></el-option>-->
<!--          <el-option v-for="(item, index) in userList"-->
<!--                     :key="index"-->
<!--                     :label="item.name"-->
<!--                     :value="item.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
        <el-table-column label="个人姓名"
                         min-width="150"
                         align="left">
          <template slot-scope="scope">
            <span class="flex">
                <span class="header_img mr5">
                  <img :src="scope.row.portrait" alt=""/>
                </span>
            {{scope.row.name}}
            </span>

          </template>
        </el-table-column>
        <el-table-column label="ID"
                         min-width="70"
                         align="left"
                         show-overflow-tooltip
                         prop="user_id">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="mobile">
          <template slot-scope="scope">
            {{scope.row.mobile | phoneStart}}
          </template>
        </el-table-column>
        <el-table-column label="可提现金额"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="incoming_count">
        </el-table-column>
        <el-table-column label="本月汇总"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="incoming_per_month">
        </el-table-column>
        <el-table-column label="注册日期"
                         min-width="150"
                         align="left"
                         show-overflow-tooltip
                         prop="create_time">
        </el-table-column>
        <el-table-column label="邀请人"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="invitor_name">
          <template slot-scope="scope">
            {{scope.row.invitor_name}}（{{scope.row.invitor_Id}}）
          </template>
        </el-table-column>
        <el-table-column label="邀请码"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="invitor_code">
        </el-table-column>
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.pn"
                  :limit.sync="listQuery.rn"
                  @pagination="getList"
                  class="text-right" />
    </div>

  </div>
</template>

<script>
  import {suppliers,} from "@/api/supplier";

  export default {
    data () {
      return {
        // 0: all. 1: consult(咨询师) 2: user (普通家长)
        userList:[{id:0,name:'所有用户'},{id:1,name:'咨询师'},{id:2,name:'普通家长'},],
        listQuery: {
          search_key: "",
          month:"",
          user_type:0,
          rn: 10,
          pn: 1,
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
      this.getList();
    },
    methods: {
      // 获取客户列表
      getList () {
        suppliers({ ...this.listQuery, })
          .then(res => {
            this.dataList = res.data.total_num == 0 ? [] : res.data.users;
            // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
            this.total = res.data.total_num;
          })
          .catch(err => console.log(err));
      },
      queryList () {
        this.listQuery.pn = 1
        this.getList()
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
