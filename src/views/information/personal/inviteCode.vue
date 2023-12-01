<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="400px"
             @close="close"
             @open="open"
             top="15vh"
             title="修改邀请码">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item label="当前邀请码：" prop="name">{{formData.invite_code_old}}</el-form-item>
      <el-form-item label="修改邀请码：" prop="invite_code">
        <el-input v-model.trim="formData.invite_code" clearable placeholder="请输入" />
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer" >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="save">提 交</el-button>
    </span>
  </my-dialog>
</template>
<script>
  import {rebindinvitecode} from "@/api/parent";
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
        formData: {
          user_id:'',
          invite_code_old:'',
          invite_code:'',
        },
        rules: {
          // invite_code: [
          //   { required: true, message: "请输入邀请码", trigger: "blur" }
          // ],
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
      },
    },
    methods: {
      // 修改邀请码
      save () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const {user_id,invite_code,} = this.formData;
            let json = {user_id,invite_code,};
            rebindinvitecode(json)
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
        this.formData.user_id = this.infoData.option.user_id;
        this.formData.invite_code_old = this.infoData.option.invite_code;
      },
      close () {
        this.$refs.ruleForm.clearValidate();
        this.dialogVisible = false;
        this.formData= {
          user_id:'',
          invite_code_old:'',
          invite_code:'',
        };
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
</style>
