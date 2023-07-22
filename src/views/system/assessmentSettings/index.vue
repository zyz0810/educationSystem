<template>
  <div class="app-container">
    <el-tabs type="border-card"
             v-model="activeName"
             class="border-card">
      <el-tab-pane label="服务商考核"
                   name="serviceProvider">
        <serviceProvider ref="child"
                         v-if="activeName == 'serviceProvider'"
                         :claimSearchType="0" />
      </el-tab-pane>
      <el-tab-pane label="员工考核"
                   name="staff">
        <staff ref="child"
               v-if="activeName == 'staff'"
               :claimSearchType="1" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import addAassessment from "./addAassessment";
import { assessmentPageList, modify } from "@/api/assessmentSettings";
import { findProviderDept } from "@/api/common";
import { mapGetters, mapState } from "vuex";
import serviceProvider from './serviceProvider'
import staff from './staff'
export default {
  components: {
    addAassessment,
    serviceProvider,
    staff
  },
  data () {
    return {
      activeName: "serviceProvider",
      tableHeight: 400,
      listLoading: false,
      dataList: [],
      total: 0,
      showAddDialog: false,
      typeOptions: {
        identity: "USER",
        optionType: "",
        option: {
        }
      },
      listQuery: {
        providerIds: '',
        assessmentDate: '',
        page: 1,
        limit: 10
      },
      providerList: []
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.tableHeight =
    //     window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
    //   window.onresize = () => {
    //     this.tableHeight =
    //       window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
    //   };
    // });
    // this.getMonth()
    // this.assessmentPageList();
    // this.findProviderDept()
  },
  methods: {
    getMonth () {
      this.listQuery.assessmentDate = this.$moment(new Date()).format("yyyy-MM");
      this.assessmentPageList();
    },
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    queryList () {
      Object.assign(this.listQuery, {

        page: 1,
      });
      this.assessmentPageList();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        providerIds: "",
        assessmentDate: '',
        page: 1,
        limit: 10
      });
      this.getMonth()
      this.assessmentPageList()
    },
    // 统计列表
    assessmentPageList () {
      assessmentPageList({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.count || 0;
        // 防止table错位
        this.$nextTick(() => {
          this.$refs.activityTable.doLayout();
        });
      });
    },
    // 删除员工目标
    deleteById (val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          modify({ assessmentIds: [val.id], operatorType: 'forbidden' })
            .then(res => {
              this.$message({
                message: '删除成功',
                type: "success"
              });
              this.assessmentPageList();
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    addAassessment (type, val) {
      this.typeOptions = {
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },

  }
};
</script>

<style lang="scss" scope>
</style>
