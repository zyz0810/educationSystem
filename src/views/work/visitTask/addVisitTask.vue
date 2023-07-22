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
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="拜访时间"
                    prop="visitStartTime">
        <el-date-picker v-model="formData.visitStartTime"
                        type="datetime"
                        class="data-time"
                        :disabled="typeOptions.optionType == 'view'"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="拜访内容"
                    prop="visitContent">
        <el-input v-model.trim="formData.visitContent"
                  placeholder="任务名称"
                  :rows="2"
                  type="textarea"
                  :disabled="typeOptions.optionType == 'view'"
                  clearable />
      </el-form-item>
      <el-form-item label="关联业务"
                    prop="customerStoreId">
        <div class="flex">
          <el-select v-model="taskType"
                     :disabled="typeOptions.optionType == 'view'"
                     placeholder="选择业务类型"
                     style="width: 120px;">
            <el-option label="客户"
                       :value="1"></el-option>
          </el-select>
          <el-select v-model="formData.customerStoreId"
                     filterable
                     @change="getlonAndLat(formData.customerStoreId)"
                     :disabled="typeOptions.optionType == 'view'"
                     placeholder="选择">
            <el-option v-for="(item) in customerList"
                       :label="item.storeName"
                       :value="item.customerStoreId"
                       :key="item.customerStoreId"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="拜访人员"
                    prop="userId">
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
      <el-form-item label="优先级"
                    prop="priority">
        <el-radio-group v-model="formData.priority"
                        size="small"
                        class="priority_tag"
                        :disabled="typeOptions.optionType == 'view'">
          <el-radio-button label="1"
                           :class="{ 'is-active': formData.priority == '1' }">高</el-radio-button>
          <el-radio-button label="2"
                           :class="{ 'is-active': formData.priority == '2' }">中</el-radio-button>
          <el-radio-button label="3"
                           :class="{ 'is-active': formData.priority == '3' }">低</el-radio-button>
          <el-radio-button label="4"
                           :class="{ 'is-active': formData.priority == '4' }">无</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="拜访签到">
        <div>执行人须到指定地点签到</div>
      </el-form-item>
      <el-form-item label="拜访地址"
                    prop="signAddress">
        <el-input v-model.trim="formData.signAddress"
                  placeholder="拜访地址"
                  disabled
                  clearable />
      </el-form-item>
      <el-form-item label="拜访范围"
                    prop="signRange">
        <el-input v-model.trim="formData.signRange"
                  placeholder="输入数值"
                  disabled
                  clearable>
          <template slot="append">M</template>
        </el-input>
        <div>超出此范围签到将无效</div>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="modify"
                 v-if="typeOptions.optionType != 'view'">确 定</el-button>
      <el-button type="primary"
                 @click="completeTask"
                 v-if="typeOptions.optionType == 'view'">更改任务状态</el-button>
      <el-button type="primary"
                 class="ml_10"
                 v-rules="{admin:'admin',ordinary:'task:edit'}"
                 v-if="typeOptions.optionType == 'view'"
                 @click="typeOptions.optionType = 'update'">编辑任务</el-button>
      <el-button type="primary"
                 @click="delTask"
                 v-rules="{admin:'admin',ordinary:'task:del'}"
                 v-if="typeOptions.optionType == 'view'">删除任务</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
    <Map :showDialog.sync="showMapDialog"
         @onChange='onChildValue'
         :option="mapType"></Map>
  </my-dialog>
</template>

<script>
import {
  getVisitTaskSetting,
} from "@/api/system/config";
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
import { getId } from "@/utils/auth";
import {
  saveOrUpdateVisitTask,
  getVisitTaskDetail
} from "@/api/visitTask"
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
        type: "1",
        optionType: "add",
        option: {}
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
        id: '',
        visitStartTime: '',
        visitContent: '',
        customerStoreId: "",
        userId: '',
        priority: '',
        signAddress: '',
        signAddressLatitude: '',
        signAddressLongitude: '',
        signRange: '',
      },
      usersList: [],
      customerQuery: {
        limit: 999,
        page: 1
      },
      customerList: [],
      rules: {
        visitStartTime: [{ required: true, message: "请选择拜访时间", trigger: "blur" }],
        visitContent: [{ required: true, message: "请输入拜访内容", trigger: "blur" }],
        customerStoreId: [{ required: true, message: "请选择关联业务", trigger: "blur" }],
        userId: [{ required: true, message: "请选择拜访人员", trigger: "blur" }],
        priority: [{ required: true, message: "请选择优先级", trigger: "blur" }],
        signAddress: [{ required: true, message: "请选择优地址", trigger: "blur" }],
        signRange: [{ required: true, message: "请输入签到范围", trigger: "blur" }],
      },
      showMapDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
      pickerOptions: {                                 //禁用当前日期之前的日期
        disabledDate (time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() < Date.now() - 8.64e7;
        },
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
    // 获取客户的经纬度
    getlonAndLat (val) {
      let newArr = this.customerList.filter(item => item.customerStoreId == val) //获取选中客户的经纬度
      this.formData.signAddress = newArr[0].areaName + newArr[0].address //地理位置
      let lonLat = newArr[0].lonAndLat.split(',');
      this.formData.signAddressLatitude = lonLat[1]
      this.formData.signAddressLongitude = lonLat[0]
    },
    // val 从子组件中获取到的值
    onChildValue (val) {
      this.formData.signAddress = val.signAddress
      this.formData.signAddressLatitude = val.signAddressLatitude
      this.formData.signAddressLongitude = val.signAddressLongitude
    },
    showMap (val) {
      this.mapType = {
        operatorType: val,
        option: {
          signAddressLatitude: this.formData.signAddressLatitude,
          signAddressLongitude: this.formData.signAddressLongitude,
          signAddress: this.formData.signAddress
        }
      };
      this.showMapDialog = true
    },
    getUsersList () {
      usersList(this.formData)
        .then(res => {
          this.usersList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 获取客户列表
    getCustomerList () {
      customerList({ ...this.customerQuery, claimSearchType: 0, sortType: 4 })
        .then(res => {
          this.customerList = res.data.data;
          // this.customerList.forEach((item, index) => {
          // });
          // 过滤掉康要多过来的客户（信息不完善）
          this.customerList = this.customerList.filter(item => item.storeName != null)
          // 过滤经纬度为空或不存在的接口
          this.customerList = this.customerList.filter(item => (item.lonAndLat != undefined && item.lonAndLat != ''))
        })
        .catch(err => console.log(err));
    },
    // 获取任务详情
    getTaskInfo () {
      getVisitTaskDetail({ visitTaskId: this.typeOptions.option.id })
        .then(res => {
          this.$set(this.formData, "id", res.data.id);
          // this.formData = res.data
          this.formData.id = res.data.id
          this.formData.visitContent = res.data.visitContent
          this.formData.customerStoreId = res.data.customerStoreId
          this.formData.userId = res.data.userId
          this.formData.priority = res.data.priority
          this.formData.signAddress = res.data.signAddress
          this.formData.signAddressLatitude = res.data.signAddressLatitude
          this.formData.signAddressLongitude = res.data.signAddressLongitude
          this.formData.signRange = res.data.signRange
          this.formData.visitStartTime = this.$moment(res.data.visitStartTime).format("YYYY-MM-DD HH:mm:ss")
        })
        .catch(err => console.log(err));
    },
    // 拜访设置
    getVisitTaskSetting () {
      getVisitTaskSetting({})
        .then(res => {
          this.formData.signRange = res.data.outsideAttendanceDistance
        })
        .catch(() => { });
    },
    modify () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.typeOptions.optionType == 'add') {
            delete this.formData.id
          }
          // delete this.formData.createTime
          // delete this.formData.updateTime
          // delete this.formData.visitTaskTypeCode
          saveOrUpdateVisitTask(this.formData)
            .then(res => {
              this.dialogVisible = false;
              this.$emit("insertTask");
              this.$message({
                message: '成功',
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
          taskComplete({ ids: this.typeOptions.option.id })
            .then(res => {
              this.dialogVisible = false;
              this.$emit("insertTask");
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
          taskDel({ ids: this.typeOptions.option.id })
            .then(res => {
              this.dialogVisible = false;
              this.$emit("insertTask");
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
      this.getVisitTaskSetting()
      if (this.typeOptions.optionType !== "add") {
        this.getTaskInfo();
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        visitStartTime: '',
        visitContent: '',
        customerStoreId: "",
        userId: '',
        priority: '',
        signAddress: '',
        signAddressLatitude: '',
        signAddressLongitude: '',
        signRange: '',
        // visitTaskTypeCode: '',
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
.choose-map {
  a {
    cursor: pointer;
    color: #1890ff;
  }
  span {
    cursor: pointer;
    color: #1890ff;
    margin-left: 20px;
  }
}
</style>
