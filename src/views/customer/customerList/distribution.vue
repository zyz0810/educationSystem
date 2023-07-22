<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="30vh"
             title="分配客户">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="接收对象"
                    prop="userId">
        <el-select placeholder="选择对象"
                   filterable
                   v-model="formData.userId"
                   clearable>
          <el-option v-for="(item,index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  v-model.trim="formData.claimRemark"
                  clearable
                  placeholder="请输入备注信息"
                  textarea />
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
import { transfer } from "@/api/customer/customer";
import { getUsersByRole } from "@/api/common";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    selectList: {
      required: false,
      type: Array,
      default: []
    }
  },
  data () {
    return {
      formData: {},
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      rules: {
        userId: [{ required: true, message: "请选择接收对象", trigger: "blur" }]
      },
      userOptions: []
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
  mounted () {
    this.getUsersByRole(); //所有下拉用户列表数据
  },
  methods: {
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let arrs = this.selectList;
          let b = [];
          arrs.forEach((item, index) => {
            b.push(item.id);
          });
          this.formData.ids = b;
          const deptId = this.userOptions.find(
            item => item.id == this.formData.userId
          );

          let formData = Object.assign({}, this.formData)
          this.$set(formData, 'deptId', deptId.deptId)
          transfer(formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({
                  message: '成功',
                  type: "success"
                });
                this.dialogVisible = false;
                this.$emit("modify");
              } else {
                this.$message({
                  message: res.data.resp_msg,
                  type: "warning"
                });
              }
            })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;
            this.$emit("modify");
          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    open () { },
    beginDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.endTime) {
            return new Date(self.formData.endTime).getTime() < time.getTime();
          }
        }
      };
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.startTime) {
            return new Date(self.formData.startTime).getTime() > time.getTime();
          }
        }
      };
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {});
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
  .span {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
    display: inline-block;
    color: white;
    background: red;
    margin: 0px 20px 0px 0px;
    border-radius: 50%;
  }
}

.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
