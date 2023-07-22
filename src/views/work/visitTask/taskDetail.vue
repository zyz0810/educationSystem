
<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title">
    <div class="task-box">
      <!--任务信息-->
      <div class="task-datail-box">
        <p class="block_title">任务信息</p>
        <div class="list-ul"
             v-if="signType != 2">
          <div class="l-div">拜访时间：</div>
          <div class="l-div2">{{data.visitStartTime}}</div>
        </div>
        <div class="list-ul"
             v-if="signType != 2">
          <div class="l-div">拜访内容：</div>
          <div class="l-div2">{{data.visitContent}}</div>
        </div>
        <div class="list-ul"
             v-if="signType != 2">
          <div class="l-div">优先级：</div>
          <div class="l-div2">{{priorityList[data.priority]}}</div>
        </div>
        <div class="list-ul"
             v-if="signType != 2">
          <div class="l-div">关联业务：</div>
          <div class="l-div2 blue"
               @click.stop="associatedVisit('view','customerName')">{{data.storeName}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">拜访人员：</div>
          <div class="l-div2">{{data.visitUser}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">{{signType != 2 ? '拜访地址：':'签到地址：'}}</div>
          <div class="l-div2 blue"
               @click="showMap('look')">{{data.signAddress}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">{{signType != 2 ? '拜访范围：':'签到范围：'}}</div>
          <div class="l-div2">{{data.signRange}}米内</div>
        </div>

        <div class="list-ul"
             v-if="signType == 2">
          <div class="l-div">签到类型：</div>
          <div class="l-div2">{{signTypeValue[data.signType] || (data.visitTaskTypeCode == 'TASK'?'任务签到':'拜访签到')}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">创建时间：</div>
          <div class="l-div2">{{data.createTime}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">更新时间：</div>
          <div class="l-div2">{{data.updateTime}}</div>
        </div>
      </div>
      <!--状态信息-->
      <div class="task-datail-box"
           v-if="signType != 2">
        <p class="block_title">状态信息</p>
        <div class="list-ul">
          <div class="l-div">任务状态：</div>
          <div class="l-div2">{{levelArr[data.visitStatus]}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">超时时间：</div>
          <div class="l-div2 red">{{data.timeOut}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">拜访人员：</div>
          <div class="l-div2">{{data.visitUser}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">拜访时间：</div>
          <div class="l-div2">{{data.visitStartTime}}</div>
        </div>
        <div class="list-ul"
             v-if="[3].includes(data.visitStatus)">
          <div class="l-div">拜访内容：</div>
          <div class="l-div2">
            <div v-for="(item,index) in data.crmVisitTaskDictDTOs"
                 :key='index'>
              <div class="form-list">
                <div class='form-list-item'>{{item.dictName}}：</div>
                <div class='form-list-item2'
                     v-if="item.dictLabel != 'image' || item.dictLabel != 'file_upload'">{{item.content}}</div>
                <!--图片-->
                <div class='form-list-item2'
                     v-if="item.dictLabel == 'image' ">
                  <img :src="items"
                       @click="showImg(items)"
                       v-for='(items,index) in item.imageUrls'
                       :key='index'
                       alt="">
                </div>
                <!--附件-->
                <div class='form-list-item2'
                     v-if="item.dictLabel == 'file_upload'">
                  <div class="down-load"
                       @click="downLoad(items.url,items.fileName)"
                       v-for='(items,index) in item.fileInfos'
                       :key='index'>{{items.fileName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-ul list-ul2"
             v-if="[4,5].includes(data.visitStatus)">
          <div class="l-div">原 因：</div>
          <div class="l-div2">
            <div>{{data.remark || '暂无'}}</div>
            <div>
              <img class="imgList"
                   v-for="(item,index) in data.crmVisitTaskImageDTOs"
                   @click="showImg(item.taskImageUrl)"
                   :key='index'
                   :src="item.taskImageUrl">
            </div>
          </div>
        </div>
      </div>
      <!-- 临时签到才会有客户记录-->
      <div class="task-datail-box"
           v-if="signType == 2">
        <p class="block_title">新客户记录</p>
        <div class="list-ul">
          <div class="l-div">客户名称：</div>
          <div class="l-div2">{{customerClueDTO.name}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">联系人：</div>
          <div class="l-div2">{{customerClueDTO.linkman}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">手机号：</div>
          <div class="l-div2">{{customerClueDTO.telephone}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">客户地址：</div>
          <div class="l-div2">{{customerClueDTO.address}}</div>
        </div>
        <div class="list-ul">
          <div class="l-div">上传图片：</div>
          <div class="l-div2">
            <img v-for='(items,index) in clueImg'
                 :key='index'
                 @click="showImg(items)"
                 :src="items"
                 class="clue-img-box">
          </div>
        </div>
        <div class="list-ul">
          <div class="l-div">备注：</div>
          <div class="l-div2">{{customerClueDTO.remark}}</div>
        </div>
      </div>
    </div>

    <div class="button-box"
         v-if="signType != 2">
      <!-- 1: "未开始", 2: "进行中", 3: "已完成", 4: "未完成", 5: "已取消" 6 超时-->
      <!--isUpdate -->
      <!--
        <el-button type="primary"
                 plain
                 v-if="data.visitStatus == 2 && isUpdate != 1"
                 v-rules="{ admin: 'admin', ordinary: 'visit:task:finished' }"
                 @click="fishedTash()">完成任务</el-button>
      <el-button type="primary"
                 plain
                 v-if="[2].includes(data.visitStatus)"
                 v-rules="{ admin: 'admin', ordinary: 'visit:task:unfinished' }"
                 @click="noFishedTash('noFished')">未能完成</el-button>
      <el-button type="primary"
                 plain
                 v-if="[1].includes(data.visitStatus)"
                 v-rules="{ admin: 'admin', ordinary: 'visit:task:edit' }"
                 @click.stop="addVisitTask('update')">编辑任务</el-button>
      <el-button type="primary"
                 plain
                 v-if="[1].includes(data.visitStatus)"
                 v-rules="{ admin: 'admin', ordinary: 'visit:task:cancel' }"
                 @click="noFishedTash('cancel')">取消任务</el-button>
      <el-button type="primary"
                 v-if="[1].includes(data.visitStatus)"
                 @click.stop="delTask()"
                 v-rules="{ admin: 'admin', ordinary: 'visit:task:del' }"
                 plain>删除任务</el-button>
   -->
    </div>
    <!--图片放大弹窗-->
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="15vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
    <!--新增编辑任务  @insertTask="getTaskList"-->
    <addVisitTask :showDialog.sync="showAddDialog"
                  @insertTask='getVisitTaskDetail'
                  :typeOptions="typeOptions"></addVisitTask>
    <!--完成任务-->
    <finishTask :showDialog.sync="showFishedDialog"
                @modify='getVisitTaskDetail'
                :finishTaskType='finishTaskType'></finishTask>
    <!--未能完成、取消任务-->
    <noFinishTask :showDialog.sync="showNoFishedDialog"
                  @modify='getVisitTaskDetail'
                  :option='noFinishTaskType'></noFinishTask>
    <Map :showDialog.sync="showMapDialog"
         :option="mapType"></Map>
  </my-dialog>
</template>

<script>
import addVisitTask from "./addVisitTask";
import finishTask from "./finishTask";
import noFinishTask from "./noFinishTask";
import { mapGetters } from "vuex";
import {
  getVisitTaskDetail,
  removeVisitTask,
  getTempSignAndInfoById
} from "@/api/visitTask";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    visitTaskId: {
      required: false,
      type: [String, Number],
      default: ''
    },
    // VISIT(0, "拜访"), TASK (1, "任务"), TEMP (2, "临时")
    signType: {
      required: false,
      type: [String, Number],
      default: 0
    },
  },
  components: {
    addVisitTask,
    finishTask,
    noFinishTask
  },
  data () {
    return {
      title: '任务详情',
      showAddDialog: false,
      showFishedDialog: false,
      showNoFishedDialog: false,
      data: {},
      typeOptions: {},
      visitStatus: '',
      priorityList: {
        1: '高',
        2: "中",
        3: "低",
        4: "无",
      },
      // 1: "未开始", 2: "进行中", 3: "已完成", 4: "未完成", 5: "已取消" 6:'已超时'
      levelArr: {
        1: "未开始",
        2: "进行中",
        3: "已完成",
        4: "未完成",
        5: "已取消",
        6: '已超时'
      },
      // VISIT(0, "拜访"), TASK (1, "任务"), TEMP (2, "临时");
      signTypeValue: {
        0: "拜访签到",
        1: "任务签到",
        2: "临时签到",
      },
      showMapDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
      //没有完成的任务状态
      noFinishTaskType: {
        operatorType: "",
        option: {}
      },
      finishTaskType: {
        operatorType: "",
        option: {}
      },
      imgDialogVisible: false,
      dialogImageUrl: "",
      isUpdate: '',//未再移动端离店签退
      customerClueDTO: {},
      clueImg: [],
    };
  },
  computed: {
    ...mapGetters(["permission_routes"]),
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
    // 附件下载
    downLoad (url, name) {
      this.$axios({
        method: 'get',
        url: url, // 请求地址
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(response => {
        const blob = new Blob([response.data]);
        const linkNode = document.createElement("a");
        linkNode.download = name; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      }).catch(
        function (error) {
          // 请求失败处理
          alert('请求失败！')
        })
    },
    // 查看图片放大
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    //关联跳转 
    associatedVisit () {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          customerName: this.data.storeName,
        },
      });
      const arr = this.permission_routes.find((item) => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    // 任务完成
    fishedTash () {
      this.finishTaskType = {
        option: {
          visitTaskId: this.visitTaskId
        }
      };
      this.showFishedDialog = true
    },
    // 未能完成任务、取消任务
    noFishedTash (val) {
      this.noFinishTaskType = {
        operatorType: val,
        option: {
          visitTaskId: this.visitTaskId
        }
      };
      this.showNoFishedDialog = true
    },
    // 编辑
    addVisitTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: this.data
      };
      this.showAddDialog = true;
    },
    // 删除任务
    delTask (type, val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          removeVisitTask({ visitTaskIds: this.visitTaskId })
            .then(res => {
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
              this.dialogVisible = false;
              this.$emit("delTask");
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    showMap (val) {
      this.mapType = {
        operatorType: val,
        option: {
          signAddressLatitude: this.data.signAddressLatitude,
          signAddressLongitude: this.data.signAddressLongitude,
          signAddress: this.data.signAddress
        }
      };
      this.showMapDialog = true
    },
    // 任务详情
    getVisitTaskDetail () {
      getVisitTaskDetail({ visitTaskId: this.visitTaskId })
        .then(res => {
          this.data = res.data
          this.data.createTime = this.$moment(this.data.createTime).format("YYYY-MM-DD HH:mm:ss")
          this.data.visitStartTime = this.$moment(this.data.visitStartTime).format("YYYY-MM-DD HH:mm:ss")
          this.data.updateTime = this.$moment(this.data.updateTime).format("YYYY-MM-DD HH:mm:ss")
          this.isUpdate = res.data.isUpdate   //未再移动端离店签退
          this.$emit('delTask')
        })
        .catch(err => console.log(err));
    },
    // 临时签到任务详情
    getTempSignAndInfoById () {
      getTempSignAndInfoById({ id: this.visitTaskId })
        .then(res => {
          this.data = res.data
          this.data.createTime = this.$moment(this.data.createTime).format("YYYY-MM-DD HH:mm:ss")
          this.data.visitStartTime = this.$moment(this.data.visitStartTime).format("YYYY-MM-DD HH:mm:ss")
          this.data.updateTime = this.$moment(this.data.updateTime).format("YYYY-MM-DD HH:mm:ss")
          this.customerClueDTO = res.data.customerClueDTO
          this.clueImg = res.data.customerClueDTO.images.split(",")
          this.data.visitUser = this.data.nickname
        })
        .catch(err => console.log(err));
    },
    open () {
      if (this.signType == 2) {
        this.getTempSignAndInfoById()//临时签到任务详情
      } else {
        this.getVisitTaskDetail()
      }
    },
    close () {
      this.dialogVisible = false;
      // this.signType = ''
      this.$emit('insertTask')
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
@import "@/assets/styles/variables.scss";
.block_title {
  padding-left: 5px;
  border-left: 5px solid $menuActiveText;
}
.list-ul {
  display: flex;
  border: 1px solid #dedede;
  box-sizing: border-box;
  .l-div {
    padding: 10px 0px;
    width: 30%;
    border-right: 1px solid #dedede;
    margin-right: 30px;
    background: rgb(245, 247, 250);
    text-align: center;
  }
  .l-div2 {
    padding: 10px 0px;
    flex: 1;
  }
  .blue {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
  }
}
// .button-box {
//   margin: 40px 0px 20px;
//   display: flex;
// }
/deep/.el-button--primary.is-plain {
  width: 20%;
}
.imgList {
  width: 80px;
  height: 80px;
  cursor: pointer;
  margin-right: 10px;
}
.task-box {
  height: 480px;
  overflow-y: scroll;
  padding: 0px 20px 30px 0px;
}
.form-list {
  display: flex;
  line-height: 1.6em;
  .form-list-item1 {
    margin-right: 8px;
  }
  .form-list-item2 {
    display: contents;
    flex: 1;
    img {
      width: 80px;
      height: 80px;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}
.down-load {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  margin-right: 20px;
}
.red {
  color: red;
}
.form-list {
  .form-list-item {
    color: #999;
    // width: 60px;
  }
}
.clue-img-box {
  width: 80px;
  height: 80px;
  margin-right: 5px;
}
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px;
}
</style>
