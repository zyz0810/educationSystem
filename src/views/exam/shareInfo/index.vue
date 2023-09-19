<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
<!--      <el-form-item label="">-->
<!--        <el-input v-model.trim="listQuery.keyword"-->
<!--                  clearable suffix-icon="el-icon-search"-->
<!--                  @change="queryCustomerList"-->
<!--                  placeholder="标题/关键词" />-->
<!--      </el-form-item>-->
      <el-button type="primary" class="fr mt_10 mb_10" :disabled="dataList.length > 0" @click="handelDetail('create', '')">新建</el-button>
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
        <el-table-column label="协议标题"
                         fixed="left"
                         min-width="200"
                         align="left"
                         show-overflow-tooltip
                         prop="title"></el-table-column>
        <el-table-column label="协议内容"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="content"></el-table-column>
        <el-table-column label="更新日期"
                         min-width="160"
                         align="center"
                         show-overflow-tooltip
                         prop="update_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="发布人"
                         min-width="100"
                         align="center"
                         prop="operator">
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelDetail('detail',scope.row)">详情</el-button>
            <el-button type="text" @click.stop="handelDetail('update', scope.row)">编辑</el-button>
<!--            <el-button type="text" @click.stop="handleDel(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
    </div>
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData'
                    @updateList='getList' />
  </div>
</template>

<script>
import {getprotocol,} from "@/api/aboutUs";
import detail from './detail';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
        rn: 10,
        pn: 1,
      },
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
      getprotocol()
        .then(res => {
          let json = res.data;
          this.dataList = [json];
        })
        .catch(err => console.log(err));
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
