<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="搜索/ID/姓名/手机号" />
      </el-form-item>
      <el-form-item label="">
          <el-select v-model="listQuery.channel" clearable @change="queryCustomerList" placeholder="请选择">
            <el-option label="渠道无值" value=""></el-option>
<!--            <el-option v-for="(item, index) in channelList"-->
<!--                       :key="index"-->
<!--                       :label="item.name"-->
<!--                       :value="item.id"></el-option>-->
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

        <el-table-column label="个人姓名"
                         width="150"
                         align="left">
          <template slot-scope="scope">
            <span class="flex pointer blue01"  @click="handelDetail('detail', scope.row)">
                <span class="header_img mr5">
                  <img :src="scope.row.portrait" alt=""/>
                </span>
            {{scope.row.user_name}}
            </span>

          </template>
        </el-table-column>

        <el-table-column label="ID"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="user_id">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="性别"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
                         prop="sex" :formatter="formatterSex"></el-table-column>
        <el-table-column label="地域"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="city"></el-table-column>
        <el-table-column label="个人简介"
                         min-width="180"
                         align="left"
                         show-overflow-tooltip
                         prop="intro"></el-table-column>
        <el-table-column label="注册来源"
                         min-width="130"
                         align="left"
                         show-overflow-tooltip
                         prop="channel"></el-table-column>
        <el-table-column label="提交时间"
                         min-width="150"
                         align="left"
                         prop="create_time" :formatter="formatTime"></el-table-column>
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.pn"
                  :limit.sync="listQuery.rn"
                  @pagination="customerList"
                  class="text-right" />
    </div>
    <detail :showDialog.sync="showDetail"
            :infoData='infoData'
            @updateList='customerList' />
  </div>
</template>

<script>
  import {getaudituserlist,} from "@/api/parent";
  import detail from './detail';
  export default {
    data () {
      return {
        listQuery: {
          keyword: "",
          channel:"",
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
        channelList:[{id:'',name:'全部渠道'},{id:1,name:'超级管理员'},{id:2,name:'管理员'},{id:3,name:'供应商'},{id:4,name:'客服审核员'}]
      };
    },
    components: {detail},
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
      formatterSex (row, column, cellValue, index) {
        // 1男 2女
        return cellValue == 1 ? "男" : cellValue == 2? "女" : "";
      },
      formatTime (row, column, cellValue, index) {
        return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
      handelDetail (type, row) {
        this.showDetail = true
        this.infoData = {
          type:type,
          option:row==''?{}:row,
        }
      },
      // 获取客户列表
      customerList () {
        getaudituserlist({ ...this.listQuery, })
          .then(res => {
            this.dataList = res.data.total_num == 0 ? [] : res.data.list;
            // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
            this.total = res.data.total_num;
          })
          .catch(err => console.log(err));
      },

      queryCustomerList () {
        this.listQuery.pn = 1;
        this.customerList();
      },
      queryList(channel){
        this.listQuery.channel = channel;
        this.listQuery.pn = 1;
        this.customerList();
        console.log('11')
      },
    },
  };
</script>

<style lang="scss" scoped>
  .invite_ewm{
    display: block;
    width: 50px;
    height: 50px;
    img{
      width: 100%;
      height: 100%;
    }
  }

</style>
