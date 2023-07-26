<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box border_bottom">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.key"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="请输入" />
      </el-form-item>
      <el-button type="primary" class="fr mt_10" @click="handelDetail('create', '')">新建</el-button>
    </el-form>
    <div class="container_box flex">
      <roleBox :roleList="roleList" :roleCurrent="listQuery.role" @queryList="queryList"></roleBox>
      <div class="container">
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
        <el-table-column label="客户名称"
                         fixed="left"
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
        <el-table-column label="客户编号"
                         min-width="160"
                         align="center"
                         prop="storeSn">
        </el-table-column>
        <el-table-column label="联系人"
                         min-width="100"
                         align="center"
                         show-overflow-tooltip
                         prop="linkman"></el-table-column>
        <el-table-column label="手机号"
                         width="100"
                         align="center"
                         prop="mobile">
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
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="customerList"
                  class="text-right" />
      </div>
    </div>
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData'
                    @updateList='customerList' />
  </div>
</template>

<script>
import {customerList,} from "@/api/customer/customer";
import detail from './detail';
import roleBox from './../components/roleBox';
export default {
  data () {
    return {
      listQuery: {
        key: "",
        role:"",
        limit: 10,
        page: 1,
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
      roleList:[{id:'',name:'全部'},{id:1,name:'超级管理员'},{id:2,name:'管理员'},{id:3,name:'供应商'},{id:4,name:'客服审核员'}]
    };
  },
  components: {detail,roleBox},
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
      customerList({ ...this.listQuery, })
        .then(res => {
          // this.dataList = res.data.data;
          this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },

    queryCustomerList () {
      this.listQuery.page = 1;
      this.customerList();
    },
    queryList(role){
      this.listQuery.role = role;
      this.listQuery.page = 1;
      this.customerList();
      console.log('11')
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
  .container_box{
    height: calc(100vh - 129px);
    .container{
      flex: 1;
      overflow: auto;
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
