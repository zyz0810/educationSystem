<template>
  <my-dialog append-to-body
             :visible="dialogVisible"
             :close-on-click-modal="false"
             width="66%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <div class="amap-page-container">
      <el-amap-search-box v-if="option.operatorType == 'add' "
                          class="search-box"
                          :search-option="searchOption"
                          :on-search-result="onSearchResult">
      </el-amap-search-box>
      <el-amap vid="amapDemo"
               :plugin="plugin"
               :center="mapCenter"
               :zoom="12"
               class="amap-demo">
        <!--标记-->
        <el-amap-marker v-for="(marker,index) in markers"
                        :key='index'
                        :position="marker"></el-amap-marker>
        <!--文本起始点-->
        <el-amap-text v-for="(item, index) in texts"
                      :key="index + '-only'"
                      :text="item.text"
                      :offset="item.offset"
                      :textAlign='item.textAlign'
                      :position="item.position"
                      :events="item.events"></el-amap-text>
      </el-amap>
      <div class="r-footer">
        <el-form ref="ruleForm"
                 :model="formData"
                 label-width="100px"
                 class="formList">
          <el-form-item label="地址坐标：">
            <el-input v-model="formData.lnglat"
                      :disabled="option.operatorType != 'add'"
                      placeholder="请选择地址坐标"
                      clearable />
          </el-form-item>
          <el-form-item label="签到地址：">
            <el-input v-model="formData.attendanceAddr"
                      :disabled="option.operatorType != 'add'"
                      placeholder="请选择签到地址"
                      clearable />
          </el-form-item>
          <el-button type="primary"
                     v-if="option.operatorType == 'add'"
                     size='medium'
                     @click="saveAddress()">保存</el-button>
        </el-form>
      </div>
    </div>
  </my-dialog>
</template>

<script>
import {
  saveAttendanceSetting
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
        operatorType: "look",
        option: {
          signAddressLatitude: "",
          signAddressLongitude: "",
          signAddress: ""
        }
      }
    },
  },
  data () {
    const that = this
    return {
      textMap: {
        look: "地址详情",
        add: "选择地址"
      },
      formData: {
        lnglat: '',
        longitude: '',
        latitude: '',
        attendanceAddr: '',
      },
      // 插件
      plugin: [
        {
          pName: 'ToolBar',
          events: {
            init (instance) {
            }
          }
        },
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init (instance) {
            }
          }
        },
        {
          pName: 'Scale',
          events: {
            init (instance) {
            }
          }
        }
      ],
      markers: [
        [117.316937, 31.885135],
      ],
      searchOption: {
        city: '合肥',
        citylimit: true
      },
      mapCenter: [117.316937, 31.885135],
      // 文本
      texts: [
        {
          position: [117.316937, 31.885135],
          text: ' ',
          offset: [0, -25],
          textAlign: 'center',
          events: {
            click: () => {
              // alert('click text');
            }
          }
        },
      ]
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
    // 添加标注点
    addMarker: function () {
      let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
      let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
      this.markers.push([lng, lat]);
    },
    onSearchResult (pois) {
      let latSum = 0
      let lngSum = 0
      pois.forEach((poi, index) => {
        lngSum += poi.lng
        latSum += poi.lat
      })
      let center = {
        lng: lngSum / pois.length,
        lat: latSum / pois.length,
        name: name / pois.length
      }
      this.formData.attendanceAddr = pois[0].name //选中的地址
      this.mapCenter = [pois[0].lng, pois[0].lat] //中心点
      this.markers = [[pois[0].lng, pois[0].lat]] //标记点
      this.formData.lnglat = pois[0].lng + '，' + pois[0].lat
      this.formData.longitude = pois[0].lng
      this.formData.latitude = pois[0].lat

      this.texts[0].position = this.mapCenter  //中心点位置
      this.texts[0].text = this.formData.attendanceAddr
    },
    saveAddress () {
      let addressInfor = {
        signAddress: this.formData.attendanceAddr,
        signAddressLatitude: this.formData.latitude || "31.885135",
        signAddressLongitude: this.formData.longitude || '117.316937',
      }
      this.$emit("onChange", addressInfor)
      this.dialogVisible = false;
    },
    open () {
      if (this.option.operatorType != 'add') {

      }
      // if (this.option.operatorType != 'add') {
      this.formData = this.option.option
      this.markers = [[this.option.option.signAddressLongitude || '117.316937', this.option.option.signAddressLatitude || '31.885135']] //标记点
      this.mapCenter = [this.option.option.signAddressLongitude || '117.316937', this.option.option.signAddressLatitude || "31.885135"] //中心点
      this.formData.lnglat = (this.option.option.signAddressLongitude || '117.316937') + '，' + (this.option.option.signAddressLatitude || "31.885135")
      this.formData.attendanceAddr = this.option.option.signAddress || '合肥'

      this.texts[0].position = this.mapCenter  //中心点位置
      this.texts[0].text = this.formData.attendanceAddr


      // }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        lnglat: '',
        longitude: '',
        latitude: '',
        attendanceAddr: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 10px 0px;
}
/deep/.el-form {
  justify-content: space-between;
  display: flex;
  margin: 20px 0px 0px 0px;
}
/deep/.el-button {
  margin: 0px 0px 0px 20px;
  height: 35px;
}
.amap-page-container {
  position: relative;
  .amap-demo {
    height: 500px;
    left: 100px;
  }
  .search-box {
    position: absolute;
    top: 20px;
    left: 10%;
    border: 1px solid #dedede;
    width: 80%;
  }
}
/deep/.el-form-item {
  width: 50%;
}
/deep/.el-input__inner {
  width: 90% !important;
}

/deep/.amap-overlay-text-container {
  padding: 5px 10px !important;
  border-radius: 2px !important;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5) !important;
  border: 1px solid #dedede;
  margin: -29px 0px 0px -36px;
}
/deep/.amap-overlay-text-container::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translate(-50%, -50%);
  border-right: solid 10px transparent;
  border-top: solid 10px white;
  border-left: solid 10px transparent;
}
/deep/.amap-overlay-text-container::after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translate(-50%, -50%);
  border-right: solid 10px transparent;
  border-top: solid 10px white;
  border-left: solid 10px transparent;
}
</style>
