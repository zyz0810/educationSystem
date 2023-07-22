<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             @close="close"
             @open="open"
             top="10vh"
             :title="title">
    <div class="table-box">
      <div class="x-list">
        <div class="t-left">拜访人员</div>
        <div class="t-right">{{dataDetalil.userName}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">到店时间</div>
        <div class="t-right">{{dataDetalil.visitStartTime}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">离店时间</div>
        <div class="t-right">{{dataDetalil.visitEndTime}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">拜访客户</div>
        <div class="t-right">{{dataDetalil.customerStoreName}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">签到地址</div>
        <div class="t-right">{{dataDetalil.signAddress}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">任务类型</div>
        <div class="t-right">{{dataDetalil.taskTypeRuleStr}}</div>
      </div>
      <div class="x-list">
        <div class="t-left">任务内容</div>
        <div class="t-right ">
          <div class="flexed"
               v-for='(item,index) in dataDetalil.contentDTOList'
               :key='index'>
            <!--taskContentType 任务内容-操作说明（1.上传照片（单张）2.上传照片（多张）3.单行输入4.多行输入）-->
            <div class="x-title">{{item.taskContentName}}</div>
            <div class="x-content">

<!--              <el-image v-if='item.taskContentType == 1'-->
<!--                        @click="showImg(item.content)"-->
<!--                        :src="item.content"></el-image>-->

              <viewer :images="[item.content]" v-if="item.taskContentType == 1 && item.content!='' && item.content != null">
                <span class="task_img">
                  <img :src="item.content" />
                </span>
              </viewer>



              <div v-if='item.taskContentType == 2'>
<!--                <el-image v-for='(i,indexs) in item.contentList '-->
<!--                          :key='indexs'-->
<!--                          @click="showImg(i)"-->
<!--                          :src="i"></el-image>-->

                <viewer :images="[item.content]" v-if="item.taskContentType == 2 && item.contentList!='' && item.contentList != null && item.contentList.length > 0">
                  <span class="task_img" v-for='(i,indexs) in item.contentList' :key='indexs'>
                    <img :src="i" />
                  </span>
                </viewer>

              </div>

              <div v-if='item.taskContentType == 3'>{{item.content}}</div>
<!--              <div v-if='item.taskContentType == 4'>{{item.content}}</div>-->
              <div v-if='item.taskContentType == 4' v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div>
      <my-dialog :visible.sync="imgDialogVisible"
                 :append-to-body="true"
                 top="9vh">
        <img width="100%"
             :src="dialogImageUrl"
             alt />
      </my-dialog>
    </div>
  </my-dialog>
</template>

<script>
import {
  recondDetail
} from "@/api/fieldCheck";
export default {
  props: ['showDialog', 'visitTaskId'],
  data () {
    return {
      title: '查看任务详情',
      dataDetalil: {},
      imgDialogVisible: false,
      dialogImageUrl: "",
    }
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
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    // 签到记录跳转
    recondDetail () {
      recondDetail({ id: this.visitTaskId })
        .then(res => {
          this.dataDetalil = res.data
          // this.data.createTime = this.$moment(this.data.createTime).format("YYYY-MM-DD HH:mm:ss")
          // this.data.visitStartTime = this.$moment(this.data.visitStartTime).format("YYYY-MM-DD HH:mm:ss")
          // this.data.updateTime = this.$moment(this.data.updateTime).format("YYYY-MM-DD HH:mm:ss")
          // this.isUpdate = res.data.isUpdate   //未再移动端离店签退
          // this.contentDTOList = data.contentDTOList[0]
          // this.$emit('delTask')


          // contentDTOList
          let contentDTOList = res.data.contentDTOList;
          contentDTOList.map(item=>{
            if(item.taskContentType == 4){
              item.content = item.content.replace(/&&/g, "<br/>")
            }
          })
          this.dataDetalil.contentDTOList = contentDTOList;
        })
        .catch(err => console.log(err));
    },
    open () {
      this.recondDetail()
    },
    close () {
      this.dialogVisible = false;

    }
  }
};
</script>

<style lang="scss" scoped>
  .task_img{
    width: 100px;
    display: inline-block;
    margin: 0px 10px 0px 0px;
    img{
      width: 100%;
    }
  }
.el-form {
  padding: 0 20px;
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
#image_slot {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.table-box {
  max-height: 70vh;
  overflow: auto;
  .x-list {
    display: flex;
    margin-bottom: 10px;
    .t-left {
      width: 100px;
    }
    .t-right {
      flex: 1;
      color: #999;
    }
    .flexed {
      display: flex;
      .x-title {
        width: 80px;
      }
      .x-content {
        margin-bottom: 10px;
        flex: 1;
        .el-image {
          width: 100px;
          margin: 0px 10px 0px 0px;
        }
      }
    }
  }
}
</style>
