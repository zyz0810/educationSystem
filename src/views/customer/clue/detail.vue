<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :top="'15vh'"
             title="线索详情">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="线索名称"
                    prop="name">
        <el-input v-model="formData.name"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="formData.linkman"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.telephone"
                  disabled
                  clearable />
      </el-form-item>

      <el-form-item label="客户地址"
                    prop="address">
        <el-input v-model="formData.address"
                  disabled
                  clearable
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  textarea />
      </el-form-item>
      <el-form-item label="员工定位"
                    prop="userAddress">
        <el-input v-model="formData.userAddress"
                  disabled
                  clearable
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  textarea />
      </el-form-item>
      <el-form-item label="负责人"
                    prop="userName">
        <el-input v-model="formData.userName"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="线索状态"
                    prop="status">
        <el-input v-model="formData.status"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="创建时间"
                    prop="createTime">
        <el-input v-model="formData.createTime"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="上传图片"
                    prop="showPage8">
        <div class="img-box">
          <img v-for="(item,index) in formData.images"
               :key="index"
               @click="showImg(item)"
               :src="item">
        </div>
      </el-form-item>
      <el-form-item label="备注"
                    prop="remark">
        <el-input v-model="formData.remark"
                  disabled
                  clearable
                  placeholder="我是备注内容"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  textarea />
      </el-form-item>
    </el-form>
    <!--图片放大弹窗  -->
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="15vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
  </my-dialog>
</template> 

<script> 
import {
  clueDetail
} from "@/api/clue";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    detailId: {
      required: false,
      type: [String, Number],
      default: ''
    },
  },
  data () {
    return {
      formData: {
        name: '',
        linkman: '',
        telephone: '',
        address: '',
        userAddress: '',
        userName: '',
        status: '',
        showPage8: '',
        createTime: '',
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        userAddress: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        showPage8: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "请输入线索名称", trigger: "blur" }
        ],
      },
      imgDialogVisible: false,
      dialogImageUrl: "",
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
    // 查看图片放大
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    clueDetail () {
      clueDetail({ id: this.detailId })
        .then(res => {
          this.formData = res.data;
          this.formData.createTime = this.$moment(res.data.createTime).format("YYYY-MM-DD HH:mm:ss")
          this.formData.images = res.data.images.split(',')
          this.formData.status = res.data.status == 0
            ? "待转客户"
            : res.data.status == 1
              ? "已转客户"
              : "--";
        })
        .catch(err => console.log(err));
    },
    open () {
      this.clueDetail()
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        name: '',
        linkman: '',
        telephone: '',
        address: '',
        userAddress: '',
        userName: '',
        status: '',
        showPage8: '',
        createTime: '',
        remark: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  height: 680px;
  overflow-y: scroll;
}
.img-box img {
  width: 60px;
  height: 60px;
  margin-right: 5px;
}
</style>
 