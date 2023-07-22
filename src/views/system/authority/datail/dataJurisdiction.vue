<template>
  <div class="dataJurisdiction">
    <div class="n-title"><span>数据权限</span>（设置该角色的用户可以操作的数据的范围）</div>
    <div class="check-box">
      <el-radio-group v-model="dataScope">
        <el-radio :label="1">本人<span>只能操作自己的数据</span></el-radio>
        <el-radio :label="2"
                  v-if="dataJurisdiction >= 2">本人及下属<span>只能操作自己和下属的数据</span></el-radio>
        <el-radio :label="3"
                  v-if="dataJurisdiction >= 3">所属部门<span>能操作自己、下属、和自己所属部门的数据</span></el-radio>
        <el-radio :label="4"
                  v-if="dataJurisdiction >= 4">所属部门及下属部门<span>所属部门及下属部门 能操作自己、下属和自己所属部门及其子部门的数据</span></el-radio>
        <el-radio :label="5"
                  v-if="dataJurisdiction >= 5">全公司<span>能操作全公司的数据</span></el-radio>
      </el-radio-group>
    </div>
    <div class="button">
      <el-button type="primary"
                 size='medium'
                 icon="el-icon-circle-check"
                 @click="setRolePermission">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getCustomerFollow } from "@/api/customer/customer";
import { setRolePermission, getRoleById, deleteRole } from "@/api/authority";
export default {
  props: {
    id: {
      required: true,
      type: [Number, String],
      default: ""
    },
  },
  data () {
    return {
      imgDialogVisible: false,
      dialogImageUrl: "",
      followList: [],
      dataInfo: {},
      menuPermissionIds: [],
      dataScope: "",
      dataJurisdiction: '',
    };
  },
  mounted () {
    this.getRoleById() // 获取详情
  },
  methods: {
    // 获取详情
    getRoleById () {
      this.listLoading = true;
      getRoleById({ roleId: this.id }).then(res => {
        this.listLoading = false;
        this.dataInfo = res.data;
        // this.dataScope = this.dataInfo.dataScope   //上级id
        this.dataJurisdiction = res.data.parentDataScope || 5
        this.dataScope = res.data.dataScope //上级id
        // this.dataJurisdiction = this.dataInfo.parentDataScope - 1 || this.dataInfo.dataScope || 6
      });
    },
    // 保存
    setRolePermission () {
      let data = {
        roleId: this.id,
        dataScope: this.dataScope,
        menuPermissionIds: this.dataInfo.menuIds || '',//权限ids
      }
      setRolePermission(data).then(res => {
        if (res.resp_code == 0) {
          this.$message({ message: res.resp_msg, type: 'success' });
          // this.dataJurisdiction = this.dataScope 
        } else {
          this.$message({ message: res.resp_msg, type: 'warning' });
        }
      });
    },
  }
};
</script>

<style lang="scss" scope>
.n-title {
  margin-right: 10px;
  height: 40px;
  line-height: 40px;
  span {
    font-size: 18px;
    color: #333;
  }
}
.check-box {
  .el-radio {
    display: block;
    height: 30px;
    line-height: 30px;
    .el-radio__label {
      position: relative;
      span {
        left: 220px;
        position: absolute;
      }
    }
  }
}
.button {
  width: 100%;
  text-align: center;
  margin: 20px 0px;
}
</style>
