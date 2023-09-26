<template>
  <middle-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="700px"
             @close="close"
             @open="open"
             :top="'15vh'"
             title="结算审核">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="结算结果"
                    prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="4">结算成功</el-radio>
          <el-radio :label="5">结算失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失败原因" prop="reason" v-if="formData.status == 5">
        <el-checkbox-group v-model="formData.reason">
          <el-checkbox label="姓名有误"></el-checkbox>
          <el-checkbox label="开户行错误"></el-checkbox>
          <el-checkbox label="银行卡错误"></el-checkbox>
          <el-checkbox label="手机号错误"></el-checkbox>
          <el-checkbox label="其他原因"></el-checkbox>
        </el-checkbox-group>
        <el-input style="width: 90%;"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入失败原因"
          v-model="formData.content">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" class="ml_30" @click="save">确定</el-button>
    </span>
  </middle-dialog>
</template>

<script>
  import {updateapply} from "@/api/income";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    infoData: {
      required: true,
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      formData: {
        id:'',
        status: 4,
        reason: [],
        content: '',
      },
      rules: {
        status: [
          { required: true, message: "请选择结算结果", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "请选择失败原因", trigger: "blur" }
        ],
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
    save(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {id,status}=this.formData;
          let reason = this.formData.reason.join(',')
          updateapply({id,status,reason:reason+this.formData.content}).then(res => {
            this.$message({message: res.errmsg, type: 'success'});
            this.$emit("success");
            this.dialogVisible = false;
          });
        }
      });
    },
    open () {
      this.formData.id = this.infoData.id;
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      this.formData= {
        id:'',
        status: 4,
        reason: [],
        content: '',
      };
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/.el-dialog__body {
    height: 400px;
    overflow-y: scroll;
  }
.img-box img {
  width: 60px;
  height: 60px;
  margin-right: 5px;
}
</style>
