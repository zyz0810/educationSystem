<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="110px"
             :rules="rules"
             class="formList">
      <div>
        <div class="block_title">考勤组名称</div>
        <el-form-item label="考勤组名称："
                      class="picker-box"
                      v-if='formData.sectionPARM'
                      prop="sectionPARM.name">
          <el-input @change="getName"
                    v-model.trim="formData.sectionPARM.name"
                    placeholder="输入考勤组名称">
          </el-input>
        </el-form-item>
        <div class="block_title">考勤时间</div>
        <el-form-item label="上班时间："
                      prop="goWorkTime">
          <el-time-picker class="picker-box"
                          format='HH:mm'
                          value-format="HH:mm"
                          v-model="formData.goWorkTime"
                          @clear="setValueNull"
                          clearable
                          placeholder="上班时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下班时间："
                      prop="afterWork">
          <el-time-picker class="picker-box"
                          format='HH:mm'
                          value-format="HH:mm"
                          v-model="formData.afterWork"
                          clearable
                          placeholder="下班时间">
          </el-time-picker>
        </el-form-item>
      </div>
      <div class="m-b20">
        <div class="block_title">休息时间</div>
        <el-form-item label="休息时间："
                      prop="afterWork">
          <el-time-picker class="time-box"
                          format='HH:mm'
                          value-format="HH:mm"
                          v-model="restTimeStart"
                          clearable>
          </el-time-picker>
          <span class="line">-</span>
          <el-time-picker class="time-box"
                          format='HH:mm'
                          value-format="HH:mm"
                          v-model="restTimeStop"
                          clearable>
          </el-time-picker>
        </el-form-item>
      </div>
      <div class="block_title">地点打卡</div>
      <el-form-item class="place-address"
                    label="考勤地址："
                    prop="attendanceAddr">
        <div class="s-address"
             @click="showMap('look')">{{formData.attendanceAddr}}</div>
        <div class="s-choose"
             @click="showMap('add')"><i class="iconfont icon-dizhi"></i>选择</div>
      </el-form-item>
      <el-form-item label="有效范围："
                    class="picker-box"
                    prop="attendanceDistance">
        <el-input v-model.trim="formData.attendanceDistance"
                  type="number"
                  placeholder="输入数值">
          <template slot="append">米</template>
        </el-input>
      </el-form-item>
      <p class="m-title">超出此范围将无法完成打卡</p>
      <div class="block_title">其他设置</div>
      <div>
        <el-checkbox @change='getAllowOutSign'
                     v-model="allowOutSign">允许外勤打卡</el-checkbox>
      </div>
      <el-checkbox @change='getOutSignPic'
                   v-model="outSignPic">外勤打卡需拍照</el-checkbox>
      <el-checkbox @change='getNeedRemark'
                   v-model="needRemark">外勤打卡需填写备注</el-checkbox>
      <div style="margin: 15px 0;"></div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="attendanceSectionSave">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
    <!--地图弹窗-->
    <Map :showDialog.sync="showMapDialog"
         @onChange="addressInfor"
         :option="mapType"></Map>
  </my-dialog>
</template>

<script> 
import {
  attendanceSectionSave,
  findById
} from "@/api/system/config";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: Object,
      default: {
        operatorType: "add",
        option: {}
      }
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      tipsDialog: false,
      textMap: {
        add: "新增考勤组",
        update: "编辑考勤组"
      },
      formData: {
        names: '',
        id: "",//考勤组id
        goWorkTime: "00:00",
        afterWork: "00:00",
        attendanceAddr: '',
        attendanceDistance: '', //考勤半径
        latitude: '',
        longitude: '',
        restTime: '',//休息时间段
        sectionPARM: {
          name: '',//考勤组名称
          checkingSectionOtherSetting: {
            allowOutSign: true, //允许外勤打卡
            needRemark: true, //外勤打卡需填写备注
            outSignPic: true, //外勤打卡需拍照
          }
        }
      },
      allowOutSign: true, //允许外勤打卡
      needRemark: true, //外勤打卡需填写备注
      outSignPic: true, //外勤打卡需拍照
      restTimeStart: "00:00",
      restTimeStop: "00:00",
      rules: {
        'sectionPARM.name': [
          { required: true, message: "请输入考勤组名称", trigger: "blur" }
        ],
        // name: [
        //   { required: true, message: "请输入考勤组名称", trigger: "blur" }
        // ],
        goWorkTime: [
          { required: true, message: "请选择上班时间", trigger: "blur" }
        ],
        afterWork: [
          { required: true, message: "请选择下班时间", trigger: "blur" }
        ],
        attendanceAddr: [
          { required: true, message: "请选择出勤地点", trigger: "blur" }
        ],
        attendanceDistance: [
          { required: true, message: "请输入考勤半径", trigger: "blur" }
        ],
      },
      showMapDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
      checkAll: true,
      checkedCities: ['外勤打卡需拍照', '外勤打卡需填写备注',],
      cities: ['外勤打卡需拍照', '外勤打卡需填写备注',],
      isIndeterminate: true
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  methods: {
    setValueNull (val) {
      this.carModels = [];
      this.derives = [];
    },
    getName (val) {
      // this.formData.sectionPARM.name = val
    },
    getAllowOutSign (val) {
      this.formData.sectionPARM.checkingSectionOtherSetting.allowOutSign = val
      if (val == false) {
        this.needRemark = this.formData.sectionPARM.checkingSectionOtherSetting.needRemark = false
        this.outSignPic = this.formData.sectionPARM.checkingSectionOtherSetting.outSignPic = false
      }
    },
    getNeedRemark (val) {
      this.formData.sectionPARM.checkingSectionOtherSetting.needRemark = val
      if (val == true) {
        this.allowOutSign = this.formData.sectionPARM.checkingSectionOtherSetting.allowOutSign = true
      }
    },
    getOutSignPic (val) {
      this.formData.sectionPARM.checkingSectionOtherSetting.outSignPic = val
      if (val == true) {
        this.allowOutSign = this.formData.sectionPARM.checkingSectionOtherSetting.allowOutSign = true
      }
    },
    // 考勤组根据id查询   
    findById () {
      findById({ id: this.option.option.id })
        .then(res => {
          this.formData = res.data

          this.allowOutSign = res.data.sectionPARM.checkingSectionOtherSetting.allowOutSign //允许外勤打卡
          this.needRemark = res.data.sectionPARM.checkingSectionOtherSetting.needRemark //外勤打卡需填写备注
          this.outSignPic = res.data.sectionPARM.checkingSectionOtherSetting.outSignPic //外勤打卡需拍照

          var strs = new Array(); //定义一数组
          strs = this.formData.restTime.split("-"); //字符分割
          this.restTimeStart = strs[0]
          this.restTimeStop = strs[1]

          delete this.formData.empIdList
          delete this.formData.departmentIdList
          delete this.formData.sectionPARM.otherSettings
        })
        .catch(() => { });
    },
    //时间地点保存
    attendanceSectionSave () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.formData.restTime = `${this.restTimeStart}-${this.restTimeStop}`
          attendanceSectionSave(this.formData)
            .then(res => {
              this.$message({ message: res.resp_msg, type: 'success' });
              this.$emit("modify");
              this.dialogVisible = false
              // if (this.option.operatorType == 'update') {
              //   this.$confirm('立即生效：今日考勤结果将按新规则重算', '选择规则生效时间', {
              //     confirmButtonText: '明天生效',
              //     cancelButtonText: '立即生效',
              //   }).then(() => {
              //     // this.$message({
              //     //   type: 'success',
              //     //   message: '操作成功!'
              //     // });
              //     this.$emit("modify");
              //     this.dialogVisible = false
              //   }).catch(() => {
              //     // this.$message({
              //     //   type: 'success',
              //     //   message: '立即生效'
              //     // });
              //     this.$emit("modify");
              //     this.dialogVisible = false
              //   });

              // } else {

              // }
            })
            .catch(() => { });
        } else {
          return false;
        }
      });
    },
    // 选择地址
    addressInfor (val) {
      this.formData.latitude = val.signAddressLatitude
      this.formData.longitude = val.signAddressLongitude
      this.formData.attendanceAddr = val.signAddress
    },
    // 地图显示
    showMap (val) {
      this.mapType = {
        operatorType: val,
        option: {
          signAddressLatitude: this.formData.latitude,
          signAddressLongitude: this.formData.longitude,
          signAddress: this.formData.attendanceAddr
        }
      };
      this.showMapDialog = true
    },
    open () {
      if (this.option.operatorType != "add") {
        this.formData = this.option.option
        this.findById()
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: "",//考勤组id
        goWorkTime: "00:00",
        afterWork: "00:00",
        attendanceAddr: '',
        attendanceDistance: '', //考勤半径
        latitude: '',
        longitude: '',
        restTime: '',//休息时间段
        sectionPARM: {
          name: '',//考勤组名称
          checkingSectionOtherSetting: {
            // allowOutSign: true, //允许外勤打卡
            // needRemark: true, //外勤打卡需填写备注
            // outSignPic: true, //外勤打卡需拍照
          }
        }
      })
      this.restTimeStart = "00:00"
      this.restTimeStop = "00:00"
      this.dialogVisible = false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
/deep/.picker-box {
  display: inline-block;
  width: 240px;
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
.block_title {
  padding-left: 5px;
  border-left: 5px solid $menuActiveText;
  margin: 10px 0px;
  font-size: 16px;
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
.m-title {
  font-size: 13px;
  color: #999;
  margin-left: 100px;
  margin-top: 0px;
}
</style>
