<template>
  <div class="app-container">
    <el-tabs type="border-card"
             class="border-card"
             v-model="activeName">
      <el-tab-pane label="公海规则"
                   name="all"
                   ref="all"
                   v-if="roles.includes('admin') || roles.includes('business:set:highsee:rule')">
        <highSeasRules ref="sea"
                       v-if="activeName == 'all'"
                       claimType="ALL"
                       :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="参数设置"
                   name="responsible"
                   ref="responsible"
                   v-if="roles.includes('admin') || roles.includes('business:set:parm')">
        <paramSetting v-if="activeName == 'responsible'"
                      claimType="CHARGE"
                      :listQuery="listQuery" />
      </el-tab-pane>
      <el-tab-pane label="考勤设置"
                   name="partake"
                   ref="partake"
                   v-if="roles.includes('admin') || roles.includes('business:set:attendance')">
        <workSetting v-if="activeName == 'partake'"
                     claimType="TAKE_PART"
                     :listQuery="listQuery" />
      </el-tab-pane>
      <!--
        <el-tab-pane label="字段设置"
                   name="field"
                   ref="field"
                   v-if="roles.includes('admin') || roles.includes('business:set:dict')">
        <fieldSetting v-if="activeName == 'field'"
                      claimType="FILED_PART"
                      :listQuery="listQuery" />
      </el-tab-pane>
      -->
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import highSeasRules from "./highSeasRules/index";
import paramSetting from "./paramSetting/index";
import workSetting from "./workSetting/index";
import fieldSetting from "./fieldSetting/index";
import { listConfig, addConfig, saveBatch } from "@/api/system/config";
export default {
  components: {
    highSeasRules,
    paramSetting,
    workSetting,
    fieldSetting,
  },
  data () {
    return {
      showFollowDialog: false,
      followType: {
        operatorType: "",
        option: "",
      },
      levelType: {
        operatorType: "",
        option: "",
      },
      optionType: {
        operatorType: "",
        option: "",
      },
      radio: 3,
      total: 0,
      seaLoading: false,
      listLoading: false,
      sourceListLoading: false,
      followListLoading: false,
      seaInfo: [
        {
          bargainDay: {
            code: "",
            day: "",
          },
          followDay: {
            code: "",
            day: "",
          },
        },
      ],
      selectList: [],
      seaList: [],
      customerLevelList: [],
      customerSourceList: {},
      customerFollowList: {},
      showLevelDialog: false,
      showSourceDialog: false,
      isActivated: false,
      listQuery: {
        name: "",
        dateTime: "",
        startDate: "",
        endDate: "",
        page: 1,
        limit: 10,
      },
      isSave: true,
      currentRowIndex: "",
      activeName: "all",
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.permissions,
    }),
  },
  filters: {
    //0正常 1停用
    filtersStatus: function (value) {
      let StatusArr = { 0: "正常", 1: "停用" };
      return StatusArr[value];
    },
  },
  mounted () {
    if (this.$refs.all) {
      this.activeName = "all";
      return;
    }
    if (this.$refs.responsible) {
      this.activeName = "responsible";
      return;
    }
    if (this.$refs.partake) {
      this.activeName = "partake";
      return;
    }
    if (this.$refs.field) {
      this.activeName = "field";
      return;
    }
  },
  // async mounted() {
  //   this.getSea();
  //   this.getList();
  //   await this.$on("hook:activated", () => {
  //     if (this.isActivated) {
  //       this.getSea();
  //       this.getList();
  //     }
  //   });
  //   this.isActivated = true;
  // },
  methods: {
    open () { },
    handelState (index, row) {
      // ：active-value得为true
      // ：inactive-value得为false
      let flag = row.status; //保存点击之后v-modeld的值(true，false)
      row.status = !row.status; //保持switch点击前的状态
      let paras = {
        dictCode: row.dictCode,
        dictName: row.dictName,
        dictSort: row.dictSort,
        status: flag,
      };
      addConfig(paras)
        .then((res) => {
          if (res.resp_code == 0) {
            this.getList();
            row.status = !row.status;
            // 逻辑处理
            this.$message({ message: res.resp_msg, type: "success" });

            // this.GetList();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => { });
    },
    addSea () {
      let arr = [
        {
          dictCode: this.seaInfo[0].bargainDay.code,
          dictValue: this.seaInfo[0].bargainDay.day,
        },
        {
          dictCode: this.seaInfo[0].followDay.code,
          dictValue: this.seaInfo[0].followDay.day,
        },
      ];
      saveBatch({ datas: arr })
        .then((res) => {
          // this.isSave = false;
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
          }
        })
        .catch(() => {
          // this.isSave = false;
        });
    },
    addLevel (type, row) {
      this.levelType = {
        operatorType: type,
        option: row,
      };
      this.showLevelDialog = true;
    },

    addSource (type, row) {
      this.optionType = {
        operatorType: type,
        option: row,
      };
      this.showSourceDialog = true;
    },
    addFollow (type, row) {
      this.followType = {
        operatorType: type,
        option: row,
      };
      this.showFollowDialog = true;
    },
    delSource (type, row) {
      this.$confirm("确定删除吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          if (type == "customer_level") {
            this.listLoading = true;
          } else if (type == "customer_source") {
            this.sourceListLoading = true;
          } else if (type == "customer_follow") {
            this.followListLoading = true;
          }
          this.sourceListLoading = true;
          //NProgress.start();
          let paras = {
            dictCode: row.dictCode,
            isDelete: "INVALID",
          };
          addConfig(paras).then((res) => {
            this.listLoading = false;
            this.sourceListLoading = false;
            this.followListLoading = false;
            this.getList();
            this.$message({
              message: res.resp_msg,
              type: "success",
            });
          });
        })
        .catch(() => { });
    },
    getSea () {
      listConfig({ dictType: "customer_highseas" })
        .then((res) => {
          this.seaLoading = true;
          if (res.resp_code == 0) {
            res.data.forEach((item) => {
              this.seaLoading = false;
              if (item.dictType == "customer_highseas") {
                item.dataList.forEach((item) => {
                  if (item.dictLabel == "not_bargain") {
                    this.seaInfo[0].bargainDay.day = item.dictValue;
                    this.seaInfo[0].bargainDay.code = item.dictCode;
                  } else if (item.dictLabel == "not_follow") {
                    this.seaInfo[0].followDay.day = item.dictValue;
                    this.seaInfo[0].followDay.code = item.dictCode;
                  }
                });
              }
            });
          }
        })
        .catch(() => { });
    },
    getList () {
      listConfig()
        .then((res) => {
          this.listLoading = true;
          this.sourceListLoading = true;
          this.followListLoading = true;
          if (res.resp_code == 0) {
            res.data.forEach((item) => {
              this.listLoading = false;
              this.sourceListLoading = false;
              this.followListLoading = false;
              if (item.dictType == "customer_level") {
                this.customerLevelList = item.dataList;
              } else if (item.dictType == "customer_source") {
                this.customerSourceList = item.dataList;
              } else if (item.dictType == "customer_follow") {
                this.customerFollowList = item.dataList;
              }
            });
          }
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scope>
@import "@/assets/styles/variables.scss";
.border-card {
  margin-top: 20px;
}
.set {
  .el-input {
    width: 80px;
    margin: 0 5px;
    .el-input__inner {
      padding: 0 5px;
      height: 30px;
      line-height: 20px;
    }
  }
}
.block_title {
  padding-left: 5px;
  border-left: 5px solid $menuActiveText;
}
</style>
