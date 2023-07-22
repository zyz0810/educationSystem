<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="已选员工"
                    prop="ids">
        <div class="department-box"
             v-for="(item, index) in selectList"
             :key="index">{{ item.nickname }}</div>
      </el-form-item>
      <el-form-item label="部门"
                    prop="deptId"
                    v-if="role == 'department'">
        <el-cascader :options="paementIds"
                     change-on-select
                     v-model="formData.deptId"
                     :props="propsParm"
                     @change="depart"></el-cascader>
      </el-form-item>
      <el-form-item label="修改职务"
                    v-if="role == 'job'"
                    prop="roleIds">
        <el-select v-model="formData.roleIds"
                   multiple
                   placeholder="修改职务">
          <el-option v-for="(item, index) in rolesList"
                     :key="index"
                     :label="item.roleName"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="role == 'resetPassword'"
                    label="新密码"
                    prop="password">
        <el-input v-model.trim="formData.password"
                  clearable
                  placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item v-if="role == 'resetPassword'"
                    label="确认密码"
                    prop="confirmPassword">
        <el-input v-model.trim="formData.confirmPassword"
                  clearable
                  placeholder="请再次输入密码" />
      </el-form-item>
      <el-form-item label="原因备注"
                    v-if="role != 'resetPassword'">
        <el-input v-model.trim="formData.remark"
                  type="textarea"
                  :rows="6"
                  clearable
                  placeholder="原因备注" />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="option == 'add'"
                 type="primary"
                 @click="save">确 定</el-button>
      <el-button v-else
                 type="primary"
                 @click="modify">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  updateDept,
  getRoles,
  updateRoles,
  resetPassword,
  updateEnabled,
  getCrmUserById,
} from "@/api/system/staff";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    title: {
      required: false,
      type: String,
      default: ""
    },
    role: {
      required: false,
      type: String,
      default: ""
    },
    option: {
      required: false,
      type: String,
      default: "add"
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    selectList: {
      type: Array,
      defalut: []
    },
    departmentList: {
      required: false,
      type: Array,
      defalut: []
    },
    rolesList: {
      type: Array,
      defalut: []
    }
  },
  data () {
    return {
      textMap: {
        update: "编辑员工信息",
        add: "新增员工信息"
      },
      imgDialogVisible: false,
      step: 0,
      formData: {
        deptId: "",
        ids: [],
        remark: "",
        status: "" //帐号状态（0正常 1停用)
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        ids: [{ required: true, message: "请选择员工", trigger: "blur" }],
        deptId: [
          { required: true, message: "请选择修改部门", trigger: "blur" }
        ],
        roleIds: [
          { required: true, message: "请选择修改职务", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ]
      },
      deptName: "",
      dialogFormVisible: false,
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      paementIds: []
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
  mounted () { },
  methods: {
    // 获取详情

    save () {
      let arrs = this.selectList;
      let b = [];
      arrs.forEach((item, index) => {
        b.push(item.id);
      });
      this.formData.ids = b;
      // 修改部门
      if (this.role == "department") {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            updateDept(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({ message: res.resp_msg, type: "success" });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({ message: res.resp_msg, type: "warning" });
                }
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      }
      // 修改职务
      if (this.role == "job") {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            updateRoles(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({ message: res.resp_msg, type: "success" });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({ message: res.resp_msg, type: "warning" });
                }
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      }
      // 启用禁用
      if (this.role == "enable" || this.role == "disable") {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (this.role == "enable") {
              this.formData.status = 0;
            } else {
              this.formData.status = 1;
            }
            updateEnabled(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({ message: res.resp_msg, type: "success" });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({ message: res.resp_msg, type: "warning" });
                }
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      }
      // 重置密码
      if (this.role == "resetPassword") {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            resetPassword(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({ message: res.resp_msg, type: "success" });
                  this.dialogVisible = false;
                  this.$emit("modify");
                } else {
                  this.$message({ message: res.resp_msg, type: "warning" });
                }
              })
              .catch(err => console.log(err));
          } else {
            return false;
          }
        });
      }
    },
    // 部门
    depart (value) {
      this.formData.deptId = value[value.length - 1];
    },
    // 部门筛选
    department (list, ids) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        ids.push(data);
      });
      return ids;
    },
    modify () { },
    open () {
      this.paementIds = this.department(this.departmentList, []);
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        deptId: "",
        ids: [],
        remark: "",
        status: "" //帐号状态（0正常 1停用)
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
  .choose-input {
    border: 1px solid #dedede;
    padding: 0px 10px;
    box-sizing: border-box;
  }
  .department-box {
    border: 1px solid #dedede;
    padding: 0px 10px;
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
</style>
