<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             :append-to-body="true"
             title="审核不通过原因">
    <el-form v-if='typeOptions.optionType == "add"'
             :model="formData"
             label-width="100px"
             class="formList">
      <el-input v-model.trim="formData.reason"
                placeholder="请输入内容"
                :rows="10"
                type="textarea"
                clearable />
    </el-form>
    <div class="reason-box"
         v-if='typeOptions.optionType == "look"'>{{typeOptions.option.failReason}}</div>
    <span slot="footer"
          class="dialog-footer"
          v-if='typeOptions.optionType == "add"'>
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>   
import { coordinatesAuditAudit } from "@/api/coordinateReview";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    typeOptions: {
      required: true,
      type: Object,
      default: {
        optionType: "add",
        option: {},
        idList: () => []
      }
    }
  },
  data () {
    return {
      formData: {
        idList: [],
        state: 'FAIL',
        reason: '',
      },
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
    },
  },
  methods: {
    save () {
      if (this.formData.reason == '') {
        this.$message({
          message: '不通过原因不能为空',
          type: 'warning'
        });
        return
      }
      coordinatesAuditAudit(this.formData)
        .then(res => {
          if (res.resp_code == 0) {
            this.dialogVisible = false;
            this.$emit("insertTask");
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
          }
        })
        .catch(err => console.log(err));
    },
    open () {
      this.formData.idList = this.typeOptions.idList
    },
    close () {
      Object.assign(this.formData, {
        idList: [],
        state: 'FAIL',
        reason: '',
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
}
.dialog-footer {
  margin: 20px 0px 0px;
}
.reason-box {
  height: 280px;
  overflow-y: scroll;
  line-height: 1.8em;
}
.reason-box::-webkit-scrollbar {
  display: none;
}
</style>
