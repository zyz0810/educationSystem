<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             top="15vh"
             :append-to-body="true"
             :title="textMap[typeOptions.optionType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="80px"
             :rules="rules"
             class="formList">
      <el-form-item label="任务名称"
                    prop="taskName">
        <el-input v-model.trim="formData.taskName"
                  placeholder="任务名称"
                  :disabled="typeOptions.optionType == 'view'"
                  clearable />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="formData.startTime"
                        type="date"
                        @change="getStartTime"
                        :disabled="typeOptions.optionType == 'view'"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd"
                        :picker-options="startDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="formData.endTime"
                        type="date"
                        @change="getEndTime"
                        :disabled="typeOptions.optionType == 'view'"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd"
                        :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item label="负责人员">
        <el-select v-model="formData.userId"
                   filterable
                   placeholder="请选择"
                   :disabled="typeOptions.optionType == 'view'">
          <el-option v-for="item in usersList"
                     :label="item.nickname"
                     :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参与人员"
                    prop="participateIds">
        <el-select v-model="formData.participateIds"
                   multiple
                   placeholder="请选择"
                   :disabled="typeOptions.optionType == 'view'">
          <el-option v-for="item in usersList"
                     :label="item.nickname"
                     :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级"
                    prop="priority">
        <el-radio-group v-model="formData.priority"
                        size="small"
                        class="priority_tag"
                        :disabled="typeOptions.optionType == 'view'">
          <el-radio-button label="1"
                           :class="{ 'is-active': formData.priority == 1 }">高</el-radio-button>
          <el-radio-button label="2"
                           :class="{ 'is-active': formData.priority == 2 }">中</el-radio-button>
          <el-radio-button label="3"
                           :class="{ 'is-active': formData.priority == 3 }">低</el-radio-button>
          <el-radio-button label="4"
                           :class="{ 'is-active': formData.priority == 4 }">无</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联业务">
        <div class="flex">
          <el-select v-model="taskType"
                     :disabled="typeOptions.optionType == 'view'"
                     placeholder="选择业务类型"
                     style="width: 120px;">
            <el-option label="客户"
                       :value="1"></el-option>
          </el-select>
          <el-select v-model="formData.relationIds"
                     :disabled="typeOptions.optionType == 'view'"
                     placeholder="选择">
            <el-option v-for="(item, index) in customerList"
                       :disabled="customerStoreId!=''"
                       :label="item.storeName"
                       :value="item.id"
                       :key="index"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  :disabled="typeOptions.optionType == 'view'"
                  v-model.trim="formData.remark"
                  clearable
                  placeholder="任务描述"
                  textarea />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="modify"
                 v-if="typeOptions.optionType != 'view'">确 定</el-button>
      <el-button type="primary"
                 @click="completeTask"
                 v-if="typeOptions.optionType == 'view'">完成任务</el-button>
      <el-button type="primary"
                 class="ml_10"
                 v-if="typeOptions.optionType == 'view'"
                 @click="typeOptions.optionType = 'update'">编辑任务</el-button>
      <el-button type="primary"
                 @click="delTask"
                 v-if="typeOptions.optionType == 'view'">删除任务</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  customerList,
  usable,
  deleteCustomer,
  highSeas
} from "@/api/customer/customer";
import {
  usersList,
  taskDetail,
  taskSave,
  taskDel,
  taskComplete
} from "@/api/task";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    customerStoreId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    customerCrmId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    typeOptions: {
      required: true,
      type: Object,
      default: {
        optionType: "add",
        id: "",
        type: 1
      }
    }
  },
  data () {
    return {
      textMap: {
        add: "新建任务",
        update: "编辑任务",
        view: "查看任务"
      },
      taskType: 1,
      formData: {
        businessType: 1,
        claimType: "ALL",
        taskName: "",
        startTime: "",
        endTime: "",
        userId: "",
        priority: "",
        relationIds: "",
        participateIds: "",
        remark: "",
        taskType: 1
      },
      usersList: [],
      customerQuery: {
        customerName: "",
        mobile: "",
        customerTypeId: "",
        storeLevel: "",
        bargain: "",
        followTime: "",
        limit: 999,
        page: 1
      },
      customerList: [],
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      rules: {
        taskName: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ]
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
    getStartTime (e) {
      this.formData.startTime = e + ' 00:00:00'
    },
    getEndTime (e) {
      this.formData.endTime = e + ' 23:59:59'
    },
    getUsersList () {
      this.formData.relationIds = this.customerCrmId;
      usersList(this.formData)
        .then(res => {
          this.usersList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 获取客户列表
    getCustomerList () {
      customerList({ ...this.customerQuery, claimSearchType: 0 })
        .then(res => {
          this.customerList = res.data.data;
        })
        .catch(err => console.log(err));
    },
    // 获取任务详情
    getTaskInfo () {
      // taskDetail({ id: this.typeOptions.option.id })
      //   .then(res => {
      //     this.formData.businessType = res.data.businessType;
      //     this.formData.endTime = res.data.endTime + " 00:00:00";
      //     if (res.data.participateIds != "") {
      //       this.formData.participateIds = res.data.participateIds
      //         .split("、")
      //         .map(item => parseInt(item));
      //     } else {
      //       this.formData.participateIds = [];
      //     }
      //     this.formData.priority = res.data.priority;
      //     this.formData.remark = res.data.remark;
      //     this.formData.startTime = res.data.startTime + " 00:00:00";
      //     if (res.data.relationStore) {
      //       this.formData.relationIds = res.data.relationStore[0].storeName;
      //     } else {
      //       this.formData.relationIds = "";
      //     }
      //     this.formData.taskName = res.data.taskName;
      //     this.formData.userId = res.data.userId;
      //     this.$set(this.formData, "id", res.data.id);
      //   })
      //   .catch(err => console.log(err));
    },
    modify () {
      // participateIds
      let formData = Object.assign({}, this.formData);
      if (formData.participateIds.length > 0) {
        formData.participateIds = formData.participateIds.join(",");
      } else {
        formData.participateIds = "";
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          taskSave(formData)
            .then(res => {
              this.dialogVisible = false;
              this.$emit("insertTask");
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    completeTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          taskComplete({ ids: this.typeOptions.id })
            .then(res => {
              this.listLoading = false;
              this.getTaskList();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    delTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          taskDel({ ids: this.typeOptions.id })
            .then(res => {
              this.listLoading = false;
              this.getTaskList();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    open () {
      this.getCustomerList();
      this.getUsersList();
      if (this.typeOptions.optionType !== "add") {
        this.getTaskInfo();
      }
    },
    beginDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.endTime) {
            return new Date(self.formData.endTime).getTime() < time.getTime();
          }
        }
      };
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.formData.startTime) {
            return new Date(self.formData.startTime).getTime() > time.getTime();
          }
        }
      };
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        businessType: 1,
        claimType: "ALL",
        taskName: "",
        startTime: "",
        endTime: "",
        userId: "",
        priority: "",
        relationIds: "",
        participateIds: "",
        remark: "",
        taskType: 1
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss">
.el-form {
  padding: 0 20px;
  .flex {
    display: flex;
  }
  .priority_tag {
    .el-radio-button {
      margin-right: 5px;

      &:first-child {
        .el-radio-button__inner {
          color: rgb(248, 47, 55);
          border: 1px solid rgb(248, 47, 55);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(248, 47, 55);
          }
        }
      }
      &:nth-child(2) {
        .el-radio-button__inner {
          color: rgb(250, 151, 38);
          border: 1px solid rgb(250, 151, 38);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(250, 151, 38);
          }
        }
      }
      &:nth-child(3) {
        .el-radio-button__inner {
          color: rgb(107, 155, 202);
          border: 1px solid rgb(107, 155, 202);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(107, 155, 202);
          }
        }
      }
      &:nth-child(4) {
        .el-radio-button__inner {
          color: rgb(153, 153, 153);
          border: 1px solid rgb(153, 153, 153);
        }
        &.is-active {
          .el-radio-button__inner {
            color: #fff;
            background: rgb(153, 153, 153);
          }
        }
      }

      .el-radio-button__inner {
        padding: 0;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        vertical-align: middle;
        display: inline-block;
        color: white;
        border: none;
        border-radius: 50%;
        box-shadow: none;
      }
    }
  }
}

.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
