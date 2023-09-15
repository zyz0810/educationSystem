<template>
  <div class="app-container">
    <div class="container">
      <el-table v-loading="listLoading"
                :data="dataList"
                :max-height="tableHeight"
                ref="activityTable"
                :header-cell-style="{ background: '#F8F9FA' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>

        <el-table-column label="姓名"
                         width="50"
                         align="left">
          <template slot-scope="scope">
            <span class="header_img">
              <img src="http://cdn.kyaoduo.com/upload/image/20200808/WechatIMG289.png" alt="邀请码"/>
            </span>
          </template>
        </el-table-column>
        <el-table-column label=""
                         min-width="160"
                         align="left" prop="storeName">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="邀请码"
                         min-width="100"
                         align="left"
                         prop="mobile"></el-table-column>
        <el-table-column label="邀请二维码"
                         min-width="100"
                         align="left"
                         prop="mobile">
          <template slot-scope="scope">
            <viewer :images="['http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png']">
            <span class="invite_ewm">
              <img src="http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png" alt="邀请码"/>
            </span>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="60"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="handelDownLoad('http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png','邀请码')">下载</el-button>
<!--            <a class="pointer blue01" href="http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png" download>下载</a>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="customerList"
                  class="text-right" />
    </div>
  </div>
</template>

<script>
  // import {customerList,} from "@/api/customer/customer";
  export default {
    data () {
      return {
        listQuery: {
          key: "",
          role:"",
          limit: 10,
          page: 1,
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
        roleList:[{id:'',name:'全部'},{id:1,name:'超级管理员'},{id:2,name:'管理员'},{id:3,name:'供应商'},{id:4,name:'客服审核员'}]
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
      // 下载图片
      handelDownLoad (url, name) {
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
        image.onload = () => {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, image.width, image.height);
          canvas.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            let Link = document.createElement("a");
            Link.download = name;
            Link.href = url;
            Link.click();
            Link.remove();
            // 用完释放URL对象
            URL.revokeObjectURL(url);
          });
        };

      },
      // 获取客户列表
      customerList () {
        // customerList({ ...this.listQuery, })
        //   .then(res => {
        //     // this.dataList = res.data.data;
        //     this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
        //     this.total = res.data.count;
        //   })
        //   .catch(err => console.log(err));
      },

      queryCustomerList () {
        this.listQuery.page = 1;
        this.customerList();
      },
      queryList(role){
        this.listQuery.role = role;
        this.listQuery.page = 1;
        this.customerList();
        console.log('11')
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
  .invite_ewm{
    display: block;
    width: 50px;
    height: 50px;
    img{
      width: 100%;
      height: 100%;
    }
  }

</style>
