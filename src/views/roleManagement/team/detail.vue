<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             :title="textMap[dialogStatus]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item label="选择角色："
                    prop="role">
        <el-select v-model="formData.role" placeholder="请选择">
          <el-option v-for="(item, index) in roleList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名："
                    prop="name">
        <el-input v-model.trim="formData.name"
                  clearable
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="手机号："
                    prop="mobile">
        <el-input v-model.trim="formData.mobile"
                  clearable
                  placeholder="请输入" />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer" v-show="dialogStatus!='detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="dialogStatus == 'create'?save():updateData()">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
import {
  adduser,updateuser
} from "@/api/role";
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
    roleList:{
      required: true,
      type: Array,
      default: []
    },
  },
  data () {
    return {
      formData: {
        role: '',
        name: '',
        mobile: '',
      },
      textMap: {
        update: '编辑团队用户',
        create: '新建团队用户',
        detail:'团队用户详情'
      },
      dialogStatus: '',
      rules: {
        role: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" }
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
    isCanView(){
      return this.dialogStatus == 'detail'
    }
  },
  methods: {
    updateData() {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateuser(this.formData)
            .then(res => {
              this.$emit("updateList");
              this.dialogVisible = false;
            })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    // 修改定位
    save () {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          adduser(this.formData)
            .then(res => {
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
      this.formData.id = this.infoData.option.id;
      this.dialogStatus = this.infoData.type;
      if(this.infoData.type == 'update'){
        const {id,role, name, mobile,} = this.infoData.option;
        this.formData = {id,role, name, mobile,};
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        role: '',
        name: '',
        mobile: '',
      });
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
