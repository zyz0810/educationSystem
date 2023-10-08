<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryGetList"
                  placeholder="标题/关键词" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.label" clearable placeholder="请选择" @change="queryGetList">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in reasonList"
                     :key="index"
                     :label="item"
                     :value="item"></el-option>
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
                         min-width="140"
                         align="left"
                         show-overflow-tooltip
                         prop="">
          <template slot-scope="scope">
            <span class="flex">
              <span class="header_img"><img :src="scope.row.complaint_user_portrait" alt=""/></span>
              {{scope.row.complaint_user_name}}（{{scope.row.complaint_user_id}}）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="被投诉人"
                         min-width="140"
                         align="left"
                         show-overflow-tooltip
                         prop="complaint_user_id">
          <template slot-scope="scope">
            <span class="flex">
              <span class="header_img"><img :src="scope.row.consult_portrait" alt=""/></span>
              {{scope.row.consult_name}}（{{scope.row.consult_id}}）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="举报订单无字段"
                         min-width="160"
                         align="left"
                         prop="storeSn">
          <template slot-scope="scope">
             订单： {{scope.row.order_id}}
          </template>
        </el-table-column>
        <el-table-column label="投诉原因"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="reject_reason"></el-table-column>
        <el-table-column label="备注"
                         width="100"
                         align="left"
                         prop="content">
        </el-table-column>
        <el-table-column label="证据"
                         min-width="100"
                         align="left"
                         prop="mobile">
          <template slot-scope="scope">
            <viewer :images="scope.row.pictures">
              <span class="report_img" v-for="(item,index) in scope.row.pictures" :key="index">
                <img :src="item" />
              </span>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="举报时间"
                         min-width="160"
                         align="left"
                         prop="create_time" :formatter="formatTime">
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelDetail('reject',scope.row)">驳回</el-button>
            <el-button type="text" @click.stop="handelDetail('warn', scope.row)">警告</el-button>
            <el-button type="text" @click.stop="handelDetail('black',scope.row)">移入黑名单</el-button>
          </template>
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
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData' :reasonList="reasonList"
                    @updateList='getList' />
  </div>
</template>

<script>
import {complaintlists,} from "@/api/report";
import {complaintlabels} from "@/api/blackList";
import detail from './detail';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
        label:"",
        rn: 10,
        pn: 1,
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      tableHeight: 520,
      showDetail: false,
      showReject:false,
      infoData: {
        type:'',
        option:{},
      },
      reasonList:[],
      // reasonList:['接单时不专心','恶意骚扰','色情/性骚扰','涉及政治','诈骗','其它',]
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
    this.getList();
    this.getReasonList();
  },
  methods: {
    getReasonList () {
      complaintlabels()
        .then(res => {
          this.reasonList = res.data;
        })
        .catch(err => console.log(err));
    },
    formatTime (row, column, cellValue, index) {
      // let aa = cellValue
      // let aa = Number(this.$moment(Number(cellValue)).format("X"))//X大写代表秒x代表毫秒
      let aa = cellValue + '000';
      return this.$moment(Number(aa)).format("YYYY-MM-DD HH:mm:ss");
    },
    // 修改定位
    handelDetail (type, row) {
      this.showDetail = true
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      }
    },
    // 获取客户列表
    getList () {
      complaintlists({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data.total == 0 ? [] : res.data.complaints;
          // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.total;
        })
        .catch(err => console.log(err));
    },

    queryGetList () {
      this.listQuery.pn = 1
      this.getList()
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
