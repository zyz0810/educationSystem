<template>
  <div class="basic_infor">
    <div class="basic_box">
      <div class="titleBox">
        <label>基本信息</label>
      </div>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户编号：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.storeSn}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户名称：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.storeName}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">企业统一社会信用代码：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.taxpayerIdentificationNumber}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">联系人：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.linkman}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">联系方式：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.telephone}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户类型：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.customerTypeStr}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户来源：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.sourceStr}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户级别：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.storeLevelStr}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">经营地址：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.areaName}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">详细地址：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.address}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">成交状态：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.bargain==0?'未成交':dataInfo.bargain==1?'已成交':'--'}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">客户状态：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.enabled==0?'禁用':dataInfo.status==0?'启用':'--'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">下单状态：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.orderStatus == 2?'未下单':dataInfo.orderStatus==1?'已下单':'--'}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">最近下单时间：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.orderTime}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">负责人：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.clerkName}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">最后跟进时间：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.followTime  || '--'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">创建时间：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.createTime}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">更新时间：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.updateTime}}</div>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="4"
                v-if="customer == 1">
          <div class="grid-content bg-purple-light">领取时间：</div>
        </el-col>
        <el-col :span="8"
                v-if="customer == 1">
          <div class="grid-content">{{dataInfo.claimTime  || '--'}}</div>
        </el-col>
        <el-col :span="4"
                v-if="customer != 1">
          <div class="grid-content bg-purple-light">加入公海时间：</div>
        </el-col>
        <el-col :span="8"
                v-if="customer != 1">
          <div class="grid-content">{{dataInfo.highseasTime  || '--'}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">备注：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">{{dataInfo.remark || '暂无'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4"
                v-if="customer == 1">
          <div class="grid-content bg-purple-light">最后拜访时间：</div>
        </el-col>
        <el-col :span="8"
                v-if="customer == 1">
          <div class="grid-content">{{dataInfo.signTime  || '--'}}</div>
        </el-col>
        <el-col :span="4"
                v-if="customer == 1">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
        <el-col :span="8"
                v-if="customer == 1">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="documentInfo">
        <div class="titleBox"> <label>证件资料</label> </div>
      </div>
      <el-form ref="ruleForm"
               :rules="rules"
               :model="dataInfo"
               label-width="100px"
               class="documentList">
        <el-form-item v-for="(item,index) in dataInfo.configDTOS"
                      :key="index"
                      :class="item.isMust == 1?'required_icon':''"
                      :label="item.name">
          <div class="box_Ima">
            <div class="image_box">
              <div class="my_imgBox"
                   style=""
                   v-for="(items,indexChild) in item.image"
                   :key="indexChild">
                <el-image style="width: 148px; height: 148px"
                          :src="items"
                          @click="showImg(items)"></el-image>
                <!--expiredStatus  证件状态:0:暂无,1:已过期,2,未过期,3:即将过期-->
                <el-image class="icon"
                          v-if='item.expiredStatus == 1'
                          :src="require('../../../../assets/image/icon_expired.png')"></el-image>
              </div>
              <div class="x_infor"
                   v-if='item.imageList.length != 0'>
                <el-form-item label="证照号码:">
                  <el-input v-if='item.imageList[0]'
                            v-model.trim="item.imageList[0].number"
                            disabled
                            clearable />
                </el-form-item>
                <el-form-item label="证照有效期:">
                  <el-input v-if='item.imageList[0]'
                            v-model.trim="item.imageList[0].startTime"
                            disabled
                            clearable />
                </el-form-item>
                <div>
                  <el-form-item label=" "
                                class="ab">
                    <el-input v-if='item.imageList[0]'
                              v-model.trim="item.imageList[0].endTime"
                              disabled
                              clearable />
                    <!--判断不为空 就是长期-->
                    <el-checkbox class="re"
                                 disabled
                                 v-if='item.imageList[0]'
                                 v-model="item.imageList[0].neverExpire">长期</el-checkbox>
                  </el-form-item>

                </div>

              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <my-dialog :visible.sync="imgDialogVisible"
                 :append-to-body="true"
                 top="9vh">
        <img width="100%"
             :src="dialogImageUrl"
             alt />
      </my-dialog>
    </div>
  </div>
</template>

<script>
import { updateEnabled } from "@/api/customer/customer";
export default {
  props: {
    dataInfo: {
      required: true,
      type: [Object, Array],
      default: {}
    },
    // 客户界面进入0公海1是客户
    customer: {
      required: true,
      type: Number,
      default: 0
    },
    dataInfo: {
      required: true,
      type: [Array, Object],
      default: {}
    }
  },
  data () {
    return {
      imgDialogVisible: false,
      dialogImageUrl: "",
      checked: true,
      aa: '',
      bb: '',
      rules: {
      },
    };
  },
  methods: {
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).catch();
    },
    deleteImg (value, name) {
      if (!value) return;
      const obj = Object.assign({}, this.dataInfo);
      Object.keys(obj).forEach(item => {
        if (item == name) {
          obj[item] = "";
        }
      });
      const {
        secondMedicalLicenseUrl,
        firstMedicalLicenseUrl,
        businessLicenseUrl,
        idcardFrontUrl,
        idcardBackUrl,
        id,
        idcardHeldUrl,
        drugTradeLicenseUrl,
        medicalLicenseUrl,
        foodBusinessLicenseUrl
      } = obj;
      this.hint("确定删除该资料？").then(res => {
        if (res) {
          updateEnabled(obj).then(res => {
            this.$message({ message: res.resp_msg, type: "success" });
            this.$emit("success");
          });
        }
      });
    },
    downloadImg (link, fileName) {
      const linkNode = document.createElement("a");
      linkNode.setAttribute("download", "11");
      // linkNode.download = fileName; //a标签的download属性规定下载文件的名称
      // linkNode.style.display = "none";
      linkNode.href = link;
      linkNode.click(); //模拟在按钮上的一次鼠标单击
      document.body.removeChild(linkNode);
    }
  }
};
</script>

<style lang="scss" scope>
.basic_infor {
  height: 403px;
  overflow-y: scroll;
  padding-right: 20px;
}
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.el-row:last-child {
  border-bottom: 1px solid #dcdfe6;
}
.el-col {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  text-align: center;
}
.el-col:nth-child(4n) {
  border-right: 1px solid #dcdfe6;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  min-height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 0 4px;
}
.row-bg {
  background-color: #f9fafc;
}
.titleBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.margin_b {
  margin-bottom: 10px;
}
.documentInfo {
  margin: 20px 0px 20px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: left;
  // margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    width: 160px;
    height: 40px;
  }
  .el-button:nth-child(2) {
    margin-left: 30px;
  }
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
/deep/.my_imgBox {
  margin-right: 40px !important;
  width: 150px;
  height: 150px;
}
/deep/.el-dialog {
  margin-top: 15vh !important;
}
.box_Ima {
  width: 100%;
  .image_box {
    display: flex;
    position: relative;
    margin: 0px 0px 10px 0px;
    flex-wrap: wrap;
    .my_imgBox {
      margin: 0px 40px 20px 0px;
      position: relative;
    }
    .icon {
      position: absolute;
      z-index: 999999999;
      width: 60px;
      left: 100px;
      top: 100px;
    }
  }
}

.ab {
  position: relative;
  .re {
    position: absolute;
    right: -80px;
  }
}
.required_icon {
  & > .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
</style>