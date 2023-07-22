<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="选项值名"
                    prop="dictName">
        <el-input v-model.trim="formData.dictName"
                  placeholder="选项值名"
                  clearable />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="option == 'add'"
                 type="primary"
                 :loading="isSave"
                 @click="save">确 定</el-button>
      <el-button v-else
                 type="primary"
                 :loading="isSave"
                 @click="modify">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { addConfig } from "@/api/system/config";
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
        operatorType: "add",
        option: {}
      }
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      textMap: {
        add: "新增客户来源",
        update: "编辑客户来源"
      },
      formData: {
        dictType: "customer_source",
        dictCode: "",
        dictName: "",
        dictSort: "",
        status: 0
      },
      rules: {
        dictName: [
          { required: true, message: "请输入选项值名", trigger: "blur" }
        ]
      },
      isSave: false
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
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isSave = true;
          let formData = Object.assign({}, this.formData);

          addConfig(formData)
            .then(res => {
              this.isSave = false;
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("insertSource");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
              this.isSave = false;
            });
        } else {
          return false;
        }
      });
    },
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isSave = true;
          let formData = Object.assign({}, this.formData);
          formData.dictCode = this.option.dictCode;
          formData.dictSort = this.option.dictSort;
          formData.status = this.option.status;

          addConfig(this.formData)
            .then(res => {
              this.isSave = false;
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("insertSource");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
              this.isSave = false;
            });
        } else {
          return false;
        }
      });
    },
    open () {
      if (this.option.operatorType != "add") {
        this.formData.dictCode = this.option.option.dictCode;
        this.formData.dictSort = this.option.option.dictSort;
        this.formData.status = this.option.option.status;
        this.formData.dictName = this.option.option.dictName;
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        dictType: "customer_source",
        dictCode: "",
        dictName: "",
        dictSort: "",
        status: 0
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
</style>
