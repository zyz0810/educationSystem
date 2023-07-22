<template>
  <div>
    <el-table ref="sea"
              v-loading="listLoading"
              class="mt_20 set"
              :data="seaInfo"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              border
              highlight-current-row>
      <el-table-column label="未跟进天数"
                       align="center"
                       prop="sn">
        <template slot-scope="scope">
          超过
          <el-input size="small"
                    v-model.trim="scope.row.bargainDay.day"></el-input>天未跟进
        </template>
      </el-table-column>
      <el-table-column label="未成交天数"
                       align="center"
                       prop="invoiceType">
        <template slot-scope="scope">
          超过
          <el-input size="small"
                    v-model.trim="scope.row.followDay.day"></el-input>天未成交
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center">
      <el-button class="filter-item mt_20"
                 type="primary"
                 icon="el-icon-success"
                 @click="addSea()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Sortable from "sortablejs";
import { listConfig, addConfig, saveBatch } from "@/api/system/config";
export default {
  components: {
  },
  data () {
    return {
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
            day: ""
          },
          followDay: {
            code: "",
            day: ""
          }
        }
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
        limit: 10
      },
      isSave: true,
      currentRowIndex: "",
      activeName: "all",
    };
  },
  computed: {
    ...mapState({
      roles: state => state.user.permissions,
    }),
  },
  filters: {
    //0正常 1停用
    filtersStatus: function (value) {
      let StatusArr = { 0: "正常", 1: "停用" };
      return StatusArr[value];
    }
  },
  async mounted () {
    this.getSea();
    await this.$on("hook:activated", () => {
      if (this.isActivated) {
        this.getSea();
      }
    });
    this.isActivated = true;
  },
  methods: {
    levelSort () {
      const el = this.$refs.level.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = Sortable.create(el, {
        handle: ".levelAllowDrag",
        onEnd: evt => {
          const targetRow = this.customerLevelList.splice(evt.oldIndex, 1)[0];
          this.customerLevelList.splice(evt.newIndex, 0, targetRow);
          for (let index in this.customerLevelList) {
            this.customerLevelList[index].dictSort = parseInt(index) + 1;
          }
          let i;
          if (parseInt(evt.oldIndex + 1) > parseInt(targetRow.dictSort)) {
            i = targetRow.dictSort;
          } else if (
            parseInt(evt.oldIndex + 1) < parseInt(targetRow.dictSort)
          ) {
            i = targetRow.dictSort + 1;
          }
          let formData = {
            dictType: targetRow.dictType,
            dictCode: targetRow.dictCode,
            dictName: targetRow.dictName,
            dictSort: i,
            status: targetRow.status
          };
          addConfig(formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.getList();
              }
            })
            .catch(() => { });
        }
      });
    },
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
        status: flag
      };
      addConfig(paras)
        .then(res => {
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
          dictValue: this.seaInfo[0].bargainDay.day
        },
        {
          dictCode: this.seaInfo[0].followDay.code,
          dictValue: this.seaInfo[0].followDay.day
        }
      ];
      saveBatch({ datas: arr })
        .then(res => {
          // this.isSave = false;
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
          }
        })
        .catch(() => {
          // this.isSave = false;
        });
    },
    getSea () {
      listConfig({ dictType: "customer_highseas" })
        .then(res => {
          this.seaLoading = true;
          if (res.resp_code == 0) {
            res.data.forEach(item => {
              this.seaLoading = false;
              if (item.dictType == "customer_highseas") {
                item.dataList.forEach(item => {
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
  }
};
</script>

<style lang="scss" scoped>
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
