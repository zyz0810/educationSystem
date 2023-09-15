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
<!--      <el-button type="primary" class="fr mt_10" :disabled="dataList.length > 0" @click="handelDetail('create', '')">新建</el-button>-->
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
        <el-table-column label="封面"
                         fixed="left"
                         min-width="200"
                         align="left"
                         show-overflow-tooltip
                         prop="cover">
          <template slot-scope="scope">
            <viewer :images="[scope.row.logo]">
                <span class="list_img">
                  <img :src="scope.row.logo" />
                </span>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="标题"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>
        <el-table-column label="视频"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>
        <el-table-column label="价格（元）"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>
        <el-table-column label="分类"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>
        <el-table-column label="内容"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>

        <el-table-column label="发布日期"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="发布人"
                         min-width="100"
                         align="center"
                         prop="operator">
        </el-table-column>
        <el-table-column label="状态"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelDetail('detail',scope.row)">通过并上传视频</el-button>
            <el-button type="text" @click.stop="handleDel(scope.row)">驳回</el-button>
          </template>
        </el-table-column>
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
import {getaboutus,} from "@/api/aboutUs";
import detail from './detail';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
        rn: 10,
        pn: 1,
      },
      total:0,
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
      getaboutus()
        .then(res => {
          this.dataList = res.data;
          // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    queryList(){
      this.listQuery.pn = 1;
      this.getList();
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
        deleteuser({ id: row.id }).then(res => {
          this.$message({ message: res.resp_msg, type: 'success' });
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
</style>
