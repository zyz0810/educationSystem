<template>
  <div class="login">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="22" :lg="22" :xl="20" class="n-background">
     <img src="./../assets/logo/logo.png" class="login_logo"/>
      <p class="f32 bold logon_title">家庭教育的重要性，影响孩子一生</p>
      <p class="f16">父母是孩子的第一任老师</p>
      <p class="f16">家庭氛围对孩子的影响</p>
      <p class="f16">家庭教育需要科学引导</p>
      <p class="f16">我们也需要注重家庭氛围的营造，为孩子创造一个稳定、和谐的成长环境。只有这样，我们才能让孩子健康、快乐地成长</p>
      <img class="logo_img" src="./../assets/logo/logo_img01.png"/>
<!--      <p class="f12 p_footer">Copyright © 北京XXX数科技有限公司    京ICP备17027560号-2</p>-->
      </el-col>
    </el-row>
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form">
      <h3 class="title-h3">欢迎来到<br/>
        鑫规泽咨询管理平台</h3>
      <el-form-item prop="username">
        <el-input v-model.trim="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入手机号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model.trim="loginForm.password"
                  :type="passwordType" ref="password"
                  auto-complete="off"
                  placeholder="请输入密码"
                  @keyup.enter.native="handleLogin">
          <i slot="suffix" class="el-input__icon el-icon-view f16" @click.stop="showPwd"></i>
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>-->
      <!-- <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin:0px 0px 25px 0px;"
        >记住密码</el-checkbox
      >-->
      <el-form-item style="width:100%;">
        <el-button :loading="loading"
                   size="medium"
                   class="login-button"
                   type="primary"
                   style="width:100%;"
                   @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <p class="text-left ml_20">登录即表示我已阅读并同意<span class="yellow01">《服务协议》</span>和<span class="yellow01">《隐私协议》</span></p>
      </el-form-item>
      <el-form-item style="width:100%; padding: 20px 20px 0 0; text-align: right;">
        <router-link :to="{path: '/password', query: { type: 'forget' }}">
          <span class="red01">忘记密码？</span>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Login",
  data () {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      passwordType: "password",
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission_routes"])
  },
  created () {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    getCode () {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie () {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin () {
      this.$router.push({ path: "/" });
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  height: 100vh;
  background-color: rgb(249,244,222);
  background-image: url("../assets/logo/logo_bg.png");
  background-size: cover;
  /*background: linear-gradient(to bottom, #56ccf2, #2f80ed);*/
  padding: 0px 100px;
  box-sizing: border-box;
  .login_logo{
    width: 60px;
    height: 60px;
  }
  .logo_img{
    width: 250px;
    height: 70px !important;
    margin-top: 20px;
  }
  .p_footer{
    color: #707E98;
  }
}
.title-h3 {
  font-family: AlibabaPuHuiTi-Medium;
  color:#3D3D3D;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0;
  margin: 30px 0 20px 0;
  line-height: 1.5;
}
.title-h6 {
  font-family: AlibabaPuHuiTi-Regular;
  font-size: 20px;
  letter-spacing: 0px;
  color: #1d69b1;
  opacity: 0.54;
  margin: 30px 0px 50px 0px;
}
.el-input__prefix {
  top: 5px;
}
.login-form {
 border-radius: 5px;
  background: #ffffff;
  width: 520px;
  /*height: calc(100vh - 180px);*/
  text-align: center;
  /*flex: 0.5;*/
  padding: 10px 20px;
  .el-form-item__error {
    width: 100% !important;
  }
  /deep/.el-input {
    height: 40px;
    line-height: 40px;
    width: 472px !important;
    .el-input__inner{
      height: 40px;
      line-height: 40px;
    }
    input {
      height: 40px;
      border-radius: 4px;
      background-color: #fff;
      border: 1px solid #DCDFE6;
    }
    input::-webkit-input-placeholder {
      /* placeholder颜色  */
      color: #C0C4CC;
      font-size: 14px;
    }
  }
  .el-form-item__error{
    text-align: left;
    padding-left: 25px;
  }
  .el-button {
    height: 40px;
    background: #F2A249;
    box-shadow: 0px 4px 13px 0px rgba(48, 179, 222, 0.2);
    width: 472px !important;
    border: none;
    color: #ffffff;
    border-radius: 4px;
    /*margin: 10px 0px 0px 0px;*/
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.n-background {
  height: calc(100vh - 180px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 180px 30px;
  img {
    height: 100%;
  }
  p{
    margin: 10px 0;
    line-height: 1.6;
    color:#2B3F66;
    &.logon_title{
      margin: 30px 0 20px;
    }
  }
}
</style>
