<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             title="修改定位">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="经度"
                    prop="longitude">
        <el-input v-model.trim="formData.longitude"
                  placeholder="请输入经度"
                  clearable />
      </el-form-item>
      <el-form-item label="维度"
                    prop="latitude">
        <el-input v-model.trim="formData.latitude"
                  placeholder="请输入维度"
                  clearable />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
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
    rowList: {
      required: true,
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      formData: {
        id: '',
        longitude: '',
        latitude: '',
        lonAndLat: '',
      },
      rules: {
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" }
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
    }
  },
  methods: {
    // 修改定位
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formData.lonAndLat = `${this.formData.longitude},${this.formData.latitude}`
          lonAndLatEdit(this.formData)
            .then(res => {
              this.$emit("modif");
              this.dialogVisible = false;
            })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    open () {
      this.formData.id = this.rowList.id
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
  .priority_tag {
    .el-radio-button {
      margin-right: 5px;

      &:first-child {
        .el-radio-button__inner {
          color: rgb(248, 47, 55);
          border: 1px solid rgb(248, 47, 55);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(248, 47, 55);
          }
        }
      }
      &:nth-child(2) {
        .el-radio-button__inner {
          color: rgb(250, 151, 38);
          border: 1px solid rgb(250, 151, 38);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(250, 151, 38);
          }
        }
      }
      &:nth-child(3) {
        .el-radio-button__inner {
          color: rgb(107, 155, 202);
          border: 1px solid rgb(107, 155, 202);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(107, 155, 202);
          }
        }
      }
      &:nth-child(4) {
        .el-radio-button__inner {
          color: rgb(153, 153, 153);
          border: 1px solid rgb(153, 153, 153);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(153, 153, 153);
          }
        }
      }

      .el-radio-button__inner {
        padding: 0;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        vertical-align: middle;
        display: inline-block;
        color: white;
        border: none;
        border-radius: 50%;
        box-shadow: none;
      }
    }
  }
}

.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
