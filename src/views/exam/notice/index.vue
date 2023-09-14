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
                         fixed="left"
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
                         align="center"
                         prop="cmd">
        </el-table-column>
        <el-table-column label="发布日期"
                         min-width="150"
                         align="center"
                         show-overflow-tooltip
                         prop="create_time">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布人"
                         width="100"
                         align="center"
                         prop="publisher">
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="handelDetail('detail',scope.row)">详情</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'customer:edit'}"
                       :disabled="scope.row.result == 0"
                       @click.stop="handelDetail('update', scope.row)">编辑</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'customer:update:location'}"
                       @click.stop="handleDel(scope.row)">删除</el-button>
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
                    :infoData='infoData'
                    @updateList='customerList' />
  </div>
</template>

<script>
import {noticelist,} from "@/api/notice";
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
      noticelist({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data;
          // this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },

    queryCustomerList () {
      this.listQuery.pn = 1
      this.customerList()
    },
    // 删除单个
    handleDel (id, index) {
      // type,msg,title,option,callback

      this.$MyMessageBox(3,"<span style='margin-left: 35px;'>确定删除该项目？</span>", "确定删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).then(res => {
        if (res) {
          // deleteCustomer({ storeIds: [id] }).then(res => {
          //   this.$message({ message: res.resp_msg, type: 'success' });
          //   this.dataList.splice(index, 1);
          // });
        }}).catch();

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
