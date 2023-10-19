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
        <el-select v-model="listQuery.label" clearable placeholder="请选择" @change="queryList">
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

        <el-table-column label="个人姓名"
                         width="150"
                         align="left">
          <template slot-scope="scope">
            <span class="flex">
                <span class="header_img mr5">
                  <img :src="scope.row.portrait" alt=""/>
                </span>
            {{scope.row.consult_name}}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="ID"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="consult_id">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         show-overflow-tooltip
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="性别"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="sex" :formatter="formatterSex"></el-table-column>
        <el-table-column label="城市"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="city"></el-table-column>
        <el-table-column label="个人简介"
                         min-width="180"
                         align="left"
                         show-overflow-tooltip
                         prop="intro">
<!--          <template slot-scope="scope">-->
<!--            <span class="mr10">{{scope.row.intro}}</span>-->
<!--&lt;!&ndash;            <span class="person_tag" v-for="(item,index) in scope.row.label">{{item}}</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="f16 bold yellow02" v-show="scope.row.label.length > 2">…</span>&ndash;&gt;-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="提交时间"
                         min-width="130"
                         align="left"
                         show-overflow-tooltip
                         prop="create_time"></el-table-column>

        <el-table-column label="违规/拉黑原因"
                         min-width="130"
                         align="left"
                         show-overflow-tooltip
                         prop="reason"></el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="60"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handleDel(scope.row)">移除</el-button>
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

  </div>
</template>

<script>
  import {getblacklist,removebacklist,complaintlabels} from "@/api/blackList";
  export default {
    data () {
      return {
        reasonList:[],
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
        infoData: {
          type:'',
          option:{},
        },
        channelList:[{id:'',name:'全部渠道'},{id:1,name:'超级管理员'},{id:2,name:'管理员'},{id:3,name:'供应商'},{id:4,name:'客服审核员'}]
      };
    },
    components: {},
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
      // reasonList
      // 获取客户列表
      getReasonList () {
        complaintlabels()
          .then(res => {
            this.reasonList = res.data;
          })
          .catch(err => console.log(err));
      },
      formatterSex (row, column, cellValue, index) {
        // 1男 2女
        return cellValue == 1 ? "男" : cellValue == 2? "女" : "";
      },
      // 删除单个
      async  handleDel(row){
        const res = await this.$confirm("<span style='margin-left: 35px;'>“"+ row.consult_name +"”从黑名单移除？将恢复沟通权限</span>", "移除黑名单", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          // type: "info",
          dangerouslyUseHTMLString: true,
          customClass:'del_confirm'
        }).catch((err)=>{console.log('err',err)})
        if(res){
          // this.$success("你确认惹删除！")
          removebacklist({ black_user_id: row.consult_id }).then(res => {
            this.$message({ message: res.errmsg, type: 'success' });
            this.getList();
          });
          console.log('确定',res)
        }
      },
      // 获取客户列表
      getList () {
        getblacklist({ ...this.listQuery, })
          .then(res => {
            this.dataList = res.data.totalCount == 0 ? [] : res.data.black_list;
            this.total = res.data.totalCount;
          })
          .catch(err => console.log(err));
      },

      queryList () {
        this.listQuery.pn = 1;
        this.getList();
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
