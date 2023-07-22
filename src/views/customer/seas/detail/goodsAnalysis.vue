<template>
  <div class="">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="选择时间">
        <el-date-picker v-model="orderTime"
                        value-format="yyyy-MM"
                        clearable
                        type="monthrange"
                        :picker-options="billPickerOptions"
                        @change="selectProductAnalysisList"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="selectProductAnalysisList"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="goods-analysis">
      <div class="s-div">
        <div class='v-title'>
          <span>{{storeName}} </span>
          <span>{{this.$moment(listQuery.startTime).format("YYYY-MM")}}月~{{this.$moment(listQuery.endTime).format("YYYY-MM")}}月 </span>进货概览
        </div>
        <div id="order"
             :style="{ width: '100%', height: '300px' }"></div>
        <div class='v-bottom'
             v-if='productType'>进货商品种类：{{productType || 0}} , 进货商品数量：{{productTotalQuantity  || 0}}</div>
      </div>
      <div class="s-div2">
        <div class='v-title'>
          <span>{{goodsName}}</span>
          <span>{{this.$moment(listQuery.endTime).subtract(150, 'days').format("YYYY-MM")}}月~{{this.$moment(listQuery.endTime).format("YYYY-MM")}}月</span>进货趋势
        </div>
        <div id="goods"
             :style="{ width: '100%', height: '430px' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  selectProductAnalysisBySkuId,
  selectProductAnalysisList,
} from "@/api/customer/customer";
import detail from "./detail";
export default {
  props: {
    customerStoreId: {
      required: true,
      type: [Number, String],
      default: ""
    },
    storeName: {
      require: true,
      type: String,
      default: '',
    }
  },
  components: {
    detail
  },
  data () {
    return {
      listLoading: false,
      listQuery: {
        startTime: '',
        endTime: '',
      },
      orderList: [],
      goodsName: '',
      xAxisData: ['一月', '二月', '三月', '四月', '五月', '六月'],
      data1: [-44, 466, 545, 667, 898, 545,],//数量
      data2: [-84, 426, 525, 627, 999, 515,], //增幅
      skuId: '',
      productTotalQuantity: '',
      productType: '',
      maxProportion: '',
      billPickerOptions: {
        disabledDate (time) {
          let t = new Date().getDate();
          // return time.getTime() > Date.now() - 8.64e7 * t ; 
          return time.getTime() > Date.now();  //包含本月 - 8.64e7 * t 删除
        }
      },
    };
  },
  mounted () {
    var date = new Date(new Date().setDate(1));
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : "" + month;
    this.listQuery.startTime = this.listQuery.endTime = date.getFullYear() + "-" + month
    // 加载图表
    this.$nextTick(() => {
      this.selectProductAnalysisList()
      this.selectProductAnalysisBySkuId()
      // 图表自适应
      window.onresize = function () {
        echarts.init(document.getElementById("order")).resize();
        echarts.init(document.getElementById("goods")).resize();
      };
    });
    this.listLoading = false;
  },
  computed: {
    orderTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime];
        } else {
          return [];
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0];
          this.listQuery.endTime = v[1];
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      },
    },
  },
  methods: {
    // 商品
    getGoods () {
      this.goodsName = this.goodsName
      this.charts = echarts.init(document.getElementById("goods"));
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      };
      this.charts.setOption({
        legend: {
          icon: "circle",
          left: '88%',
          top: '0%',
          align: 'left',  //文字位置
          data: ['环比增长率', '数量'],
          itemWidth: 8,  // 设置宽度
          itemHeight: 8, // 设置高度  
          bottom: 10,
          left: 'center',
        },
        title: {
          text: (this.orderList.length == 0 || !this.data1) ? "暂无数据" : "",
          x: "center",
          y: '138px',
          textStyle: {
            color: "#666",
            fontWeight: "normal",
            fontSize: 16,
          },
          tooltip: {
            show: false
          },
        },
        tooltip: {
          trigger: 'item', //axis   单个柱形图
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            var per = params.seriesName == '环比增长率' ? '%' : ''
            return params.name + '<br/>' + params.seriesName + ' : ' + params.value + per;
          }
        },
        toolbox: {},
        xAxis: {
          show: (this.orderList.length == 0 || !this.data1) ? false : true,  //没有数据的情况隐藏X轴
          data: this.xAxisData, //x轴
          name: '',
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false }
        },
        yAxis: [
          {
            show: (this.orderList.length == 0 || !this.data1) ? false : true,//没有数据的情况隐藏Y轴
            type: 'value',
            name: '数量',
            axisLabel: {
            }
          },
          // {
          //   show: (this.orderList.length == 0 || !this.data1) ? false : true,//没有数据的情况隐藏Y轴
          //   type: 'value',
          //   name: '环比增长率',
          //   min: 0,
          //   max: this.maxProportion,
          //   interval: this.maxProportion / 5,
          //   axisLabel: {
          //     formatter: '{value}'
          //   }
          // }
        ],
        grid: {
          bottom: 140
        },
        series: [
          // {
          //   name: '环比增长率',
          //   type: 'bar',
          //   stack: 'one',
          //   emphasis: emphasisStyle,
          //   data: this.data2,
          //   color: '#73C0DE',
          //   barWidth: '30px',
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         position: 'top'
          //       }
          //     }
          //   }
          // },
          {
            name: '数量',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: this.data1,
            color: '#91CC75',
            barWidth: '30px',
            itemStyle: {
              normal: {
                label: {
                  position: 'top'
                }
              }
            }
          },
        ],
        // 可为负值  data1 和 data2为数据
        data: (this.data1 || this.data2 || []).map((item) => {
          return {
            value: item,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: item > 0 ? 'top' : 'bottom',
                  textStyle: {
                    color: '#C23531',
                    fontSize: 12
                  }
                }
              }
            }
          }
        }),
      }, true);
    },
    // 进货概括
    drawOrder () {
      this.charts = echarts.init(document.getElementById("order"));
      // 绘制图表
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>进货数量：{c}<br/>同期占比：{d}%",
          textStyle: {
            align: 'left'
          }
        },
        title: {
          text: this.orderList.length == 0 ? "暂无数据" : "",
          x: "center",
          y: "center",
          textStyle: {
            color: "#666",
            fontWeight: "normal",
            fontSize: 16,
          },
        },
        //设置饼状图每个颜色块的颜色++
        color: ["#1F8A70", "#BEDB39", "#FFE11a", "#FD7400", '#7BA79D', '#D8B25C',
          '#A5AB81', '#DD8047', '#CF181D', '#60ADC1', '#B5CEEC', '#F2D68D',
          '#418AB3', '#A6B727', '#F69200', '#838383', '#73C0DE', '#91CC75'],
        series: [
          {
            name: "",
            type: "pie",
            radius: "71%",
            center: ["50%", "50%"],
            data: this.orderList,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],

      });
      // mouseover  鼠标移入   click   点击
      this.charts.on('click', (res) => {//移入
        this.goodsName = res.data.name
        this.skuId = res.data.skuId
        this.getGoods()
        this.selectProductAnalysisBySkuId()  //刷新右侧柱形图的数据
      })
      this.charts.on('mouseout', (res) => {//移出
      })
    },
    // 员工进货趋势
    selectProductAnalysisList () {
      this.listLoading = true;
      selectProductAnalysisList({
        ...this.listQuery,
        customerStoreId: this.customerStoreId
      }).then(res => {
        this.listLoading = false;
        if (res.data) {
          this.orderList = (res.data.productAnalysisItemDTOS || []).map((item, index) => {
            return {
              name: item.productName,
              value: item.quantity,
              skuId: item.skuId
            }
          })
          this.productTotalQuantity = res.data.productTotalQuantity
          this.productType = res.data.productType
          // 获取商品最大值的skuId
          var maxNum = Math.max.apply(Math, (this.orderList || []).map(function (item) { return item.value }))
          var skuList = this.orderList.filter((item, index) => {
            if (item.value == maxNum) {
              return item.skuId
            }
          })
          this.skuId = skuList.length == 0 ? '' : skuList[0].skuId
          this.goodsName = skuList.length == 0 ? '' : skuList[0].name  //商品名字
          this.selectProductAnalysisBySkuId()
        } else {
          this.goodsName = ''  //商品名字
          this.orderList = []
          this.productTotalQuantity = 0
          this.productType = 0
          this.xAxisData = []
          this.data1 = [] //数量
          this.data2 = []//增幅
          this.selectProductAnalysisBySkuId()
        }
        this.drawOrder()
      });
    },
    // 柱形图数据
    selectProductAnalysisBySkuId (val) {
      this.listLoading = true;
      selectProductAnalysisBySkuId({
        ...this.listQuery,
        customerStoreId: this.customerStoreId,
        skuId: this.skuId,
        startTime: this.$moment(this.listQuery.endTime).subtract(150, 'days').format("YYYY-MM")
      }).then(res => {
        this.listLoading = false
        this.xAxisData = res.data.dateTime
        this.data1 = res.data.quantityList//数量
        this.data2 = res.data.productProportionlist//增幅
        this.maxProportion = res.data.maxProportion
        this.getGoods()
      });
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        startTime: '',
        endTime: '',
      });
      var date = new Date(new Date().setDate(1));
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : "" + month;
      this.listQuery.startTime = this.listQuery.endTime = date.getFullYear() + "-" + month
      this.selectProductAnalysisList()
    },
  }
};
</script>

<style lang="scss" scope>
.goods-analysis {
  margin: 10px 0px;
  font-weight: 600;
  height: 385px;
  display: flex;
  justify-content: space-around;
  .s-div {
    flex: 0.5;
    width: 50%;
    text-align: center;
    margin-right: 30px;
    .v-title {
      margin: 0px 0px 20px;
    }
    .v-bottom {
      font-weight: 300;
    }
  }
  .s-div2 {
    flex: 0.5;
    width: 50%;
    text-align: center;
    .v-title {
      margin: 0px 0px 20px;
      span {
        display: inline-block;
        margin: 0px 10px 0px 0px;
      }
    }
  }
}
.no-data {
  height: 300px;
  line-height: 291px;
  font-size: 16px;
  font-weight: 200;
  color: #000;
}
</style>
