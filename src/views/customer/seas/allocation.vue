<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :append-to-body="true"
             title="分配客户">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="接受对象"
                    prop="userId">
        <el-select v-model="formData.userId"
                   filterable
                   placeholder="请选择接受对象"
                   clearable>
          <el-option :label="item.nickname"
                     :value="item.id"
                     v-for="(item, index) in userList"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                  placeholder="请输入备注信息"
                  v-model.trim="formData.claimRemark"
                  max="300"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save"
                 :loading="isSave">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { getUsersByRole } from "@/api/common";
import { highSeasTransfer, transfer } from "@/api/customer/customer";
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    selectList: {
      required: true,
      type: [Array, Object],
      default: []
    },
    // 客户界面进入0公海1是客户
    customer: {
      required: false,
      type: Number,
      default: 0
    },
  },
  data () {
    return {
      formData: {
        claimRemark: "",
        userId: ""
      },
      isSave: false,
      userList: [],
      rules: {
        userId: [{ required: true, message: "请选择接受对象", trigger: "blur" }]
      }
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
    ...mapActions(["getDict", "getBacklog"]),
    save () {
      const storeIds = this.selectList.map(item => item.customerStoreId);
      const ids = this.selectList.map(item => item.id);
      // const { deptId } = this.userList.find(
      //   item => item.id == this.formData.userId
      // );
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.customer == 1) { //客户页面
            transfer({
              ...this.formData,
              // deptId,
              // storeIds,
              ids
            }).then(res => {
              if (res.resp_code == 0) {
                this.$emit("success");
                this.$message({ message: res.resp_msg, type: "success" });
                this.dialogVisible = false;
              }
            });
          } else {//公海页面
            highSeasTransfer({
              ...this.formData,
              // deptId,
              // storeIds,
              ids
            }).then(res => {
              if (res.resp_code == 0) {
                this.$emit("success");
                this.$message({ message: res.resp_msg, type: "success" });
                this.dialogVisible = false;
                this.getBacklog();
              }
            });
          }

        }
      });
    },
    getUsersByRole () {
      getUsersByRole().then(res => {
        this.userList = res.data;
      });
    },
    open () {
      this.getUsersByRole();

    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        claimRemark: "",
        userId: ""
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
