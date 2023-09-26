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
                         min-width="120"
                         align="left">
          <template slot-scope="scope">
            <span class="flex">
              <span class="header_img mr5">
              <img src="./../../../assets/image/head Portrait.png" alt="邀请码"/>
            </span>
              {{scope.row.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="手机"
                         min-width="160"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="邀请码"
                         min-width="100"
                         align="left"
                         prop="invite_code"></el-table-column>
<!--        <el-table-column label="邀请二维码"-->
<!--                         min-width="200"-->
<!--                         align="left"-->
<!--                         prop="invite_code">-->
<!--          <template slot-scope="scope">-->
<!--            <viewer v-if="scope.row.invite_code!=''&&scope.row.invite_code!=null" :images="[scope.row.invite_code]">-->
<!--              <span class="invite_ewm">-->
<!--                <img :src="scope.row.invite_code" alt=""/>-->
<!--              </span>-->
<!--            </viewer>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作"-->
<!--                         align="left"-->
<!--                         width="60"-->
<!--                         prop="remarks">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text"-->
<!--                       @click.stop="handelDownLoad('http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png','邀请码')">下载</el-button>-->
<!--&lt;!&ndash;            <a class="pointer blue01" href="http://cdn.kyaoduo.com/upload/license/20220315/c4d2be84-6d5a-47ce-9a0e-7d12045e6d29.png" download>下载</a>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.pn"
                  :limit.sync="listQuery.rn"
                  @pagination="getList"
                  class="text-right" />
    </div>
  </div>
</template>

<script>
  import {invitecode,} from "@/api/invite";
  export default {
    data () {
      return {
        listQuery: {
          rn: 10,
          pn: 1,
        },
        total: 0,
        listLoading: false,
        selectList: [],
        dataList: [],
        tableHeight: 520,
        infoData: {
          type:'',
          option:{},
        },
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
      this.getList();
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
      getList () {
        invitecode()
          .then(res => {
            // this.dataList = res.data.data;
            this.dataList = [{name:res.data.name,mobile:res.data.mobile,invite_code:res.data.invite_code,}];
            // this.total = res.data.count;
          })
          .catch(err => console.log(err));
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
