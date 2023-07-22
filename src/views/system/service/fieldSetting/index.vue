<template>
  <div class="paramSetting">
    <p class="block_title">
      拜访
      <el-button class="filter-item fr"
                 type="primary"
                 size="mini"
                 icon="el-icon-plus"
                 @click="addField('add','')">新增字段</el-button>
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
      <el-table-column label="字段名称"
                       align="center"
                       min-width="120"
                       show-overflow-tooltip
                       prop="dictName"></el-table-column>
      <el-table-column label="字段类型"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="dictLabelName"></el-table-column>
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
      <el-table-column label="必填"
                       align="center"
                       prop="dictValue">
        <template slot-scope="scope">
          <!--1必传-->
          <el-checkbox @change="isMustChange(scope.$index, scope.row)"
                       v-model="scope.row.dictValue.must"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="100"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="editField('update',scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="delField('customer_level',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <addField :showDialog.sync="showFieldDialog"
              :option="optionType"
              :dictCode='dictCode'
              v-if='showFieldDialog'
              @insertFollow="getList" />
    <editField :showDialog.sync="showEDitFieldDialog"
               :option="optionType"
               :dictCode='dictCode'
               @insertFollow="getList" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Sortable from "sortablejs";
import addField from "./addField";
import editField from "./editField";
import { fieldQuery, fieldSave, saveOrUpdateFieldDataValue } from "@/api/system/config";

export default {
  components: {
    addField,
    editField
  },
  data () {
    return {
      showFieldDialog: false,
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
      dictCode: "",
      showEDitFieldDialog: false,
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
          // let i;
          // if (parseInt(evt.oldIndex + 1) > parseInt(targetRow.dictSort)) {
          //   i = targetRow.dictSort;
          // } else if (
          //   parseInt(evt.oldIndex + 1) < parseInt(targetRow.dictSort)
          // ) {
          //   i = targetRow.dictSort + 1;
          // }
          let formData = [{
            dictCode: targetRow.dictCode,
            dictSort: evt.newIndex,
          }];
          fieldSave({ datas: formData })
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
    open () { },
    // 是否必填
    isMustChange (index, row) {
      let paras = row
      paras.handleType = 2// 0删除1启用、禁用2编辑、必填

      if (row.dictLabel == 'file_upload' || row.dictLabel == 'image'
        || row.dictLabel == 'text_area' || row.dictLabel == 'input') {
        delete paras.dictValue.options
      }
      saveOrUpdateFieldDataValue(paras)
        .then(res => {
          if (res.resp_code == 0) {
            this.getList();
            // row.must = row.dictValue.must;  // 逻辑处理
            this.$message({ message: res.resp_msg, type: "success" });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => { });
    },
    // 启用禁用
    handelState (index, row) {
      let flag = row.status; //保存点击之后v-modeld的值(true，false)
      row.status = !row.status; //保持switch点击前的状态
      let paras = {
        handleType: 1, // 0删除1启用、禁用2编辑、必填
        dictCode: row.dictCode,
        dictName: row.dictName,
        dictSort: row.dictSort,
        status: flag
      };
      saveOrUpdateFieldDataValue(paras)
        .then(res => {
          if (res.resp_code == 0) {
            this.getList();
            row.status = !row.status;
            // 逻辑处理
            this.$message({ message: res.resp_msg, type: "success" });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => { });
    },
    // 新建
    addField (type, row) {
      this.optionType = {
        operatorType: type,
        option: row
      };
      this.showFieldDialog = true;
    },
    // 编辑
    editField (type, row) {
      this.optionType = {
        operatorType: type,
        option: row
      };
      this.showEDitFieldDialog = true;
    },
    delField (type, row) {
      this.$confirm("确定删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let paras = {
            handleType: 0, // 0删除1启用、禁用2编辑、必填
            dictCode: row.dictCode,
            isDelete: 'INVALID'
          };
          saveOrUpdateFieldDataValue(paras).then(res => {
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
      fieldQuery()
        .then(res => {
          if (res.resp_code == 0) {
            this.customerLevelList = res.data
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
.move-icon {
  cursor: move;
}
</style>
