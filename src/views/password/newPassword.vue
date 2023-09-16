<template>
  <div class="app-container">
    <top-view-two></top-view-two>
    <div class="content">
      <p class="f20">忘记密码</p>
      <el-form ref="dataForm"
               :inline="true"
               :model="passwordTemp"
               label-width="90px"
               class="password_box"
               :rules="rules">
        <el-form-item label="手机号:"
                      prop="mobile">
          <el-input v-model="passwordTemp.mobile"
                    clearable
                    placeholder="手机号"
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="验证码"
                      prop="verifyCode"
                      class="get_code">
          <el-input ref="username"
                    v-model="passwordTemp.verifyCode"
                    placeholder="请输入验证码"
                    type="text"
                    autocomplete="on" />
          <el-button type="primary"
                     @click="getCode"
                     :disabled="disabled">{{codeTxt}}</el-button>
        </el-form-item>
<!--        <el-form-item label="新密码:"-->
<!--                      prop="password">-->
<!--          <el-input v-model="passwordTemp.password"-->
<!--                    type="password"-->
<!--                    clearable-->
<!--                    placeholder="新的登录密码" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码:"-->
<!--                      prop="confirmPassword">-->
<!--          <el-input v-model="passwordTemp.confirmPassword"-->
<!--                    type="password"-->
<!--                    clearable-->
<!--                    placeholder="确认新的登录密码" />-->
<!--        </el-form-item>-->
      </el-form>
      <div class="submit">
        <el-button class="filter-item"
                   type="primary"
                   @click="resetPassword">提交</el-button>
        <el-button class="filter-item"
                   @click="resetInfo">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPassword } from "@/api/login";
import { getSmsCode } from "@/api/system/code";
import {
  getToken,
  setToken,
  removeToken,
  getMobile,
  setMobile,
  removeMobile
} from "@/utils/auth";
// resetPassword
export default {
  data () {
    return {
      disabled: false,
      listQuery: {},
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      passwordTemp: {
        confirmPassword: "",
        mobile: getMobile(),
        password: "",
        verifyCode: ""
      },
      codeTxt: "获取验证码",
      rules: {
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "change" }
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ]
      }
    };
  },
  mounted () { },
  methods: {
    open () { },
    getCode () {
      if (this.passwordTemp.mobile != "") {
        getSmsCode({ mobile: this.passwordTemp.mobile, type: 2 }).then(res => {
          // this.publishOption = res.data
          // if(res.resp_code == 0){
          this.countdown2(this);
          // }
        });
      } else {
        this.$confirm("请输入手机号码", "提示", {
          type: "warning",
          showCancelButton: false
        })
          .then(() => { })
          .catch(() => { });
      }
    },
    countdown2 (that) {
      let setTime = 60;
      let time = setTime;
      let codeTxt = "验证码";
      return (function timeFn (o) {
        if (time == 0) {
          that.codeTxt = codeTxt;
          that.disabled = false;
          time = setTime;
        } else {
          that.codeTxt = time + "s重试";
          that.disabled = true;
          time--;
          setTimeout(function () {
            timeFn(o);
          }, 1000);
        }
        if (that.dialogFormVisible == false) {
          time = 0;
        }
      })();
    },
    resetPassword () {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          resetPassword(this.passwordTemp).then(res => {
            if (res.resp_code == 0) {
              this.dialogFormVisible = false;
              this.$message({
                message: "密码重置成功",
                type: "success"
              });
            }
          });
        }
      });
    },
    resetInfo () {
      this.passwordTemp = {
        confirmPassword: "",
        mobile: getMobile(),
        password: "",
        verifyCode: ""
      };
      // this.$refs.dataForm.clearValidate()
      // this.$refs.dataForm.clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
  .app-container{
    margin: 0;
    height: 100vh;
    background: #f2f2f2;
    /*height: calc(100vh - 70px)*/
  }
.get_code {
  position: relative;
  button {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.password_box {
  /*width: 1000px;*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  .el-input {
    width: 400px;
  }
}
.content {
  height: 74vh;
  width: 80%;
  min-width: 800px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 10px auto 0;
  padding: 20px 0 0;
  .submit {
    margin-bottom: 20px;
  }
}
</style>
