<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="550px"
             @close="close"
             @open="open"
             top="15vh"
             title="驳回">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item label="驳回原因：" prop="reason">
        <el-radio-group v-model="formData.reason" class="consultant_reason">
          <el-radio v-for="(item,index) in reasonList" :key="index" :label="item">{{item}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回内容：" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20}"
          placeholder="请输入内容"
          v-model="formData.content">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="save">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
  import {auditconsultinfo} from "@/api/counselor";
  export default {
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      infoData:{
        required: true,
        type: Object,
        default: {
          type:'create',
          option:{}
        }
      },
    },
    data () {
      return {
        reasonList:['证书与资质不符合','证书未列入范围','违禁个人昵称','违禁头像','违禁个人信息','其他原因'],
        formData: {
          id: '',
          action: 'reject',
          reason: '',
          content: '',
        },
        rules: {
          reason: [
            { required: true, message: "请选择退回原因", trigger: "blur" }
          ],
        }
      };
    },
    components: {},
    computed: {
      dialogVisible: {
        get () {
          return this.showDialog;
        },
        set (value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    methods: {
      save () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            auditconsultinfo(this.formData)
              .then(res => {
                this.$message({ message: res.errmsg, type: 'success' });
                this.$emit("updateList");
                this.dialogVisible = false;
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      },
      open () {
        this.formData.id = this.infoData.option.id;
      },
      close () {
        this.$refs.ruleForm.clearValidate();
        Object.assign(this.formData, {
          id: '',
          action: 'reject',
          reason: '',
          content: '',
        });
        this.reasonList = ['证书与资质不符合','证书未列入范围','违禁个人昵称','违禁头像','违禁个人信息','其他原因'];
        this.dialogVisible = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .consultant_reason{
    .el-radio{
      line-height: 2;
    }
  }
</style>
