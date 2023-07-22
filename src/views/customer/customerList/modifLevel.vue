<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             @close="close"
             @open="open"
             top="30vh"
             title="批量修改级别">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="上传文件"
                    prop='fileList'>
        <!--

          <el-upload class="upload-demo"
                   action="https://jsonplaceholder.typicode.com/posts/"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :before-remove="beforeRemove"
                   multiple
                   :limit="1"
                   :on-exceed="handleExceed"
                   :file-list="fileList">
          <el-button size="small"
                     type="primary">点击上传</el-button>
        </el-upload>
   -->
        <el-upload class="upload-demo"
                   action
                   :multiple="false"
                   :file-list="payProofUrlList"
                   :on-remove="handleRemove"
                   :http-request="uploadSingleFile"
                   :limit="1"
                   accept=".xlsx, .xls">
          <el-button size="small"
                     type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <div class="level-tips">请先
        <el-link type="primary"
                 href="https://kangyaoduo.oss-cn-hangzhou.aliyuncs.com/upload/template/客户级别批量修改模板.xlsx">下载模板</el-link>，在模板中填写需要导入的信息(客户名称、客户编码、客户级别)，
        然后点击添加文件，上传即可，仅支持上传.xls .xlsx格式文件(且文件大小10M以内)若超出限制，请分批导入。
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { transfer, importInfo } from "@/api/customer/customer";
import { uploadSingleFile } from "@/api/common";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      payProofUrlList: [],
      formData: {
        fileList: [],
      },
      rules: {
        fileList: [{ required: true, message: "请选择接收对象", trigger: "blur" }]
      },
      userOptions: [],
      file: {},
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
  mounted () {
  },
  methods: {
    // 下载模板
    downMode () {
      console.log(1)
    },
    // 图片上传
    uploadSingleFile (e) {
      const file = e.file;
      this.file = file
      // uploadSingleFile(file)
      //   .then(res => {
      //     this.payProofUrlList = [{ name: res.fileName, url: res.fileUrl }]
      //     this.formData.fileList = this.payProofUrlList
      //     this.$message({ message: "上传成功", type: "success" });
      //   })
      //   .catch(e => {
      //   });
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    // 保存
    save () {
      importInfo(this.file)
        .then(res => {
          if (res != 'SUCCESS') {
            this.dialogVisible = true;
          } else {
            this.$message({
              message: '成功',
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("modify");
          }

        })
        .catch(e => {
        });
    },
    open () { },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {});
      this.dialogVisible = false;
      this.payProofUrlList = []
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
}

.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
.level-tips {
  font-size: 12px;
  color: #999;
  line-height: 1.5em;
  margin: 0px 0px 20px;
  span {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
