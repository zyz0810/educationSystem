git<template>
  <div style="width: 80%;">
    <el-form ref="dataForm"
             :model="formData"
             label-width="150px"
             class="provider_data"
             :rules="rules">
      <el-form-item label="服务商类型:"
                    prop="providerCategory"
                    :key="0">
        <el-radio-group v-model="formData.providerCategory"
                        @change="changeProviderCategory">
          <el-radio label="PERSONAL">个人</el-radio>
          <el-radio label="BUSINESE">企业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="真实姓名:"
                    prop="providerName"
                    v-if="formData.providerCategory == 'PERSONAL'"
                    :key="1">
        <el-input v-model.trim="formData.providerName"
                  clearable
                  placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="企业名称:"
                    prop="providerName"
                    v-if="formData.providerCategory == 'BUSINESE'"
                    :key="2">
        <el-input v-model.trim="formData.providerName"
                  clearable
                  placeholder="请输入企业名称" />
      </el-form-item>
      <el-form-item label="统一社会信用代码:"
                    prop="licenseCode"
                    v-if="formData.providerCategory == 'BUSINESE'"
                    :key="3">
        <el-input v-model.trim="formData.licenseCode"
                  clearable
                  placeholder="请输入统一社会信用代码"
                  maxlength="18" />
      </el-form-item>
      <!--      <el-form-item label="联系人姓名:"-->
      <!--                    prop="linkman"-->
      <!--                    :key="3">-->
      <!--        <el-input v-model="formData.linkman"-->
      <!--                  clearable-->
      <!--                  placeholder="请输入联系人姓名"-->
      <!--                  :disabled="true" />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="手机号:"-->
      <!--                    prop="telephone"-->
      <!--                    :key="4">-->
      <!--        <el-input v-model="formData.telephone"-->
      <!--                  clearable-->
      <!--                  placeholder="请输入手机号"-->
      <!--                  :disabled="true" />-->
      <!--      </el-form-item>-->
      <el-form-item label="经营地址："
                    prop="address"
                    :key="4">
        <el-input v-model.trim="formData.address"
                  clearable
                  maxlength="50"
                  placeholder="请输入经营地址" />
      </el-form-item>
      <el-form-item label="服务商级别:"
                    prop="providerType"
                    :key="5">
        <el-radio-group v-model="formData.providerType">
          <el-radio label="CITY_PARTNER"
                    v-if="formData.providerCategory == 'PERSONAL'">合伙人</el-radio>
          <el-radio label="REGIONAL_AGENTS"
                    v-if="formData.providerCategory == 'BUSINESE'">服务商</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="企业营业执照:"
                    ref="businessLicenseUrl"
                    prop="businessLicenseUrl"
                    v-if="formData.providerCategory == 'BUSINESE'"
                    :key="6">
        <el-upload class="avatar-uploader"
                   :class="businessLicenseList.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="businessLicenseList"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :http-request="uploadFile"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="办理人:"
                    prop="entrustType"
                    v-if="formData.providerCategory == 'BUSINESE'"
                    :key="7">
        <el-select v-model="formData.entrustType"
                   placeholder="请选择">
          <el-option label="企业法人"
                     :value="0"></el-option>
          <el-option label="被委托人"
                     :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传委托函:"
                    ref="letterOfAttorneyUrl"
                    prop="letterOfAttorneyUrl"
                    v-if="formData.providerCategory == 'BUSINESE' && formData.entrustType == 1"
                    :key="8">
        <el-upload class="avatar-uploader upload_single"
                   action
                   :multiple="false"
                   name="files"
                   :class="letterOfAttorneyUrlList.length ==1 ?'form_upload':''"
                   :file-list="letterOfAttorneyUrlList"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveFour"
                   :http-request="uploadFileFour"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip"
               slot="tip">上传加盖公章的原件照片或扫描件，支持格式：.jpg .png，单个文件不能超过10M。
            <el-link type="primary"
                     href="https://kangyaoduo.oss-cn-hangzhou.aliyuncs.com/upload/file/%E6%8E%88%E6%9D%83%E5%A7%94%E6%89%98%E4%B9%A6.docx">下载模板</el-link>
          </div>
        </el-upload>

      </el-form-item>
      <el-form-item label="证件资料:"
                    ref="certificatesUrl"
                    prop="certificatesUrl"
                    :key="9"
                    class="upload_multiple">
        <el-upload class="avatar-uploader"
                   :class="certificatesUrlList1.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="certificatesUrlList1"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveOne"
                   :http-request="uploadFileOne"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>法人身份证人面像</i>
        </el-upload>
        <el-upload class="avatar-uploader"
                   :class="certificatesUrlList2.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="certificatesUrlList2"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveTwo"
                   :http-request="uploadFileTwo"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>法人身份证国徽面</i>
        </el-upload>
        <el-upload class="avatar-uploader"
                   :class="certificatesUrlList3.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="certificatesUrlList3"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveThree"
                   :http-request="uploadFileThree"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>法人手持身份证</i>
        </el-upload>
        <!--        <my-dialog append-to-body-->
        <!--                   :visible.sync="dialogVisiblePri"-->
        <!--                   title="查看图片"-->
        <!--                   size="tiny">-->
        <!--          <img width="100%"-->
        <!--               :src="dialogImageUrl"-->
        <!--               alt="">-->
        <!--        </my-dialog>-->
      </el-form-item>
      <el-form-item label="被委托人证件资料:"
                    ref="entrustUserCertificatesUrl"
                    prop="entrustUserCertificatesUrl"
                    v-if="formData.providerCategory == 'BUSINESE' && formData.entrustType == 1"
                    :key="10"
                    class="upload_multiple">
        <el-upload class="avatar-uploader"
                   :class="entrustUserCertificatesUrlList1.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="entrustUserCertificatesUrlList1"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveFive"
                   :http-request="uploadFileFive"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>被委托人身份证人面像</i>
        </el-upload>
        <el-upload class="avatar-uploader"
                   :class="entrustUserCertificatesUrlList2.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="entrustUserCertificatesUrlList2"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveSix"
                   :http-request="uploadFileSix"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>被委托人身份证国徽面</i>
        </el-upload>
        <el-upload class="avatar-uploader"
                   :class="entrustUserCertificatesUrlList3.length ==1 ?'form_upload':''"
                   action
                   :multiple="false"
                   name="files"
                   :file-list="entrustUserCertificatesUrlList3"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemoveSeven"
                   :http-request="uploadFileSeven"
                   :limit="1"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
          <i>被委托人手持身份证</i>
        </el-upload>
        <my-dialog append-to-body
                   :visible.sync="dialogVisiblePri"
                   title="查看图片"
                   size="tiny">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </my-dialog>
      </el-form-item>
      <el-form-item label=""
                    :key="11">
        <el-checkbox v-model="readTxt">我已阅读并同意</el-checkbox><span class="blue01"
              @click="showTxtDialog = true">《服务商协议》</span>
      </el-form-item>
    </el-form>
    <div class="submit text-center">
      <el-button class="filter-item"
                 type="primary"
                 @click="save">提 交</el-button>
    </div>
    <txt :showDialog.sync="showTxtDialog"></txt>
  </div>
</template>

<script>
import txt from "./txt";
import { providerRegister } from "@/api/provider";
import { uploadFile } from "@/api/common";
import { mapGetters } from "vuex";
import addStaff from "../../../staff/add";
import updateDepartment from "../../../staff/updateDepartment";
export default {
  props: {
    provider: {
      required: true,
      type: Object,
      default: {}
    }
  },
  components: { txt },
  data () {
    return {
      showTxtDialog: false,
      readTxt: false,
      update: false,
      businessLicenseList: [],
      dialogVisiblePri: false,
      dialogImageUrl: '',
      letterOfAttorneyUrlList: [],
      certificatesUrlList1: [],
      certificatesUrlList2: [],
      certificatesUrlList3: [],
      certificatesUrl: ['', '', ''],
      entrustUserCertificatesUrlList1: [],
      entrustUserCertificatesUrlList2: [],
      entrustUserCertificatesUrlList3: [],
      entrustUserCertificatesUrl: ['', '', ''],
      formData: {
        providerCategory: 'PERSONAL',
        providerName: '',
        licenseCode: '',
        address: '',
        linkman: '',
        telephone: '',
        businessLicenseUrl: '',
        providerType: 'CITY_PARTNER',
        entrustType: 0,
        certificatesUrl: '',
        letterOfAttorneyUrl: '',
        entrustUserCertificatesUrl: '',
      },
      rules: {
        providerName: [
          { required: true, message: "请输入服务商名称", trigger: "change" }
        ],
        address: [
          { required: true, message: "请输入经营地址", trigger: "change" }
        ],
        // providerType: [
        //   { required: true, message: "请选择服务商级别", trigger: "change" }
        // ],
        licenseCode: [
          { required: true, message: "请输入统一社会信用代码", trigger: "change" }
        ],
        businessLicenseUrl: [
          { required: true, message: "请上传营业执照", trigger: "change" }
        ],
        certificatesUrl: [
          { required: true, message: "请上传证件资料", trigger: "change" }
        ],
        letterOfAttorneyUrl: [
          { required: true, message: "请上传委托函", trigger: "change" }
        ],
        entrustUserCertificatesUrl: [
          { required: true, message: "请上传被委托人证件资料", trigger: "change" }
        ],
      }
    };
  },
  computed: {
    ...mapGetters([
      "avatar",
      "device",
      "sidebar",
      "permission_routes",
      "name",
    ]),
  },
  mounted () {
    if (this.provider.provider) {
      this.update = true
      this.formData = {
        id: this.provider.provider.id,
        providerCategory: 'PERSONAL',
        providerName: this.provider.provider.providerName,
        licenseCode: this.provider.provider.licenseCode,
        address: this.provider.provider.address,
        linkman: this.provider.provider.linkman,
        telephone: this.provider.provider.telephone,
        businessLicenseUrl: this.provider.provider.businessLicenseUrl == ' ' ? [] : this.provider.provider.businessLicenseUrl,
        providerType: '',
        entrustType: this.provider.provider.entrustType,
        certificatesUrl: '',
        letterOfAttorneyUrl: this.provider.provider.letterOfAttorneyUrl,
        entrustUserCertificatesUrl: ''
      }
      if (this.provider.provider.providerType == 0) {
        this.formData.providerType = 'STAFF'
      } else if (this.provider.provider.providerType == 1) {
        this.formData.providerType = 'CITY_PARTNER'
      } else if (this.provider.provider.providerType == 2) {
        this.formData.providerType = 'REGIONAL_AGENTS'
      } else {
        this.formData.providerType = ''
      }
      if (this.provider.provider.providerCategory == 0) {
        this.formData.providerCategory = 'PERSONAL'
      } else if (this.provider.provider.providerCategory == 1) {
        this.formData.providerCategory = 'BUSINESE'
      } else {
        this.formData.providerCategory = ''
      }
      this.businessLicenseList = this.provider.provider.businessLicenseUrl == ' ' || this.provider.provider.businessLicenseUrl == null ? [] : [{ image: this.provider.provider.businessLicenseUrl, url: this.provider.provider.businessLicenseUrl }]
      this.letterOfAttorneyUrlList = this.provider.provider.letterOfAttorneyUrl == ' ' || this.provider.provider.letterOfAttorneyUrl == null ? [] : [{ image: this.provider.provider.letterOfAttorneyUrl, url: this.provider.provider.letterOfAttorneyUrl }]
      if (this.provider.provider.certificatesUrl != '' && this.provider.provider.certificatesUrl != null) {
        // this.formData.certificatesUrl = '';
        this.certificatesUrl = this.provider.provider.certificatesUrl.split(',');
        this.certificatesUrlList1 = [{ image: this.certificatesUrl[0], url: this.certificatesUrl[0] }];
        this.certificatesUrlList2 = [{ image: this.certificatesUrl[1], url: this.certificatesUrl[1] }];
        this.certificatesUrlList3 = [{ image: this.certificatesUrl[2], url: this.certificatesUrl[2] }];
      }
      if (this.provider.provider.entrustUserCertificatesUrl != '' && this.provider.provider.entrustUserCertificatesUrl != null) {
        // this.formData.certificatesUrl = '';
        this.entrustUserCertificatesUrl = this.provider.provider.entrustUserCertificatesUrl.split(',');
        this.entrustUserCertificatesUrlList1 = [{ image: this.entrustUserCertificatesUrl[0], url: this.entrustUserCertificatesUrl[0] }];
        this.entrustUserCertificatesUrlList2 = [{ image: this.entrustUserCertificatesUrl[1], url: this.entrustUserCertificatesUrl[1] }];
        this.entrustUserCertificatesUrlList3 = [{ image: this.entrustUserCertificatesUrl[2], url: this.entrustUserCertificatesUrl[2] }];
      }

    } else {
      this.update = false
      this.formData = {
        providerCategory: 'PERSONAL',
        providerName: '',
        licenseCode: '',
        address: '',
        linkman: this.provider.nickname,
        telephone: this.provider.mobile,
        businessLicenseUrl: '',
        providerType: 'CITY_PARTNER',
        entrustType: 0,
        certificatesUrl: '',
        letterOfAttorneyUrl: '',
        entrustUserCertificatesUrl: '',
      }
    }
  },
  methods: {
    changeRead (val) {
    },
    changeProviderCategory (val) {
      if (val == 'PERSONAL') {
        this.formData.providerType = 'CITY_PARTNER'
      } else {
        this.formData.providerType = 'REGIONAL_AGENTS'
      }
    },
    // 图片移除
    handleRemove (file, fileList) {
      this.businessLicenseList = fileList
      this.formData.businessLicenseUrl = ''
    },
    // 图片移除
    handleRemoveOne (file, fileList) {
      this.certificatesUrlList1 = fileList
      this.formData.certificatesUrl = ''
    },
    // 图片移除
    handleRemoveTwo (file, fileList) {
      this.certificatesUrlList2 = fileList
      this.formData.certificatesUrl = ''
    },
    // 图片移除
    handleRemoveThree (file, fileList) {
      this.certificatesUrlList3 = fileList
      this.formData.certificatesUrl = ''
    },
    // 图片移除
    handleRemoveFour (file, fileList) {
      this.letterOfAttorneyUrlList = fileList
      this.formData.letterOfAttorneyUrl = ''
    },
    // 图片移除
    handleRemoveFive (file, fileList) {
      this.entrustUserCertificatesUrlList1 = fileList
      this.formData.entrustUserCertificatesUrl = ''
    },
    // 图片移除
    handleRemoveSix (file, fileList) {
      this.entrustUserCertificatesUrlList2 = fileList
      this.formData.entrustUserCertificatesUrl = ''
    },
    // 图片移除
    handleRemoveSeven (file, fileList) {
      this.entrustUserCertificatesUrlList3 = fileList
      this.formData.entrustUserCertificatesUrl = ''
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
          this.businessLicenseList = [{ image: res.picUrl, url: res.picUrl }]
          this.formData.businessLicenseUrl = res.picUrl
          this.$refs.businessLicenseUrl.clearValidate("businessLicenseUrl");
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },

    // 图片上传
    uploadFileOne (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.certificatesUrlList1 = [{ image: res.picUrl, url: res.picUrl }]
          this.certificatesUrl[0] = res.picUrl
          if (this.certificatesUrlList1.length > 0 && this.certificatesUrlList2.length > 0 && this.certificatesUrlList3.length > 0) {
            this.$refs.certificatesUrl.clearValidate("certificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    // 图片上传
    uploadFileTwo (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.certificatesUrlList2 = [{ image: res.picUrl, url: res.picUrl }]
          this.certificatesUrl[1] = res.picUrl
          if (this.certificatesUrlList1.length > 0 && this.certificatesUrlList2.length > 0 && this.certificatesUrlList3.length > 0) {
            this.$refs.certificatesUrl.clearValidate("certificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    // 图片上传
    uploadFileThree (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.certificatesUrlList3 = [{ image: res.picUrl, url: res.picUrl }]
          this.certificatesUrl[2] = res.picUrl
          if (this.certificatesUrlList1.length > 0 && this.certificatesUrlList2.length > 0 && this.certificatesUrlList3.length > 0) {
            this.$refs.certificatesUrl.clearValidate("certificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    uploadFileFour (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.letterOfAttorneyUrlList = [{ image: res.picUrl, url: res.picUrl }]
          this.formData.letterOfAttorneyUrl = res.picUrl
          this.$refs.letterOfAttorneyUrl.clearValidate("letterOfAttorneyUrl");
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    // 图片上传
    uploadFileFive (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.entrustUserCertificatesUrlList1 = [{ image: res.picUrl, url: res.picUrl }]
          this.entrustUserCertificatesUrl[0] = res.picUrl
          if (this.entrustUserCertificatesUrlList1.length > 0 && this.entrustUserCertificatesUrlList2.length > 0 && this.entrustUserCertificatesUrlList3.length > 0) {
            this.$refs.entrustUserCertificatesUrl.clearValidate("entrustUserCertificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    // 图片上传
    uploadFileSix (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.entrustUserCertificatesUrlList2 = [{ image: res.picUrl, url: res.picUrl }]
          this.entrustUserCertificatesUrl[1] = res.picUrl
          if (this.entrustUserCertificatesUrlList1.length > 0 && this.entrustUserCertificatesUrlList2.length > 0 && this.entrustUserCertificatesUrlList3.length > 0) {
            this.$refs.entrustUserCertificatesUrl.clearValidate("entrustUserCertificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    // 图片上传
    uploadFileSeven (e) {
      const file = e.file;
      uploadFile(file)
        .then(res => {
          this.entrustUserCertificatesUrlList3 = [{ image: res.picUrl, url: res.picUrl }]
          this.entrustUserCertificatesUrl[2] = res.picUrl
          if (this.entrustUserCertificatesUrlList1.length > 0 && this.entrustUserCertificatesUrlList2.length > 0 && this.entrustUserCertificatesUrlList3.length > 0) {
            this.$refs.entrustUserCertificatesUrl.clearValidate("entrustUserCertificatesUrl");
          }
        })
        .catch(e => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    save () {
      if (this.readTxt) {
        if (this.certificatesUrlList1.length > 0 && this.certificatesUrlList2.length > 0 && this.certificatesUrlList3.length > 0) {
          this.formData.certificatesUrl = this.certificatesUrl.join(',')
        }
        if (this.entrustUserCertificatesUrlList1.length > 0 && this.entrustUserCertificatesUrlList2.length > 0 && this.entrustUserCertificatesUrlList3.length > 0) {
          this.formData.entrustUserCertificatesUrl = this.entrustUserCertificatesUrl.join(',')
        }

        if (this.formData.providerCategory != 'BUSINESE' || this.formData.entrustType != 1) {
          this.formData.letterOfAttorneyUrl = '';
          this.formData.entrustUserCertificatesUrl = '';
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const { providerCategory, providerName, address, providerType, certificatesUrl, linkman, telephone, id } = this.formData
            if (this.formData.providerCategory == 'PERSONAL') {
              providerRegister({ providerCategory, providerName, address, providerType, certificatesUrl, linkman, telephone, id })
                .then(res => {
                  if (res.resp_code == 0) {
                    // if(this.update == true){
                    //   this.$emit("changeActive", 1, 0);
                    // }else{
                    //   this.$emit("changeActive", 1);
                    // }
                    this.$emit("changeActive", 1, 0);
                  }
                })
                .catch(err => console.log(err));
            } else {
              providerRegister(this.formData)
                .then(res => {
                  if (res.resp_code == 0) {
                    // if(this.update == true){
                    //   this.$emit("changeActive", 1, 0);
                    // }else{
                    //   this.$emit("changeActive", 1);
                    // }
                    this.$emit("changeActive", 1, 0);
                  }
                })
                .catch(err => console.log(err));
            }
          }
        })
      } else {
        this.$confirm('请先阅读并同意《服务商协议》', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: "warning"
        }).catch();
      }

    },
  }
};
</script>

<style lang="scss" scope>
.provider_data {
  .el-input {
    width: 300px;
  }
}
.address-tab {
  position: absolute;
  top: 38px;
  left: 0;
  width: 400px;
  z-index: 2003;
  /deep/.el-tabs__content {
    height: 180px;
    overflow-y: scroll;
    max-height: 180px !important;
    overflow: auto;
    padding: 15px 0 15px 15px !important;
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2002;
  background: #fff;
  opacity: 0;
}
.submit {
  margin: 50px 0 50px;
}
.avatar-uploader {
  &.form_upload {
    .el-upload {
      display: none !important;
    }
  }
}
.upload_multiple {
  .avatar-uploader {
    width: 148px;
    height: 148px;
    float: left;
    margin-right: 10px;
  }
  .el-upload--picture-card {
    i {
      font-size: 14px;
      font-style: normal;
    }
  }
}
.upload_single {
  display: block;
}
</style>
