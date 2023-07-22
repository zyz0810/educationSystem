<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="84%"
             @close="close"
             top="10vh"
             title
             class="dialogContainer"
             @open="open">
    <div class="flex">
      <div class="describe">
        <div class="e-div">{{ dataInfo.roleName }}</div>
        <div class="e-div2">{{ dataInfo.remark }}</div>
      </div>
      <div class="btn">
        <el-button class="filter-item"
                   icon="el-icon-edit"
                   v-rules="{admin:'admin',ordinary:'role:user:add'}"
                   @click="operation('add')">添加人员</el-button>
        <el-button class="filter-item"
                   icon="el-icon-plus"
                   v-rules="{admin:'admin',ordinary:'role:edit'}"
                   @click="operation('editJob')">编辑职务</el-button>
        <el-button class="filter-item"
                   icon="el-icon-delete"
                   v-rules="{admin:'admin',ordinary:'role:del'}"
                   @click="deleteRole">删除职务</el-button>
      </div>
    </div>
    <el-tabs class="border-card"
             v-model="tab">
      <el-tab-pane label="操作权限"
                   name="first">
        <!--        <operationJurisdiction :id="id"-->
        <!--                               @modify="getRoleById"-->
        <!--                               @close='close'-->
        <!--                               :dataInfo="dataInfo"-->
        <!--                               v-if="tab == 'first'"-->
        <!--                               ref="operationJurisdiction" />-->
        <el-checkbox :indeterminate="isIndeterminate"
                     class="menu_CheckAll"
                     v-model="isCheckAll"
                     @change="checkAllChange">全选</el-checkbox>
        <div class="menu_tree">
          <el-tree v-model="menuPermissionIds"
                   :data="menuList"
                   :check-on-click-node="true"
                   ref="treeMenu"
                   show-checkbox
                   node-key="id"
                   :default-checked-keys="checkedMenu"
                   :props="defaultProps"
                   @check-change="changeTree"></el-tree>
        </div>
        <div class="button">
          <el-button type="primary"
                     size="medium"
                     icon="el-icon-circle-check"
                     @click="setRolePermission">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据权限"
                   name="second">
        <dataJurisdiction :id="id"
                          @close='close'
                          :dataInfo="dataInfo"
                          v-if="tab == 'second'" />
      </el-tab-pane>
      <el-tab-pane label="成员列表"
                   name="three">
        <memberList :id="id"
                    :dataInfo="dataInfo"
                    v-if="tab == 'three'" />
      </el-tab-pane>
    </el-tabs>
    <span slot="footer"
          v-if="tab == 'three'"
          class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </span>
    <!--操作-->
    <operation :showDialog.sync="operationDialog"
               :tittle="tittle"
               @modify="getRoleById"
               :status="status"
               :item="item"></operation>
  </my-dialog>
</template>
<script>
import operationJurisdiction from "./operationJurisdiction";
import memberList from "./memberList";
import dataJurisdiction from "./dataJurisdiction";
import operation from "./../operation";
import { getRoleById, deleteRole, setRolePermission } from "@/api/authority";
import { findTreeList, } from "@/api/system/menu";
export default {
  name: "orderView",
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    id: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  data () {
    return {
      listLoading: false,
      showFollowDialog: false,
      showAddDialog: false,
      showAllocationDialog: false,
      dataInfo: {},
      selectList: [],
      tableHeight: 400,
      tab: "first",
      typeOptions: {
        type: "",
        optionType: "",
        option: {}
      },
      tittle: "",
      operationDialog: false,
      status: "",
      item: {},
      isIndeterminate: false,
      menuPermissionIds: [],
      menuList: [],
      menuAllList: [],
      menuListCurrent: [],
      checkedMenu: [],
      defaultProps: {
        children: "childrens",
        label: "name",
      },
      isCheckAll: false,
    };
  },

  components: {
    operationJurisdiction,
    operation,
    memberList,
    dataJurisdiction
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
    // isCheckAll: {
    //   get () {
    //     return this.checkAll;
    //   },
    //   set (value) {
    //     let arr = [];
    //     this.operationList.map((item) => {
    //       const list = item.childrens.map((i) => i.id);
    //       arr = arr.concat(list);
    //     });
    //     this.menuPermissionIds = value ? arr : [];
    //     this.operationList.forEach((item) => (item.isCheck = value));
    //     this.checkAll = value;
    //   },
    // },

  },
  methods: {
    changeTree (one, two, three) {
      this.menuListCurrent = this.$refs.treeMenu.getCheckedKeys();
      if (this.menuListCurrent.length == 0) {
        this.isIndeterminate = false;
        this.isCheckAll = false;
      } else if (this.menuListCurrent.length != 0 && this.menuListCurrent.length < this.menuAllList.length) {
        this.isIndeterminate = true;
        this.isCheckAll = false;
      } else {
        this.isIndeterminate = false;
        this.isCheckAll = true;
      }
    },
    checkAllChange () {
      if (this.isCheckAll) { // 全选
        this.$nextTick(() => {    //这个如果要默认全选就必须加，否则会报错“setCheckedNodes”未定义
          this.$refs.treeMenu.setCheckedNodes(this.menuList)
        })
        // this.
      } else { // 取消选中
        this.$nextTick(() => {
          this.$refs.treeMenu.setCheckedKeys([])
        })
      }
    },
    //操作
    operation (val, val2) {
      this.status = val;
      this.item = this.dataInfo;
      if (this.status == "add") {
        this.operationDialog = true;
        this.tittle = "职务中添加人员";
      } else if (this.status == "editJob") {
        this.operationDialog = true;
        this.tittle = "编辑职务";
      }
    },
    open () {
      this.tab = "first";
      this.getRoleById();
      // this.getTreeList();

    },
    transfer () {
      this.selectList = [{ id: this.id }];
      this.showAllocationDialog = true;
    },
    editorNewFollow () {
      this.showFollowDialog = true;
    },
    callBack () {
      if (this.tab == "first") {
        this.$refs.operationJurisdiction.getRoleById();
      }
    },
    // 获取全部菜单
    getTreeList () {
      findTreeList().then(res => {
        this.menuList = res.data;
      })
    },
    // 保存接口
    setRolePermission () {
      let data = {
        roleId: this.id,
        dataScope: this.dataInfo.dataScope,
        menuPermissionIds: this.$refs.treeMenu.getCheckedKeys(), //权限ids
      };
      setRolePermission(data).then((res) => {
        if (res.resp_code == 0) {
          this.$message({ message: res.resp_msg, type: "success" });
          // this.$emit("close");
        }
      });
    },
    getFlatArr (arr) {
      return arr.reduce((a, item) => {
        let flatArr = [...a, item];

        if (item.childrens) {
          flatArr = [...flatArr, ...this.getFlatArr(item.childrens)];
        }
        return flatArr;
      }, []);
    },

    // 获取详情
    async getRoleById () {
      function treeToArray (data) {
        const result = [];
        data.forEach((item) => {
          // 遍历树
          const loop = (data) => {
            let child = data.childrens;
            if (child.length > 0) {
              // 是否有子节点，有则继续遍历下一级，无则是叶子节点
              for (let i = 0; i < child.length; i++) {
                loop(child[i]);
              }
            } else {
              result.push(data);
            }
          };
          loop(item);
        });
        return result;
      }

      await findTreeList().then(res => {
        this.menuList = res.data;
        this.menuAllList = this.getFlatArr(res.data)
      })

      this.listLoading = true;
      getRoleById({ roleId: this.id }).then(res => {
        this.listLoading = false;
        this.dataInfo = res.data;
        // this.dialogVisible = false
        if (res.data.menuIds.length == 0) {
          this.isIndeterminate = false;
          this.isCheckAll = false;
          this.$refs.treeMenu.setCheckedKeys([]);
        } else if (res.data.menuIds.length > 0 && res.data.menuIds.length < this.menuAllList.length) {
          this.isIndeterminate = true;
          this.isCheckAll = false;
          this.checkedMenu = res.data.menuIds;
          this.$refs.treeMenu.setCheckedKeys(this.checkedMenu);
        } else {
          this.isIndeterminate = false;
          this.isCheckAll = true;
          this.checkedMenu = res.data.menuIds;
          this.$refs.treeMenu.setCheckedKeys(this.checkedMenu);
        }
        this.$emit("modify");
      });
    },
    close () {
      Object.assign(this.dataInfo, {});
      this.dialogVisible = false;

      this.listLoading = false;
      this.showFollowDialog = false;
      this.showAddDialog = false;
      this.showAllocationDialog = false;
      this.selectList = [];
      this.tableHeight = 400;
      this.tab = "first";
      this.typeOptions = {
        type: "",
        optionType: "",
        option: {}
      };
      this.tittle = "";
      this.operationDialog = false;
      this.status = "";
      this.item = {};
      this.isIndeterminate = false;
      this.menuPermissionIds = [];
      this.menuList = [];
      this.menuAllList = [];
      this.menuListCurrent = [];
      this.checkedMenu = [];
      this.isCheckAll = false;
    },
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // 删除职务
    deleteRole () {
      this.hint("确定要更删除职务？").then(res => {
        if (res) {
          deleteRole({ roleId: this.id }).then(res => {
            this.$message({ message: res.resp_msg, type: 'successs' });
            this.dialogVisible = false;
            this.$emit("modify");
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>
.detailInfo {
  span {
    font-weight: bold;
    margin-right: 30px;
  }
  .titleInfo {
    font-family: "微软雅黑 Bold", "微软雅黑";
    font-weight: 700;
    font-style: normal;
    font-size: 18px;
    line-height: 28px;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .describe {
    .e-div {
      margin-bottom: 10px;
      font-size: 24px;
    }
    .e-div2 {
    }
  }
  .btn {
    margin-top: 10px;
    .el-button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
.menu_CheckAll {
  margin-left: 24px;
}
.menu_tree {
  max-height: 45vh;
  overflow: auto;
}
</style>
