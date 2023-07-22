<template>
  <my-dialog append-to-body
             :visible="dialogVisible"
             :close-on-click-modal="false"
             width="66%"
             @close="close"
             @open="open"
             :title="title">
    <div class="amap-page-container">
      <el-amap vid="amap"
               ref="trackMap"
               :plugin="plugin"
               :zoom="zoom"
               :center="center"
               class="amap-demo">
        <!--路线-->
        <el-amap-polyline :editable="polyline.editable"
                          :path="polyline.path"
                          :strokeColor="polyline.strokeColor"
                          :strokeWeight="polyline.strokeWeight"
                          :lineJoin='polyline.lineJoin'
                          :lineCap="polyline.lineCap"
                          :strokeStyle="polyline.strokeStyle"
                          :strokeDasharray='polyline.strokeDasharray'
                          :events="polyline.events"></el-amap-polyline>
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
        <!--文本起始点-->
        <el-amap-text v-for="(item, index) in texts"
                      :key="index + '-only'"
                      :text="item.text"
                      :offset="item.offset"
                      :textAlign='item.textAlign'
                      :position="item.position"
                      :events="item.events"></el-amap-text>
      </el-amap>
      <!--
      <button class=""
              @click="analysisTxt">获取txt文本内容</button>
      <button @click="startTrackAnim()">发送到发送到</button>
      -->
    </div>
  </my-dialog>
</template>

<script>  
import {
  findTrailById
} from "@/api/fieldCheck";
import VueAMap from 'vue-amap'
let amapManager = new VueAMap.AMapManager();
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    id: {
      required: true,
      type: [String, Number],
      default: 0,
    },
  },
  data () {
    const that = this
    return {
      // 路况
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
      title: '地图轨迹',
      carMarker: null,  // 小车的marker
      zoom: 16,
      center: [116.478935, 39.997761],
      amapManager,

      markers: [
        {
          position: [116.478935, 39.997761],
          content: '',
          // '<div style="text-align:center;color:white; background-color:#00BFFF;height: 24px; line-height: 24px;width: 24px; border: 1px solid #00BFFF; border-radius: 12px;margin: 18px 0px 0px 0px;">起</div>',
          offset: new AMap.Pixel(-25, -35),
          // content: '<img src="static/img/icon_start.png" />',  //自定义点标记覆盖物内容
          icon: new AMap.Icon({
            image: 'http://pic.5tu.cn/uploads/allimg/1112/22230607740.jpg',
            size: new AMap.Size(52, 52), //图标大小
            offset: new AMap.Pixel(-25, -35),
          }),
        },
        {
          content:
            '<div style="text-align:center;color:white; background-color:red;height: 24px; line-height: 24px;width: 24px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 2px;">终</div>',
          icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          position: [116.484648, 39.999861],
          offset: new AMap.Pixel(-28, -28)
        }
      ],
      polyline: {
        path: [
          // [116.478935, 39.997761],
          // [116.478939, 39.997825],
          // [116.478912, 39.998549],
          // [116.478912, 39.998549],
          // [116.478998, 39.998555],
          // [116.478998, 39.998555],
          // [116.479282, 39.99856],
          // [116.479658, 39.998528],
          // [116.480151, 39.998453],
          // [116.480784, 39.998302],
          // [116.480784, 39.998302],
          // [116.481149, 39.998184],
          // [116.481573, 39.997997],
          // [116.481863, 39.997846],
          // [116.482072, 39.997718],
          // [116.482362, 39.997718],
          // [116.483633, 39.998935],
          // [116.48367, 39.998968],
          // [116.484648, 39.999861]
        ],//折线的节点坐标数组
        strokeStyle: 'solid', // 线样式 实线:solid，虚线:dashed
        strokeColor: "#32CD32", //这边颜色
        strokeWeight: 4, //线宽
        lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
        lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
        strokeDasharray: [10, 10],//此属性在strokeStyle 为dashed 时有效
        events: {
          click (e) {
            // alert('click polyline');
          },
          end: (e) => {
            let newPath = e.target.getPath().map(point => [point.lng, point.lat]);
          }
        },
        editable: false
      },
      // 文本
      texts: [
        {
          position: [116.478935, 39.997761],
          // text: '北京市朝阳区望京街道阜安西路望京SOHO',
          text: ' ',
          offset: [0, -25],
          textAlign: 'center',
          events: {
            click: () => {
              // alert('click text');
            }
          }
        },
        {
          position: [116.484648, 39.999861],
          // text: '北京市朝阳区望京街道阜安路融科·橄榄城',
          text: '',
          offset: [0, -30],
          textAlign: 'center',
          events: {
            click: () => {
              // alert('click text');
            }
          }
        }
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
  mounted () {

  },
  methods: {
    // 解析txt文件中的内容
    analysisTxt () {
      // const url = 'http://uat.cdn.kyaoduo.com/upload/license/202011/9f807050-5dae-4530-8876-7d16464f5e00.txt';
      // const url = 'http://uat.cdn.kyaoduo.com/upload/txt/202011/99c55db1-ad7f-4482-bba8-dadb22d19733.txt';
      // const url = 'http://uat.cdn.kyaoduo.com/upload/license/202011/9f807050-5dae-4530-8876-7d16464f5e00.txt';
      const url = 'http://uat.cdn.kyaoduo.com/upload/file/202011/908d4919-ca41-454c-8965-da21c210fb18.txt'
      this.$axios.get(url).then(
        res => {
          this.polyline.path = res.data
          let first = res.data[0]
          this.center = res.data[0] //中心线
          this.markers[0].position = res.data[0] //起点
          this.markers[0].position = res.data[res.data.length - 1] //终点
        },
        err => {
          console.log(err);
        }
      );
    },
    /* 渲染轨迹回放地图 */
    initMap () {
      // 渲染地图
      let map = new AMap.Map(this.$refs.trackMap, {
        zoom: 17,
        center: [116.484648, 39.999861]
      });

      // 创建小车marker
      this.carMarker = new AMap.Marker({
        map: map,
        position: [116.478935, 39.997761],
        icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
        offset: new AMap.Pixel(-13, -26),
      });

      // 绘制轨迹
      new AMap.Polyline({
        map: map,
        path: this.lineData,
        showDir: true,
        strokeColor: '#28F',  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: 'solid'  // 线样式
      });

      // 通过的轨迹
      let passedPolyline = new AMap.Polyline({
        map: map,
        showDir: true,
        strokeColor: '#4B5',  // 线颜色
        strokeOpacity: 1,     // 线透明度
        strokeWeight: 6,      // 线宽
      });
      // 小车移动回调
      this.carMarker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
      });
      // 地图自适应
      map.setFitView();

    },
    /* 开始轨迹回放动画 */
    startTrackAnim () {
      // this.carMarker.stopMove();
      this.carMarker.moveAlong(this.polyline.path, {
        duration: 200,
        autoRotation: true
      });
    },
    /* 暂停轨迹回放动画 */
    pauseTrackAnim () {
      this.carMarker.pauseMove();
    },
    /* 继续开始轨迹回放动画 */
    resumeTrackAnim () {
      this.carMarker.resumeMove();
    },
    // 查看轨迹
    findTrailById () {
      findTrailById({ id: this.id })
        .then(res => {
          if (res.data.trailLog == null) {  // 签到轨迹为null
            this.center = [res.data.signAddressLongitude, res.data.signAddressLatitude] //中心点
            this.markers[1].position = [res.data.signAddressLongitude, res.data.signAddressLatitude] //终点
            this.texts[1].position = [res.data.signAddressLongitude, res.data.signAddressLatitude]
            this.texts[0].text = ''//起点位置
            this.texts[1].text = res.data.signAddress//终点位置
          } else { //有签到轨迹
            this.$axios.get(res.data.trailLog).then(
              res => {
                this.polyline.path = res.data
                this.center = res.data[0]  //中心点
                this.markers[0].position = res.data[0] //起点
                this.markers[0].content = '<div style="text-align:center;color:white; background-color:#00BFFF;height: 24px; line-height: 24px;width: 24px; border: 1px solid #00BFFF; border-radius: 12px;margin:30px 0px 0px 5px">起</div>'
                this.markers[1].position = res.data[res.data.length - 1] //终点
                this.texts[0].position = res.data[0] //起点文字
                this.texts[1].position = res.data[res.data.length - 1]//重点文字 

                let lnglatXYStart = res.data[0];// 地图上所标点的坐标   起点位置
                AMap.service('AMap.Geocoder', () => {// 回调函数
                  let geocoder = new AMap.Geocoder({});
                  geocoder.getAddress(lnglatXYStart, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                      this.texts[0].text = result.regeocode.formattedAddress//起点位置
                    } else {
                    }
                  });
                });
                let lnglatXYEnd = res.data[res.data.length - 1];// 地图上所标点的坐标  起点位置
                AMap.service('AMap.Geocoder', () => {// 回调函数
                  let geocoder = new AMap.Geocoder({});
                  geocoder.getAddress(lnglatXYEnd, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                      this.texts[1].text = result.regeocode.formattedAddress//起点位置

                    } else {
                      console.log(err);
                    }
                  });
                });

              },
              err => {
                console.log(err);
              }
            );
          }
        })
        .catch(err => console.log(err));
    },
    open () {
      this.findTrailById()
      // this.initMap()
    },
    close () {
      this.markers = [
        {
          position: [116.478935, 39.997761],
          content:
            '<div style="text-align:center;color:white; background-color:#00BFFF;height: 24px; line-height: 24px;width: 24px; border: 1px solid #00BFFF; border-radius: 12px;margin: 30px 0px 0px 5px;">起</div>',
          offset: new AMap.Pixel(-25, -35),
          icon: new AMap.Icon({
            image: 'http://pic.5tu.cn/uploads/allimg/1112/22230607740.jpg',
            size: new AMap.Size(52, 52), //图标大小
            offset: new AMap.Pixel(-25, -35),
          }),
          contentRender: (h, instance) => h(exampleComponents, { style: { backgroundColor: '#fff' }, props: { text: 'father is here' } }, ['xxxxxxx'])
        },
        {
          content:
            '<div style="text-align:center;color:white; background-color:red;height: 24px; line-height: 24px;width: 24px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 7px;">终</div>',
          icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          position: [116.484648, 39.999861],
          offset: new AMap.Pixel(-28, -28)
        }
      ]
      this.polyline = {
        path: [
          [116.478935, 39.997761],
          [116.478939, 39.997825],
          [116.478912, 39.998549],
          [116.478912, 39.998549],
          [116.478998, 39.998555],
          [116.478998, 39.998555],
          [116.479282, 39.99856],
          [116.479658, 39.998528],
          [116.480151, 39.998453],
          [116.480784, 39.998302],
          [116.480784, 39.998302],
          [116.481149, 39.998184],
          [116.481573, 39.997997],
          [116.481863, 39.997846],
          [116.482072, 39.997718],
          [116.482362, 39.997718],
          [116.483633, 39.998935],
          [116.48367, 39.998968],
          [116.484648, 39.999861]
        ],//折线的节点坐标数组
        strokeStyle: 'solid', // 线样式 实线:solid，虚线:dashed
        strokeColor: "#32CD32", //这边颜色
        strokeWeight: 4, //线宽
        lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
        lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
        strokeDasharray: [10, 10],//此属性在strokeStyle 为dashed 时有效
        events: {
        },
        editable: false
      }
      zoom: 16
      this.dialogVisible = false;
    }
  }
};
</script >

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
#container {
  height: 50vh;
  width: 100%;
}

/deep/.amap-overlay-text-container {
  padding: 5px 10px !important;
  border-radius: 2px !important;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5) !important;
  border: 1px solid #dedede;
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
