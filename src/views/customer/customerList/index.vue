<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box border_bottom">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.customerName"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="标题/关键词" />
      </el-form-item>
    </el-form>
    <div class="container mt_10">
      <container ref="child"
                 @typeValue="getUsable"
                 @levelValue="getLevel"
                 v-if="activeName == 'all'"
                 :claimSearchType="0"
                 :listQuery="listQuery" />
    </div>

  </div>
</template>

<script>
// import container from "./view";
import container from "./view"
import { getUsersByRole } from "@/api/common";
export default {
  data () {
    return {
      listQuery: {
        sortType: 4,//按更新时间倒叙
        staffId: '',
        customerName: "",
        mobile: "",
        customerTypeId: "",
        storeLevel: "",
        bargain: "",
        startTime: "",
        endTime: "",
        limit: 10,
        page: 1,
        rStartTime: '',
        rEndTime: '',
        orderStatus: '',
        certificateStatus: '',//证件状态
        oStartTime: '', //下单开始时间
        oEndTime: '', //下单结束时间
        customerStoreId: '',
        commission: '', //代办事项  分配我的客户传参1
      },
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      typeOptions: [],
      levelOptions: [],
      activeName: "all",
      userOptions: [],
    };
  },
  components: {
    container,
  },
  computed: {
    dateTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
    createTime: {
      get () {
        if (this.listQuery.rStartTime && this.listQuery.rEndTime) {
          return [this.listQuery.rStartTime, this.listQuery.rEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.rStartTime = v[0] + ' 00:00:00';
          this.listQuery.rEndTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.rStartTime = "";
          this.listQuery.rEndTime = "";
        }
      },
    },
    orderTime: {
      get () {
        if (this.listQuery.oStartTime && this.listQuery.oEndTime) {
          return [this.listQuery.oStartTime, this.listQuery.oEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.oStartTime = v[0] + ' 00:00:00';
          this.listQuery.oEndTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.oStartTime = "";
          this.listQuery.oEndTime = "";
        }
      },
    },
  },
  mounted () {
    this.getUsable();
    this.getUsersByRole()
  },
  methods: {
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
    // 获取客户类型
    getUsable (val) {
      this.typeOptions = val;
    },
    getLevel (val) {
      this.levelOptions = val;
    },
    queryCustomerList () {
      this.listQuery.page = 1
      this.customerList()
    },
    customerList () {
      this.$refs.child.customerList();
    },
    open () { },
    orderId (e) {
      this.listQuery.value = e;
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        staffId: '',
        customerName: "",
        mobile: "",
        customerTypeId: "",
        storeLevel: "",
        bargain: "",
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10,
        rStartTime: '',
        rEndTime: '',
        orderStatus: '',
        certificateStatus: '',//证件状态
        oStartTime: '', //下单开始时间
        oEndTime: '', //下单结束时间
        customerStoreId: '',
        commission: '', //代办事项  分配我的客户传参1
      });
      this.$router.push({ query: {} }); //清空地址栏参数
      this.customerList();
    },
    // 重置
    reset () {
      Object.keys(this.listQuery).map((key) => (this.listQuery[key] = ""));
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.border-card {
  margin-top: 10px !important;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
/deep/.search_box .el-form-item {
  float: none;
}
</style>
