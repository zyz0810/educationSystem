<template>
  <div class="app-container">
    <div class="header-box">
      <el-form class="search_box"
               :inline="true"
               :model="listQuery">
        <el-form-item label="选择员工">
          <el-select placeholder="请选择员工"
                     filterable
                     v-model.trim="listQuery.employeeId"
                     @change="attendanceSignTraceFindByDate(1)">
            <el-option v-for="(item, index) in userOptions"
                       :key="index"
                       :label="item.nickname"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker v-model="listQuery.date"
                          type="date"
                          value-format="yyyy-MM-dd"
                          @change="attendanceSignTraceFindByDate(1)"
                          placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="header-box-right">
        <div @click="attendanceSignTraceFindByDate(1)"><i class="iconfont icon-guijichakan"></i>轨迹
        </div>
        <div @click="attendanceSignTraceFindByDate(2)"><i class="iconfont icon-dingwei"></i>定位</div>
      </div>
    </div>
    <div class="mt10 p_10 bg_white height100">
      <div class="amap-wrapper">
        <el-amap class="amap-box"
                 vid='amap'
                 :amap-manager='amapManager'
                 :zoom="zoom"
                 :plugin="plugin"
                 :center="center"
                 :mapStyle="mapStyle">
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
          <el-amap-marker :vid="indexText"
                          v-for="(markerTest, indexText) in markersText"
                          :key="indexText + '^-^'"
                          :position="markerTest.position"
                          :content="markerTest.content"></el-amap-marker> 
          <!--marker标记点-->
          <el-amap-text v-for="(item, index) in texts"
                        :key="index + '-only'"
                        :text="item.text"
                        :offset="item.offset"
                        :textAlign='item.textAlign'
                        :position="item.position"
                        :events="item.events"></el-amap-text>
        </el-amap>

      </div>
    </div>
  </div>
</template>

<script>
import { getUsersByRole } from "@/api/common"; //过滤掉禁用员工
import { attendanceSignTraceFindByDate } from "@/api/trackView";
import { getUsers } from "@/api/system/staff";
import vue from 'vue'
import VueAMap from 'vue-amap'
vue.use(VueAMap)
let amapManager = new VueAMap.AMapManager();
import { mapGetters, mapState } from "vuex";
import {
  getSetting,
} from "@/api/system/config";
export default {
  name: 'trackView',
  components: {
  },
  data () {
    const self = this;
    return {
      minutes: 1,
      listQuery: {
        employeeId: '', //员工id
        date: '',
      },
      userOptions: [],
      positions: {
        address: '',
        lng: '',
        lat: '',
      },
      amapManager,
      center: [121.59996, 31.197646],//地图中心点坐标
      zoom: 16,//初始化地图显示层级
      mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a", //设置地图样式 
      // 路况
      plugin: [
        {
          pName: 'ToolBar',
          events: {
            init (instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init (instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'Scale',
          events: {
            init (instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'Geolocation',
          events: {
            init (o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                //  能获取定位的所有信息
                if (result && result.position) {
                  self.str = result.formattedAddress;
                  self.positions.address = self.str.substring(self.str.indexOf('市') + 1);
                  self.positions.lng = result.position.lng;
                  self.positions.lat = result.position.lat;
                  self.positions.loaded = true;
                  self.center = [result.position.lng, result.position.lat]
                  self.$nextTick(
                    self.getPosition()   //数据加载完执行
                  );
                  sessionStorage.setItem('id', JSON.stringify(self.positions));
                }
              });
            }
          }
        }
      ],
      markers: [
        // {
        //   position: [117.34984, 31.89489],
        //   icon: new AMap.Icon({
        //     image: require('../../../assets/image/car.png'),
        //     size: new AMap.Size(52, 52), //图标大小
        //     offset: new AMap.Pixel(-10, -10),
        //   }),
        //   // content:
        //   //   '<div style="text-align:center;color:white; background-color:#00BFFF;height: 24px; line-height: 24px;width: 24px; border: 1px solid #00BFFF; border-radius: 12px;margin: 18px 0px 0px 0px;">起</div>',
        // },
        // {
        //   content:
        //     '<div style="text-align:center;color:white; background-color:red;height: 24px; line-height: 24px;width: 24px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 2px;">终</div>',
        //   icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
        //   position: [121.59996, 31.197646],
        //   offset: new AMap.Pixel(-28, -28)
        // }
      ],
      // 文本
      markersText: [],
      // 文本
      texts: [
        {
          position: [117.34984, 31.89489],
          text: '北京市朝阳区望京街道阜安西路望京SOHO',
          offset: [0, -25],
          textAlign: 'center',
          events: {
            click: () => {
              alert('click text');
            }
          }
        },
      ],
      polyline: {
        path: [
          // [121.59996, 31.197646], [117.259138, 31.895798], [117.369938, 31.894798]
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
    };
  },
  created () {
  },
  mounted () {
    this.listQuery.date = this.$moment(new Date()).format('YYYY-MM-DD')
    this.listQuery.employeeId = this.crm_id
    this.getSetting()
    this.getUsersByRole() //过滤掉禁用员工
    // this.$nextTick(() => {
    //   this.getSetting()
    //   const timer = setInterval(() => {
    //   }, this.minutes * 60000)
    //   this.$once('hook:beforeDestroy', () => {
    //     clearInterval(timer)
    //   })
    // })
  },
  computed: {
    ...mapState({
      name: (state) => state.user.name,
      crm_id: (state) => state.user.crm_id,
    }),
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    next()
  },
  methods: {
    // 其他设置
    getSetting () {
      getSetting({})
        .then(res => {
          this.minutes = res.data.minutes
        })
        .catch(() => { });
    },
    getPosition () {
      // 当前位置
      this.texts = [
        {
          position: [this.positions.lng, this.positions.lat],
          text: this.positions.address,
          offset: [0, -25],
          textAlign: 'center',
        },
      ]
    },
    // 定时器
    getSetIntval () {
      this.timer = setInterval(() => {
        this.attendanceSignTraceFindByDate()
      }, this.minutes * 60000); //循环执行就是设置一个时间间隔，每过一段时间都会执行一次这个方法,直到这个定时器被销毁掉
    },
    // 轨迹定位查询
    attendanceSignTraceFindByDate (val) {
      clearTimeout(this.timer); //清楚定时器
      val == 2 ? this.listQuery.date = this.$moment(new Date()).format('YYYY-MM-DD') : this.listQuery.date
      attendanceSignTraceFindByDate(this.listQuery)
        .then((res) => {
          if (res.data.path.length == 0) {
            if (val == 1) {
              this.$message({
                message: '暂无轨迹信息',
                type: 'warning'
              });
            }
            this.getPosition()  //获取当前位置
            this.markers = []
            this.markersText = []
            this.center = [this.positions.lng, this.positions.lat]
            this.polyline.path = res.data.path
          } else {
            this.texts = []
            // 起点1，签到点：2，终点：3，停留点：4，经过点:5
            this.polyline.path = res.data.path
            this.markers = res.data.market.map((item, index) => {
              return {
                mark: item.mark,
                position: item.point,
                icon: new AMap.Icon({
                  image:
                    item.mark == 1 ? require('../../../assets/image/point1.png')
                      : item.mark == 2 ? require('../../../assets/image/point2.png')
                        : item.mark == 3 ? require('../../../assets/image/point3.png')
                          : item.mark == 4 ? require('../../../assets/image/point5.png')
                            : item.mark == 5 ? require('../../../assets/image/point5.png')
                              : '',
                  size: new AMap.Size(43, 43), //图标大小
                  offset: new AMap.Pixel(-50, -50),
                }),
                events: {
                  // 鼠标移近
                  mouseover: (item) => {
                    // console.log(item.target.Ce.position)
                    // let position = [item.target.Ce.position.lng, item.target.Ce.position.lat]
                    // 判断当前鼠标经过的标记点
                    this.markersText = res.data.market.filter(item2 => item2.longitude == item.target.Ce.position.lng).map((item2, index) => {
                      return {
                        content: `<div class='info'>
                                  <div class="point"></div>
                                  <div class="customer_name">${item2.customerStoreName}（${this.$moment(item2.createTime).format('HH:mm')}）</div>
                                  <div>${item2.address}</div>
                                  </div>`,
                        position: item2.point,
                      }
                    })
                    // 判断当前鼠标经过的标记点
                    // this.texts = res.data.market.filter(item2 => item2.longitude == item.target.Ce.position.lng).map((item2, index) => {
                    //   return {
                    //     text: item2.address + '(' + this.$moment(item2.createTime).format('HH:mm') + ')' + 'div' + '11' + '</div>',
                    //     offset: [0, -30],
                    //     textAlign: 'center',
                    //     position: item2.point,
                    //     visible: false
                    //   }
                    // }) 
                  },
                  // 鼠标移出
                  mouseout: () => {
                    this.texts = []
                    this.markersText = []
                  }
                }
              }
            })
            // 有轨迹默认当前第一条为起点   没有就当前浏览器的中心点 
            this.center = res.data.path.length == 0 ? [this.positions.lng, this.positions.lat] : this.polyline.path[0]
            this.center = val == 1 ? this.polyline.path[0] : this.polyline.path.slice(-1)[0]
          }
          // 当前天可查轨迹定时查
          let date = this.$moment(new Date()).format('YYYY-MM-DD')
          if (this.listQuery.date == date) {
            this.getSetIntval()
          }
        })
        .catch((err) => console.log(err));
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;

          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    // getLocation () {
    //   // this.listQuery.date = this.$moment(new Date()).format('YYYY-MM-DD')
    //   attendanceSignTraceFindByDate(this.listQuery)
    //     .then((res) => {
    //       if (res.data.path.length == 0) {
    //         this.$message({
    //           message: '暂无轨迹信息',
    //           type: 'warning'
    //         });
    //         this.getPosition()  //获取当前位置
    //       } else {
    //         // 起点1，签到点：2，终点：3，停留点：4，经过点:5
    //         this.polyline.path = res.data.path
    //         this.markers = res.data.market.map((item, index) => {
    //           return {
    //             mark: item.mark,
    //             position: item.point,
    //             content:
    //               item.mark == 1 ? '<div style="font-size:12px;text-align:center;color:white; background-color:#00BFFF;height: 25px; line-height: 25px;width: 40px; border: 1px solid #00BFFF; border-radius: 12px;margin: 18px 0px 0px 0px;">起点</div>'
    //                 : item.mark == 2 ? '<div style="font-size:12px;text-align:center;color:white; background-color:rgb(0, 121, 254);height: 25px; line-height: 25px;width: 40px; border: 1px solid #00BFFF; border-radius: 12px;margin: 18px 0px 0px 0px;">签到</div>'
    //                   : item.mark == 3 ? '<div style="font-size:12px;text-align:center;color:white; background-color:red;height: 25px; line-height: 25px;width: 40px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 2px;">终点</div>'
    //                     : item.mark == 4 ? '<div style="font-size:12px;text-align:center;color:white; background-color:rgba(254, 148, 0, 1);height: 25px; line-height: 25px;width: 40px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 2px;">停留</div>'
    //                       : item.mark == 5 ? '<div style="font-size:12px;text-align:center;color:white; background-color:red;height: 25px; line-height: 25px;width: 40px; border: 1px solid red; border-radius: 12px;margin: 24px 0px 0px 2px;">经过</div>'
    //                         : ""
    //           }
    //         })
    //         this.texts = res.data.market.map((item, index) => {
    //           return {
    //             text: item.address + '(' + this.$moment(item.createTime).format('HH:mm') + ')',
    //             offset: [0, -25],
    //             textAlign: 'center',
    //             position: item.point,
    //           }
    //         })
    //       }
    //       // 有轨迹默认当前第一条为起点   没有就当前浏览器的中心点
    //       this.center = res.data.path.length == 0 ? [this.positions.lng, this.positions.lat] : this.polyline.path.slice(-1)[0]
    //     })
    //     .catch((err) => console.log(err));
    // },
    // 初始化地图   刷新不显示地图问题
    // createAmap () {
    //   let map = new AMap.Map('amap', {
    //     resizeEnable: true,
    //     zoom: 16, // 设置地图显示的缩放级别
    //     center: this.center, // 设置地图中心点坐标
    //     // markers: this.markers,
    //     viewMode: '2D', // 设置地图模式
    //     // 地图模式
    //     lang: 'zh_cn',// 设置地图语言类型, 
    //   })
    //   let scale = new AMap.Scale({ // 比例尺
    //     visible: true
    //   })
    //   let toolBar = new AMap.ToolBar({ // 工具条
    //     visible: true
    //   })
    //   let MapType = new AMap.MapType({ //卫星路况
    //     visible: true
    //   })
    //   map.addControl(scale)
    //   map.addControl(toolBar)
    //   map.addControl(MapType)
    //   // 浏览器精确定位
    //   AMap.plugin('AMap.Geolocation', function () {
    //     var geolocation = new AMap.Geolocation({
    //       enableHighAccuracy: true, // 是否使用高精度定位，默认:true
    //       timeout: 10000, // 超过10秒后停止定位，默认：无穷大
    //       maximumAge: 0, // 定位结果缓存0毫秒，默认：0
    //       convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    //       showButton: true, // 显示定位按钮，默认：true
    //       buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
    //       buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //       showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
    //       showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
    //       panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
    //       zoomToAccuracy: false // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    //     })
    //     map.addControl(geolocation)
    //     geolocation.getCurrentPosition(function (status, result) {
    //       let position = result.position
    //       if (status === 'complete') {
    //         console.log('定位成功：定位结果 = %o', [position.lng, position.lat])
    //       } else {
    //         console.log('定位失败')
    //       }
    //     })
    //   })
    // },
  },
};
</script>

<style lang="scss" scoped>
.height100 {
  height: 82vh;
}
.amap-wrapper {
  width: 100%;
  height: 80vh;
}
.header-box {
  // display: flex;
  // justify-content: space-between;
  .header-box-right {
    position: absolute;
    z-index: 99;
    top: 60px;
    left: 700px;
    background: white;
    padding: 5px 10px;
    border-radius: 4px;
    div {
      display: inline;
      cursor: pointer;
      user-select: none;
      &:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
}
.icon-dingwei,
.icon-locus {
  font-size: 18px;
  font-weight: 600;
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
