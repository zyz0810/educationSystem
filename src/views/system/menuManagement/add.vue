<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="700px"
             top="12vh"
             @close="close"
             @open="open"
             :title="textMap[rowInfo.operatorType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="上级菜单" prop="parentId">
<!--        <el-select placeholder="选择上级菜单"-->
<!--                   filterable-->
<!--                   v-model.trim="formData.userId"-->
<!--                   clearable>-->
<!--          <el-option v-for="(item, index) in menuList"-->
<!--                     :key="index"-->
<!--                     :label="item.nickname"-->
<!--                     :value="item.id" />-->
<!--        </el-select>-->
        <el-cascader
          v-model="formData.parentId"
          :options="menuList" :props="props"
          filterable clearable
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="formData.menuType">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="16">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model.trim="formData.name" clearable placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="显示排序" prop="sort">
            <el-input-number v-model="formData.sort" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="权限标识">
        <el-input v-model.trim="formData.permission" clearable placeholder="请输入权限标识" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"
                 :loading="load"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  updateEnabled,
  findDeptTree,
  getRoles,
  saveSysUser,
  getCrmUserById,
  getUsers,
  getUsersSuperior,
} from "@/api/system/staff";

import { mapGetters } from "vuex";
import {saveOrUpdateMenu} from "@/api/system/menu";
import { dict } from "@/api/common";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    rowInfo: {
      required: true,
      type: Object,
      default: {
        operatorType: "add",
      },
    },
    menuList: {
      required: true,
      type: Array,
      default: [],
    },

  },
  data () {
    return {
      props:{
        label:'name',
        value:'id',
        children:'childrens',
        expandTrigger:'hover',
        emitPath:false,
        checkStrictly: true,
      },
      textMap: {
        update: "编辑菜单",
        add: "新增菜单",
        addChild: "新增菜单",
        view: "查看菜单",
        copy: "复制菜单",
      },
      formData: {
        parentId:'',
        menuType:2,
        name:'',
        sort:'',
        permission:''
      },
      load: false,
      menuListAll:[],
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["name", 'level_List']),
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
  },
  methods: {
    handleChange(){},
    // 新增
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.load = true
          saveOrUpdateMenu(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({message: res.resp_msg, type: "success"});
                this.load = false
                this.dialogVisible = false;
                this.$emit("modify");
              }
            })
            .catch(err => {
              this.load = false
            });
        }
      });
    },
    // 编辑
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.load = true
          let formData = Object.assign({}, this.formData);
          if (formData.roleIds.length > 0) {
            formData.roleIds = formData.roleIds.join(",");
          } else {
            formData.roleIds = "";
          }
          saveSysUser(formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.load = false
                this.dialogVisible = false;
                this.$emit("modify");
              } else {
                this.load = false
                this.$message({ message: res.resp_msg, type: "warning" });
              }
            })
            .catch(err => {
              this.load = false
            });
        }
      });
    },

    getTreeData (data) {
      if (data != "" || data != null) {
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].childrens && data[i].childrens.length < 1) {
            // children若为空数组，则将children设为undefined
            // if (data[i].grade == 3) {
            //   data[i].childrens = undefined;
            // }
            this.$delete( data[i],'childrens')
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].childrens);
          }
        }
        return data;
      }
    },
    open () {
      if(this.rowInfo.operatorType == 'update'){
        const {id,parentId, menuType, name, sort, permission} = this.rowInfo.optionInfo;
        this.formData = {id,parentId, menuType, name, sort, permission};
        console.log('haode:'+parentId)
        console.log(this.formData)
      }else if(this.rowInfo.operatorType == 'addChild'){
        let parentId = this.rowInfo.optionInfo.id;
        this.formData = {parentId, menuType:2, name:'', sort:'', permission:''};
        console.log('haode11::'+this.formData.parentId)
        console.log(this.formData)
      }else{
        this.formData = {parentId:'', menuType:2, name:'', sort:'', permission:''};
      }
      this.menuListAll = this.getTreeData(this.menuList);
    },

    close () {
      Object.assign(this.formData, {
          parentId:'',
            menuType:2,
            name:'',
            sort:'',
            permission:''
      });
      this.load= false;
      this.menuListAll = [];
      this.dialogVisible = false;
      this.$refs.ruleForm.clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 40px;
  .choose-input {
    border: 1px solid #dedede;
    padding: 0px 10px;
    box-sizing: border-box;
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
.table-box {
  width: 100%;
  .x-tr {
    width: 100%;
    display: flex;
    // align-items: center;
    top: 0;
    left: 0;

    .x-list {
      flex: 0.2;
      padding: 8px 0px;
      box-sizing: border-box;
      text-align: center;
    }
    .x-list2 {
      flex: 0.3;
      text-align: center;
      padding: 8px 0px;
      box-sizing: border-box;
      .t-input {
        width: 90px;
      }
    }
    .x-list3 {
      flex: 0.9;
      text-align: left;
      padding: 8px 10px;
      box-sizing: border-box;
      .el-select {
        width: 140px;
        padding-right: 10px;
        .el-input {
          width: 140px;
        }
      }
      .t-input {
        width: 90px;
        margin: 0px 0px 4px 10px;
      }
    }
    .x-list4 {
      text-align: left;
      padding: 8px 15px;
      box-sizing: border-box;
      flex: 1;
      width: 45%;
      .t-input {
        width: 90px;
        margin-bottom: 4px;
      }
      /deep/.el-switch__core {
        margin-left: 10px !important;
      }
    }
    .t-header {
      background: rgb(245, 247, 250);
      text-align: center;
      height: 40px;
      border: 1px solid #dedede;
    }
    .t-border {
      border: 1px solid #dedede;
    }
  }
}
/deep/table {
  border-spacing: 0px;
}
/deep/.el-form {
  padding: 0 0px;
}
.assessment-box {
  height: 64vh;
  overflow-y: scroll;
  padding: 0px 15px 0px 0px;
}
</style>
