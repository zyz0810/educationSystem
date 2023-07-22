
<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             append-to-body
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <div class="">
      <el-form ref="ruleForm"
               :rules='rules'
               :model="formData"
               label-width="100px">
        <el-form-item label="备注信息"
                      prop="remark">
          <el-input v-model.trim="formData.remark"
                    placeholder="备注信息"
                    :rows="4"
                    type="textarea"
                    clearable />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload class="avatar-uploader"
                     :class="formData.crmVisitTaskImageParms.length==9?'form_upload':''"
                     action
                     multiple
                     name="files"
                     :file-list="formData.crmVisitTaskImageParms"
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
          <div>支持格式：.jpg .png .gif，最多可上传9张图片</div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">保 存</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { uploadFile } from "@/api/common";
import {
  visitTaskCancel,
  visitTaskNotCompleted,
} from "@/api/visitTask";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: Object,
      default: {
        optionType: "noFished",
        option: {}
      }
    }
  },
  components: {
  },
  data () {
    return {
      textMap: {
        noFished: "未能完成",
        cancel: "取消任务",
      },
      showAddDialog: false,
      dialogImageUrl: '',
      dialogImgVisible: false,
      dialogVisiblePri: false,
      formData: {
        remark: '',
        crmVisitTaskImageParms: [],
        visitTaskId: '',
      },
      rules: {
        remark: [{ required: true, message: "请输入备注内容", trigger: "blur" }],
      },
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
    // 图片移除
    handleRemove (file, fileList) {
      this.formData.crmVisitTaskImageParms = fileList
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
          this.formData.crmVisitTaskImageParms.push({ url: res.picUrl, taskImageUrl: res.picUrl })
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    save () {
      if (this.formData.crmVisitTaskImageParms.length > 0) {
        this.formData.crmVisitTaskImageParms.forEach((item, index) => {
          delete item.uid
          delete item.url
          delete item.status
        })
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.option.operatorType == 'noFished') {//没有完成任务
            visitTaskNotCompleted({
              ...this.formData,
            }).then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.dialogVisible = false;
                this.$emit("modify");
              }
            });
          } else {//取消任务
            visitTaskCancel({
              ...this.formData,
            }).then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.dialogVisible = false;
                this.$emit("modify");
              }
            });
          }

        }
      });
    },
    handleRemove () {

    },
    handlePictureCardPreview () { },
    // 编辑
    addVisitTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },
    modify () {

    },
    open () {
      this.formData.visitTaskId = this.option.option.visitTaskId
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        remark: '',
        crmVisitTaskImageParms: [],
        visitTaskId: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
@import "@/assets/styles/variables.scss";
.border-card {
  margin-top: 20px;
}
.block_title {
  padding-left: 5px;
  border-left: 5px solid $menuActiveText;
}
.avatar-uploader {
  display: flex;
  // flex-wrap: wrap;
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
</style>

