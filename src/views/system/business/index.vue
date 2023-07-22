<template>
  <el-form ref="ruleForm"
           :model="formData"
           label-width="140px"
           :rules="rules"
           class="formList">
    <el-form-item label="企业名称"
                  prop="name">
      <el-input v-model.trim="formData.name"
                placeholder="客户名称"
                clearable />
    </el-form-item>
    <el-form-item label="公司logo"
                  prop="logo">
      <el-upload class="avatar-uploader"
                 action="https://jsonplaceholder/api-user/file/uploadSingleImage"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl"
             :src="imageUrl"
             class="avatar" />
        <i v-else
           class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <div class="logo-tips">建议尺寸：180x50，支持 JPG、JPEG、PNG格式，图片小于2M</div>
    <el-form-item>
      <el-button type="primary"
                 @click="save"
                 v-rules="'enterprise:set:edit'">保 存</el-button>
      <el-button type="primary"
                 @click="save"
                 v-rules="'admin' || 'enterprise:set:edit'">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { uploadFile } from "@/api/common";
export default {
  data () {
    return {
      formData: {
        name: "",
        logo: ""
      },
      rules: {
        name: [{ required: true, message: "请选择展示页面", trigger: "blur" }],
        logo: [{ required: true, message: "请输入排序值", trigger: "blur" }]
      },
      imageUrl: ""
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
    }
  },
  methods: {
    // 图片上传
    uploadFile (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.imageUrl = res.picUrl;
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    open () { },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {});
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.formList {
  width: 500px;
}
.el-form {
  padding: 0 20px;
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
#image_slot {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.logo-tips {
  line-height: 1.5em;
  color: #999;
  margin: 0px 0px 0px 130px;
}
// 图片上传
.avatar-uploader {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .el-upload {
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .relative {
    position: relative;
    .absolute {
      position: absolute;
      top: -10px;
      right: 0px;
      font-size: 30px;
      z-index: 9999;
    }
    .avatar {
      margin-right: 20px;
      width: 80px;
      height: 80px;
      display: block;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 100px;
    overflow: hidden;
    line-height: 100px;
    text-align: center;
    margin-right: 20px;
    border: 1px dotted #dedede;
  }
}
</style>
