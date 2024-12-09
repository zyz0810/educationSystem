<template>
  <my-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
    @open="open"
    top="15vh"
    :title="textMap[dialogStatus]"
  >
    <el-form
      ref="ruleForm"
      :model="formData"
      label-width="120px"
      :rules="rules"
      class="formList"
    >
      <el-form-item label="用户端" prop="target">
        <!--        <el-radio-group v-model="formData.is_consult" :disabled="isCanView">-->
        <!--          <el-radio-button :label="0">家长端</el-radio-button>-->
        <!--          <el-radio-button :label="1">咨询师端</el-radio-button>-->
        <!--        </el-radio-group>-->

        <el-checkbox-group
          v-model="formData.target"
          :disabled="isCanView"
          @change="aa"
        >
          <el-checkbox :label="0">全部用户</el-checkbox>
          <el-checkbox :label="1">家长端</el-checkbox>
          <el-checkbox :label="2">咨询师端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="排序：" prop="weight">
        <el-input
          v-model.trim="formData.weight"
          v-show="!isCanView"
          placeholder="请输入"
          clearable
        />
        <span v-show="isCanView">{{ formData.weight }}</span>
      </el-form-item>
      <el-form-item label="文章标题：" prop="title">
        <el-input
          v-model.trim="formData.title"
          v-show="!isCanView"
          placeholder="请输入"
          clearable
        />
        <span v-show="isCanView">{{ formData.title }}</span>
      </el-form-item>
            <el-form-item label="文章封面：" prop="img">
        <!--        <el-input v-model.trim="formData.two" v-if="!isCanView"-->
        <!--                  placeholder="请输入"-->
        <!--                  clearable />-->
        <SingleImage
          :tempUrl="formData.img"
          v-on:imgSrc="hasImgSrc"
          v-if="!isCanView"
        ></SingleImage>
        <viewer :images="[formData.img]" v-else>
          <span class="notice_banner">
            <img :src="formData.img" />
          </span>
        </viewer>
        <div class="upload_img_tip">
          <p>格式为：jpg/png；不超过1M</p>
          <p>建议尺寸：1420x400</p>
        </div>
      </el-form-item>
      <el-form-item label="文章内容：" prop="content">
        <quillEditor
          ref="myQuillEditor"
          v-show="!isCanView"
          :isChange.sync="isChange"
          :isProductDetail="true"
          :content.sync="formData.content"
        />
        <div v-html="formData.content" v-show="isCanView" class="html_content">
          {{ formData.content }}
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="dialogStatus != 'detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        class="ml_30"
        @click="dialogStatus == 'create' ? save() : updateData()"
        >保 存</el-button
      >
    </span>
  </my-dialog>
</template>
<script>
import { addDocumentDetail, getDocumentDetail, editDocumentDetail,delDocumentDetail } from "@/api/document";
import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
import quillEditor from "@/components/quillEditor/quillEditorProductDetail.vue";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    infoData: {
      required: true,
      type: Object,
      default: {
        type: "create",
        option: {},
      },
    },
  },
  data() {
    return {
      formData: {
        title: "",
        content: "",
        img: "",
        target: [],
        weight: "",
      },
      isChange: false,
      textMap: {
        update: "编辑文章",
        create: "发布文章",
        detail: "文章详情",
      },
      dialogStatus: "",
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        // cmd: [
        //   { required: true, message: "请输入链接", trigger: "blur" }
        // ],
        target: [{ required: true, message: "请选择用户端", trigger: "blur" }],
      },
    };
  },
  components: {
    quillEditor,
    SingleImage
  },
  computed: {
    dialogVisible: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("update:show-dialog", value);
      },
    },
    isCanView() {
      return this.dialogStatus == "detail";
    },
  },
  methods: {
    aa(e) {
      console.log(e);
      console.log("this.formData", this.formData);
    },

    hasImgSrc(val) {
      console.log("图片", val);
      this.formData.img = val;
    },
    // 修改定位
    save() {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let formData = {};
          const { id, title, img, content, weight } = this.formData;
          let target = "";
          if (
            this.formData.target.length == 1 &&
            this.formData.target[0] == [0]
          ) {
            target = 0;
          } else if (
            this.formData.target.length == 1 &&
            this.formData.target[0] == 1
          ) {
            target = 1;
          } else if (
            this.formData.target.indexOf(0) > -1 &&
            this.formData.target.indexOf(1) > -1
          ) {
            target = 2;
          }
          formData = { id, title, img, content, target: target, weight };
          addDocumentDetail(formData)
            .then((res) => {
              this.$message({ message: res.errmsg, type: "success" });
              this.$emit("updateList");
              this.dialogVisible = false;
            })
            .catch((err) => console.log(err));
        } else {
          return false;
        }
      });
    },
    updateData() {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let formData = {};
          const { id, title, img, content, weight } = this.formData;
          let target = "";
          if (
            this.formData.target.length == 1 &&
            this.formData.target[0] == [0]
          ) {
            target = 0;
          } else if (
            this.formData.target.length == 1 &&
            this.formData.target[0] == 1
          ) {
            target = 1;
          } else if (
            this.formData.target.indexOf(0) > -1 &&
            this.formData.target.indexOf(1) > -1
          ) {
            target = 2;
          }
          formData = {
              id,
              title,
              img,
              content,
              target,
              weight,
            };
          editDocumentDetail(formData)
            .then((res) => {
              this.$message({ message: res.errmsg, type: "success" });
              this.$emit("updateList");
              this.dialogVisible = false;
            })
            .catch((err) => console.log(err));
        } else {
          return false;
        }
      });
    },
    open() {
      // 咨询师的 1  家长的 2  全部的 3
      if (this.infoData.type != "create") {
        const { id, title, img, content, weight } = this.infoData.option;
        let target = [];
        if (this.infoData.option.target == 0) {
          target = [0];
        } else if (this.infoData.option.target == 1) {
          target = [1];
        } else if (this.infoData.option.target == 2) {
          target = [0, 1, 2];
        }
        this.formData = { id, title, img, content: content, target: target, weight };
      }
      this.dialogStatus = this.infoData.type;
      this.$nextTick(() => {
        if (this.$refs.myQuillEditor) {
          this.$refs.myQuillEditor.changeContent(this.formData.content);
        }
      });
    },
    close() {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        title: "",
        content: "",
        target: [],
        weight: "",
      });
      this.isChange = false;
      this.textMap = {
        update: "编辑文章",
        create: "新建文章",
        detail: "文章详情",
      };
      this.dialogStatus = "";
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
  .html_content{
    img{
      max-width: 100%;
    }
  }
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
}
.notice_banner {
  img {
    height: 100px;
  }
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
.upload_img_tip {
  color: #999999;
  font-size: 12px;
  p {
    margin: 0;
    line-height: 1.6;
  }
}
.notice_content {
  p {
    margin: 0;
  }
}
</style>
