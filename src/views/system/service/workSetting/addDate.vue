<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="选择日期："
                    prop="workDate">
        <el-date-picker v-model="formData.workDate"
                        format='yyyy-MM-dd'
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="设置状态："
                    prop="isWorkDay">
        <el-radio v-model="formData.isWorkDay"
                  :label="0">工作日</el-radio>
        <el-radio v-model="formData.isWorkDay"
                  :label="1">休息日</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="option.operatorType == 'add'"
                 type="primary"
                 @click="save">确 定</el-button>
      <el-button v-else
                 type="primary"
                 @click="modify">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { definedSetting, updateDefinedSetting } from "@/api/system/config";
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
        add: "新增自定义时间",
        update: "编辑自定义时间"
      },
      formData: {
        id: '',
        workDate: "",
        isWorkDay: ''
      },
      rules: {
        workDate: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        isWorkDay: [
          { required: true, message: "请选择设置状态", trigger: "blur" }
        ]
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
    // 保存
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          definedSetting(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("modify");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
            });
        } else {
          return false;
        }
      });
    },
    // 修改编辑
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateDefinedSetting(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("modify");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
            });
        } else {
          return false;
        }
      });
    },
    open () {
      if (this.option.operatorType != "add") {
        this.formData = this.option.option
        this.formData.workDate = this.$moment(this.option.option.workDate).format("YYYY-MM-DD")
      } else {
        Object.assign(this.formData, {
          workDate: "",
          isWorkDay: 0
        });
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
      })

      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
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
/deep/.el-input__inner {
  width: 100% !important;
}
</style>
