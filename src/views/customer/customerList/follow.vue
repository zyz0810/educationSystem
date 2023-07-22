<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :top="'30vh'"
             title="新建跟进">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="跟进类型"
                    prop="sortNum">
        <el-select v-model="formData.status"
                   clearable>
          <el-option v-for="(item,index) in visitOptions"
                     :key="index"
                     :label="item.dictName"
                     :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进内容"
                    prop="sortNum">
        <el-input v-model.trim="formData.sortNum"
                  clearable
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 6}"
                  placeholder="勤跟进，多签单"
                  textarea />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 class="ml_30"
                 @click="save">保 存</el-button>
    </span>
  </my-dialog>
</template> 

<script>
import {
  followSave
} from "@/api/customer/customer";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    visitOptions: {
      required: false,
      type: Array,
      default: []
    },
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
          followSave(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("modify");
              } else {
                this.$message({
                  message: res.data.resp_msg,
                  type: "warning"
                });
              }
            })
            .catch(err => console.log(err));
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
