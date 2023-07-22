<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             :append-to-body="true"
             width="36%"
             @close="close"
             @open="open"
             :title="tittle">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="上级职务"
                    prop="parentId"
                    v-if="status == 'editJob'">
        <el-select placeholder="请选择"
                   filterable
                   v-model="formData.parentId"
                   clearable>
          <el-option v-for="(item, index) in superiorPosition"
                     :key="index"
                     :label="item.roleName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="职务名称"
                    prop="roleName">
        <el-input v-model.trim="formData.roleName"
                  :disabled="status == 'add' || status == 'start' || status == 'stop'"
                  placeholder="职务名称"
                  clearable />
      </el-form-item>
      <el-form-item label="所属部门"
                    prop="deptId"
                    v-if="status == 'editJob'">
        <el-cascader change-on-select
                     :options="paementIds"
                     v-model="formData.deptId"
                     :props="propsParm"
                     clearable
                     @change="depart"></el-cascader>
      </el-form-item>
      <el-form-item v-if="status == 'add'"
                    label="添加成员"
                    prop="sortNum">
        <el-select v-model="formData.userIds"
                   clearable
                   multiple
                   filterable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="status == 'editJob'"
                    label="职务描述">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model.trim="formData.remark"
                  placeholder="职务描述"
                  clearable />
      </el-form-item>
      <el-form-item v-if="status == 'start'"
                    label="启用原因">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model.trim="formData.reason"
                  placeholder="请输入启用原因"
                  clearable />
      </el-form-item>
      <el-form-item v-if="status == 'stop'"
                    label="停用原因">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model.trim="formData.reason"
                  placeholder="请输入停用原因"
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
  batchSaveUsersRole,
  saveOrUpdateSysRole,
  updateEnabled
} from "@/api/authority";
import { findDeptTree, getRolesByRole } from "@/api/system/staff";
import { getUsersByRole } from "@/api/common";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    tittle: {
      required: false,
      type: String,
      default: ""
    },
    status: {
      required: false,
      type: String,
      default: ""
    },
    item: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      imgDialogVisible: false,
      step: 0,
      formData: {
        roleId: "",
        roleName: "",
        userIds: "",
        remark: "",
        parentId: '',//职务id
        deptId: '',
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        roleName: [
          { required: true, message: "请输入职务名称", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择所属职务", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请选择所属部门", trigger: "blur" },
        ]
      },
      userOptions: [],
      deptName: "",
      userOptions: [],
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      departmentList: [],
      paementIds: [],
      superiorPosition: [],//上级职务
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
    this.findDeptTree();
    this.getRolesByRole()
  },
  methods: {
    // 保存职务
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 添加人员
          if (this.status == "add") {
            let data = {
              roleId: this.item.id,
              userIds: this.formData.userIds
            };
            batchSaveUsersRole(data)
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
          } else if (this.status == "editJob") {
            saveOrUpdateSysRole(this.formData)
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
          } else if (this.status == "start" || this.status == "stop") {
            //修改职务状态启用停用
            this.status == "start"
              ? (this.formData.status = 0)
              : (this.formData.status = 1);
            this.formData.remark = this.formData.reason;
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
          }
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
            this.$message({ message: res.resp_msg, type: "warning" });
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
    // 上级职务
    getRolesByRole () {
      getRolesByRole()
        .then(res => {
          this.superiorPosition = res.data;
        })
        .catch(err => console.log(err));
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.formData.deptId = val.id;
    },
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(err => console.log(err));
    },
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
    // 接受父组件参数
    open () {
      Object.assign(this.formData, this.item);
      this.paementIds = this.department(this.departmentList, []);
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        roleId: "",
        roleName: "",
        userIds: "",
        remark: "",
        parentId: '',//职务id
        deptId: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
.tips {
  text-align: center;
  color: red;
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
