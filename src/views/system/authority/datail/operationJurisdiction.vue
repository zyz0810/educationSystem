<template>
  <div>
    <div class="operationJurisdiction">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="isCheckAll">全选</el-checkbox>
      <div class="class-one"
           v-for="(item, index) in operationList"
           :key="index">
        <checkBox :checkData="item"
                  @input="checkChang"
                  :list.sync="item.list"
                  v-model="item.isCheck"
                  :menuPermissionIds.sync="menuPermissionIds" />
      </div>
    </div>
    <div class="button">
      <el-button type="primary"
                 size="medium"
                 icon="el-icon-circle-check"
                 @click="setRolePermission">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getCustomerFollow } from "@/api/customer/customer";
import checkBox from "./checkBox";
import {
  findMenuTree,
  setRolePermission,
  getRoleById,
  deleteRole,
} from "@/api/authority";
export default {
  props: {
    id: {
      required: true,
      type: [Number, String],
      default: "",
    },
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      imgDialogVisible: false,
      dialogImageUrl: "",
      operationList: [],
      dataInfo: {},
      menuPermissionIds: [],
      dataScope: "",
      isIndeterminate: false,
      chooseAllId: [],
      isIndeterminateOne: false,
      checkOne: false, //一行单选
      chooseOneId: [],
      checkAll: false,
    };
  },
  components: {
    checkBox,
  },
  computed: {
    isCheckAll: {
      get () {
        return this.checkAll;
      },
      set (value) {
        let arr = [];
        this.operationList.map((item) => {
          const list = item.childrens.map((i) => i.id);
          arr = arr.concat(list);
        });
        this.menuPermissionIds = value ? arr : [];
        this.operationList.forEach((item) => (item.isCheck = value));
        this.checkAll = value;
      },
    },
  },
  mounted () {
    this.findMenuTree(); //操作权限树
  },
  methods: {
    checkChang () {
      this.checkAll = this.operationList.every((item) => item.isCheck);
    },
    // 保存接口
    setRolePermission () {
      const menuPermissionIds = this.operationList.reduce((total, current) => {
        return current.list.length
          ? total.concat(current.list)
          : total.concat([]);
      }, []);
      // console.log(menuPermissionIds);
      // const arr = this.operationList
      //   .filter((item) => item.list.length >= 1)
      //   .map((item) => item.id);

      const arr = this.operationList
        .filter((item) => {
          if (item.list.length > 0) {
            return item;
          } else if (item.list.length == 0 && item.isCheck == true) {
            return item;
          }
        })
        .map((item) => item.id);

      let data = {
        roleId: this.id,
        dataScope: this.dataInfo.dataScope,
        menuPermissionIds: menuPermissionIds.concat(arr), //权限ids
      };
      setRolePermission(data).then((res) => {
        if (res.resp_code == 0) {
          this.$message({ message: res.resp_msg, type: "success" });
          // this.$emit("close");
        } else {
          this.$message({ message: res.resp_msg, type: "warning" });
        }
      });
    },
    // 操作权限树
    async findMenuTree () {
      // 获取详情
      await getRoleById({ roleId: this.id }).then((res) => {
        this.dataInfo = res.data;
        this.menuPermissionIds = res.data.menuIds || [];
      });
      // 获取操作树信息
      await findMenuTree({ roleId: this.id }).then((res) => {
        this.operationList = res.data;
        this.operationList.forEach((item, index) => {
          item.list = [];

          if (item.childrens.length > 0) {
            item.isCheck = item.childrens.every((item) => {
              return this.menuPermissionIds.includes(item.id);
            });
          } else {
            item.isCheck = this.menuPermissionIds.includes(item.id);
          }
        });
        this.checkAll = this.operationList.every((item) => {
          return item.childrens.every((i) =>
            this.menuPermissionIds.includes(i.id)
          );
        });
      });
    },
  },
};
</script>

<style lang="scss" scope>
.class-two {
  .o-title {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    font-weight: bold;
  }
}
.button {
  width: 100%;
  text-align: center;
  margin: 20px 0px 0px 0px !important;
}
.operationJurisdiction {
  height: 400px;
  overflow-y: scroll;
}
// /deep/.buttons {
//   margin: auto;
//   text-align: center;
// }
</style>
