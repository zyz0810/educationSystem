<template>
  <div class="app-container">
    <div class="r-title">
      <div>服务商认证</div>
      <div>
        <span class="red01">*</span>为必填项
      </div>
    </div>
    <div class="content">
      <el-steps :active="activeStep" align-center>
        <el-step title="填写资料" ></el-step>
        <el-step title="平台审核" ></el-step>
        <el-step title="缴纳保证金" ></el-step>
        <el-step title="认证成功" ></el-step>
      </el-steps>
      <providerData v-if="formData.id && activeStep == 0" :status="this.status" :provider="formData" @changeActive="changeActive"></providerData>
      <statusData v-if="activeStep == 1" :status="this.status" :remarks="formData.provider?formData.provider.providerReviewLog.remarks:''" @changeActive="changeActive"></statusData>
      <money v-if="activeStep == 2" :status="this.status" :money="formData.provider.setDeposit == null || formData.provider.setDeposit == '' ? '0' : formData.provider.setDeposit"  :instalmentsProportion="formData.provider.instalmentsProportion == null ? '':formData.provider.instalmentsProportion" :providerId="formData.provider.id" @changeActive="changeActive"></money>
      <statusData v-if="activeStep == 2" :status="this.status" :remarks="formData.provider?formData.provider.providerReviewLog.remarks:''" @changeActive="changeActive"></statusData>
      <statusData v-if="activeStep == 4" :status="this.status" :remarks="formData.provider?formData.provider.providerReviewLog.remarks:''" @changeActive="changeActive"></statusData>
    </div>
  </div>
</template>

<script>
  import { findAreaTree, findAreaChilds } from "@/api/area";
  import {providerRegister} from "@/api/provider";
  import providerData from "./component/data";
  import statusData from "./component/statusData";
  import money from "./component/money";
  import { mapGetters } from "vuex";
  import store from '@/store'
  import {getInfo} from '@/api/login'
  export default {
    components: {
      providerData,
      statusData,
      money
    },
    data() {
      return {
        areaNameActive: "province",
        areaTab: false,
        disabled: false,
        formData:{},
        activeStep:0,
        status:''
      };
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      changeActive(val,status){
        this.activeStep = val
        if(status != null){
          this.status = status
        }
      },
      getInfo(){
        getInfo().then(res => {
          this.formData = Object.assign({},res.data)
          if(res.data.provider){
            this.status = res.data.provider.status
            if(res.data.provider.status == '0' || res.data.provider.status == '1' ){
              this.activeStep = 1
            }else if(res.data.provider.status == 2 || res.data.provider.status == 3 || res.data.provider.status == 4 ){
              this.activeStep = 2
            }else if(res.data.provider.status == 5 ){
              this.activeStep = 4
            }else{
              this.activeStep = 0
            }
          }
        }).catch(error => {

        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  .r-title {
    /*margin-top: 20px;*/
    height: 60px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    align-items: center;
    padding: 0 20px;
    background: #ffffff;
  }
  .address-tab {
    position: absolute;
    top: 38px;
    left: 0;
    width: 400px;
    z-index: 2003;
    /deep/.el-tabs__content {
      height: 180px;
      overflow-y: scroll;
      max-height: 180px !important;
      overflow: auto;
      padding: 15px 0 15px 15px !important;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2002;
    background: #fff;
    opacity: 0;
  }
  .content {
    /*height: 74vh;*/
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-steps{
      width: 100%;
      margin: 20px 0 50px;
    }
    .submit {
      margin-bottom: 20px;
    }
  }
</style>
