<template>
  <div class="app-container">
<!--    <el-row :gutter="20" class="container statistics">-->
<!--      <div class="statistics_title">平台用户统计</div>-->
<!--      <el-col :span="6" class="statistics_item">-->
<!--        <p>新增咨询者</p>-->
<!--        <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--      </el-col>-->
<!--      <el-col :span="6" class="statistics_item">-->
<!--        <p>新增咨询者</p>-->
<!--        <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--      </el-col>-->
<!--      <el-col :span="6" class="statistics_item">-->
<!--        <p>新增咨询者</p>-->
<!--        <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--      </el-col>-->
<!--      <el-col :span="6" class="statistics_item">-->
<!--        <p>新增咨询者</p>-->
<!--        <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <div class="container statistics">
      <div class="statistics_title flex">
        <span class="flex_bd">平台用户统计</span>
        <el-date-picker
          v-model="listQuery.one"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
     <div class="statistics_cont flex">
       <div class="flex_item statistics_item">
         <p>新增咨询者
           <el-popover
             placement="top-start"
             title="标题"
             width="200"
             trigger="hover"
             content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
             <i slot="reference" class="el-icon-warning-outline gray01 f12 "></i>
           </el-popover>

         </p>
         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
       </div>

       <div class="flex_item statistics_item">
         <p>新增咨询师 <el-popover
           placement="top-start"
           title="标题"
           width="200"
           trigger="hover"
           content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
           <i slot="reference" class="el-icon-warning-outline gray01 f12 "></i>
         </el-popover></p>
         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
       </div>
       <div class="flex_item statistics_item">
         <p>咨询者总量 <el-popover
           placement="top-start"
           title="标题"
           width="200"
           trigger="hover"
           content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
           <i slot="reference" class="el-icon-warning-outline gray01 f12 "></i>
         </el-popover></p>
         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
       </div>

       <div class="flex_item statistics_item">
         <p>咨询师总量 <el-popover
           placement="top-start"
           title="邀请人"
           width="200"
           trigger="hover"
           >
           <div>张三</div>
           <div>李四</div>
           <i slot="reference" class="el-icon-warning-outline gray01 f12 "></i>
         </el-popover></p>
         <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
       </div>
     </div>

    </div>
    <div class="container statistics mt_10">
      <div class="statistics_title flex">
        <span class="flex_bd">收入流水和收益统计</span>
        <el-date-picker
          v-model="listQuery.one"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="statistics_cont flex">
        <div class="flex_item statistics_item">
          <p>今日平台收入（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>

        <div class="flex_item statistics_item">
          <p>本月平台收入（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
        <div class="flex_item statistics_item">
          <p>今日平台收益（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
        <div class="flex_item statistics_item">
          <p>本日平台收益（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
      </div>
      <div class="statistics_cont flex">
        <div class="flex_item statistics_item">
          <p>今日微课收入（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>

        <div class="flex_item statistics_item">
          <p>本月订单收入（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
        <div class="flex_item statistics_item">
          <p>今日微课收益（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
        <div class="flex_item statistics_item">
          <p>本日订单收益（元）</p>
          <p class="f26 bold"> <CountTo :startVal='0' :endVal='23454565.00' :duration='2000' :decimals="2"/></p>
        </div>
      </div>
    </div>
    <div class="flex mt_10">
      <div class="container statistics flex_item">
        <div class="statistics_title flex">
          <span class="flex_bd">通话统计</span>
          <el-date-picker
            v-model="listQuery.one"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="statistics_cont flex">
          <div class="flex_item statistics_item">
            <p>今日下单数量</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
          </div>

          <div class="flex_item statistics_item">
            <p>本月下单数量</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
          </div>
        </div>

      </div>
      <div class="container statistics flex_item ml_10">
        <div class="statistics_title flex">
          <span class="flex_bd">微课统计</span>
          <el-date-picker
            v-model="listQuery.one"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="statistics_cont flex">
          <div class="flex_item statistics_item">
            <p>今日下单数量</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
          </div>

          <div class="flex_item statistics_item">
            <p>本月下单数量</p>
            <p class="f26 bold"> <CountTo :startVal='0' :endVal='2345' :duration='2000' /></p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {customerList,} from "@/api/customer/customer";
export default {
  data () {
    return {
      listQuery: {
        one: "",
        limit: 10,
        page: 1,
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
      total: 0,
      listLoading: false,
      selectList: [],
      dataList: [],
      tableHeight: 520,
      showDetail: false,
      infoData: {
        type:'',
        option:{},
      },
      popoverContent:'张三<br>李四',
    };
  },
  computed: {},
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      };
    });
    this.customerList();
  },
  methods: {
    // 修改定位
    handelDetail (type, row) {
      this.showDetail = true
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      }
    },
    // 获取客户列表
    customerList () {
      customerList({ ...this.listQuery, })
        .then(res => {
          // this.dataList = res.data.data;
          this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },

    queryCustomerList () {
      this.listQuery.page = 1
      this.customerList()
    },
    // 删除单个
    handleDel (id, index) {
      // type,msg,title,option,callback

      this.$MyMessageBox(3,"<span style='margin-left: 35px;'>确定删除该项目？</span>", "确定删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).then(res => {
        if (res) {
          // deleteCustomer({ storeIds: [id] }).then(res => {
          //   this.$message({ message: res.resp_msg, type: 'success' });
          //   this.dataList.splice(index, 1);
          // });
        }}).catch();

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
</style>
