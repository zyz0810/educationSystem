<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="500px"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="110px"
             :rules="rules"
             class="formList">
      <el-form-item label="添加黑名单：" prop="black_user_id">
        <el-input v-model.trim="formData.black_user_id"
                  clearable
                  placeholder="请输入用户ID" />
      </el-form-item>
      <el-form-item label="拉黑原因"
                    prop="reason">
        <el-select v-model="formData.reason" placeholder="请选择">
          <el-option v-for="(item, index) in reasonList"
                     :key="'reason'+index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="ext_note">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入内容"
          v-model="formData.ext_note">
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
  import {addblacklist} from "@/api/blackList";

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
      reasonList:{
        required: true,
        type: Array,
        default: []
      },
    },
    data () {
      return {
        formData: {
          black_user_id: '',
          reason: '',
          ext_note: '',
        },
        textMap: {
          create: '添加黑名单',
          update: '添加黑名单',
        },
        dialogStatus: '',
        rules: {
          black_user_id: [
            { required: true, message: "请输入用户ID", trigger: "blur" }
          ],
          reason: [
            { required: true, message: "请选择类型", trigger: "blur" }
          ],
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
      // 保存
      save () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            addblacklist(this.formData)
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
        this.dialogStatus = this.infoData.type;
      },
      close () {
        this.$refs.ruleForm.clearValidate();
        Object.assign(this.formData, {
          black_user_id: '',
          reason: '',
          ext_note: '',
        });
        this.dialogStatus = '';
        this.dialogVisible = false;
      }
    }
  };
</script>

<style lang="scss">
  .el-form {
    padding: 0 20px;
  }
</style>
