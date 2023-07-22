
<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             append-to-body
             @close="close"
             @open="open"
             top="15vh"
             :title="title">
    <div class="">
      <el-form ref="ruleForm"
               :model="formData"
               label-width="100px"
               :rules="rules"
               class="formList">
        <el-form-item v-for="(item,index) in formList"
                      :key='index'
                      width=300
                      :label="item.dictName"
                      label-width="150px"
                      :class="item.dictValue.must == true ? 'regular' : ''">
          <!--单行文本输入-->
          <el-input v-model.trim="item.content"
                    :placeholder="item.dictValue.inputTip"
                    :maxlength="item.dictValue.fieldLength"
                    v-if="item.dictLabel == 'input'"
                    clearable />
          <!--多文本输入-->
          <el-input v-model.trim="item.content"
                    :placeholder="item.dictValue.inputTip"
                    :maxlength="item.dictValue.fieldLength"
                    :minlength="item.dictValue.fieldMin"
                    type="textarea"
                    v-if="item.dictLabel == 'text_area'"
                    clearable />
          <div class="el-upload__tip"
               v-if="item.dictLabel == 'text_area' || item.dictLabel == 'input'">{{item.dictValue.fieldDesc}}</div>
          <!--单选输入-->
          <el-radio-group v-model="item.content"
                          v-if="item.dictLabel == 'radio'">
            <el-radio v-for="items in item.dictValue.options"
                      :key="items.optionName"
                      :label="items.optionName"
                      :value="items.optionName"></el-radio>
          </el-radio-group>
          <!--多选输入-->
          <el-checkbox-group v-model="checkboxList"
                             v-if="item.dictLabel == 'check_box'">
            <el-checkbox v-for="items in item.dictValue.options"
                         :key="items.optionName"
                         :label="items.optionName"
                         :value="items.optionName"
                         @change="handleChange($event,items.optionName,index)"></el-checkbox>
          </el-checkbox-group>
          <!--下拉-->
          <el-select v-model="item.content"
                     :placeholder="item.dictValue.inputTip"
                     v-if="item.dictLabel == 'select'">
            <el-option v-for="items in item.dictValue.options"
                       :key="items.optionName"
                       :label="items.optionName"
                       :value="items.optionName">
            </el-option>
          </el-select>
          <!--图片-->
          <div @click="getIndex(index)"
               class="img-box"
               v-if="item.dictLabel == 'image'">
            <UploadOnly :eventDetail.sync="item.contents"></UploadOnly>
            <!--
              <el-upload :class="followImgList.length==9?'form_upload':''"
                        class="avatar-uploader"
                        action
                        multiple
                        name="files"
                        :file-list="followImgList"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :http-request="uploadImg"
                        :limit="9"
                        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
                <i class="el-icon-plus"></i>
              </el-upload>
            -->
            <div slot="tip"
                 class="el-upload__tip">支持格式：.jpg .png ，单个文件不能超过2MB</div>
          </div>
          <!--附件-->
          <div @click="getFileIndex(index)"
               class="file-box">
            <el-upload class="upload-demo"
                       action
                       v-if="item.dictLabel == 'file_upload'"
                       :http-request="uploadFile"
                       :on-change="handleEnclosure"
                       :limit="3"
                       :on-remove="handleRemoveFile"
                       :file-list="productAnnexList"
                       accept=".rar,.zip,.mp3,.mp4">
              <el-button type="primary"
                         :disabled="isEdit">选取文件</el-button>
              <div slot="tip"
                   class="el-upload__tip">支持格式：.rar .zip .mp3 .mp4，单个文件不能超过20MB</div>
            </el-upload>
          </div>
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
    <el-dialog append-to-body
               :visible.sync="imgDialogVisible"
               size="tiny">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
  </my-dialog>
</template>

<script>
import { uploadFile, uploadSingleFile } from "@/api/common";
import {
  getEnableFields,
  visitTaskDone,
} from "@/api/visitTask";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    finishTaskType: {
      required: true,
      type: Object,
      default: () => { }
    },
  },
  components: {
  },
  data () {
    return {
      title: '完成拜访任务',
      showAddDialog: false,
      formData: {

      },
      rules: {
        content: [{ required: true, message: "请完善", trigger: "blur" }],
      },
      formList: [],
      checkboxList: [],
      checkedData: [],
      arr: [],
      dialogImageUrl: '',
      imgDialogVisible: false,
      followImgList: [],
      followFilesList: [],
      imgIndex: '',
      fileIndex: '',
      imgList: [],
      fileList: [],
      productAnnexList: [], //附件
      isEdit: false,
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
    handleEnclosure () { },
    // 文件移除
    handleRemoveFile (file, imgList) {
      this.followFilesList = imgList
    },
    // 图片移除
    handleRemove (file, imgList) {
      this.followImgList = imgList
    },
    // 图片放大
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    getIndex (index) {
      this.imgIndex = index;
    },
    getFileIndex (index) {
      this.fileIndex = index;
    },
    // 图片上传
    uploadImg (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.followImgList.push({ image: res.picUrl, url: res.picUrl })
          // this.formList[this.imgIndex].content = this.followImgList
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    // 附件上传
    uploadFile (e) {
      const file = e.file;
      uploadSingleFile(file)
        .then(res => {
          this.followFilesList.push({ fileName: res.fileName, url: res.fileUrl })
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    //多选功能
    handleChange: function (e, id, index) {
      if (this.arr.indexOf(id) == -1) {
        this.arr.push(id)
      } else {
        this.arr.splice(this.arr.indexOf(id), 1);
      }
      this.formList[index].content = this.arr.toString()
    },
    // 编辑
    addVisitTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },
    save () {
      this.formList.forEach((item, index) => {
        if (item.dictLabel == "image" && item.length) {
          item.content = item.contents.map((items, index) => {
            return items.image;
          }).join(",");
          delete item.contents
        }
      })
      // 附件上传内容
      if (this.followFilesList.length > 0) {
        this.formList[this.fileIndex].fileInfos = this.followFilesList
      }
      // 正则判断必填项
      const boo = this.formList.every((item) => {
        if (item.dictValue.must == true) {
          return item.content || item.fileInfos;
        } else {
          return true;
        }
      });
      if (!boo) {
        this.$message({ message: "请完善信息", type: "warning" });
        return;
      }
      const crmVisitTaskDictParms = this.formList
      crmVisitTaskDictParms.forEach((item, index) => {
        delete item.dictValue.options
        delete item.dictValue.fieldLength
        delete item.status
        delete item.dictType
        delete item.dictValue.inputTip
        delete item.dictValue.must
        delete item.dictValue.fieldDesc
      })
      visitTaskDone({
        crmVisitTaskDictParms,
        visitTaskId: this.finishTaskType.option.visitTaskId
      })
        .then(res => {
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
            this.$emit("modify");
            this.dialogVisible = false;
          }
        })
        .catch(() => { });
    },
    // 获取完成任务所需填写的信息对象
    getEnableFields () {
      getEnableFields()
        .then(res => {
          this.formList = res.data
        })
        .catch(err => console.log(err));
    },
    open () {
      this.getEnableFields()
    },
    close () {
      this.dialogVisible = false
      this.checkedData = []
      this.formList = []
      this.checkboxList = []
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
.img-box {
  /deep/.el-upload-list__item {
    width: 100px;
    height: 80px;
  }
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
/deep/.regular {
  .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
</style>

