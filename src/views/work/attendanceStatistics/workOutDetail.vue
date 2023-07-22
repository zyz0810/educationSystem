<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title">
    <div class="work_out_box">
      <div class=""><span>打卡地址：</span><span>{{status == 1 ? detail.signStartAddr : detail.signEndAddr}}</span></div>
      <div class=""><span>经 纬 度：</span>
        <span>
          {{status == 1 ? detail.signStartLongitude : detail.signEndLongitude}} ，
          {{status == 1 ? detail.signStartLatitude : detail.signEndLatitude}}
        </span>
      </div>
      <div class=""><span>打卡备注：</span><span>{{status == 1 ? detail.remark : detail.remarkOff}}</span></div>
      <div class=""><span>打卡照片：</span>
        <img v-if='status == 1 && detail.imageUrl'
             class="imageUrl"
             @click="showImg(detail.imageUrl)"
             :src="detail.imageUrl" />
        <img class="imageUrl"
             v-if='status == 2 && detail.imageUrlOff'
             @click="showImg(detail.imageUrlOff)"
             :src="detail.imageUrlOff" />
      </div>
    </div>
    <!--图片放大弹窗-->
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="15vh">
      <img width="100%"
           :src="dialogImageUrl" />
    </my-dialog>
  </my-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    detail: {
      required: true,
      type: Array / Object,
      default: () => { }
    },
    // 1签到 2 签退
    status: {
      required: true,
      type: String / Number,
      default: 1
    }
  },
  data () {
    return {
      title: '外勤打卡详情',
      statisticsInfor: {
      },
      yearMonthFormat: '',
      dialogImageUrl: '',
      imgDialogVisible: false,
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
    // 查看图片放大
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    open () {
    },
    close () {
      this.dialogVisible = false;

    }
  }
};
</script>

<style lang="scss" scoped>
.work_out_box {
  min-height: 400px;
  line-height: 1.8em;
  div {
    display: flex;
    margin-bottom: 10px;
    span {
      &:nth-child(2) {
        margin-left: 10px;
        flex: 1;
      }
    }
  }
}
/deep/img {
  border: 0;
}
.imageUrl {
  margin-left: 10px;
  flex: 1;
  width: 240px;
  height: 300px;
}
img[src=""] {
  opacity: 0;
}
</style>
