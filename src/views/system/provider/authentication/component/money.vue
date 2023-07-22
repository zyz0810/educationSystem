<template>
  <div style="width: 80%">
    <div v-if="status == 2">
      <h2 class="wait_exam m100"><i class="el-icon-circle-check exam_icon green01"></i>审核已通过，请缴纳保证金！</h2>
      <div>
        <h3>保证金：￥{{money}}</h3>
        <h3>选择支付方式</h3>
        <el-radio-group v-model="payType"
                        class="mb20"
                        v-if="instalmentsProportion != '' && instalmentsProportion != null"
                        @change="changePayType">
          <el-radio :label="0">分期扣减</el-radio>
          <el-radio :label="1">全款支付</el-radio>
        </el-radio-group>
        <div v-show="payType == 0">
          <p>每月按服务收益的{{instalmentsProportion}}%还款</p>
          <p class="gray01">选择分期扣减，不需要立即付款，只要每月按固定比例从收益中扣除，直到扣满保证金额度即可</p>
          <el-button class="filter-item mb_30"
                     type="primary"
                     @click="submitInstalmentsProportion">提 交</el-button>
        </div>
        <div class="mb_30"
             v-show="payType == 1">
          <el-button class="filter-item"
                     type="primary"
                     @click="handleZHIFUBAO">扫码支付</el-button>

          <el-button class="filter-item"
                     type="primary"
                     @click="bankPay">银行转账</el-button>
        </div>
        <div class="mt_20"
             v-if="bankPayInfo">
          <h3>银行转账</h3>
          <p>户名：{{bankInfo.bankAccountName}}</p>
          <p>开户行：{{bankInfo.bankBranchName}}</p>
          <p>银行账号：{{bankInfo.bankCardNo}}</p>
          <p class="f12 gray01"
             v-if="bankPayInfo">转账成功后，请回到此页面，点击下方“提交转账凭证”按钮填写转账信息。我们确认到款后，会第一时间为您升级。</p>
        </div>
      </div>
      <el-button class="filter-item mb_30"
                 type="primary"
                 v-if="bankPayInfo"
                 @click="submitPayData">提交转账凭证</el-button>
    </div>
    <my-dialog :visible="dialogZHIFUBAOVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeZHIFUBAO"
               @open="openZHIFUBAO"
               title="缴纳保证金-扫码支付">
      <h2 class="text-center">扫码支付金额：{{money}}元</h2>
      <div id="qrcode"
           class="text-center"
           ref="qrcode"></div>
    </my-dialog>
    <my-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="close"
               @open="open"
               title="提交线下转账记录">
      <el-form ref="ruleForm"
               :model="formData"
               label-width="100px"
               :rules="rules"
               class="formList">
        <el-form-item label="付款人姓名"
                      prop="payerName">
          <el-input v-model="formData.payerName"
                    placeholder="请输入姓名"
                    clearable />
        </el-form-item>
        <el-form-item label="银行账号"
                      prop="payerBankNo">
          <el-input v-model="formData.payerBankNo"
                    placeholder="请输入银行账号"
                    clearable />
        </el-form-item>
        <el-form-item label="转账截图"
                      prop="payProofUrl">
          <el-upload class="avatar-uploader"
                     :class="payProofUrlList.length == 1?'form_upload':''"
                     action
                     :multiple="false"
                     name="files"
                     :file-list="payProofUrlList"
                     list-type="picture-card"
                     :on-preview="handlePictureCardPreview"
                     :on-remove="handleRemove"
                     :http-request="uploadFile"
                     :limit="1"
                     accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog append-to-body
                     :visible.sync="dialogVisiblePri"
                     size="tiny">
            <img width="100%"
                 :src="dialogImageUrl"
                 alt="">
          </el-dialog>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="save">提 交</el-button>
        <el-button class="ml_30"
                   @click="dialogVisible = false">取 消</el-button>
      </span>
    </my-dialog>

  </div>
</template>

<script>
import { findAreaTree, findAreaChilds } from "@/api/area";
import { getDepositOnlinePay, getDepositOfflinePay, submitOfflinePay, submitInstalmentsPay } from '@/api/provider'
import { uploadFile } from "@/api/common";
import QRCode from 'qrcodejs2'
import {
  getToken,
  setToken,
  removeToken,
  getMobile,
  setMobile,
  removeMobile
} from "@/utils/auth";
export default {
  props: {
    status: {
      required: true,
      type: [Number, String],
      default: ""
    },
    money: {
      required: true,
      type: [Number, String],
      default: "0"
    },
    instalmentsProportion: {
      required: true,
      type: [Number, String],
      default: ""
    },
    providerId: {
      required: true,
      type: [Number, String],
      default: ""
    },
  },
  data () {
    return {
      payType: 0,
      qrcode: null,
      payProofUrlList: [],
      dialogVisiblePri: false,
      dialogImageUrl: '',
      bankPayInfo: false,
      bankInfo: {},
      dialogZHIFUBAOVisible: false,
      formData: {
        payerName: '',
        payerBankNo: '',
        payProofUrl: ''
      },
      dialogVisible: false,
      rules: {
        payerName: [
          { required: true, message: "请输入用户名", trigger: "change" }
        ],
        payerBankNo: [
          { required: true, message: "请输入银行账号", trigger: "change" }
        ],
      }
    };
  },
  mounted () {
    if (this.instalmentsProportion == '' && this.instalmentsProportion == null) {
      this.payType = 0
    } else {
      this.payType = 1
    }
  },
  methods: {
    changePayType (val) {
      if (val == 0) {
        this.bankPayInfo = false
      }
    },
    // 图片移除
    handleRemove (file, fileList) {
      this.payProofUrlList = fileList
      this.formData.payProofUrl = ''
    },
    // 图片放大
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisiblePri = true;
    },
    // 图片上传
    uploadFile (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.payProofUrlList = [{ image: res.picUrl, url: res.picUrl }]
          this.formData.payProofUrl = res.picUrl
        })
        .catch(e => {
          this.$message({ message: "上传附件失败", type: "warning" });
        });
    },
    bankPay () {
      this.bankPayInfo = true
      getDepositOfflinePay().then(res => {
        this.bankInfo = res.data
      }).catch(e => {
        this.$message({ message: "失败", type: "warning" });
      });
    },
    submitPayData () {
      this.dialogVisible = true
    },
    handleZHIFUBAO () {
      this.bankPayInfo = false
      this.dialogZHIFUBAOVisible = true
    },
    makeQrcode (text) {
      if (this.qrcode) {
        this.qrcode.clear();
        this.qrcode._el.title = '';
        this.qrcode.makeCode(text);
      } else {
        this.qrcode = new QRCode('qrcode', {
          width: 160, // 设置宽度，单位像素
          height: 160, // 设置高度，单位像素
          text  // 设置二维码内容或跳转地址
        })
        this.qrcode._el.title = '';
      }
    },
    openZHIFUBAO () {
      getDepositOnlinePay({ providerId: this.providerId, depositPaymentType: 0 })
        .then(res => {
          if (res.resp_code == 0) {
            this.makeQrcode(res.data.payParameters.billQRCode)
          }
        })
        .catch(e => {
          this.$message({ message: res.resp_msg, type: "warning" });
        });
    },
    closeZHIFUBAO () {
      this.dialogZHIFUBAOVisible = false
    },
    open () { },
    close () { },
    submitInstalmentsProportion () {
      submitInstalmentsPay({ providerId: this.providerId })
        .then(res => {
          // this.$message({ message: res.resp_msg, type: "success" });
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
            this.dialogVisible = false
            this.$emit("changeActive", 2, 3);
          }
        })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          submitOfflinePay(this.formData).then(res => {
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.dialogVisible = false
              this.$emit("changeActive", 2, 3);
            }
          }).catch(e => {
            this.$message({ message: res.resp_msg, type: "warning" });
          });
        }
      })
    },
  }
};
</script>

<style lang="scss">
.wait_exam {
  display: flex;
  align-item: center;
  line-height: 60px;
  .exam_icon {
    font-size: 60px;
    margin-right: 10px;
  }
}
.m100 {
  margin: 50px 0;
}
.avatar-uploader {
  &.form_upload {
    .el-upload {
      display: none !important;
    }
  }
}
#qrcode {
  img {
    margin: 50px auto 30px;
  }
}
</style>
