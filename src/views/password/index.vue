<template>
  <div class="app-container">
    <top-view-two></top-view-two>
    <div class="content">
     <div class="step_one" v-if="pageType == 'forget' && pageStep == 1">
       <p class="f20 text-center">忘记密码</p>
       <el-form ref="firstForm"
                :model="passwordTemp"
                label-width="0"
                :hide-required-asterisk="true"
                class="password_box"
                :rules="rules">
         <el-form-item label=" "
                       prop="mobile">
           <el-input v-model="passwordTemp.mobile"
                     clearable
                     placeholder="请输入手机号"/>
         </el-form-item>
         <el-form-item label=" "
                       prop="verifyCode"
                       class="get_code">
           <el-input ref="username"
                     v-model="passwordTemp.verifyCode"
                     placeholder="请输入验证码"
                     type="text"
                     autocomplete="on" />
           <el-button type="text"
                      @click="getCode"
                      :disabled="disabled">{{codeTxt}}</el-button>
         </el-form-item>
         <el-form-item label=" " class="submit">
           <el-button type="warning" @click="nextStep(2)">下一步</el-button>
         </el-form-item>
       </el-form>
<!--       <div class="submit">-->
<!--         <el-button type="warning" @click="nextStep(2)">下一步</el-button>-->
<!--       </div>-->
     </div>
      <div class="step_one" v-show="pageType == 'forget' && pageStep == 2">
        <p class="f20 text-center">输入新的密码</p>
        <el-form ref="secondForm"
                 :inline="true"
                 :model="passwordTemp"
                 :hide-required-asterisk="true"
                 label-width="0"
                 class="password_box"
                 :rules="rules">
          <el-form-item label=" " prop="password">
            <el-input v-model="passwordTemp.password"
                      :type="passwordType" ref="password"
                      clearable
                      placeholder="请输入密码" >
              <i slot="suffix" class="el-input__icon el-icon-view f16" @click.stop="showPwd"></i>
            </el-input>
          </el-form-item>
          <el-form-item label=" " prop="confirmPassword" >
            <el-input v-model="passwordTemp.confirmPassword"
                      :type="passwordConfirmType" ref="confirmPassword"
                      clearable
                      placeholder="请再次输入密码" >
              <i slot="suffix" class="el-input__icon el-icon-view f16" @click.stop="showConfirmPwd"></i>
            </el-input>
          </el-form-item>
          <el-form-item label=" " class="submit">
            <el-button type="warning" @click="nextStep(3)">下一步</el-button>
          </el-form-item>
        </el-form>
<!--        <div class="submit">-->
<!--          <el-button type="warning" @click="nextStep(3)">下一步</el-button>-->
<!--        </div>-->
      </div>

      <div class="step_one mt_20" style="padding-top: 50px"  v-if="(pageType == 'update' && pageStep == 2) || (pageType == 'forget' && pageStep == 3)">
        <el-form ref="dataForm"
                 :inline="true"
                 :model="passwordTemp"
                 label-width="0"
                 class="password_box"
                 :rules="rules">
          <el-form-item label=" " prop="confirmPassword" class="text-center">
            <p><i class="iconfont icon-zhengque f76 green02"></i></p>
            <div class="f20">操作成功</div>
            <div class="f14">密码已经找回</div>
          </el-form-item>
          <el-form-item label=" " class="submit">
            <el-button type="warning" @click="handleIndex">返回首页登录</el-button>
          </el-form-item>
        </el-form>
        <!--        <div class="submit">-->
        <!--          <el-button type="warning" @click="nextStep(3)">下一步</el-button>-->
        <!--        </div>-->
      </div>

<!--      修改密码-->
      <div class="step_one" v-if="pageType == 'update' && pageStep == 1">
        <p class="f20 text-center">修改密码</p>
        <el-form ref="thirdForm"
                 :inline="true"
                 :model="passwordTemp"
                 :hide-required-asterisk="true"
                 label-width="0"
                 class="password_box"
                 :rules="rules">
          <el-form-item label=" " prop="password">
            <el-input v-model="passwordTemp.password"
                      type="password"
                      clearable
                      placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label=" " prop="password">
            <el-input v-model="passwordTemp.password"
                      type="password"
                      clearable
                      placeholder="请输入新的密码" />
          </el-form-item>
          <el-form-item label=" " prop="confirmPassword" >
            <el-input v-model="passwordTemp.confirmPassword"
                      type="password"
                      clearable
                      placeholder="请再次输入新的密码" />
          </el-form-item>
          <el-form-item label=" " class="submit">
            <el-button type="warning" @click="updatePassword">确定</el-button>
          </el-form-item>
        </el-form>
        <!--        <div class="submit">-->
        <!--          <el-button type="warning" @click="nextStep(3)">下一步</el-button>-->
        <!--        </div>-->
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
import { validatePhone,isPassword,validateConfirmPassword } from "@/utils/validate";
export default {
  data () {
    return {
      disabled: false,
      passwordTemp: {
        confirmPassword: "",
        mobile: '',
        password: "",
        verifyCode: ""
      },
      codeTxt: "获取验证码",
      passwordType:'password',
      passwordConfirmType:'password',
      pageType:'',
      pageStep: 1,
      rules: {
        confirmPassword: [
          { required: true, message: "请再次输入新密码", trigger: "change" },
          {validator: (rule, value, callback) =>
              validateConfirmPassword(rule, value, callback, this.passwordTemp.password),},
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "change" },
          { validator: isPassword },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          { validator: validatePhone },
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ]
      }
    };
  },
  mounted () {
    console.log(this.$route.query)
    this.pageType = this.$route.query.type ? this.$route.query.type:'forget';
    this.pageStep = 1;
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
    showConfirmPwd() {
      if (this.passwordConfirmType === "password") {
        this.passwordConfirmType = "";
      } else {
        this.passwordConfirmType = "password";
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus();
      });
    },
    nextStep(type){
      if(type == 2){
        this.$refs.firstForm.validate((valid) => {
          if (valid) {
            this.pageStep = 2;
            this.$refs.secondForm.clearValidate();
          }
        })
      }else if(type == 3){
        this.$refs.secondForm.validate((valid) => {
          if (valid) {
            this.pageStep = 3;
          }
        })
      }
    },
    updatePassword(){
      this.pageStep = 2;
    },
    handleIndex(){
      this.$router.push({path:'/'})
    },
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
      let codeTxt = "获取验证码";
      return (function timeFn (o) {
        if (time == 0) {
          that.codeTxt = codeTxt;
          that.disabled = false;
          time = setTime;
        } else {
          that.codeTxt = time + "s";
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
        mobile: '',
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
    top: 5px;
    right: 5px;
  }
}

.password_box {
  /*width: 1000px;*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /*padding-top: 30px;*/
  .el-input {
    width: 470px;
    /deep/.el-input__inner{
      height: 40px;
      line-height: 40px;
    }

  }
}
.content {
  height: 74vh;
  width: 80%;
  min-width: 800px;
  background: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 10px auto 0;
  padding: 30px 0 0;
 .el-form-item{
   margin-bottom: 25px;
 }
  .submit {
    margin-bottom: 20px;
    .el-button{
      font-size: 14px;
      width: 470px;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      /*background: #F2A249;*/
      /deep/span{
        display: inline-block;
      }
    }
  }
}
</style>
