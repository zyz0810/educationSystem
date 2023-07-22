<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="40%"
             @close="close"
             :append-to-body="true"
             @open="open"
             title="编辑客户">
    <el-steps :active="step"
              simple>
      <el-step name="1"
               title="填写基础信息"
               icon="el-icon-edit"></el-step>
      <el-step name="2"
               title="上传证件信息"
               icon="el-icon-edit"></el-step>
    </el-steps>
    <!--基础信息-->
    <el-form ref="ruleForm"
             v-if="step == 1"
             :model="formData"
             label-width="140px"
             :rules="rules"
             class="formList">
      <el-form-item label="客户名称"
                    prop="storeName">
        <el-input v-model.trim="formData.storeName"
                  placeholder="客户名称"
                  clearable />
      </el-form-item>
      <el-form-item label="统一社会信用代码"
                    prop="taxpayerIdentificationNumber">
        <el-input v-model.trim="formData.taxpayerIdentificationNumber"
                  placeholder="统一社会信用代码"
                  clearable />
      </el-form-item>
      <el-form-item label="联系人"
                    prop="linkman">
        <el-input v-model.trim="formData.linkman"
                  placeholder="联系人"
                  clearable />
      </el-form-item>
      <el-form-item label="手机号"
                    prop="telephone">
        <el-input v-model.trim="formData.telephone"
                  :disabled="option != 'add'"
                  placeholder="手机号"
                  clearable />
      </el-form-item>
      <el-form-item label="经营地址"
                    prop="companyArea">
        <el-input v-model.trim="formData.companyArea"
                  @focus="get"
                  placeholder="请选择经营地址"
                  readonly
                  type="text" />
        <el-tabs type="border-card"
                 v-model="areaNameActive"
                 class="address-tab"
                 v-show="areaTab"
                 :before-leave="changeTab">
          <el-tab-pane label="省"
                       name="province">
            <p v-for="(item, index) in princeOptions"
               :key="index"
               @click="getCity(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="市"
                       name="city">
            <p v-for="(item, index) in cityOptions"
               :key="index"
               @click="getArea(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="区"
                       name="area">
            <p v-for="(item, index) in areaOptions"
               :key="index"
               @click="getStreet(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="街道"
                       name="street">
            <p v-for="(item, index) in streetOptions"
               :key="index"
               @click="getAreaId(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="详细地址"
                    prop="address">
        <el-input v-model.trim="formData.address"
                  clearable
                  placeholder="详细地址" />
      </el-form-item>
      <el-form-item label="客户类型"
                    prop="customerTypeId">
        <el-select placeholder="客户类型"
                   v-model="formData.customerTypeId"
                   @change="getTypeOptions"
                   clearable>
          <el-option v-for="(item, index) in typeOptions"
                     :key="index"
                     :label="item.name"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户来源"
                    prop="source">
        <el-select placeholder="客户来源"
                   @clear="setValueNull"
                   @change="getSource"
                   v-model="formData.source"
                   clearable>
          <el-option v-for="(item, index) in source_List"
                     :key="index"
                     :label="item.dictName"
                     :value="item.dictCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户级别"
                    prop="storeLevel">
        <el-select placeholder="客户级别"
                   @clear="setStoreLevelNull"
                   @change="getStoreLevel"
                   v-model="formData.storeLevel"
                   clearable>
          <el-option v-for="(item, index) in level_List"
                     :key="index"
                     :label="item.dictName"
                     :value="item.dictCode" />
        </el-select>
      </el-form-item>
    </el-form>
    <!--证件信息-->
    <el-form ref="ruleForm"
             v-if="step == 2"
             :model="formData"
             label-width="140px"
             :rules="rules"
             class="formList">
      <el-form-item v-for="(item, index) in qualificationsList"
                    :key="index"
                    :label="item.name"
                    :class="item.isMust == 1 ? 'required_icon' : ''">
        <div class="flex-box">
          <!--:id="(getType == 1 || option == 'add') ?  item.id :  item.parameterId"-->
          <upload :title="item.name"
                  :id="item.parameterId"
                  :isMust="item.isMust"
                  :max="item.max"
                  :eventDetail.sync="item.eventDetail"></upload>
        </div>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model.trim="formData.sortNum"
                  placeholder="请输入备注信息"
                  clearable />
      </el-form-item>
    </el-form>

    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="step == 1"
                 type="primary"
                 @click="next">下一步</el-button>
      <el-button v-if="step == 2"
                 type="primary"
                 @click="back">上一步</el-button>
      <el-button v-if="step == 2"
                 type="primary"
                 @click="save">保 存</el-button>
    </span>
    <div class="mask"
         @click="closeArea"
         v-if="areaTab == true"></div>
  </my-dialog>
</template>

<script>
import { findAreaTree, findAreaChilds } from "@/api/area";
import { updateEnabled, detail, usable, applyCommit, selectByCategoryId, } from "@/api/customer/customer";
import { getCascaderOptions } from "@/utils/common";
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: String,
      default: "edit",
    },
    customerStoreId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    id: {
      required: false,
      type: [String, Number],
      default: ""
    },
    // 客户界面进入0公海1是客户 
    customer: {
      required: false,
      type: [String, Number],
      default: ""
    },
  },
  data () {
    return {
      editableTabs2: [
        {
          title: "填写基础信息",
          name: 1,
          content: "Tab 1 content"
        },
        {
          title: "上传证件信息",
          name: 2,
          content: "Tab 2 content"
        }
      ],
      imgDialogVisible: false,
      step: 1,
      typeOptions: [],
      formData: {
        customerCrmId: '',
        id: '',
        storeName: "",
        taxpayerIdentificationNumber: "",
        linkman: "",
        telephone: "",
        customerTypeId: "",
        source: "",
        storeLevel: "",
        areaId: "",
        address: "",
        remark: "",
        companyArea: "",
        images: [],
        sourceStr: "",
        storeLevelStr: "",
        configDTOS: '',
        images: [],
        storeSn: '',
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        storeName: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        taxpayerIdentificationNumber: [
          { required: true, message: "请输入企业营业执照", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^1[3-9]\d{9}$/.test(value)) {
                cb();
              } else {
                cb(new Error("请输入正确的手机格式"));
              }
            }
          }
        ],
        customerTypeId: [
          { required: true, message: "请选择客户类型", trigger: "blur" }
        ],
        businessLicenseUrl: [
          { required: true, message: "请选择企业营业执照", trigger: "blur" }
        ],
        companyArea: [{ required: true, message: "请选择地区", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        qualificationsImg: [
          { required: true, message: "请上传必要图片", trigger: "blur" }
        ],
      },
      areaList: [],
      areaNameActive: "province",
      state: "",
      speed: 0,
      status: this.$route.query.status ? this.$route.query.status : "",
      areaTab: false,
      categoryOption: [],
      princeOptions: null,
      cityOptions: null,
      areaOptions: null,
      streetOptions: null,
      addressList: [],
      qualificationsList: [],
      index: "",
      indexChil: "",
      returnFalse: '',
      customerCrmId: '',
      getType: 0,//默认
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
    ...mapGetters(["follow_List", "level_List", "source_List"])
  },
  mounted () {
    this.findAreaTree(); // 获取省市区
    this.getDict();
    this.usable();
    this.parentMsg();
  },
  methods: {
    // 获取客户类型的id 获取不同资质
    getTypeOptions (val) {
      selectByCategoryId({ id: val }).then((res) => {
        this.qualificationsList = res.data;
        // this.getType = 1
        // let data = {};
        // this.qualificationsList.map((item) => {
        //   data[item.id] = [
        //     { required: true, message: "请上传必要图片", trigger: "blur" },
        //   ];
        // });
        // Object.assign(this.rules, {
        //   ...data,
        // });
        this.qualificationsList.map((item) => {
          item.parameterId = item.id
        });
      });
    },
    //  清除客户来源
    setValueNull (val) {
      if (!val) {
        this.formData.source = "";
        this.formData.sourceStr = "";
      }
    },
    // 获取客户来源val值
    getSource (val) {
      let obj = {};
      obj = this.source_List.find((item) => {
        return item.dictCode === val;
      });
      this.formData.sourceStr = obj.dictName;
    },
    // 清除客户等级
    setStoreLevelNull (val) {
      if (!val) {
        this.formData.storeLevel = "";
        this.formData.storeLevelStr = "";
      }
    },
    // 获取客户等级val值
    getStoreLevel (val) {
      let obj = {};
      obj = this.level_List.find((item) => {
        return item.dictCode === val;
      });
      this.formData.storeLevelStr = obj.dictName;
    },
    ...mapActions(["getDict"]),
    // 父组件触发子组件
    parentMsg (id) {
      this.customerCrmId = id
      // 客户界面进入0公海1是客户 
      let param = {
        id: this.id,
        claimSearchType: -1
      }
      if (this.customer == 1) {
        delete param.claimSearchType
      }
      detail(param)
        .then(res => {
          if (res.resp_code == 0) {
            this.formData = res.data;
            this.formData.telephone = res.data.mobile || res.data.telephone
            this.formData.companyArea = this.formData.areaName  //地址回显
            this.formData.areaId = this.formData.areaId //地址id回显
            this.qualificationsList = res.data.configDTOS || [];
            this.formData.source == 0
              ? (this.formData.source = "")
              : (this.formData.source = this.formData.source);
            this.formData.storeLevel == 0
              ? (this.formData.storeLevel = "")
              : (this.formData.storeLevel = this.formData.storeLevel);
            this.qualificationsList.forEach(
              item =>
              (item.eventDetail = (item.image).map(i => {
                return {
                  url: i,
                  image: i,
                  parameterId: item.parameterId,
                  expiredStatus: item.expiredStatus,
                };
              }))
            );
          } else {
            this.$message({
              message: res.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 客户列表中客户类型接口
    usable () {
      usable({ limit: 999 })
        .then(res => {
          const data = res.data;
          this.typeOptions = res.data.data;
        })
        .catch(err => console.log(err));
    },
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let newArr = [];
          // 多种上传图片图片拼接
          this.qualificationsList.forEach((item) => {
            newArr = newArr.concat(item.eventDetail);
          });
          // 过滤underfined数据
          let images = newArr.filter(item => item)
          Object.assign(this.formData, {
            images,
          });
          const boo = this.qualificationsList.every((item) => {
            if (item.isMust == 1) {
              return item.eventDetail && item.eventDetail.length;
            } else {
              return true;
            }
          });
          if (!boo) {
            this.$message({ message: "请选择图片", type: "warning" });
            return;
          }
          // 没有customerStoreId的用户,如果你编辑也是走创建用户接口
          if (this.option == "add" || this.formData.customerStoreId == "") {
            //新增
            updateEnabled(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.formData.source == ""
                    ? (this.formData.source = 0)
                    : (this.formData.source = this.formData.source);
                  this.formData.storeLevel == ""
                    ? (this.formData.storeLevel = 0)
                    : (this.formData.storeLevel = this.formData.storeLevel);
                  this.$message({
                    message: res.resp_msg,
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({
                    message: res.resp_msg,
                    type: "warning"
                  });
                }
              })
              .catch(err => console.log(err));
          } else {
            //编辑
            delete this.formData.configDTOS;
            this.formData.id = this.formData.customerStoreId;
            this.formData.customerCrmId = this.customerCrmId
            applyCommit(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({
                    message: res.resp_msg,
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({
                    message: res.resp_msg,
                    type: "warning"
                  });
                }
              })
              .catch();
          }
        } else {
          return false;
        }
      });
    },
    // 获取省市区
    findAreaTree () {
      findAreaTree()
        .then(res => {
          this.areaList = getCascaderOptions(res.data, []);
        })
        .catch();
    },
    // 地区选中的id
    handleChange (value) {
      this.formData.areaId = value[value.length - 1];
    },
    handleItemChange () { },
    // tab切换
    tabClick () { },
    // 下一步
    next () {
      this.step = 2;
    },
    // 上一步
    back () {
      this.step = 1;
    },
    open () { },
    close () {
      this.step = 1;
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        customerCrmId: '',
        id: '',
        storeName: "",
        taxpayerIdentificationNumber: "",
        linkman: "",
        telephone: "",
        customerTypeId: "",
        source: "",
        storeLevel: "",
        areaId: "",
        address: "",
        remark: "",
        companyArea: "",
        images: [],
        sourceStr: "",
        storeLevelStr: "",
        configDTOS: '',
        images: [],
        storeSn: '',
      });
      this.qualificationsList = [];
      this.dialogVisible = false;
    },
    closeArea () {
      this.areaTab = false;
    },
    changeCity (val, id) {
      this.formData.areaId = id;
      findAreaChilds({ id: val }).then((res) => {
        this.areaOptions = res.data;
        this.streetOptions = null;
      });
    },
    changeArea (val, id) {
      this.formData.areaId = id;
      findAreaChilds({ id: val }).then((res) => {
        this.streetOptions = res.data;
      });
    },
    get () {
      this.areaTab = true;
      this.getProvice();
    },
    // 省份
    getProvice () {
      // this.formData.companyArea = "0000"; //默认
      findAreaChilds().then((res) => {
        this.princeOptions = res.data;
      });
    },
    // 城市
    getCity (name, id) {
      this.provinceName = name;
      this.cityName = "";
      this.areaName = "";
      this.streetName = "";
      this.formData.companyArea = name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.cityOptions = res.data;
        this.areaNameActive = "city";
      });
    },
    // 区域
    getArea (name, id) {
      this.cityName = name;
      this.areaName = "";
      this.streetName = "";
      this.formData.companyArea = this.provinceName + " / " + name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.areaOptions = res.data;
        this.areaNameActive = "area";
        if (res.data.length < 1) {
          this.formData.areaId = id;
          this.areaTab = false;
        }
      });
    },
    // 街道
    getStreet (name, id) {
      this.areaName = name;
      this.streetName = "";
      this.formData.companyArea =
        this.provinceName + " / " + this.cityName + " / " + name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.streetOptions = res.data;
        this.areaNameActive = "street";
        if (res.data.length < 1) {
          this.areaTab = false;
        }
      });
    },
    // 获取区域id
    getAreaId (name, id) {
      this.streetName = name;
      this.formData.companyArea =
        this.provinceName +
        " / " +
        this.cityName +
        " / " +
        this.areaName +
        " / " +
        name;
      this.formData.areaId = id;
      this.areaTab = false;
    },
    // 省市区tab切换
    changeTab (activeName, oldActiveName) {
      if (activeName == "city") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        }
      } else if (activeName == "area") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        } else if (this.cityName == "") {
          this.areaNameActive = "city";
          return false;
        }
      } else if (activeName == "street") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        } else if (this.areaName == "") {
          this.areaNameActive = "area";
          return false;
        } else if (this.cityName == "") {
          this.areaNameActive = "city";
          return false;
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 10px 20px 0px !important;
}
.flex-box {
  display: flex;
  width: 100px;
}
/deep/.el-form {
  min-height: 530px;
  overflow-y: scroll;
  height: 530px;
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
#image_slot {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.address-tab {
  position: absolute;
  top: 38px;
  left: 0;
  width: 400px;
  z-index: 2003;
  /deep/.el-tabs__content {
    height: 125px;
    overflow-y: scroll;
    max-height: 150px !important;
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
// 进度条样式
.el-steps {
  margin: 0px 0px 20px;
}
// 图片上传样式
.avatar-uploader {
  width: 100px;
  height: 80px;
  overflow: hidden;
  margin-right: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 80px;
  overflow: hidden;
  line-height: 80px;
  text-align: center;
  margin-right: 20px;
  border: 1px dotted #dedede;
}
.avatar {
  margin-right: 20px;
  width: 80px;
  height: 80px;
  display: block;
  margin-top: 0px;
}
.dis {
  line-height: 1.5em;
}
.relative {
  position: relative;
  .absolute {
    position: absolute;
    top: -0px;
    right: 0px;
    font-size: 25px;
    z-index: 9999;
  }
}
.dialog-footer {
  padding: 10px 0 30px 0px;
}

.required_icon {
  & > .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
</style>
