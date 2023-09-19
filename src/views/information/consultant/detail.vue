<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="400px"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <div class="flex mr10 ml_10">
      <div class="flex_hd"><img class="head_img_detail" :src="formData.portrait"/></div>
      <div class="flex_bd">
        <div class="f14 flex ">{{formData.user_name}}
          <img src="./../../../assets/image/male.png" class="sex_icon ml5" v-show="formData.sex == 1"/>
          <img src="./../../../assets/image/female.png" class="sex_icon ml5" v-show="formData.sex == 2"/>
        </div>
        <div class="mt5"><img class="phone_icon" src="./../../../assets/image/phone.png"/>{{formData.mobile}}</div>
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
        <div class="info_txt">咨询费</div>
        <div class="flex_bd text-right">{{formData.price}}</div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">城市</div>
        <div class="flex_bd text-right">{{formData.city}}</div>
      </div>
      <div class="flex border_bottom1 info_content_line">
        <div class="info_txt">个人简介</div>
        <div class="flex_bd text-right">{{formData.intro}}</div>
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">资质标签</div>
      <div class="tag_list">
        <span class="person_tag" v-for="(item,index) in formData.label">{{item}}</span>
      </div>
    </div>

    <div class="mt_10 info_content">
      <div class="detail_title">证书无字段</div>
      <div class="img_list">
        <img :src="formData.portrait">
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">认证资料</div>
      <div class="img_list">
        <img :src="formData.portrait">
      </div>
    </div>
    <div class="mt_10 info_content">
      <div class="detail_title">形象照</div>
      <div class="img_list">
        <img :src="formData.portrait">
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
        label:''
      },
      isChange:false,
      textMap: {
        update: '编辑家长信息',
        create: '新建家长信息',
        detail:'家长信息'
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
      const {id,portrait,user_name,mobile,user_id,city,intro,sex,price,label,} = this.infoData.option;
      this.formData = {id,portrait,user_name,mobile,user_id,city,intro,sex,price,label,};
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        longitude: '',
        latitude: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }

}

.img_list{
  img{
    width: 50px;
    margin-right: 5px;
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
</style>
