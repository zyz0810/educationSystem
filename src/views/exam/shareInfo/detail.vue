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
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="标题：" prop="title">
        <el-input placeholder="请输入内容" v-model="formData.title" v-show="!isCanView"></el-input>
        <span v-show="isCanView">{{formData.title}}</span>
      </el-form-item>
      <el-form-item label="协议内容："
                    prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 20}"
          placeholder="请输入内容"
          v-model="formData.content" v-show="!isCanView">
        </el-input>
          <span v-show="isCanView">{{formData.content}}</span>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer" v-show="dialogStatus!='detail'">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" class="ml_30" @click="save">保 存</el-button>
    </span>
  </my-dialog>
</template>
<script>
import { setprotocol} from "@/api/aboutUs";
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
        title: '',
        content: '',
      },
      dialogStatus: '',
      textMap: {
        update: '协议内容',
        create: '协议内容',
        detail:'协议内容'
      },
      rules: {
        logo: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        // content: [
        //   { required: true, message: "请输入公告内容", trigger: "blur" }
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
    isCanView(){
      return this.dialogStatus == 'detail'
    }
  },
  methods: {
    // 修改定位
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          setprotocol(this.formData)
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
      this.dialogStatus = this.infoData.type;
      if(this.dialogStatus != 'create'){
        const {title,content} = this.infoData.option;
        this.formData = {title,content};
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      this.formData= {
        title: '',
        content: '',
      };
      this.dialogStatus= '';
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
