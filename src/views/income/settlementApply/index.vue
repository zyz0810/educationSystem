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
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">
          <el-option label="全部状态" value=""></el-option>
          <el-option v-for="(item, index) in userList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="container mt_10">
      <div v-if="selectList.length > 0" class="mb_10">
        <span class="mr10 f12 choose_span">已选择<span class="blue01 bold choose_num">{{selectList.length}}</span>条<i class="el-icon-close gray01 ml5"></i></span>
        <el-button type="primary" plain>批量同意</el-button>
        <el-button type="primary" plain>批量结算</el-button>
        <el-button type="primary" plain>批量导出</el-button>
      </div>
      <el-table v-loading="listLoading"
                :data="dataList"
                :max-height="tableHeight"
                ref="activityTable"
                :header-cell-style="{ background: '#F8F9FA' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                :row-key=" (row) => { return row.id; }  "
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column :reserve-selection="true"
                         fixed
                         type="selection"></el-table-column>
        <el-table-column label="个人姓名"
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
  import {getProfits,} from "@/api/income";

  export default {
    data () {
      return {
        userList:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
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
        getProfits({ ...this.listQuery, })
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
 .choose_span{
   color: #3D3D3D;
   padding-right: 5px;
   border-right: 1px solid #ccc;
   .choose_num{
     margin: 0 3px;
   }
 }
</style>
