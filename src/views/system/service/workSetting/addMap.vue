<template>
  <my-dialog :visible="dialogVisible"
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
               :center="mapCenter"
               :zoom="12"
               class="amap-demo">
        <el-amap-marker v-for="(marker,index) in markers"
                        :key='index'
                        :position="marker"></el-amap-marker>

      </el-amap>
      <div class="r-footer"
           v-if="option.operatorType == 'add'">
        <el-form ref="ruleForm"
                 :model="formData"
                 label-width="100px"
                 class="formList">
          <el-form-item label="地址坐标：">
            <el-input v-model.trim="formData.lnglat"
                      placeholder="请选择地址坐标"
                      clearable />
          </el-form-item>
          <el-form-item label="签到地址：">
            <el-input v-model.trim="formData.attendanceAddr"
                      placeholder="请选择签到地址"
                      clearable />
          </el-form-item>
          <el-button type="primary"
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
        option: {}
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
      markers: [
        [121.59996, 31.197646],
      ],
      searchOption: {
        // city: '上海',
        // citylimit: true
      },
      mapCenter: [121.59996, 31.197646],
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
    },
    saveAddress () {
      //时间地点保存
      saveAttendanceSetting(this.formData)
        .then(res => {
          this.$message({ message: res.resp_msg, type: 'success' });
        })
        .catch(() => { });
    },
    open () {
      this.formData = this.option.option
      this.markers = [[this.option.option.longitude, this.option.option.latitude]] //标记点
      this.mapCenter = [this.option.option.longitude, this.option.option.latitude] //中心点
      this.formData.lnglat = this.option.option.longitude + '，' + this.option.option.latitude
      this.formData.attendanceAddr = this.option.option.attendanceAddr
    },
    close () {
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
</style>
