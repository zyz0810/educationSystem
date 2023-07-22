<template>
  <div class="app-container">
    <el-tabs type="border-card"
             v-model="activeName"
             class="border-card">
      <el-tab-pane label="服务商"
                   name="serviceProvider">
        <serviceProvider ref="child"
                         v-if="activeName == 'serviceProvider'"
                         :claimSearchType="0" />
      </el-tab-pane>
      <el-tab-pane label="员工"
                   name="staff">
        <staff ref="child"
               v-if="activeName == 'staff'"
               :claimSearchType="1" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getUsersByRole, findProviderDept } from "@/api/common";
import { providerAssessment } from "@/api/workCompletion";
import { mapGetters, mapState } from "vuex";
import serviceProvider from './serviceProvider'
import staff from './staff'
export default {
  props: {
  },
  components: {
    serviceProvider,
    staff
  },
  data () {
    return {
      activeName: "serviceProvider",
      tableHeight: 400,
      // listLoading: false,
    };
  },
  computed: {
    // ...mapState({
    //   roles: (state) => state.user.roles,
    //   permissions: state => state.user.permissions,
    //   crm_id: (state) => state.user.crm_id,
    // }),
    // ...mapGetters(["provider_id", "provider_type",]),
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
    // this.listQuery.providerIds = (this.provider_type == '服务商' || this.provider_type == '合伙人') ? [this.provider_id] : ''
    // console.log(this.listQuery.providerIds)
    // this.getMonth()
    // this.findProviderDept()
  },
  methods: {
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    getMonth () {
      this.listQuery.assessmentDate = this.$moment(new Date()).format("yyyy-MM");
      this.providerAssessment();
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.providerAssessment();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        providerIds: [],
        assessmentDate: '',
        page: 1,
        limit: 10
      });
      this.getMonth()
      this.query();

    },
    // 业绩目标设置
    providerAssessment () {
      providerAssessment({
        ...this.listQuery,
      }).then(res => {
        this.dataList = res.data.data;
        this.total = res.data.count || 0;
      });
    },
  }
};
</script>

<style lang="scss" scope>
</style>
