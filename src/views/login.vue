<template>
  <div class="login">
    <div class="n-background">
      <img width="100%"
           :src="crm_background"
           alt />
    </div>
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form">
      <!--
        <el-avatar shape="square"
                 :size="100"
                 class="avatar"
                 :src="crm_icon"></el-avatar>
     -->
      <h3 class="title-h3">康药麦麦访销管理后台</h3>
      <h6 class="title-h6">开启线上办公新模式</h6>
      <el-form-item prop="username">
        <el-input v-model.trim="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入你的登录账号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model.trim="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="请输入你的登录密码"
                  @keyup.enter.native="handleLogin">
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { mapGetters, mapActions } from "vuex";
// import crm_icon from "@/assets/logo/crm_icon.jpg";
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
      crm_icon: require("@/assets/logo/crm_icon.png"),
      crm_background: require("@/assets/image/login-background.png"),
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

<style  lang="scss" scope>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  height: 100vh;
  // background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
  background: linear-gradient(to bottom, #56ccf2, #2f80ed);
  padding: 0px 100px;
  box-sizing: border-box;
}
.title-h3 {
  font-family: AlibabaPuHuiTi-Medium;
  font-size: 35px;
  letter-spacing: 0px;
  color: #1d69b1;
  margin: 200px 0px 0px;
}
.title-h6 {
  font-family: AlibabaPuHuiTi-Regular;
  font-size: 20px;
  letter-spacing: 0px;
  color: #1d69b1;
  opacity: 0.54;
  margin: 30px 0px 50px 0px;
}
.avatar {
  margin-top: 30px;
  color: #0079fe;
  margin: auto;
}
.el-input__prefix {
  top: 5px;
}
.login-form {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  background: #ffffff;
  width: 500px;
  // height: 580px;
  height: calc(100vh - 180px);
  // padding: 25px 25px 5px 25px;
  text-align: center;
  flex: 0.5;
  padding: 0px;
  .el-form-item__error {
    width: 100% !important;
  }
  .el-input {
    height: 60px;
    line-height: 60px;
    width: 400px !important;
    input {
      height: 60px;
      text-align: center;
      border: none;
      border-radius: 30px;
      background-color: #f6f6f6;
    }
    input::-webkit-input-placeholder {
      /* placeholder颜色  */
      color: #999;
      font-size: 14px;
    }
  }
  .el-button {
    width: 100px;
    height: 50px;
    background-image: linear-gradient(0deg, #5b86e5 0%, #36d1dc 100%);
    box-shadow: 0px 4px 13px 0px rgba(48, 179, 222, 0.2);
    width: 160px !important;
    border: none;
    color: #ffffff;
    border-radius: 30px;
    margin: 80px 0px 0px 0px;
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
  flex: 0.5;
  img {
    height: 100%;
  }
}
</style>
