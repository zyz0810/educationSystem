<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryGetList"
                  placeholder="搜索/ID/姓名/手机号" />
      </el-form-item>
      <el-form-item label="">
          <el-select v-model="listQuery.status" clearable @change="queryGetList" placeholder="请选择">
<!--            1待审核 2通过 3拒绝-->
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="通过" :value="2"></el-option>
            <el-option label="拒绝" :value="3"></el-option>
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

        <el-table-column label="咨询师ID"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
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
        <el-table-column label="咨询费"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
                         prop="price"></el-table-column>
        <el-table-column label="城市"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
                         prop="city"></el-table-column>
<!--        <el-table-column label="个人简介"-->
<!--                         min-width="200"-->
<!--                         show-overflow-tooltip-->
<!--                         align="left"-->
<!--                         prop="intro">-->
<!--          <template slot-scope="scope">-->
<!--            <span style='white-space: pre-wrap;' v-html="scope.row.intro"></span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="分类"
                         width="220"
                         align="left"
                         prop="intro">
          <template slot-scope="scope">
<!--            <span class="mr10">{{scope.row.intro}}</span>-->
            <span v-if="scope.row.label != null && scope.row.label != [] && scope.row.label.length > 0">
              <span class="person_tag" v-for="(item,index) in scope.row.label" :index="index" v-show="index < 2">{{item}}</span>
              <span class="f16 bold yellow02" v-show="scope.row.label!=null && scope.row.label.length > 2">…</span>
            </span>

          </template>
        </el-table-column>
<!--        <el-table-column label=""-->
<!--                         min-width="150"-->
<!--                         align="left"-->
<!--                         prop="label">-->
<!--          <template slot-scope="scope">-->
<!--            <span class="person_tag">幼育</span>-->
<!--            <span class="person_tag">幼儿教育</span>-->
<!--            <span class="f16 bold yellow02">…</span>-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label="提交时间"
                         min-width="150"
                         align="left"
                         show-overflow-tooltip
                         prop="create_time"></el-table-column>

        <el-table-column label="状态和审核意见"
                         min-width="160"
                         align="left"
                         prop="status">
          <template slot-scope="scope">
            <!--            状态，1待审核 2通过 3拒绝-->
            <span class="mr5" :class="{'orange01':scope.row.status == 1,'green01':scope.row.status == 2,'red01':scope.row.status == 3}">{{formatterStatus(scope.row.status)}}</span>
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
  import {getauditconsultlist,auditconsultinfo} from "@/api/counselor";
  import detail from './../../information/consultant/detail';
  import rejectView from './reject';
  export default {
    data () {
      return {
        listQuery: {
          keyword: "",
          status:"",
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
        return cellValue == 1 ? "男" : cellValue == 2? "女" : cellValue == 3? "保密" : "";
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
      getList () {
        getauditconsultlist({ ...this.listQuery, })
          .then(res => {
            this.dataList = res.data.total_num == 0? [] : res.data.list;
            // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
            this.total = res.data.total_num;
          })
          .catch(err => console.log(err));
      },

      queryGetList () {
        this.listQuery.pn = 1;
        this.getList();
      },
// 同意
      async handelPass(row){
        const res = await this.$confirm("<span style='margin-left: 35px;'>确定审核通过吗？</span>", "确定同意", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          // type: "info",
          dangerouslyUseHTMLString: true,
          customClass:'del_confirm'
        }).catch((err)=>{console.log('err',err)})
        if(res){
          auditconsultinfo({ id: row.id,action:'pass' }).then(res => {
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
