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

      <el-form-item label="驳回原因"
                    prop="one">
        <el-select v-model="formData.one" placeholder="请选择">
          <el-option v-for="(item, index) in reasonList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="备注内容"
                    prop="two">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入内容"
          v-model="formData.two">
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
import {
  lonAndLatEdit
} from "@/api/customer/customer";
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
        one: 1,
        two: 'https://cdn.kyaoduo.com/upload/file/202307/feb5e6bc-0083-4eed-95be-ac7cf82bf11b.jpeg',
        three: '12',
        four: '<p style="color:red;">2222</p>',
      },
      isChange:false,
      textMap: {
        reject: '驳回',
        warn: '警告',
        blacklist:'加入黑名单'
      },
      dialogStatus: '',
      rules: {
        one: [
          { required: true, message: "请选择类型", trigger: "blur" }
        ],
        two: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        three: [
          { required: true, message: "请输入链接", trigger: "blur" }
        ],
        four: [
          { required: true, message: "请输入公告内容", trigger: "blur" }
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
    hasImgSrc(val) {
      this.formData.two = val;
    },
    // 修改定位
    save () {
      // if (this.$refs.myQuillEditor) {
      //   this.$refs.myQuillEditor.changeContent(description);
      // }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formData.lonAndLat = `${this.formData.longitude},${this.formData.latitude}`
          lonAndLatEdit(this.formData)
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
      this.$nextTick(()=>{
        if (this.$refs.myQuillEditor) {
          this.$refs.myQuillEditor.changeContent(this.formData.four);
        }
      });

    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        longitude: '',
        latitude: '',
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
