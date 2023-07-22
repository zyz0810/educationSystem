
<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="66%"
             append-to-body
             @close="close"
             @open="open"
             title="地址详情">
    <div class="">
      <div class="amap-page-container">
        <el-amap vid="amapDemo"
                 :plugin="plugin"
                 :center="mapCenter"
                 :zoom="zoom"
                 class="amap-demo">
          <!--标记点-->
          <el-amap-marker :vid="index"
                          v-for="(marker, index) in markers"
                          :key="index"
                          :position="marker.position"
                          :icon="marker.icon"
                          :content="marker.content"
                          :map-manager="amapManager"
                          :visible="marker.visible"
                          :draggable="marker.draggable"
                          :events="marker.events"></el-amap-marker> 
          <!--标记点文字-->
          <el-amap-marker :vid="indexText"
                          v-for="(markerTest, indexText) in markersText"
                          :key="indexText + '^-^'"
                          :position="markerTest.position"
                          :content="markerTest.content"></el-amap-marker> 

        </el-amap>
      </div>
    </div>

  </my-dialog>
</template>

<script> 
import vue from 'vue'
import VueAMap from 'vue-amap'
vue.use(VueAMap)
let amapManager = new VueAMap.AMapManager();
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    mapInfor: {
      required: false,
      type: Object,
      default: {
        option: {}
      }
    },
  },
  data () {
    const that = this
    return {
      amapManager,
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
      zoom: 12,
      markers: [
        [117.130522, 31.854037],
      ],
      searchOption: {
        city: '合肥',
        citylimit: true
      },
      mapCenter: [117.130522, 31.854037],
      markersText: [],   // 文本
      infor: []
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
    open () {
      this.zoom = 12
      this.infor = [
        {
          address: this.mapInfor.storeAddress,
          latitude: this.mapInfor.customerStoreLatitude,  //2
          longitude: this.mapInfor.customerStoreLongitude,  //3
          mark: 1,
          point: [this.mapInfor.customerStoreLongitude, this.mapInfor.customerStoreLatitude],
        }, {
          address: this.mapInfor.signAddress,
          latitude: this.mapInfor.userLatitude,//2
          longitude: this.mapInfor.userLongitude, //3
          mark: 2,
          point: [this.mapInfor.userLongitude, this.mapInfor.userLatitude],
        }
      ]
      this.mapCenter = this.infor[0].point
      this.markers = this.infor.map((item, index) => {
        return {
          mark: item.mark,
          position: item.point,
          icon: new AMap.Icon({
            image:
              item.mark == 1 ? require('../../../assets/image/address1.png')
                : item.mark == 2 ? require('../../../assets/image/address2.png')
                  : '',
            size: new AMap.Size(43, 43), //图标大小
            offset: new AMap.Pixel(-50, -50),
          }),
          events: {
            // 鼠标移近
            mouseover: (item) => {
              // 判断当前鼠标经过的标记点
              this.markersText = this.infor.filter(item2 => item2.longitude == item.target.Ce.position.lng).map((item2, index) => {
                return {
                  content: `<div class='info'>
                                  <div class="point"></div>
                                  <div class="customer_name">${item2.address}</div>
                                  </div>`,
                  position: item2.point,
                }
              })
            },
            // 鼠标移出
            mouseout: () => {
              this.markersText = []
            }
          }
        }
      })
      // this.markers = this.infor[0].point
      // if (this.option.operatorType != 'add') {
      // this.formData = this.option.option
      // this.markers = [[this.option.option.signAddressLongitude || '117.316937', this.option.option.signAddressLatitude || '31.885135']] //标记点
      // this.mapCenter = [this.option.option.signAddressLongitude || '117.316937', this.option.option.signAddressLatitude || "31.885135"] //中心点
      // this.formData.lnglat = (this.option.option.signAddressLongitude || '117.316937') + '，' + (this.option.option.signAddressLatitude || "31.885135")
      // this.formData.attendanceAddr = this.option.option.signAddress || '合肥'
      // this.texts[0].position = this.infor[0].point //中心点位置
      // this.texts[0].text = '合肥'
      // }
    },
    close () {
      this.markers = []
      this.markersText = []
      this.zoom = 12
      this.infor = {}
      // this.mapInfor = {}
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
.amap-wrapper {
  width: 100%;
  height: 80vh;
}
/deep/.search_box {
  border-color: #e9e9e9;
  background: transparent !important;
  padding: 0px 15px;
  overflow: hidden;
  position: absolute;
  z-index: 999999;
  left: 100px;
  top: 50px;
}
/deep/.amap-overlay-text-container {
  font-size: 14px !important;
  padding: 5px !important;
}
/deep/.amap-icon img {
  width: 32px !important;
  top: 12px !important;
}
/deep/.info {
  position: absolute;
  top: 50%;
  left: 50%;
  background: white;
  padding: 8px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  transform: translate(-48%, -93%);
  line-height: 1.5em;
  width: auto;
  .point {
    position: absolute;
    left: 48%;
    bottom: -10px;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    border-top: 15px solid white;
  }
  .customer_name {
    font-size: 15px;
    color: #333;
    font-weight: 600;
  }
}
</style>

