<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             :append-to-body="true"
             title="审核不通过原因">
    <el-form :model="formData"
             label-width="100px"
             class="formList">
      <el-input v-model.trim="formData.rejectedContent"
                placeholder="请输入内容"
                :rows="10"
                type="textarea"
                clearable />
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>   
import { coordinatesAuditAudit } from "@/api/coordinateReview";
import {
  changeTaskStatus
} from "@/api/temporaryTasks";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    id: {
      required: true,
      type: [String, Number],
      default: ''
    },
  },
  data () {
    return {
      formData: {
        id: '',
        taskStatus: 2, // 通过给5已完成，不通过给2已驳回
        rejectedContent: '',
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
      if (this.formData.rejectedContent == '') {
        this.$message({
          message: '不通过原因不能为空',
          type: 'warning'
        });
        return
      }
      changeTaskStatus(this.formData)
        .then(res => {
          this.dialogVisible = false;
          this.$emit("closeAll");
          this.$message({
            message: res.resp_msg,
            type: "success"
          });
        })
        .catch(err => console.log(err));
    },
    open () {
      this.formData.id = this.id
    },
    close () {
      Object.assign(this.formData, {
        id: '',
        taskStatus: 2, // 通过给5已完成，不通过给2已驳回
        rejectedContent: '',
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
