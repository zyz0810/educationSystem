<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             top="10vh"
             title="新建跟进记录"
             :append-to-body="true"
             class="dialogContainer"
             @open="open">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="跟进类型"
                    prop="followType">
        <el-select v-model="formData.followType"
                   clearable>
          <el-option :label="item.dictName"
                     v-for="(item, index) in follow_List"
                     :key="index"
                     :value="item.dictCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进内容"
                    prop="content">
        <!--<quill-editor v-model="formData.content" />-->
        <el-input type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="formData.content">
        </el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload class="avatar-uploader"
                   :class="formData.followFiles.length==9?'form_upload':''"
                   action
                   multiple
                   name="files"
                   :file-list="formData.followFiles"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :http-request="uploadFile"
                   :limit="9"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog append-to-body
                   :visible.sync="dialogVisiblePri"
                   size="tiny">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="save"
                 type="primary">确定</el-button>
      <el-button class="ml_20"
                 @click="close">取消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import quillEditor from "../quillEditor";
import { mapActions, mapGetters } from "vuex";
import { followSave } from "@/api/customer/customer";
import { uploadFile } from "@/api/common";
export default {
  name: "orderView",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    customerCrmId: {
      required: false,
      type: [Number, String],
      default: ""
    }
  },
  components: {
    quillEditor
  },
  data () {
    return {
      formData: {
        followType: "",
        content: "",
        followFiles: [],
      },
      rules: {
        followType: [
          { required: true, message: "请选择跟进类型", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入跟进内容", trigger: "blur" }
        ]
      },
      dialogImageUrl: '',
      dialogVisiblePri: false
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
    ...mapGetters(["follow_List"])
  },
  methods: {
    // 图片移除
    handleRemove (file, fileList) {
      this.formData.followFiles = fileList
    },
    // 图片放大
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisiblePri = true;
    },
    // 图片上传
    uploadFile (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.formData.followFiles.push({ image: res.picUrl, url: res.picUrl })
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    open () {
      this.getDict();
    },
    ...mapActions(["getDict"]),
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let filesList = []
          this.formData.followFiles.forEach((item, index) => {
            filesList.push(item.image)
          })
          followSave({
            ...this.formData,
            customerCrmId: this.customerCrmId,
            followFiles: filesList.toString()
          }).then(res => {
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.dialogVisible = false;
              this.$emit("success");
            }
          });
        }
      });
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        followType: "",
        content: "",
        followFiles: [],
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scope>
.avatar-uploader {
  display: flex;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/.el-upload-list__item {
  width: 100px;
  height: 80px;
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 80px;
  line-height: 80px;
}
/deep/.el-upload-list--picture-card {
  display: flex;
  flex-wrap: wrap;
}
.avatar {
  margin-right: 20px;
  width: 80px;
  height: 80px;
  display: block;
  margin-top: 0px;
}
.dis {
  line-height: 1.5em;
}
.relative {
  position: relative;
  .absolute {
    position: absolute;
    top: -0px;
    right: 0px;
    font-size: 25px;
    z-index: 9999;
  }
}
.tips {
  font-size: 12px;
  color: #666;
}
/deep/.form_upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
