<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             height='300px'
             @close="close"
             @open="open"
             title="签退补录详情">
    <div class="content">
      {{signSupplement.supplementRemarks}}
    </div>
    <span slot="footer"
          class="dialog-footer">
      <!--
      <el-button type="primary"
                 v-if='signSupplement.supplement == 0'
                 @click="save">同意补录</el-button>
                 
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
                 -->
    </span>
  </my-dialog>
</template>

<script>
import { mapState } from 'vuex'
import {
  signSupplementHandle,
} from "@/api/fieldCheck";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    signSupplement: {
      required: false,
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      textMap: {
        update: "编辑职务信息",
        add: "签退补录详情"
      },
      imgDialogVisible: false,
      step: 0,
      formData: {
        parentId: "",
        deptId: '',
        roleName: '',
        remark: '',
      },
      dialogImageUrl: "",
      imageUrl: "",
    };
  },
  computed: {
    ...mapState({
      roles: state => state.user.permissions,
    }),
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
    // 保存职务
    save () {
      signSupplementHandle({ signId: this.signSupplement.id })
        .then(res => {
          if (res.resp_code == 0) {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("modify");
          } else {
            this.$message({
              message: res.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
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
.content {
  margin: 0px 0px 20px;
}
/deep/.el-dialog__body {
  min-height: 300px !important;
}
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px;
}
</style>
