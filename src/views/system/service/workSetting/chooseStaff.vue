<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             title="选择员工或部门">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="140px"
             :rules="rules"
             class="formList">
      <!--
        <el-tree :data="data"
                 show-checkbox
                 node-key="id"
                 :default-expanded-keys="[2, 3]"
                 :default-checked-keys="[5]"
                 :props="defaultProps">
        </el-tree>
        -->
      <el-tree :data="companyList"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="tree"
               highlight-current
               :props="defaultProps"
               :default-checked-keys="checkArr"
               @check='check'
               @node-click="handleNodeClick">
      </el-tree>

    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="selectSection">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {

} from "@/api/structure";
import { selectSection, findDeptTreeWithUsers, findById } from "@/api/system/config";
import { } from "@/api/system/config";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: Object,
      default: {
        operatorType: "add",
        option: {}
      }
    },
  },
  data () {
    return {
      formData: {
        empIdList: [],//部门id
        sectionId: '',
      },
      rules: {
        workDate: [
          { required: true, message: "请输入日期", trigger: "blur" }
        ],
        isWorkDay: [
          { required: true, message: "请选择设置状态", trigger: "blur" }
        ]
      },
      companyList: [],
      defaultProps: {
        children: "childrens",
        label: "deptName" || "nickname",
        label: function (a, b) {
          return a.deptName || a.nickname
        },
      },
      checkArr: [],
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
    //时间地点保存
    selectSection () {
      // 过滤字符串的
      let str = this.formData.empIdList.map((item, index) => {
        let arr = []
        if (typeof item == 'string') {
          arr.push(item)
        }
        return arr
      })
      // 过滤nunber的
      let strS = this.formData.empIdList.map((item, index) => {
        let arr = []
        if (typeof item == 'number') {
          arr.push(item)
        }
        return arr
      })
      const strArrN = [].concat.apply([], strS)  //Number  部门
      const strArrS = [].concat.apply([], str) //String    员工
      let rep = new Array();
      for (let i in strArrS) {
        rep[i] = strArrS[i].replace(/-empId/g, "");
      }
      this.formData.empIdList = rep.map(Number)
      selectSection(this.formData)
        .then(res => {
          this.$message({ message: res.resp_msg, type: 'success' });
          this.$emit("modify");
          this.dialogVisible = false
        })
        .catch(() => { });
    },
    check (nodeObj, SelectedObj) {
      let checkData = this.$refs.tree.getCheckedNodes();
      let tree = this.$refs.tree.getCheckedKeys(true);
      var arr = [];
      checkData.forEach(item => {
        if (!item.hasOwnProperty("children")) {
          arr.push(item.id);
        }
      });
      this.formData.empIdList = tree
    },
    handleNodeClick (data) {
      this.formData.empIdList = [data.id]
    },
    // 考勤组根据id查询   
    findById () {
      findById({ id: this.option.option.id })
        .then(res => {
          res.data.empIdList = res.data.empIdList.map((item, index) => {
            return {
              item: item + '-empId'
            }
          })
          let arrs = res.data.empIdList
          let idsStr = arrs.map(function (obj, index) {
            return obj.item;
          }).join(",");
          let qs = idsStr.split(',')
          this.checkArr = this.formData.empIdList = qs
          // this.formData.empIdList = qs
          // 两个数组拼接成一个新数组
          // var arr1 = [1, 2, 3, 4];
          // var arr2 = [5, 6, 7];
          // var arr = arr1.concat(arr2);


        })
        .catch(() => { });
    },
    // 查询部门树
    findDeptTreeWithUsers () {
      findDeptTreeWithUsers()
        .then(res => {
          this.companyList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 保存
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          definedSetting(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("modify");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
            });
        } else {
          return false;
        }
      });
    },
    // 修改编辑
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateDefinedSetting(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.$emit("modify");
                this.dialogVisible = false;
              }
            })
            .catch(() => {
            });
        } else {
          return false;
        }
      });
    },
    open () {
      this.findDeptTreeWithUsers(); // 查询部门树
      this.formData.sectionId = this.option.option.id
      // this.formData.id = this.option.option.id
      this.findById()
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: '',
        empIdList: [],//部门id
      })
      this.checkArr = []
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
/deep/.el-input__inner {
  width: 100% !important;
}
/deep/.el-tree {
  height: 500px;
  overflow: hidden;
  overflow-y: scroll;
  display: block;
}
</style>
