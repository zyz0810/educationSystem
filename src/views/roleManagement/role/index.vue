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
<!--      <el-button type="primary" class="fr mt_10" @click="handelDetail('create', '')">新建</el-button>-->
    </el-form>
    <div class="container_box flex">
      <roleBox :roleList="roleList" :roleCurrent="listQuery.role" @queryList="queryList"></roleBox>
      <div class="container role_container">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="0" disabled>复选框 A</el-checkbox>
          <el-checkbox :label="1">复选框 B</el-checkbox>
          <el-checkbox :label="2">复选框 C</el-checkbox>
        </el-checkbox-group>
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
        checkList:[1,0],
        listQuery: {
          key: "",
          role:1,
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
        roleList:[{id:1,name:'超级管理员'},{id:2,name:'管理员'},{id:3,name:'供应商'},{id:4,name:'客服审核员'}]
      };
    },
    components: {detail,roleBox},
    computed: {},
    mounted () {
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
    .role_container{
      flex: 1;
      overflow: auto;
      /deep/.el-checkbox{

        display: block;
        line-height: 3;
        padding: 0 10px;
        margin-bottom: 10px;
        margin-right: 0;
        background: #E7F5FD;
        .el-checkbox__label{
          font-weight: bold;
        }
        &.is-checked {
          .el-checkbox__label{
            color: #3E4863 !important;
          }
          &.is-disabled{
            .el-checkbox__inner{
              background-color: #047ae291;
              border-color: #047ae291;
              &::after {
                border-color: rgba(255,255,255,1);
              }
            }
            .el-checkbox__label{
              color: #3E4863 !important;
            }


          }
        }


      }
    }
  }


</style>
