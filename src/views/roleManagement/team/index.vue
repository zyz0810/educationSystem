<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box border_bottom">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.keyword"
                  clearable suffix-icon="el-icon-search"
                  @change="queryGetList"
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
        <el-table-column label="姓名"
                         align="left"
                         show-overflow-tooltip
                         prop="name"></el-table-column>
        <el-table-column label="手机号"
                         align="left"
                         show-overflow-tooltip
                         prop="mobile">
        </el-table-column>

        <el-table-column label="角色"
                         align="left"
                         show-overflow-tooltip
                         prop="role" :formatter="formatterRole">
        </el-table-column>

        <el-table-column label="操作"
                         align="left"
                         width="100"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" v-show="scope.row.role != 'super_manager'" @click.stop="handelDetail('update', scope.row)">编辑</el-button>
            <el-button type="text" v-show="scope.row.role != 'super_manager'" @click.stop="handleDel(scope.row)">删除</el-button>
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
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData' :roleList="roleListTwo"
                    @updateList='getList' />
  </div>
</template>

<script>
import {userlist,deleteuser} from "@/api/role";
import detail from './detail';
import roleBox from './../components/roleBox';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
        role:"",
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
      roleList:[{id:'',name:'全部'},{id:'super_manager',name:'超级管理员'},{id:'manager',name:'管理员'},{id:'supplier',name:'供应商'},{id:'custom_service',name:'客服审核员'}],
      roleListTwo:[{id:'manager',name:'管理员'},{id:'supplier',name:'供应商'},{id:'custom_service',name:'客服审核员'}]
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
    this.getList();
  },
  methods: {
    formatterRole (row, column, cellValue, index) {
      // super_manager 超级管理员, manager 管理员,supplier 供应商,custom_service 客服
      return cellValue == 'super_manager' ? "超级管理员" : cellValue == 'manager'? "管理员" : cellValue == 'supplier'? "供应商" : cellValue == 'custom_service'? "客服" : "";
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
      userlist({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data.total_num == 0 ? [] : res.data.user_list;
          this.total = res.data.total_num;
        })
        .catch(err => console.log(err));
    },

    queryGetList () {
      this.listQuery.pn = 1;
      this.getList();
    },
    queryList(role){
      this.listQuery.role = role;
      this.listQuery.pn = 1;
      this.getList();
      console.log('11')
    },
    // 删除单个

    async  handleDel(row){
      const res = await this.$confirm("<span style='margin-left: 35px;'>确定删除该团队用户？</span>", "确定删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).catch((err)=>{console.log('err',err)})
      if(res){
        // this.$success("你确认惹删除！")
          deleteuser({ id: row.id }).then(res => {
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
  .container_box{
    height: calc(100vh - 129px);
    align-items: flex-start;
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
