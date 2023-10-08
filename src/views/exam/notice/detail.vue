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
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item label="类型："
                    prop="notice_type">
        <el-radio-group v-model="formData.notice_type" :disabled="isCanView">
          <el-radio-button :label="1">链接</el-radio-button>
          <el-radio-button :label="2">图文</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户端：无字段" v-if="dialogStatus == 'create'" prop="">
        <el-radio-group v-model="formData.notice_type" :disabled="isCanView">
          <el-radio-button :label="1">家长端</el-radio-button>
          <el-radio-button :label="2">咨询师端</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告Banner："
                    prop="cover">
<!--        <el-input v-model.trim="formData.two" v-if="!isCanView"-->
<!--                  placeholder="请输入"-->
<!--                  clearable />-->
        <SingleImage
          :tempUrl="formData.cover"
          v-on:imgSrc="hasImgSrc"
          v-if="!isCanView"
        ></SingleImage>
        <viewer :images="[formData.cover]" v-else>
            <span class="notice_banner">
              <img :src="formData.cover" />
            </span>
        </viewer>
        <div class="upload_img_tip">
          <p>格式为：jpg/png；不超过1M</p>
          <p>建议尺寸：750x280/1500x560</p>
        </div>
      </el-form-item>
      <el-form-item label="链接：" v-if="formData.notice_type == 1"
                    prop="cmd">
        <el-input v-model.trim="formData.cmd" v-show="!isCanView"
                  placeholder="请输入"
                  clearable />
        <span v-show="isCanView">{{formData.cmd}}</span>
      </el-form-item>
      <el-form-item label="公告内容："  v-if="formData.notice_type == 2"
                    prop="notice_content">
        <quillEditor ref="myQuillEditor" v-show="!isCanView"
                     :isChange.sync="isChange"
                     :isProductDetail="true"
                     :content.sync="formData.notice_content" />
        <div v-html="formData.notice_content"
             v-show="isCanView">
          {{ formData.notice_content }}
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer" v-show="dialogStatus!='detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="dialogStatus=='create'?save():updateData()">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
import {publishnotice,editnotice} from "@/api/notice";
import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
import quillEditor from "@/components/quillEditor/quillEditorProductDetail.vue";
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
        notice_type: 1,
        cover: '',
        cmd: '',
        notice_content: '',
      },
      isChange:false,
      textMap: {
        update: '编辑公告',
        create: '新建公告',
        detail:'公告详情'
      },
      dialogStatus: '',
      rules: {
        notice_type: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        // cmd: [
        //   { required: true, message: "请输入链接", trigger: "blur" }
        // ],
        // notice_content: [
        //   { required: true, message: "请输入公告内容", trigger: "blur" }
        // ],
      }
    };
  },
  components: {
    SingleImage,quillEditor
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
      console.log('图片',val)
      this.formData.cover = val;
    },
    // 修改定位
    save () {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let formData = {};
          const {id,notice_type,cover,cmd,notice_content} = this.formData;
          if(this.formData.notice_type == 1){
            formData = {id,notice_type,cover,cmd};
          }else{
            formData = {id,notice_type,cover,notice_content};
          }
          publishnotice(formData)
            .then(res => {
              this.$message({ message: res.errmsg, type: 'success' });
              this.$emit("updateList");
              this.dialogVisible = false;
            })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    updateData() {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let formData = {};
          const {id,notice_type,cover,cmd,notice_content} = this.formData;
          if(this.formData.notice_type == 1){
            formData = {id,notice_type,cover,cmd};
          }else{
            formData = {id,notice_type,cover,notice_content};
          }
          editnotice(formData)
            .then(res => {
              this.$message({ message: res.errmsg, type: 'success' });
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
      if(this.infoData.type != 'create'){
        const {id,type,cover,cmd,notice_content} = this.infoData.option;
        this.formData = {id,notice_type:type,cover,cmd,notice_content};
      }
      this.dialogStatus = this.infoData.type;
      this.$nextTick(()=>{
        if (this.$refs.myQuillEditor) {
          this.$refs.myQuillEditor.changeContent(this.formData.four);
        }
      });

    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        notice_type: 1,
        cover: '',
        cmd: '',
        notice_content: '',
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
  .upload_img_tip{
    color: #999999;
    font-size: 12px;
    p{
      margin: 0;
      line-height: 1.6;
    }
  }
</style>
