<template>
  <div class="app-container">
    <div class="title-modify">
      <div>查看资料</div>
    </div>
    <div class="content">
      <el-form :inline="true"
               :model="form"
               label-width="100px"
               class="password_box">
        <el-form-item label="员工姓名:"
                      prop="nickname">
          <el-input v-model="form.nickname"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="登录账号:">
          <el-input v-model="form.mobile"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="部门:">
          <el-input v-model="form.deptName"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="职务:">
          <el-input v-model="form.roleName"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="员工性别:">
          <el-radio-group v-model="form.sex"
                          :disabled="true">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在地:">
          <el-input v-model="form.areaName"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="直属上级:">
          <el-input v-model="form.leaderName"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="服务商编号:"
                      v-if="form.provider">
          <el-input v-model="form.provider.providerSn"
                    clearable
                    :disabled="true" />
        </el-form-item>
        <el-form-item label="服务商级别:"
                      v-if="form.provider">
          <el-input v-model="form.provider.providerType"
                    clearable
                    :disabled="true" />
        </el-form-item>
      </el-form>
      <!--      <div class="submit">-->
      <!--        <el-button class="filter-item" type="primary" @click="updateData">提交</el-button>-->
      <!--        <el-button class="filter-item" @click="resetInfo">重置</el-button>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import { getInfo, userUpdate } from "@/api/login";
export default {
  data () {
    return {
      form: {},
    };
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    open () { },
    getInfo () {
      getInfo().then(res => {
        if (res.resp_code == 0) {
          this.form = Object.assign({}, res.data);
          if (res.data.leaderId == 0 || res.data.leaderId == null) {
            this.$set(this.form, "leaderName", "");
          }
          // 0:'员工', 1:'城市服务商', 2:'区域代理商'
          if (res.data.provider) {
            if (res.data.provider.providerType == 1) {
              this.form.provider.providerType = '合伙人'
            } else if (res.data.provider.providerType == 2) {
              this.form.provider.providerType = '服务商'
            }
            // else if(res.data.provider.providerType == 2){
            //   this.form.provider.providerType = '区域代理商'
            // }
            // if(res.data.provider.sn == null){
            //   this.form.provider.sn = '55'
            // }
          }
        }
      });
    },
    updateData () {
      const { id, nickname, sex, username } = this.form;
      userUpdate({ id, nickname, sex, username }).then(res => {
        if (res.resp_code == 0) {
          this.$message({
            message: res.errmsg,
            type: "success"
          });
        }
      });
    },
    resetInfo () {
      this.form.nickname = "";
      this.form.sex = 0;
    }
  }
};
</script>

<style lang="scss" scope>
.title-modify {
  margin-top: 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
  align-items: center;
  padding: 0 20px;
  background: #ffffff;
}
.password_box {
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-input {
    width: 400px;
  }
  .el-radio-group {
    width: 400px;
  }
  .avatar-uploader {
    width: 400px;
  }
}
.content {
  /*height: 74vh;*/
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .submit {
    margin-bottom: 20px;
  }
}
</style>
