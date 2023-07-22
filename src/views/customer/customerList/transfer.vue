<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="30vh"
             title="客户">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="任务名称"
                    prop="sortNum">
        <el-input v-model.trim="formData.sortNum"
                  placeholder="客户名称"
                  clearable />
      </el-form-item>
      <el-form-item label="任务描述"
                    prop="sortNum">
        <el-input v-model.trim="formData.sortNum"
                  clearable
                  placeholder="任务描述"
                  textarea />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="modify">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
export default {
  name: 'transfer',
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {},
      rules: {
        showPage: [
          { required: true, message: "请选择展示页面", trigger: "blur" }
        ]
      }
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
.el-form {
  padding: 0 20px;
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
