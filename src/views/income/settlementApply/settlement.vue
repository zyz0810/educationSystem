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
                    prop="one">
        <el-radio-group v-model="formData.one">
          <el-radio :label="1">结算成功</el-radio>
          <el-radio :label="2">结算失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失败原因" v-show="formData.one == 2">
        <el-checkbox-group v-model="formData.two">
          <el-checkbox :label="1">姓名有误</el-checkbox>
          <el-checkbox :label="2">开户行错误</el-checkbox>
          <el-checkbox :label="3">银行卡错误</el-checkbox>
          <el-checkbox :label="4">手机号错误</el-checkbox>
          <el-checkbox :label="5">其他原因</el-checkbox>
        </el-checkbox-group>
        <el-input style="width: 90%;"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入失败原因"
          v-model="formData.three">
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
// import {
//   clueDetail
// } from "@/api/clue";
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
        one: 1,
        two: [],
        three: '',
      },
      rules: {
        one: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        two: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
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
    save(){},
    open () {
      // this.clueDetail()
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      this.formData= {
        one: 1,
        two: [],
        three: '',
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
