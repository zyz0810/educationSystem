<template>
  <div class="paramSetting">
    <!--
      <p class="block_title">
      客户级别
      <el-button class="filter-item fr"
                 type="primary"
                 size="mini"
                 icon="el-icon-plus"
                 @click="addLevel('add','')">新增</el-button>
    </p>
    <el-table ref="level"
              v-loading="listLoading"
              :data="customerLevelList"
              :header-cell-style="{ background: '#f5f7fa' }"
              class="mb_30"
              row-key="dictCode"
              element-loading-text="拼命加载中"
              border
              fit
              highlight-current-row>
      <el-table-column label="选项值名"
                       align="center"
                       prop="dictName"></el-table-column>
      <el-table-column label="排序"
                       align="center"
                       prop="dictSort"
                       class-name="levelAllowDrag">
        <template>
          <i class="iconfont icon-bars move-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="启用"
                       align="center"
                       prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="handelState(scope.$index, scope.row)"
                     active-value="0"
                     inactive-value="1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="addLevel('update',scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="delSource('customer_level',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  -->
    <p class="block_title">
      客户来源
      <el-button class="filter-item fr"
                 type="primary"
                 size="mini"
                 icon="el-icon-plus"
                 @click="addSource('add','')">新增</el-button>
    </p>
    <el-table ref="source"
              v-loading="sourceListLoading"
              :data="customerSourceList"
              :header-cell-style="{ background: '#f5f7fa' }"
              class="mb_30"
              row-key="dictCode"
              element-loading-text="拼命加载中"
              border
              fit
              highlight-current-row>
      <el-table-column label="选项值名"
                       align="center"
                       prop="dictName"></el-table-column>
      <el-table-column label="排序"
                       align="center"
                       prop="dictSort"
                       class-name="sourceAllowDrag">
        <template>
          <i class="iconfont icon-bars move-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="启用"
                       align="center"
                       prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="handelState(scope.$index, scope.row)"
                     active-value="0"
                     inactive-value="1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="addSource('update',scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="delSource('customer_source',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p class="block_title">
      客户跟进类型设置
      <el-button class="filter-item fr"
                 type="primary"
                 icon="el-icon-plus"
                 size="mini"
                 @click="addFollow">新增</el-button>
    </p>
    <el-table ref="follow"
              v-loading="followListLoading"
              :data="customerFollowList"
              :header-cell-style="{ background: '#f5f7fa' }"
              class="mb_30"
              row-key="dictCode"
              element-loading-text="拼命加载中"
              border
              fit
              highlight-current-row>
      <el-table-column label="选项值名"
                       align="center"
                       prop="dictName"></el-table-column>
      <el-table-column label="排序"
                       align="center"
                       prop="dictSort"
                       class-name="followAllowDrag">
        <template>
          <i class="iconfont icon-bars move-icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="启用"
                       align="center"
                       prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="handelState(scope.$index, scope.row)"
                     active-value="0"
                     inactive-value="1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="addFollow('update',scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="delSource('customer_follow',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-level :showDialog.sync="showLevelDialog"
               :option="levelType"
               @insertLevel="getList" />
    <add-source :showDialog.sync="showSourceDialog"
                :option="optionType"
                @insertSource="getList" />
    <add-follow :showDialog.sync="showFollowDialog"
                :option="followType"
                @insertFollow="getList" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import addLevel from "./addLevel";
import addSource from "./addSource";
import addFollow from "./addFollow";
import Sortable from "sortablejs";
import { listConfig, addConfig, saveBatch } from "@/api/system/config";
export default {
  components: {
    addLevel,
    addSource,
    addFollow
  },
  data () {
    return {
      showFollowDialog: false,
      followType: {
        operatorType: "",
        option: ""
      },
      levelType: {
        operatorType: "",
        option: ""
      },
      optionType: {
        operatorType: "",
        option: ""
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
      customerSourceList: [],
      customerFollowList: [],
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
      data: '',
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
    this.getList();
    this.levelSort();
    this.sourceSort();
    this.followSort();
    await this.$on("hook:activated", () => {
      if (this.isActivated) {
        this.getList();
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
                // this.$message({ message: res.resp_msg, type: "success" });
                this.getList();
              }
            })
            .catch(() => { });
        }
      });
    },
    sourceSort () {
      const el = this.$refs.source.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = Sortable.create(el, {
        handle: ".sourceAllowDrag",
        onEnd: evt => {
          const targetRow = this.customerSourceList.splice(evt.oldIndex, 1)[0];
          this.customerSourceList.splice(evt.newIndex, 0, targetRow);
          for (let index in this.customerSourceList) {
            this.customerSourceList[index].dictSort = parseInt(index) + 1;
          }
          let i;
          if (parseInt(evt.oldIndex + 1) > parseInt(targetRow.dictSort)) {
            i = targetRow.dictSort;
          } else if (
            parseInt(evt.oldIndex + 1) < parseInt(targetRow.dictSort)
          ) {
            i = targetRow.dictSort + 1;
          }
          console.log(targetRow)
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
    followSort () {
      const el = this.$refs.follow.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = Sortable.create(el, {
        handle: ".followAllowDrag",
        onEnd: evt => {
          const targetRow = this.customerFollowList.splice(evt.oldIndex, 1)[0];
          this.customerFollowList.splice(evt.newIndex, 0, targetRow);
          for (let index in this.customerFollowList) {
            this.customerFollowList[index].dictSort = parseInt(index) + 1;
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
    tabClick (name) {
      if (name == "sea") {
        this.$nextTick(() => {
          this.$refs["sea"].doLayout();
        });
      } else {
        this.$nextTick(() => {
          this.$refs["level"].doLayout();
          this.$refs["source"].doLayout();
          this.$refs["follow"].doLayout();
          if (this.$refs["source"]) {
            this.levelSort();
            this.sourceSort();
            this.followSort();
          }
        });
      }
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
    addLevel (type, row) {
      this.levelType = {
        operatorType: type,
        option: row
      };
      this.showLevelDialog = true;
    },

    addSource (type, row) {
      this.optionType = {
        operatorType: type,
        option: row
      };
      this.showSourceDialog = true;
    },
    addFollow (type, row) {
      this.followType = {
        operatorType: type,
        option: row
      };
      this.showFollowDialog = true;
    },
    delSource (type, row) {
      this.$confirm("确定删除吗?", "提示", {
        type: "warning"
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
            isDelete: 'INVALID'
          };
          addConfig(paras).then(res => {
            this.listLoading = false;
            this.sourceListLoading = false;
            this.followListLoading = false;
            this.getList();
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
          });
        })
        .catch(() => { });
    },

    getList () {
      listConfig()
        .then(res => {
          this.listLoading = true;
          this.sourceListLoading = true;
          this.followListLoading = true;
          if (res.resp_code == 0) {
            res.data.forEach(item => {
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
    }
  }
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
