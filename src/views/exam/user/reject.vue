<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="550px"
             @close="close"
             @open="open"
             top="15vh"
             title="退回">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item label="退回原因：" prop="reason">
        <el-radio-group v-model="formData.reason">
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
  import {audituserinfo} from "@/api/parent";
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
        reasonList:['违规个人昵称','违禁头像','违规个人信息'],
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
            audituserinfo(this.formData)
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
        // this.formData.id = this.infoData.option.user_id;
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
        this.reasonList = ['违规个人昵称','违禁头像','违规个人信息'];
        this.dialogVisible = false;
      }
    }
  };
</script>

<style lang="scss">
  .el-form {
    padding: 0 20px;
    .flex {
      display: flex;
    }

  }
  .notice_banner{
    img{
      height: 100px;
    }
  }
  .uploader {
    .el-upload--picture-card {
      display: none;
    }
  }
</style>
