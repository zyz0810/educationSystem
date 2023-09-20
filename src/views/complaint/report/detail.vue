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
             label-width="80px"
             :rules="rules"
             class="formList">

      <el-form-item :label="titleMap[dialogStatus]+'原因'"
                    prop="reason">
        <el-select v-model="formData.reason" placeholder="请选择">
          <el-option v-for="(item, index) in reasonList"
                     :key="index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="备注内容"
                    prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入内容"
          v-model="formData.content">
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
import {complaintstatus} from "@/api/report";
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
    }
  },
  data () {
    return {
      formData: {
        id: '',
        action: '',
        reason: '',
        content: '',
      },
      textMap: {
        reject: '驳回',
        warn: '警告',
        black:'移入黑名单'
      },
      titleMap: {
        reject: '驳回',
        warn: '警告',
        black:'拉黑'
      },
      dialogStatus: '',
      rules: {
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
    // 修改定位
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          complaintstatus(this.formData)
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
      this.formData.action = this.infoData.type;
      this.dialogStatus = this.infoData.type;
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: '',
        action: '',
        reason: '',
        content: '',
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
