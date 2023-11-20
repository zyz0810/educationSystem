<template>
  <div class="app-container">
    <div class="search_box p_10 mb10">
      <el-form :inline="true"
               class="search_box">
      <el-form-item label="">
        <el-radio-group v-model="listQuery.type" @change="handelType">
          <el-radio-button :label="1">全部</el-radio-button>
          <el-radio-button :label="2">日</el-radio-button>
          <el-radio-button :label="3">月</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-if="listQuery.type == 2">
                <el-date-picker
                  v-model="listQuery.date"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="handelTime"
                  :picker-options="pickerOptions">
                </el-date-picker>
      </el-form-item>
      <el-form-item label="" v-if="listQuery.type == 3">
        <el-date-picker
          v-model="listQuery.date"
          align="right"
          type="month"
          value-format="yyyy-MM"
          @change="handelTime"
          placeholder="选择月份">
        </el-date-picker>
      </el-form-item>
      </el-form>
    </div>
<!--    <div class="container statistics">-->
<!--      <div class="statistics_title flex">-->
<!--        平台用户统计-->
<!--      </div>-->
<!--     <div class="statistics_cont flex">-->
<!--       <div class="flex_item statistics_item">-->
<!--         <p class="f14">新增咨询者-->
<!--           <el-popover-->
<!--             placement="top-start"-->
<!--             width="200"-->
<!--             trigger="hover">-->
<!--            <div class="hover_list">-->
<!--              <div class="flex" v-for="(item,index) in arr">-->
<!--                <div class="flex_bd">{{item.name}}</div>-->
<!--                <div>{{item.num}}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--             <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--           </el-popover>-->
<!--         </p>-->
<!--         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--       </div>-->

<!--       <div class="flex_item statistics_item">-->
<!--         <p class="f14">新增咨询师 <el-popover-->
<!--           placement="top-start"-->
<!--           width="200"-->
<!--           trigger="hover">-->
<!--           <div class="hover_list">-->
<!--             <div class="flex" v-for="(item,index) in arr">-->
<!--               <div class="flex_bd">{{item.name}}</div>-->
<!--               <div>{{item.num}}</div>-->
<!--             </div>-->
<!--           </div>-->
<!--           <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--         </el-popover></p>-->
<!--         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--       </div>-->
<!--       <div :class="['flex_item', 'statistics_item',listQuery.type !== 1?'visibility':'']">-->
<!--         <p class="f14">咨询者总量 <el-popover-->
<!--           placement="top-start"-->
<!--           width="200"-->
<!--           trigger="hover">-->
<!--           <div class="hover_list">-->
<!--             <div class="flex" v-for="(item,index) in arr">-->
<!--               <div class="flex_bd">{{item.name}}</div>-->
<!--               <div>{{item.num}}</div>-->
<!--             </div>-->
<!--           </div>-->
<!--           <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--         </el-popover></p>-->
<!--         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--       </div>-->

<!--       <div :class="['flex_item', 'statistics_item',listQuery.type !== 1?'visibility':'']">-->
<!--         <p class="f14">咨询师总量 <el-popover-->
<!--           placement="top-start"-->
<!--           width="200"-->
<!--           trigger="hover"-->
<!--           >-->
<!--           <div class="hover_list">-->
<!--             <div class="flex" v-for="(item,index) in arr">-->
<!--               <div class="flex_bd">{{item.name}}</div>-->
<!--               <div>{{item.num}}</div>-->
<!--             </div>-->
<!--           </div>-->
<!--           <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--         </el-popover></p>-->
<!--         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--       </div>-->
<!--     </div>-->

<!--    </div>-->
<!--    <div class="container statistics mt_10">-->
<!--      <div class="statistics_title flex">-->
<!--        收入流水和收益统计-->
<!--      </div>-->
<!--      <div class="statistics_cont flex">-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日平台收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->

<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--          <p class="f14">本月平台收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日平台收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div  :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--          <p class="f14">本月平台收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="statistics_cont flex">-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日微课收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->

<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日订单收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日微课收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日订单收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="flex mt_10">-->
<!--      <div class="container statistics flex_item">-->
<!--        <div class="statistics_title flex">-->
<!--          通话统计-->
<!--        </div>-->
<!--        <div class="statistics_cont flex">-->
<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--            <p class="f14">今日下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->

<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--            <p class="f14">本月下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->
<!--        </div>-->

<!--      </div>-->
<!--      <div class="container statistics flex_item ml_10">-->
<!--        <div class="statistics_title flex">-->
<!--          微课统计-->
<!--        </div>-->
<!--        <div class="statistics_cont flex">-->
<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--            <p class="f14">今日下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->

<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--            <p class="f14">本月下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->
<!--        </div>-->

<!--      </div>-->
<!--    </div>-->

    <div class="container statistics">
      <div class="statistics_title flex">
        平台用户统计
      </div>
      <div class="statistics_cont flex">
<!--        <div class="flex_item statistics_item">-->
<!--          <p class="f14">新增咨询者-->
<!--            <el-popover-->
<!--              placement="top-start"-->
<!--              width="200"-->
<!--              trigger="hover">-->
<!--              <div class="hover_list">-->
<!--                <div class="flex" v-for="(item,index) in arr">-->
<!--                  <div class="flex_bd">{{item.name}}</div>-->
<!--                  <div>{{item.num}}</div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--            </el-popover>-->
<!--          </p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--        </div>-->

<!--        <div class="flex_item statistics_item">-->
<!--          <p class="f14">新增咨询师 <el-popover-->
<!--            placement="top-start"-->
<!--            width="200"-->
<!--            trigger="hover">-->
<!--            <div class="hover_list">-->
<!--              <div class="flex" v-for="(item,index) in arr">-->
<!--                <div class="flex_bd">{{item.name}}</div>-->
<!--                <div>{{item.num}}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--          </el-popover></p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type !== 1?'visibility':'']">-->
<!--          <p class="f14">咨询者总量 <el-popover-->
<!--            placement="top-start"-->
<!--            width="200"-->
<!--            trigger="hover">-->
<!--            <div class="hover_list">-->
<!--              <div class="flex" v-for="(item,index) in arr">-->
<!--                <div class="flex_bd">{{item.name}}</div>-->
<!--                <div>{{item.num}}</div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>-->
<!--          </el-popover></p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--        </div>-->

        <div v-for="(item,index) in dataList.users" :key="index" :class="['flex_item', 'statistics_item',(item.name == '咨询者总量'||item.name == '咨询师总量')&&listQuery.type !== 1?'visibility':'']">
          <p class="f14">{{item.name}}
            <el-popover v-if="item.name == '新增咨询者' || item.name == '新增咨询师'"
            placement="top-start"
            width="200"
            trigger="hover"
          >
            <div class="hover_list">
              <div class="flex" v-for="(itemA,indexA) in item.newuser_source" :key="'newuser_source'+index+indexA">
                <div class="flex_bd">{{itemA.name}}</div>
                <div>{{itemA.value}}</div>
              </div>
            </div>
            <i slot="reference" class="iconfont icon-tips gray01 f12 "></i>
          </el-popover>
          </p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='Number(item.value)' :duration='2000' /></p>
        </div>
      </div>

    </div>
    <div class="container statistics mt_10">
      <div class="statistics_title flex">
        收入流水和收益统计
      </div>
      <div class="statistics_cont flex">
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日平台收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->

<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--          <p class="f14">本月平台收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日平台收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->


          <div v-for="(item,index) in arrList" :class="['flex_item', 'statistics_item',(item.name == '本月平台收入(元)'||item.name == '本月平台收益(元)')&&listQuery.type == 2?'visibility':'',(item.name == '今日平台收入(元)'||item.name == '今日平台收益(元)')&&listQuery.type == 3?'visibility':'']">
            <p class="f14">{{item.name}}</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='Number(item.value)' :duration='2000' :decimals="2"/></p>
          </div>


      </div>
      <div class="statistics_cont flex">
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日微课收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->

<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日订单收入（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日微课收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->
<!--        <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--          <p class="f14">今日订单收益（元）</p>-->
<!--          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>-->
<!--        </div>-->

        <div v-for="(item,index) in brrList" :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">
          <p class="f14">{{item.name}}</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='Number(item.value)' :duration='2000' :decimals="2"/></p>
        </div>

      </div>
    </div>
    <div class="flex mt_10">
      <div class="container statistics flex_item">
        <div class="statistics_title flex">
          通话统计
        </div>
        <div class="statistics_cont flex">

          <div v-for="(item,index) in dataList.voice" :key="index" :class="['flex_item', 'statistics_item',item.name == '本月下单数量'&&listQuery.type == 2?'visibility':'',item.name == '今日下单数量'&&listQuery.type == 3?'visibility':'']">
            <p class="f14">{{item.name}}</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='Number(item.value)' :duration='2000' /></p>
          </div>

<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--            <p class="f14">今日下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->

<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--            <p class="f14">本月下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->
        </div>

      </div>
      <div class="container statistics flex_item ml_10">
        <div class="statistics_title flex">
          微课统计
        </div>
        <div class="statistics_cont flex">
          <div v-for="(item,index) in dataList.video_lesson" :key="index" :class="['flex_item', 'statistics_item',item.name == '本月下单数量'&&listQuery.type == 2?'visibility':'',item.name == '今日下单数量'&&listQuery.type == 3?'visibility':'']">
            <p class="f14">{{item.name}}</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='Number(item.value)' :duration='2000' /></p>
          </div>



<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 3?'visibility':'']">-->
<!--            <p class="f14">今日下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->

<!--          <div :class="['flex_item', 'statistics_item',listQuery.type == 2?'visibility':'']">-->
<!--            <p class="f14">本月下单数量</p>-->
<!--            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--          </div>-->
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {summerys,} from "@/api/businessData";
const currentDate = Date.now();
export default {
  data () {
    return {
      listQuery: {
        type: 1,
        date: '',
      },
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // pickerOptionsMonth: {
      //   disabledDate(time) {
      //     console.log(time)
      //     return time.getTime() > currentDate.getMonth();
      //   },
      // },
      listLoading: false,
      dataList: {},
      popoverContent:'张三<br>李四',
      arr:[{name:'张三',num:11},{name:'李四',num:22}]
    };
  },
  computed: {
    arrList: function() {
      return this.dataList.incoming.filter((item,index) => {
        return index < 4
      })
    },
    brrList: function() {
      return this.dataList.incoming.filter((item,index) => {
        return index > 3
      })
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    handelType(e){
      if(e == 2){
        this.listQuery.date = this.$moment().format("YYYY-MM-DD");
      }else if(e == 3){
        this.listQuery.date = this.$moment().format('yyyy-MM');
      }else{
        this.listQuery.date = '';
      }
      console.log(e,this.listQuery.date )

      this.getList();
    },
    handelTime(e){
      console.log(e)
      // this.listQuery.date = '';
      this.getList();
    },
    // 获取客户列表
    getList () {
      summerys({ ...this.listQuery, })
        .then(res => {
          this.dataList = res.data;
        })
        .catch(err => console.log(err));
    },

  },
};
</script>

<style lang="scss" scoped>
.statistics{

  .statistics_item{
    margin-top: 10px;
    background: linear-gradient(to bottom, #EBF8FF, #F8FCFD);//从下到上
    border-radius: 9px;
    padding: 20px;
    margin-left: 10px;
    &:first-child{
      margin-left: 0;
    }
    p{
      line-height: 1.6;
      margin: 0;
      i{
        margin-left: 3px;
      }
    }
  }
}
  .hover_list{
    line-height: 2;
    font-size: 12px;
    color: #2C4068;
  }
</style>
