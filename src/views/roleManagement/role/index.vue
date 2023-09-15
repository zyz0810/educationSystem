<template>
  <div class="app-container">
    <div class="container_box flex">
      <roleBox :roleList="roleList" :roleCurrent="listQuery.role" @queryList="queryList"></roleBox>
      <div class="container role_container">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(item,index) in menuList" :key="item.id" :label="item.id" :disabled="listQuery.role == 'super_manager'">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <div class="bottom_btn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {getpermbyrole,setroleperm} from "@/api/role";
  import roleBox from './../components/roleBox';
  export default {
    data () {
      return {
        checkList:[],
        listQuery: {
          role:'super_manager',
        },
        listLoading: false,
        roleList:[{id:'super_manager',name:'超级管理员'},{id:'manager',name:'管理员'},{id:'supplier',name:'供应商'},{id:'custom_service',name:'客服审核员'}],
        menuList:[{id:'can_audit_user',name:'资料审核'},{id:'can_deal_comlaint',name:'投诉处理'},{id:'can_deal_income',name:'收益发放'},
          {id:'can_query_supplier',name:'供应商查询'},{id:'can_query_operations',name:'经营数据'},{id:'can_query_user',name:'平台用户信息查询'},{id:'can_manage_perm',name:'权限管理'}],
      };
    },
    components: {roleBox},
    mounted () {
      this.getList();
    },
    methods: {
      save(){
        console.log(this.checkList)
        let arr = JSON.parse(JSON.stringify(this.checkList));
        let formData={
          role:this.listQuery.role,
          can_audit_user:arr.indexOf('can_audit_user')>-1 ? 1 : -1,
          can_deal_comlaint:arr.indexOf('can_deal_comlaint')>-1 ? 1 : -1,
          can_deal_income:arr.indexOf('can_deal_income')>-1 ? 1 : -1,
          can_query_supplier:arr.indexOf('can_query_supplier')>-1 ? 1 : -1,
          can_query_operations:arr.indexOf('can_query_operations')>-1 ? 1 : -1,
          can_query_user:arr.indexOf('can_query_user')>-1 ? 1 : -1,
          can_manage_perm:arr.indexOf('can_manage_perm')>-1 ? 1 : -1,
        };

        setroleperm(formData)
          .then(res => {
            this.$message({
              message: "权限设置成功",
              type: "success"
            });
          })
          .catch(err => console.log(err));



      },
      cancel(){
        this.getList();
      },
      // 获取客户列表
      getList () {
        getpermbyrole(this.listQuery)
          .then(res => {
            let json = res.data;
            let arr = [];
            if(json.can_audit_user == 1){
              arr.push('can_audit_user')
            }
            if(json.can_deal_comlaint == 1){
              arr.push('can_deal_comlaint')
            }
            if(json.can_deal_income == 1){
              arr.push('can_deal_income')
            }
            if(json.can_query_supplier == 1){
              arr.push('can_query_supplier')
            }
            if(json.can_query_operations == 1){
              arr.push('can_query_operations')
            }
            if(json.can_query_user == 1){
              arr.push('can_query_user')
            }
            if(json.can_manage_perm == 1){
              arr.push('can_manage_perm')
            }
            this.checkList = arr

          })
          .catch(err => console.log(err));
      },

      queryList(role){
        this.listQuery.role = role;
        this.getList();
      },

    },
  };
</script>

<style lang="scss" scoped>
  .container_box{
    height: calc(100vh - 70px);
    align-items: stretch;
    .role_container{
      flex: 1;
      overflow: auto;
      position: relative;

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

  .bottom_btn{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    box-shadow: 0 -2px 2px #f2f2f2;
    padding: 10px 0;
  }

</style>
