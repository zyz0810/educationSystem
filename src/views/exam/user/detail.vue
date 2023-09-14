<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <div class="flex">
      <div class="flex_hd"><img class="head_img_detail" src="http://cdn.kyaoduo.com/upload/image/20200808/WechatIMG289.png"></div>
      <div class="flex_bd">
        <div>{{formData.user_name}}</div>
        <div>{{form.mobile}}</div>
      </div>
    </div>
    <div class="mt_10">
      <div class="detail_title">基本信息</div>
      <div class="flex border_bottom1">
        <div>客户ID</div>
        <div class="flex_bd text-right">{{formData.user_id}}</div>
      </div>
      <div class="flex border_bottom1">
        <div>姓名</div>
        <div class="flex_bd text-right">发发发</div>
      </div>
      <div class="flex border_bottom1">
        <div>地域</div>
        <div class="flex_bd text-right">发发发</div>
      </div>
      <div class="flex border_bottom1">
        <div>个人简介</div>
        <div class="flex_bd text-right">发发发</div>
      </div>
    </div>
    <div class="mt_10">
      <div class="detail_title">资质标签</div>
      <div class="tag_list">
        <span class="person_tag">咨询</span>
        <span class="person_tag">幼教</span>
      </div>
    </div>
    <div class="mt_10">
      <div class="detail_title">附件</div>
      <div class="tag_list">
        <span class="person_tag">咨询</span>
        <span class="person_tag">幼教</span>
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
  import {
    lonAndLatEdit
  } from "@/api/customer/customer";
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
          one: 1,
          two: 'https://cdn.kyaoduo.com/upload/file/202307/feb5e6bc-0083-4eed-95be-ac7cf82bf11b.jpeg',
          three: '12',
          four: '<p style="color:red;">2222</p>',
        },
        isChange:false,
        textMap: {
          update: '编辑家长信息',
          create: '新建家长信息',
          detail:'家长信息'
        },
        dialogStatus: '',
        rules: {
          one: [
            { required: true, message: "请选择类型", trigger: "blur" }
          ],
          two: [
            { required: true, message: "请上传图片", trigger: "blur" }
          ],
          three: [
            { required: true, message: "请输入链接", trigger: "blur" }
          ],
          four: [
            { required: true, message: "请输入公告内容", trigger: "blur" }
          ],
        }
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
            lonAndLatEdit(this.formData)
              .then(res => {
                this.$emit("updateList");
                this.dialogVisible = false;
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      },
      open () {
        this.formData.id = this.infoData.option.id;
        this.dialogStatus = this.infoData.type;


        const {id,portrait,user_name,mobile,user_id,city,intro} = this.infoData.option;
        this.formData = {id,portrait,user_name,mobile,user_id,city,intro};
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
