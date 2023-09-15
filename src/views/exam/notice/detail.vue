<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
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
                    prop="one">
        <el-radio-group v-model="formData.one" :disabled="isCanView">
          <el-radio-button :label="0">链接</el-radio-button>
          <el-radio-button :label="1">图文</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告Banner："
                    prop="two">
<!--        <el-input v-model.trim="formData.two" v-if="!isCanView"-->
<!--                  placeholder="请输入"-->
<!--                  clearable />-->
        <SingleImage
          :tempUrl="formData.two"
          v-on:imgSrc="hasImgSrc"
          v-if="!isCanView"
        ></SingleImage>
        <viewer :images="[formData.two]" v-else>
            <span class="notice_banner">
              <img :src="formData.two" />
            </span>
        </viewer>
      </el-form-item>
      <el-form-item label="链接：" v-if="formData.one == 0"
                    prop="three">
        <el-input v-model.trim="formData.three" v-show="!isCanView"
                  placeholder="请输入"
                  clearable />
        <span v-show="isCanView">{{formData.three}}</span>
      </el-form-item>
      <el-form-item label="公告内容："  v-if="formData.one == 1"
                    prop="four">
        <quillEditor ref="myQuillEditor" v-show="!isCanView"
                     :isChange.sync="isChange"
                     :isProductDetail="true"
                     :content.sync="formData.four" />
        <div v-html="formData.four"
             v-show="isCanView">
          {{ formData.four }}
        </div>
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
// import {
//   lonAndLatEdit
// } from "@/api/customer/customer";
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
        one: 1,
        two: 'https://cdn.kyaoduo.com/upload/file/202307/feb5e6bc-0083-4eed-95be-ac7cf82bf11b.jpeg',
        three: '12',
        four: '<p style="color:red;">2222</p>',
      },
      isChange:false,
      textMap: {
        update: '编辑公告',
        create: '新建公告',
        detail:'公告详情'
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
      this.formData.two = val;
    },
    // 修改定位
    save () {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
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
      this.$nextTick(()=>{
        if (this.$refs.myQuillEditor) {
          this.$refs.myQuillEditor.changeContent(this.formData.four);
        }
      });

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
