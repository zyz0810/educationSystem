<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="textMap[option]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="上级职务"
                    prop="parentId"
                    :rules="[{required:!(roles.includes('admin')),message:'请选择上级职务',trigger:'blur'}]">
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
                  placeholder="职务名称"
                  clearable />
      </el-form-item>
      <el-form-item label="所属部门"
                    prop="deptId">
        <el-cascader change-on-select
                     :options="paementIds"
                     v-model="formData.deptId"
                     :props="propsParm"
                     clearable
                     @change="depart"></el-cascader>
      </el-form-item>
      <el-form-item label="职务描述">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model.trim="formData.remark"
                  placeholder="职务描述"
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
import { mapState } from 'vuex'
import { saveOrUpdateSysRole } from "@/api/system/staff";
import { findDeptTree, getRolesByRole } from "@/api/system/staff";
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
      default: "add"
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      textMap: {
        update: "编辑职务信息",
        add: "新增职务信息"
      },
      imgDialogVisible: false,
      step: 0,
      formData: {
        parentId: "",
        deptId: '',
        roleName: '',
        remark: '',
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        roleName: [
          { required: true, message: "请输入职务名称", trigger: "blur" },
        ],
        // parentId: [
        //   { required: true, message: "请选择上级职务", trigger: "blur" },
        // ],
        deptId: [
          { required: true, message: "请选择所属部门", trigger: "blur" },
        ]
      },
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
    ...mapState({
      roles: state => state.user.permissions,
    }),
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
    this.findDeptTree();
    this.getRolesByRole()
  },
  methods: {
    // 保存职务
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          saveOrUpdateSysRole(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({
                  message: "新增成功",
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
    open () {
      this.paementIds = this.department(this.departmentList, []);
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        parentId: "",
        deptId: '',
        roleName: '',
        remark: '',
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
