<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryList"
                  placeholder="标题/关键词" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.channel" placeholder="请选择" @change="queryList">
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
        <el-table-column label="个人姓名"
                         fixed="left"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="user_name">
          <template slot-scope="scope">
               <span class="flex pointer blue01"  @click="handelDetail('detail', scope.row)">
                <span class="header_img el-avatar--circle mr5">
              <img :src="scope.row.portrait" alt=""/>
            </span>
            {{scope.row.user_name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="ID"
                         min-width="80"
                         align="left"
                         prop="user_id">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="mobile"></el-table-column>
        <el-table-column label="性别"
                         width="60"
                         align="left"
                         prop="sex" :formatter="formatterSex">
        </el-table-column>
        <el-table-column label="地域"
                         min-width="100"
                         align="left"
                         prop="city">
        </el-table-column>
        <el-table-column label="个人简介"
                         min-width="100"
                         align="left"
                         prop="intro">
        </el-table-column>
        <el-table-column label="提交时间"
                         min-width="150"
                         align="left"
                         prop="create_time" :formatter="formatTime">
        </el-table-column>
        <el-table-column label="状态和审核意见"
                         min-width="160"
                         align="left"
                         prop="status">
          <template slot-scope="scope">
<!--            状态，1待审核 2通过 3拒绝-->
            <span :class="{'orange01 mr5':scope.row.status == 1,'green01 mr5':scope.row.status == 2,'red01 mr5':scope.row.status == 3,}">{{formatterStatus(scope.row.status)}}</span>
            <span v-if="scope.row.status == 3">{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="100"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" v-show="scope.row.status == 1" @click.stop="handelPass( scope.row)">同意</el-button>
            <el-button type="text" v-show="scope.row.status == 1" @click.stop="handleReject(scope.row)">退回</el-button>
          </template>
        </el-table-column>


<!--        <template slot="empty">-->
<!--&lt;!&ndash;          <img :src="$imgUrl">&ndash;&gt;-->
<!--&lt;!&ndash;          暂无数据11</template>&ndash;&gt;-->
<!--          <empty-table/>-->

<!--        </template>-->
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
    <!--详情-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData'
                    @updateList='getList' />
<!--    驳回-->
    <rejectView :showDialog.sync="showReject"
            :infoData='infoData'
            @updateList='getList' />
  </div>
</template>

<script>
import {getaudituserlist,audituserinfo} from "@/api/parent";
import detail from './../../information/personal/detail';
import rejectView from './reject';
export default {
  data () {
    return {
      userList:[],
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
      showReject:false,
      infoData: {
        type:'',
        option:{},
      },
    };
  },
  components: {detail,rejectView},
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
    formatterStatus(cellValue){
      //状态，1待审核 2通过 3拒绝
      return cellValue == 1 ? "待审核" : cellValue == 2? "通过" : cellValue == 3? "拒绝" : "";
    },
    formatterSex (row, column, cellValue, index) {
      // 1男 2女
      return cellValue == 1 ? "男" : cellValue == 2? "女" : "";
    },
    formatTime (row, column, cellValue, index) {
      return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    // 修改定位
    handelDetail (type, row) {

      this.showDetail = true;
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      };
      console.log(this.infoData)
    },
    // 获取客户列表
    getList () {
      getaudituserlist({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data.list;
          this.total = res.data.total_num;
        })
        .catch(err => console.log(err));
    },

    queryList () {
      this.listQuery.pn = 1
      this.getList()
    },
    // 同意
    async handelPass(row){
      const res = await this.$confirm("<span style='margin-left: 35px;'>确定同意吗？</span>", "确定同意", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).catch((err)=>{console.log('err',err)})
      if(res){
        audituserinfo({ id: row.id,action:'pass' }).then(res => {
          this.$message({ message: res.errmsg, type: 'success' });
          this.getList();
        });
        console.log('确定',res)
      }
    },

    handleReject(row){
      this.showReject = true;
      this.infoData = {
        type:'reject',
        option:row,
      };
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
