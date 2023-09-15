<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="500px"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="logo："
                    prop="logo">
        <SingleImage
          :tempUrl="formData.logo"
          v-on:imgSrc="hasImgSrc"
          v-if="!isCanView"
        ></SingleImage>
        <viewer :images="[formData.logo]" v-else>
            <span class="notice_banner">
              <img :src="formData.logo" />
            </span>
        </viewer>
      </el-form-item>
      <el-form-item label="公告内容："
                    prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20}"
          placeholder="请输入内容"
          v-model="formData.content" v-show="!isCanView">
          <span v-show="isCanView">{{formData.content}}</span>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer" v-show="dialogStatus!='detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="save">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
import { setaboutus} from "@/api/aboutUs";
import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
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
        logo: 'https://cdn.kyaoduo.com/upload/file/202307/feb5e6bc-0083-4eed-95be-ac7cf82bf11b.jpeg',
        content: '',
      },
      dialogStatus: '',
      textMap: {
        update: '关于我们',
        create: '关于我们',
        detail:'关于我们'
      },
      rules: {
        logo: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        // content: [
        //   { required: true, message: "请输入公告内容", trigger: "blur" }
        // ],
      }
    };
  },
  components: {
    SingleImage
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
      this.formData.logo = val;
    },
    // 修改定位
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          setaboutus(this.formData)
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
      this.dialogStatus = this.infoData.type;
      if(this.dialogStatus != 'create'){
        const {logo,content} = this.infoData.option;
        this.formData = {logo,content};
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      this.formData= {
        logo: 'https://cdn.kyaoduo.com/upload/file/202307/feb5e6bc-0083-4eed-95be-ac7cf82bf11b.jpeg',
          content: '',
      };
      this.dialogStatus= '';
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
