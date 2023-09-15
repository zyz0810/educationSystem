<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="标题/关键词" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">
          <el-option label="全部" value=""></el-option>
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
        <el-table-column label="举报人"
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
        <el-table-column label="被投诉人"
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
        <el-table-column label="举报订单"
                         min-width="160"
                         align="left"
                         prop="storeSn">
        </el-table-column>
        <el-table-column label="投诉原因"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="linkman"></el-table-column>
        <el-table-column label="备注"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="证据"
                         min-width="100"
                         align="left"
                         prop="mobile">
          <template slot-scope="scope">
            <viewer :images="['http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png']">
            <span class="report_img">
              <img src="http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png" alt="邀请码"/>
            </span>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="举报时间"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelDetail('reject',scope.row)">驳回</el-button>
            <el-button type="text" @click.stop="handelDetail('warn', scope.row)">警告</el-button>
            <el-button type="text" @click.stop="handelDetail('blacklist',scope.row)">移入黑名单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.pn"
                  :limit.sync="listQuery.rn"
                  @pagination="customerList"
                  class="text-right" />
    </div>
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData' :reasonList="reasonList"
                    @updateList='customerList' />
  </div>
</template>

<script>
import {complaintlists,} from "@/api/report";
import detail from './detail';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
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
      userList:[],
      reasonList:[{id:1,name:'接单时不专心'},{id:2,name:'恶意骚扰'},{id:3,name:'色情/性骚扰'},{id:4,name:'涉及政治'},{id:5,name:'诈骗'},{id:6,name:'其它'},]
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
    // 修改定位
    handelDetail (type, row) {
      this.showDetail = true
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      }
    },
    // 获取客户列表
    customerList () {
      complaintlists({ ...this.listQuery, })
        .then(res => {
          // this.dataList = res.data.data;
          this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },

    queryCustomerList () {
      this.listQuery.pn = 1
      this.customerList()
    },

  },
};
</script>

<style lang="scss" scoped>
.report_img{
  width: 40px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
