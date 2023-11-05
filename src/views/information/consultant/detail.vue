<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="500px"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <div class="flex mr10 ml_10">
      <div class="flex_hd mr5"><img class="head_img_detail" :src="formData.portrait"/></div>
      <div class="flex_bd">
        <div class="f14 flex ">{{formData.user_name}}
          <img src="./../../../assets/image/male.png" class="sex_icon ml5" v-show="formData.sex == 1"/>
          <img src="./../../../assets/image/female.png" class="sex_icon ml5" v-show="formData.sex == 2"/>
        </div>
        <div class="mt5" v-show="formData.mobile != ''"><img class="phone_icon" src="./../../../assets/image/phone.png"/>{{formData.mobile}}</div>
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">基本信息</div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">客户ID</div>
        <div class="flex_bd text-right">{{formData.user_id}}</div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">姓名</div>
        <div class="flex_bd text-right">{{formData.user_name}}</div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">咨询费（元/分）</div>
        <div class="flex_bd text-right">
          <span class="f12 gray01 mr5">{{Number(Number(formData.price)*15).toFixed(2)}}元/15分；{{Number(Number(formData.price)*30).toFixed(2)}}元/30分；{{Number(Number(formData.price)*60).toFixed(2)}}元/60分；</span>
          <span class="orange01">{{Number(formData.price).toFixed(2)}}元/分</span>
        </div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">城市</div>
        <div class="flex_bd text-right">{{formData.city}}</div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">个人简介</div>
        <div class="flex_bd text-right detail_intro"  style='white-space: pre-wrap;' v-html="formData.intro"></div>
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">资质标签</div>
      <div class="tag_list">
        <p v-if="formData.label == null || formData.label.length < 1" class="f12 gray01">暂无</p>
        <span class="person_tag" v-for="(item,index) in formData.label" :key="index">{{item}}</span>
      </div>
    </div>

    <div class="mt_10 info_content">
      <div class="detail_title">证书</div>
      <div class="img_list">
        <p v-if="formData.cert == null || formData.cert.length < 1" class="f12 gray01">暂无</p>
<!--        <img v-for="(item,index) in formData.cert" :key="index" :src="item">-->
        <viewer v-else-if="formData.cert != null && formData.cert.length > 0" :images="formData.cert">
              <span v-for="(item,index) in formData.cert" :key="'cert'+index">
                <img :src="item" />
              </span>
        </viewer>
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">认证资料</div>
      <div class="img_list">
        <p v-if="formData.ren_zheng == null || formData.ren_zheng.length < 1" class="f12 gray01">暂无</p>
<!--        <img v-for="(item,index) in formData.ren_zheng" :key="index" :src="item">-->
        <viewer v-else-if="formData.ren_zheng != null && formData.ren_zheng.length > 0" :images="formData.ren_zheng">
              <span v-for="(item,index) in formData.ren_zheng" :key="'ren_zheng'+index">
                <img :src="item" />
              </span>
        </viewer>
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">形象照</div>
      <div class="img_list">
        <p v-if="formData.pictures == null || formData.pictures.length<1" class="f12 gray01">暂无</p>
<!--        <img v-for="(item,index) in formData.pictures" :key="index" :src="item">-->
        <viewer v-else-if="formData.pictures != null && formData.pictures.length > 0" :images="formData.pictures">
              <span v-for="(item,index) in formData.pictures" :key="'pictures'+index">
                <img :src="item" />
              </span>
        </viewer>
      </div>
    </div>
    <span slot="footer"
          class="dialog-footer" v-show="dialogStatus!='detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="save">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
// import {
//   lonAndLatEdit
// } from "@/api/customer/customer";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    infoData:{
      required: true,
      type: Object,
      default: {
        type:'create',
        option:{}
      }
    },
  },
  data () {
    return {
      formData: {
        id:'',
        portrait:'',
        user_name:'',
        mobile:'',
        user_id:'',
        city:'',
        intro:'',
        sex:'',
        price:'',
        label:'',
        cert:[],
        ren_zheng:[],
        pictures:[],
      },
      isChange:false,
      textMap: {
        update: '编辑咨询师信息',
        create: '新建咨询师信息',
        detail:'咨询师信息'
      },
      dialogStatus: '',
    };
  },

  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
    isCanView(){
      return this.dialogStatus == 'detail'
    }
  },
  methods: {
    hasImgSrc(val) {
      this.formData.two = val;
    },
    // 修改定位
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formData.lonAndLat = `${this.formData.longitude},${this.formData.latitude}`
          // lonAndLatEdit(this.formData)
          //   .then(res => {
          //     this.$emit("updateList");
          //     this.dialogVisible = false;
          //   })
          //   .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    open () {
      this.formData.id = this.infoData.option.id;
      this.dialogStatus = this.infoData.type;
      const {id,portrait,user_name,mobile,user_id,city,intro,sex,price,label,cert,ren_zheng,pictures,} = this.infoData.option;
      this.formData = {id,portrait,user_name,mobile,user_id,city,intro,sex,price,label,cert,ren_zheng,pictures,};
    },
    close () {
      // this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id:'',
        portrait:'',
        user_name:'',
        mobile:'',
        user_id:'',
        city:'',
        intro:'',
        sex:'',
        price:'',
        label:'',
        cert:[],
        ren_zheng:[],
        pictures:[],
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
}

.img_list{
  font-size: 0;
  img{
    width: 80px;
    margin: 5px 5px 5px 0;
  }
}
.notice_banner{
  img{
    height: 100px;
  }
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
  .detail_intro{
    line-height: 1.5;
    text-align: left;
  }
  .person_tag{
    &:nth-child(10n-9){
      color: #EB4C00;
      background: #FF5E0015;
      border: 1px solid #FF5E0020;
    }
    &:nth-child(10n-8){
      color: #ED5D00;
      background: #FBBB3D15;
      border: 1px solid #FBBB3D20;
    }
    &:nth-child(10n-7){
      color: #EC0057;
      background: #FB3D8315;
      border: 1px solid #FB3D8320;
    }
    &:nth-child(10n-6){
      color: #F22511;
      background: #F1301D15;
      border: 1px solid #F1301D20;
    }
    &:nth-child(10n-5){
      color: #22891F ;
      background: #54C15115;
      border: 1px solid #54C15120;
    }
    &:nth-child(10n-4){
      color: #00808B ;
      background: #20B6C315;
      border: 1px solid #20B6C320;
    }
    &:nth-child(10n-3){
      color: #7C35C0;
      background: #8C48CD15;
      border: 1px solid #8C48CD20;
    }
    &:nth-child(10n-2){
      color: #0071BC;
      background: #0099FE15;
      border: 1px solid #0099FE20;
    }
    &:nth-child(10n-1){
      color: #3650D5;
      background: #576EE115;
      border: 1px solid #576EE120;
    }
    &:nth-child(10n){
      color: #2C4068;
      background: #707E9815;
      border: 1px solid #707E9820;
    }
  }
</style>
