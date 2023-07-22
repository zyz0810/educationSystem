<template>
  <div class="workSetting">
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="考勤组设置"
                   name="first">
        <div class="attendanceGroup">
          <el-button class="filter-item"
                     type="primary"
                     icon="el-icon-plus"
                     @click="attendanceGroup('add')">新增考勤组</el-button>
          <el-table class="mt_20"
                    :data="attendanceGroupList"
                    ref="activityTable"
                    :header-cell-style="{ background: '#f5f7fa' }"
                    element-loading-text="拼命加载中"
                    @selection-change="list => (selectList = list)"
                    border
                    height="500"
                    @row-click=" (row, column, event) => { $refs.activityTable.toggleRowSelection(row)}"
                    highlight-current-row>
            <el-table-column label="名称"
                             align="center"
                             min-width="120"
                             show-overflow-tooltip
                             prop="name"></el-table-column>
            <el-table-column label="人数"
                             align="center"
                             prop="employeeNum"></el-table-column>
            <el-table-column label="创建时间"
                             :formatter="formatTimes"
                             align="center"
                             min-width="140"
                             prop="createTime"></el-table-column>
            <el-table-column label="操作"
                             align="center"
                             fixed="right"
                             min-width="150"
                             prop="remarks">
              <template slot-scope="scope">
                <el-button type="text"
                           @click.stop="chooseStaff(scope.row)">选择人员</el-button>
                <el-button type="text"
                           @click.stop="attendanceGroup('update',scope.row)">编辑</el-button>
                <el-button type="text"
                           :disabled="scope.row.employeeNum != 0"
                           @click.stop="delAttendanceGroup(scope.row.id, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="工作日设置"
                   name="second">
        <div class="workSetting">
          <div class="g-tips">提示：自定义时间优先级高于工作日</div>
          <div class="m-b20">
            <div class="block_title">工作日设置</div>
            <div class="data-setting">
              <el-date-picker v-model="year"
                              @change="getYear"
                              type="year"
                              placeholder="选择年"
                              format="yyyy">
              </el-date-picker>
              <div class="week-box">
                <el-checkbox v-model="formData2.monday">周一</el-checkbox>
                <el-checkbox v-model="formData2.tuesday">周二</el-checkbox>
                <el-checkbox v-model="formData2.wednesday">周三</el-checkbox>
                <el-checkbox v-model="formData2.thursday">周四</el-checkbox>
                <el-checkbox v-model="formData2.friday">周五</el-checkbox>
                <el-checkbox v-model="formData2.saturday">周六</el-checkbox>
                <el-checkbox v-model="formData2.sunday">周日</el-checkbox>
              </div>
              <el-button class="filter-item mt_20"
                         type="primary"
                         icon="el-icon-success"
                         @click="saveWorkDaysSetting">保存</el-button>
            </div>
          </div>
          <div class="block_title">自定义时间</div>
          <!-- 操作 -->
          <div class="">
            <el-button class="filter-item"
                       icon="el-icon-plus"
                       @click="showAddDate('add','')">添加自定义时间</el-button>
            <el-button class="filter-item"
                       icon="el-icon-delete"
                       :disabled="isDisabled"
                       @click="deleteBatch">删除</el-button>
          </div>
          <el-table class="mt_20"
                    :data="dataList"
                    ref="activityTable"
                    :header-cell-style="{ background: '#f5f7fa' }"
                    element-loading-text="拼命加载中"
                    @selection-change="list => (selectList = list)"
                    border
                    @row-click="
        (row, column, event) => {
          $refs.activityTable.toggleRowSelection(row);
        }
      "
                    highlight-current-row>
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column label="日期"
                             :formatter="formatTime"
                             align="center"
                             prop="workDate"></el-table-column>
            <el-table-column label="状态"
                             align="center"
                             :formatter="formatWorkDay"
                             prop="isWorkDay"></el-table-column>
            <el-table-column label="操作"
                             align="center"
                             fixed="right"
                             width="140"
                             prop="remarks">
              <template slot-scope="scope">
                <el-button type="text"
                           @click.stop="showAddDate('update',scope.row)">编辑</el-button>
                <el-button type="text"
                           :disabled="scope.row.result == 1"
                           @click.stop="deleteRow(scope.row.id, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他设置"
                   name="third">
        <div class="dataSetting">
          <el-form ref="ruleForm"
                   :model="formData3"
                   label-width="120px"
                   :rules="rules3"
                   class="formList">
            <div class="m-b20">
              <div class="block_title">拜访设置</div>
              <!--
                <el-form-item label="驻店时长："
                            class="picker-box"
                            prop="residentMinute">
                <el-input v-model.trim="formData3.residentMinute"
                          placeholder="输入驻店时长">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
             -->
              <el-form-item label="签到范围："
                            class="picker-box block"
                            prop="outsideAttendanceDistance">
                <el-input v-model.trim="formData3.outsideAttendanceDistance"
                          placeholder="输入签到范围">
                  <template slot="append">米</template>
                </el-input>
              </el-form-item>
              <p class="m-title">超出此范围将无法完成打卡</p>
            </div>
            <div class="block_title">定位上传时间间隔设置</div>
            <el-form-item label="定位上传时间："
                          class="picker-box"
                          prop="minutes">
              每<el-input class="inline"
                        style="display:inline"
                        v-model.trim="formData3.minutes"
                        placeholder="输入上传时间">
              </el-input>分钟上传一次
            </el-form-item>
            <div class="save-box">
              <el-button class="filter-item mt_20"
                         type="primary"
                         icon="el-icon-success"
                         @click="visitTaskSetting()">保存</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--新增编辑考勤组-->
    <addAttendanceGroup :showDialog.sync="showAttendanceGroupDialog"
                        :option="attendanceType"
                        @modify='attendanceSectionSectionList'></addAttendanceGroup>
    <!--选择人员弹窗-->
    <chooseStaff :showDialog.sync="showChooseStaffDialog"
                 @modify='attendanceSectionSectionList'
                 :option="attendanceType"></chooseStaff>
    <!--自定义时间弹窗-->
    <addDate :showDialog.sync="showLevelDialog"
             :option="dateType"
             @modify="serchWordDatyDefined" />
    <!--地图弹窗-->
    <Map :showDialog.sync="showMapDialog"
         :option="mapType"></Map>
  </div>

</template>
<script>
import addDate from "./addDate";
import addAttendanceGroup from './addAttendanceGroup'
import chooseStaff from './chooseStaff'
// import addMap from "./addMap";
import {
  searchAttendanceSetting,
  searchWorkDaysSetting,
  serchWordDatyDefined,
  deleteWordDatyDefined,
  saveWorkDaysSetting,
  saveAttendanceSetting,
  getVisitTaskSetting,
  visitTaskSetting,
  attendanceSectionSectionList,
  deleteById,
  getSetting,
  saveOrUpdateSetting
} from "@/api/system/config";
export default {
  components: {
    addDate,
    // addMap,
    addAttendanceGroup,
    chooseStaff
  },
  data () {
    return {
      activeName: 'first',
      // formData: {
      //   goWorkTime: "00:00",
      //   afterWork: "00:00",
      //   attendanceAddr: '',
      //   attendanceDistance: '',
      //   latitude: '',
      //   longitude: '',
      //   restTime: '',//休息时间段
      // },
      restTimeStart: "00:00",
      restTimeStop: "00:00",
      year: '',
      formData2: {
        year: 0,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      formData3: {
        id: '',
        otherId: '',
        residentMinute: '',
        outsideAttendanceDistance: '',
        minutes: '',
      },
      // rules: {
      //   goWorkTime: [
      //     { required: true, message: "请选择上班时间", trigger: "blur" }
      //   ],
      //   afterWork: [
      //     { required: true, message: "请选择下班时间", trigger: "blur" }
      //   ],
      //   attendanceAddr: [
      //     { required: true, message: "请选择出勤地点", trigger: "blur" }
      //   ],
      //   attendanceDistance: [
      //     { required: true, message: "请输入考勤半径", trigger: "blur" }
      //   ],
      // },
      rules3: {
        residentMinute: [
          { required: true, message: "请输入驻店时长", trigger: "blur" }
        ],
        outsideAttendanceDistance: [
          { required: true, message: "请输入签到范围", trigger: "blur" }
        ],
        minutes: [
          { required: true, message: "请输入上传时间", trigger: "blur" }
        ],
      },
      dataList: [],
      showLevelDialog: false,
      showMapDialog: false,
      dateType: {
        operatorType: "",
        option: ""
      },
      mapType: {
        operatorType: "",
        option: {}
      },
      selectList: [],
      listQuery: {
        limit: 10,
        page: 1,
      },
      total: 0,
      attendanceGroupList: [],//考勤组列表
      showAttendanceGroupDialog: false,
      attendanceType: {
        operatorType: "",
        option: {}
      },
      showChooseStaffDialog: false
    };
  },
  computed: {
    isDisabled () {
      return this.selectList.length < 1;
    }
  },
  mounted () {
    this.searchAttendanceSetting()
    this.attendanceSectionSectionList()//考勤组列表
  },
  methods: {
    attendanceSectionSectionList () {
      attendanceSectionSectionList({})
        .then(res => {
          this.attendanceGroupList = res.data
        })
        .catch(() => { });
    },
    // 选择人员
    chooseStaff (row) {
      this.showChooseStaffDialog = true
      this.attendanceType = {
        option: row
      };
    },
    // 考勤组设置
    attendanceGroup (type, row) {
      this.showAttendanceGroupDialog = true
      this.attendanceType = {
        operatorType: type,
        option: row
      };
    },
    // 删除考勤组
    delAttendanceGroup (id, index) {
      this.hint("确定要删除该考勤组？").then(res => {
        if (res) {
          deleteById({ id: id }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.attendanceGroupList.splice(index, 1);
          });
        }
      });
    },
    // 获取年份
    getYear (val) {
      var d = new Date(val);
      this.formData2.year = d.getFullYear();
    },
    //时间地点设置
    searchAttendanceSetting () {
      searchAttendanceSetting({})
        .then(res => {
          if (res.data.length == 0) {
            this.formData.attendanceAddr = '合肥火车站'
            this.formData.latitude = '31.885135'
            this.formData.longitude = '117.316937'
            return
          }
          this.formData = res.data[0]
          var strs = new Array(); //定义一数组
          strs = this.formData.restTime.split("-"); //字符分割
          this.restTimeStart = strs[0]
          this.restTimeStop = strs[1]
        })
        .catch(() => { });
    },

    //工作日设置回显
    searchWorkDaysSetting () {
      searchWorkDaysSetting({})
        .then(res => {
          if (res.data.length == 0) {
            return
          }
          this.formData2 = res.data[0]
          this.year = (this.formData2.year - 1) + '-12-31T16:00:00.000Z'
        })
        .catch(() => { });
    },
    // 工作日设置保存
    saveWorkDaysSetting () {
      saveWorkDaysSetting(this.formData2)
        .then(res => {
          this.$message({ message: res.resp_msg, type: 'success' });
        })
        .catch(() => { });
    },
    // 自定义时间列表
    serchWordDatyDefined () {
      serchWordDatyDefined({})
        .then(res => {
          this.dataList = res.data
        })
        .catch(() => { });
    },
    // 拜访设置
    getVisitTaskSetting () {
      getVisitTaskSetting({})
        .then(res => {
          this.formData3.id = res.data.id
          this.formData3.residentMinute = res.data.residentMinute
          this.formData3.outsideAttendanceDistance = res.data.outsideAttendanceDistance
        })
        .catch(() => { });
    },
    // 其他设置
    getSetting () {
      getSetting({})
        .then(res => {
          this.formData3.otherId = res.data.id
          this.formData3.minutes = res.data.minutes
        })
        .catch(() => { });
    },
    // 保存拜访设置
    visitTaskSetting () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 拜访设置的保存接口
          visitTaskSetting(this.formData3)
            .then(res => {
              this.$message({ message: res.resp_msg, type: 'success' });
            })
            .catch(() => { });
          // 其他设置的保存接口
          saveOrUpdateSetting({ minutes: this.formData3.minutes, id: this.formData3.otherId })
            .then(res => {
              // this.$message({ message: res.resp_msg, type: 'success' });
            })
            .catch(() => { });
        } else {
          return false;
        }
      });
    },
    // 批量删除
    deleteBatch () {
      this.hint("确定要删除该时间？").then(res => {
        if (res) {
          let ids = [];
          this.selectList.forEach((item, index) => {
            ids.push(item.id);
          });
          deleteWordDatyDefined({ ids: ids }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.serchWordDatyDefined()
          });
        }
      });
    },
    // 删除
    deleteRow (id, index) {
      this.hint("确定要删除该时间？").then(res => {
        if (res) {
          deleteWordDatyDefined({ ids: [id] }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.dataList.splice(index, 1);
          });
        }
      });
    },
    // 时间格式化
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD")
        : "暂无";
    },
    // 时间格式化
    formatTimes (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    // 状态合格化
    formatWorkDay (row, column, cellValue, index) {
      return cellValue == 0
        ? "工作日"
        : cellValue == 1
          ? "休息日"
          : "";
    },
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // TAB切换
    handleClick (tab, event) {
      if (tab.name == 'first') {
        // this.searchAttendanceSetting()
        this.attendanceSectionSectionList()
      } else if (tab.name == 'second') {
        this.searchWorkDaysSetting()
        this.serchWordDatyDefined()
      } else if (tab.name == 'third') {
        this.getVisitTaskSetting()
        this.getSetting()
      }
    },
    // 选择工作日
    handleCheckedCitiesChange (value) {

    },
    // 添加工作日
    showAddDate (type, row) {
      this.dateType = {
        operatorType: type,
        option: row
      };
      this.showLevelDialog = true
    },

  }
}
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
  margin: 15px 0px;
}
.save-box {
  width: 100%;
  text-align: center;
}
// 出勤地点样式
.place-address {
  div {
    display: inline-block;
    color: #1890ff;
    cursor: pointer;
  }
  .s-choose {
    margin: 0px 0px 0px 15px;
  }
  .s-del {
    margin: 0px 0px 0px 15px;
  }
}
.el-checkbox-group {
  margin: 20px 0px 0px 0px;
}
.g-tips {
  color: #666;
  font-size: 14px;
  margin: 20px 0px;
}
/deep/.picker-box {
  display: inline-block;
  // width: 240px;
  vertical-align: top;
  .el-input__inner {
    width: 240px;
  }
}
/deep/.el-input-group__append {
  position: absolute;
  left: 240px;
  top: 00px;
  height: 33px;
  line-height: 33px;
  border: none;
  box-sizing: border-box;
  padding-right: 30px;
}
.week-box {
  margin: 20px 0px 0px 0px;
}
/deep/.time-box {
  display: inline-block;
  width: 100px;
  vertical-align: top;
  .el-input__inner {
    width: 100px;
  }
}
.line {
  display: inline-block;
  margin: 20px;
  vertical-align: top;
  line-height: 0.1;
}
.m-b20 {
  margin: 0px 0px 20px 0px;
}
.m-title {
  margin: 0px 0px 0px 30px;
  font-size: 14px;
  color: #999;
}
.block {
  display: block;
}
.inline {
  display: inline !important;
  margin: 0px 10px;
}
</style>
