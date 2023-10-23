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
      <el-button type="primary" class="fr mt_10" @click="handelDetail('create', '')">新建公告</el-button>
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
        <el-table-column label="公告banner"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="cover">
          <template slot-scope="scope">
            <viewer :images="[scope.row.cover]">
                <span class="list_img">
                  <img :src="scope.row.cover" />
                </span>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="详情/链接地址"
                         min-width="160"
                         show-overflow-tooltip
                         align="left"
                         prop="">
                    <template slot-scope="scope">
<!--                      1：链接，2：图文-->
                      <div class="over_one" v-if="scope.row.type == 1">{{scope.row.cmd}}</div>
                      <div class="over_html" v-if="scope.row.type == 2" v-html="scope.row.content"></div>
<!--                      <el-popover v-if="scope.row.type == 2"-->
<!--                        width="800"-->
<!--                        trigger="hover">-->
<!--                        <span slot="reference"><span class="over_one" v-html="scope.row.content"></span></span>-->
<!--                        <div v-html="scope.row.content"></div>-->
<!--                      </el-popover>-->

                    </template>
        </el-table-column>
        <el-table-column label="发布日期"
                         width="180"
                         align="left"
                         show-overflow-tooltip
                         prop="create_time" :formatter="formatTime">
<!--          <template slot-scope="scope">-->
<!--            <span>{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="发布人"
                         width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="publisher">
        </el-table-column>
        <el-table-column label="用户端"
                         width="120"
                         show-overflow-tooltip
                         align="left"
                         prop="is_consult" :formatter="formatConsult">
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="120"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="handelDetail('detail',scope.row)">详情</el-button>
            <el-button type="text" @click.stop="handelDetail('update', scope.row)">编辑</el-button>
            <el-button type="text" @click.stop="handleDel(scope.row)">删除</el-button>
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
                    :infoData='infoData'
                    @updateList='getList' />
  </div>
</template>

<script>
import {noticelist,removenotice} from "@/api/notice";
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
  },
  methods: {
    formatTime (row, column, cellValue, index) {
      return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    formatConsult (row, column, cellValue, index) {
      //1: 是咨询师， 0: 普通用户
      return cellValue == 1 ? "咨询师" : cellValue == 0? "普通用户" : "";
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
      noticelist({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data.totalCount == 0 ? [] : res.data.notices;
          // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.totalCount;
        })
        .catch(err => console.log(err));
    },

    queryGetList () {
      this.listQuery.pn = 1
      this.getList()
    },
    // 删除单个
    async  handleDel(row){
      const res = await this.$confirm("<span style='margin-left: 35px;'>确定删除该项目？</span>", "确定删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).catch((err)=>{console.log('err',err)})
      if(res){
        // this.$success("你确认惹删除！")
        removenotice({ id: row.id }).then(res => {
          this.$message({ message: res.errmsg, type: 'success' });
          this.getList();
        });
        console.log('确定',res)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .list_img{
    display: inline-block;
    /*width: 30px;*/
    height: 30px;
    img{
      /*width: 100%;*/
      height: 100%;
    }
  }
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
  .over_html{
    /deep/p,div,span{
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow:ellipsis;
    }

  }
</style>
