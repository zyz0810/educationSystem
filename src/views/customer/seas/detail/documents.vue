<template>
  <div>
    <div class="documentInfo">
      <div class="document_title">基本信息</div>
    </div>
    <el-form ref="ruleForm"
             :model="dataInfo"
             label-width="140px"
             class="documentList">
      <el-form-item v-for="(item,index) in dataInfo.configDTOS"
                    :key="index"
                    :label="item.name"
                    :class="item.isMust == 1 ? 'regular' : ''">
        <div class="picBox">
          <div class="my_imgBox"
               v-for="(items,indexChild) in item.image"
               :key="indexChild">
            <el-image style="width: 148px; height: 148px"
                      :src="items"
                      @click="showImg(items)"></el-image>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="30vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
  </div>
</template>

<script>
import { updateEnabled } from "@/api/customer/customer";
export default {
  props: {
    dataInfo: {
      required: true,
      type: [Array, Object],
      default: {}
    }
  },
  mounted () { },
  data () {
    return {
      imgDialogVisible: false,
      dialogImageUrl: ""
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

<style lang="scss" scoped>
.documentInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .document_title {
    font-family: "微软雅黑 Bold", "微软雅黑";
    font-style: normal;
    line-height: 18px;
  }
}
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: center;
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
.el-form {
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
  margin-right: 20px;
  width: 150px;
  height: 150px;
}
/deep/.el-dialog {
  margin-top: 15vh !important;
}
/deep/.regular {
  .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
/deep/.documentList {
  height: 403px;
  overflow-y: scroll;
}
</style>
