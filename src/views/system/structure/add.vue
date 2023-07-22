<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title">
    <el-form ref="ruleForm"
             v-if="step == 0"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="上级部门"
                    prop="parentId"
                    :rules="[{required:!(roles.includes('admin')),message:'请选择上级职务',trigger:'blur'}]">
        <el-cascader change-on-select
                     :options="paementIds"
                     v-model="formData.parentId"
                     :props="propsParm"
                     clearable
                     @change="depart"></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称"
                    prop="deptName">
        <el-input v-model.trim="formData.deptName"
                  placeholder="部门名称"
                  clearable />
      </el-form-item>
      <el-form-item label="负责人员"
                    prop="leaderId">
        <el-select placeholder="负责人员"
                   filterable
                   v-model="formData.leaderId"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="职务描述">
        <el-input type="textarea"
                  :autosize="{ minRows: 5, maxRows: 8 }"
                  v-model.trim="formData.remark"
                  placeholder="职务描述"
                  clearable />
      </el-form-item>
    </el-form>
    <el-form ref="ruleForm"
             v-if="step == 1"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="展示页面"
                    prop="showPage">
        <el-select v-model="formData.showPage"
                   placeholder="请选择展示页面">
          <el-option label="店铺首页"
                     :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片预览"
                    prop="imgUrl">
        <div class="my_imgBox"
             @click="showImg">
          <el-image class="my_img"
                    :src="formData.imgUrl"
                    fit="fill">
            <div slot="error"
                 id="image_slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <input type="file"
               name
               id="fileUpload"
               v-show="false"
               @change="picChange" />
        <el-button type="primary"
                   class="mt_10"
                   @click="fileUpload">上传图片</el-button>
      </el-form-item>
      <el-form-item label="跳转链接"
                    prop="skipUrl">
        <el-input v-model.trim="formData.skipUrl"
                  clearable />
        <el-radio-group v-model="formData.skipType">
          <el-radio :label="1">H5</el-radio>
          <el-radio :label="2">商品详情</el-radio>
          <!-- <el-radio :label="3">分类或搜索</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序值"
                    prop="sortNum">
        <el-input v-model.trim="formData.sortNum"
                  onkeyup="value=value.replace(/[^0-9]*$/ig,'')"
                  clearable />
      </el-form-item>
      <el-form-item label="状态"
                    prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="30vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
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
import { getUsersByRole } from "@/api/common";
import { saveOrUpdateSysDept } from "@/api/structure";
import { findDeptTree, getUsers } from "@/api/system/staff";
import { mapState } from 'vuex'
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
    title: {
      required: false,
      type: String,
      default: "add"
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    item: {
      required: false,
      type: Array / Object,
      default: () => { }
    }
  },
  data () {
    return {
      imgDialogVisible: false,
      step: 0,
      formData: {
        parentId: "",
        deptName: "",
        leaderId: "",
        remark: ""
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "blur" }
        ],
      },
      dialogFormVisible: false,
      deptName: "",
      userOptions: [],
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      departmentList: [],
      paementIds: [],
      dataListAll: [],
      listQuery: {
        page: 1,
        limit: 10
      }
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
    this.getUsersByRole(); //所有下拉用户列表数据
    this.findDeptTree();
  },
  methods: {
    // 获取所有的用户列表
    getListAll () {
      this.listQuery.limit = 10000000;
      getUsers(this.listQuery)
        .then(res => {
          this.dataListAll = res.data.data;
        })
        .catch(err => console.log(err));
    },
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          saveOrUpdateSysDept(this.formData)
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
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.formData.parentId = val.id;
    },
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;
            // this.$emit("modify");
          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    depart (value) {
      this.formData.parentId = value[value.length - 1];
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
      this.getListAll();
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        parentId: "",
        deptName: "",
        leaderId: "",
        remark: ""
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-input {
  border: 1px solid #dedede;
  padding: 0px 10px;
  box-sizing: border-box;
  .span1 {
    color: #999;
  }
  .span2 {
    color: #333;
  }
}
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
