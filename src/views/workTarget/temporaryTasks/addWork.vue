<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             top="8vh"
             @close="close"
             @open="open"
             :title="title[optionsValue.status]">
    <div class="status-button"
         v-if="['toExamine','look'].includes(optionsValue.status)">
      <!--任务状态;1:待接收,2:已驳回,3:待提交,4:待审核,5:已完成,6:已超时-->
      <el-button v-if='taskStatus == 1'
                 type="success">待接收</el-button>
      <el-button v-if='taskStatus == 2'
                 type="success">已驳回</el-button>
      <el-button v-if='taskStatus == 3'
                 type="success">待提交</el-button>
      <el-button v-if='taskStatus == 4'
                 type="success">待审核</el-button>
      <el-button v-if='taskStatus == 5'
                 type="success">已完成</el-button>
      <el-button v-if='taskStatus == 6'
                 type="success">已超时</el-button>
    </div>
    <div class="aaaa">
      <el-form ref="ruleForm"
               :model="formData"
               label-width="100px"
               :rules="rules"
               class="formList">
        <el-form-item label="任务类型"
                      v-if="['add','copy'].includes(optionsValue.status)"
                      prop="taskType">
          <el-radio-group @change="chooseType"
                          v-model="formData.taskType">
            <el-radio :label="1">单人任务</el-radio>
            <el-radio :label="2">群体任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务标题"
                      prop="taskTitle">
          <el-input v-model.trim="formData.taskTitle"
                    maxlength=16
                    minlength=2
                    :disabled="['toExamine','look'].includes(optionsValue.status)"
                    placeholder="可输入2-16个字"
                    clearable />
        </el-form-item>
        <el-form-item label="任务内容"
                      prop="taskContent">
          <el-input v-model.trim="formData.taskContent"
                    maxlength=200
                    minlength=2
                    :rows="5"
                    :disabled="['toExamine','look'].includes(optionsValue.status)"
                    type="textarea"
                    placeholder="可输入2-200个字"
                    clearable />
        </el-form-item>
        <el-form-item label="服务商"
                      v-show='formData.taskType == 1'
                      :prop='formData.taskType == 1 ? "serviceProviderOne": ""'>
          <!--单人任务 -->
          <el-select v-model="formData.serviceProviderOne"
                     filterable
                     @change="getServiceProviderOne"
                     clearable
                     :disabled="['toExamine','look'].includes(optionsValue.status)"
                     placeholder="请选择">
            <el-option v-for="(item, index) in userOptions"
                       :key="index"
                       :label="item.nickname"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商"
                      v-show='formData.taskType == 2'
                      :prop='formData.taskType == 2 ? "serviceProviderMore": ""'>
          <!--群体任务  -->
          <el-select v-model="formData.serviceProviderMore"
                     filterable
                     clearable
                     multiple
                     :disabled="['toExamine','look'].includes(optionsValue.status)"
                     placeholder="请选择">
            <el-option v-for="(item, index) in userOptions"
                       :key="index"
                       :label="item.nickname"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if='formData.taskType == 1'
                      label="关联客户">
          <div class="customer-box"
               v-if='customerList.length > 0'>
            <div v-for='(item,index) in customerList'
                 :key='index'>{{item.customerStoreName}}
              <i @click="del(item.customerStoreId)"
                 v-if="['add','update','copy'].includes(optionsValue.status)"
                 class="el-icon-close"></i>
            </div>
          </div>
          <span class="choose-customer"
                v-if="['add','update','copy'].includes(optionsValue.status)"
                :class="formData.serviceProviderOne ? 'font-color' : ''"
                @click="choooseCusomer">选择客户</span>
        </el-form-item>
        <el-form-item label="截止时间"
                      prop='expirationTime'>
          <el-date-picker v-model="formData.expirationTime"
                          type="date"
                          :picker-options="pickerOptions"
                          value-format="yyyy-MM-dd"
                          :disabled="['toExamine','look'].includes(optionsValue.status)"
                          placeholder="请选择截止时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!--审核内容-->
      <div v-if="['look','toExamine'].includes(optionsValue.status) && [2,4,5].includes(taskStatus)">
        <div class="examine-box">
          <div class="x-div">
            <div class="v-left">执行人</div>
            <div class="v-right">{{sysUserName}}</div>
          </div>
          <div class="x-div">
            <div class="v-left">执行时间</div>
            <div class="v-right">{{executionTime}}</div>
          </div>
          <div class="x-div">
            <div class="v-left">跟进内容</div>
            <div class="v-right">{{followContent}}</div>
          </div>
          <div class="x-div">
            <div class="v-left">跟进照片</div>
            <div class="v-right">
              <img v-for='(item,index) in followImgList'
                   :key='index'
                   :src="item"
                   @click="showImg(item)"
                   class="product_img" />
            </div>
          </div>
          <div class="x-div"
               v-if='[2,3].includes(taskStatus)'>
            <div class="v-left"></div>
            <div class="v-right c-green"
                 v-if='taskStatus == 2 && rejectedContent'>上次驳回原因：{{rejectedContent}}</div>
            <div v-if='taskStatus == 3  && rejectedContent'> class="v-right c-green">驳回原因：{{rejectedContent}}</div>
          </div>
          <div class="x-div"
               v-if='[5].includes(taskStatus)'>
            <div class="v-left">审核人</div>
            <div class="v-right">{{finishUserName}}</div>
          </div>
          <div class="x-div"
               v-if='[5].includes(taskStatus)'>
            <div class="v-left">完成时间</div>
            <div class="v-right">{{finishTime}}</div>
          </div>
        </div>

      </div>
    </div>
    <div slot="footer"
         class="dialog-footer"
         v-if="['add','update','copy'].includes(optionsValue.status)">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </div>
    <div slot="footer"
         class="dialog-footer"
         v-if=" ['look',!'update',].includes(optionsValue.status)">
      <el-button class="ml_30"
                 type="primary"
                 @click="dialogVisible=false">关闭</el-button>
    </div>
    <div slot="footer"
         v-if="['look','toExamine'].includes(optionsValue.status) && [2,4,5].includes(taskStatus) && 
         [4].includes(taskStatus) && ['toExamine'].includes(optionsValue.status)"
         class="dialog-footer">
      <el-button type="primary"
                 @click="approved">审核通过</el-button>
      <el-button class="ml_30"
                 @click="approvedNo">审核不通过</el-button>
    </div>
    <addGoodsCustomer :showDialog.sync="showCustomerDialog"
                      :checkedAreaList="checkedAreaList"
                      :customerStoreIdNotInList="formData.storeIds"
                      :customerTypeId="customerTypeId"
                      :sysUserId='formData.serviceProviderOne'
                      :treeList="treeList"
                      @insertSustomer="insertSustomer" />
    <!--审核不通过原因-->
    <reasonFailure :showDialog.sync="showReasonFailureDialog"
                   :id='formData.id'
                   @closeAll='closeAll'></reasonFailure>
    <!--点击图片放大-->
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="9vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
  </my-dialog>
</template>

<script>
import { contentAddEdit, contentDetail } from "@/api/taskContent";
import addGoodsCustomer from "./addGoodsCustomer";
import reasonFailure from "./reasonFailure";
import {
  temporaryTast,
  taskDetail,
  changeTaskStatus
} from "@/api/temporaryTasks";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    optionsValue: {
      required: false,
      type: Object,
      default: {}
    },
    treeList: {
      required: true,
      type: Array,
      default: [],
    },
    userOptions: {
      required: true,
      type: Array,
      default: [],
    },
  },
  data () {
    return {
      pickerOptions: {
        // 禁用时间
        selectableRange: '10:00:00- 23:59:59', // 动态写法在初始化时 对象.的方式更改
        disabledDate: (time) => {  // 禁用日期
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() - 1))
          return time < nowData
        }
      },
      title: {
        add: "新增临时任务",
        update: "编辑临时任务",
        copy: '复制临时任务',
        look: '任务详情',
        toExamine: '任务详情',
      },
      operationList: [
        { name: '上传照片（单张）', value: 1, },
        { name: '上传照片（多张）', value: 2, },
        { name: '单行输入', value: 3, },
        { name: '多行输入', value: 4, },
      ],
      operationList2: [
        { name: '上传照片（单张）', value: 33, },
        { name: '上传照片（多张）', value: 23, },
        { name: '单行输入', value: 333, },
        { name: '多行输入', value: 43, },
      ],
      formData: {
        id: '',
        taskType: 1,
        taskTitle: "",
        taskContent: "",
        serviceProviderOne: '',
        serviceProviderMore: [],
        sysUserIds: [],
        storeIds: [],
        customerArr: [],
        expirationTime: '',
      },
      serviceProviderOne: '',
      serviceProviderMore: [],
      rules: {
        taskType: [{ required: true, message: "请选择任务类型", trigger: "blur", }],
        taskTitle: [{ required: true, message: "请输入任务标题", trigger: "blur", },
        { min: 2, max: 16, message: '任务标题限制2-16个字', trigger: 'blur' },],
        taskContent: [{ required: true, message: "请输入任务内容", trigger: "blur", },
        { min: 2, max: 200, message: ' 任务内容限制2-200个字', trigger: 'blur' },],
        serviceProviderOne: [{ required: true, message: "请选择服务商", trigger: "blur" }],
        serviceProviderMore: [{ required: true, message: "请选择服务商", trigger: "blur" }],
        expirationTime: [{ required: true, message: "请选择截止时间", trigger: "blur" }],
      },
      showCustomerDialog: false,
      customerTypeId: [],
      checkedAreaList: [],
      customerList: [],
      showReasonFailureDialog: false,
      taskStatus: '',
      executionTime: '',//执行时间
      sysUserName: '', //执行人
      followContent: '', //跟进内容
      followImgList: [], //跟进图片
      rejectedContent: '', //驳回内容
      finishUserName: '',
      finishTime: '',
      imgDialogVisible: false,
      dialogImageUrl: "",
    };
  },
  components: {
    addGoodsCustomer,
    reasonFailure
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
    // 选择客户
    choooseCusomer () {
      if (this.formData.serviceProviderOne) {
        this.formData.storeIds = (this.customerList || []).map(item => item.customerStoreId);
        this.showCustomerDialog = true
      }
    },
    // 删除勾选
    del (val) {
      this.customerList = this.customerList.filter((item, indx) => item.customerStoreId != val)
    },
    callback (checkedAreaList, customerTypeId) {
      this.checkedAreaList = checkedAreaList;
      this.customerTypeId = customerTypeId;
      // this.showCustomerDialog = true;
    },
    // 客户回显
    insertSustomer (arr) {
      arr[0].index = this.index + 1
      this.customerList = arr.concat(this.customerList);
      this.index = this.index + 1
    },
    chooseType (val) {
      // if (val == 1) {
      //   this.serviceProviderOne = ''
      //   this.serviceProviderMore = []
      // } else {
      //   this.serviceProviderOne = ''
      //   this.serviceProviderMore = []
      // }
    },
    showImg (value) {
      if (value) {
        this.dialogImageUrl = value;
        this.imgDialogVisible = true;
      }
    },
    save () {
      if (this.formData.taskType == 1) {
        this.formData.sysUserIds = [this.formData.serviceProviderOne]
      } else {
        this.formData.sysUserIds = this.formData.serviceProviderMore
      }
      if (this.formData.taskType == 2 && this.formData.sysUserIds.length <= 1) {
        return this.$message({ message: "至少选择两个服务商", type: "warning" });
      }
      this.formData.storeIds = (this.customerList || []).map(item => item.customerStoreId);
      if (this.optionsValue.status == 'copy') { //复制没有id
        this.formData.id = ''
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          temporaryTast(this.formData).then(res => {
            this.$message({
              message: res.resp_msg,
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit("insertTask");
          })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    // 审核不通过
    approvedNo () {
      this.showReasonFailureDialog = true
    },
    // 审核通过
    approved () {
      // 通过给5已完成，不通过给2已驳回
      this.hint("是否确认审核通过？").then(res => {
        if (res) {
          changeTaskStatus({ id: this.formData.id, taskStatus: 5 }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.dialogVisible = false;
            this.$emit("insertTask");
          });
        }
      });
    },
    // 审核不通过回调
    closeAll () {
      this.dialogVisible = false;
      this.$emit("insertTask");
    },
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // 查看详情
    taskDetail () {
      taskDetail({ id: this.formData.id }).then(res => {
        this.formData.id = res.data.id
        this.formData.taskTitle = res.data.taskTitle
        this.formData.taskContent = res.data.taskContent
        this.formData.serviceProviderOne = res.data.sysUserId
        this.formData.storeIds = res.data.storeIds
        this.formData.expirationTime = this.optionsValue.status == 'copy' ? '' : res.data.expirationTime
        this.customerList = (res.data.storeMapList || []).map((item, index) => {
          return {
            customerStoreName: item.name,
            customerStoreId: item.id
          }
        })  //关联客户
        this.executionTime = res.data.executionTime//执行时间
        this.sysUserName = res.data.sysUserName //执行人
        this.followContent = res.data.followContent //跟进内容
        this.followImgList = res.data.followImgList  //跟进图片
        this.rejectedContent = res.data.rejectedContent  //驳回内容
        this.finishUserName = res.data.finishUserName //审核人
        this.finishTime = res.data.finishTime
        this.taskStatus = res.data.taskStatus
      })
        .catch(err => console.log(err));
    },
    // 切换服务商
    getServiceProviderOne () {
      this.customerList = []
    },
    open () {
      if (this.optionsValue.status != 'add') {
        this.formData.id = this.optionsValue.rowList.id  //编辑
        this.taskDetail()
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: '',
        taskType: 1,
        taskTitle: "",
        taskContent: "",
        serviceProvider: [],
        serviceProviderOne: '',
        serviceProviderMore: [],
        customerArr: [],
        expirationTime: '',
      });
      this.serviceProviderOne = ''
      this.serviceProviderMore = []
      this.customerList = []
      this.taskStatus = ''
      this.executionTime = ''//执行时间
      this.sysUserName = ''//执行人
      this.followContent = '' //跟进内容
      this.followImgList = [] //跟进图片
      this.rejectedContent = '' //驳回内容
      this.finishUserName = ''
      this.finishTime = ''
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
.choose-customer {
  color: #999;
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
}
.font-color {
  color: #1890ff;
}
.customer-box {
  max-height: 150px;
  overflow-y: scroll;
  div {
    position: relative;
    margin-bottom: 10px;
    margin: 0px 20px 0px 0px;
    line-height: 1.8em;
    margin: 0px 20px 10px 0px;
    line-height: 1.8em;
    background: #f5f5f5;
    padding-right: 40px;
    padding: 2px 40px 2px 5px;
    position: relative;
    i {
      position: absolute;
      right: 3px;
      top: 7px;
    }
  }
}
.examine-box {
  margin: 0px 0px;
  border-top: 1px #dedede solid;
  padding: 20px 40px;
  .x-div {
    display: flex;
    line-height: 1.8em;
    .v-left {
      width: 70px;
      margin-right: 20px;
      color: #333;
    }
    .v-right {
      flex: 1;
      color: #999;
    }
    .c-green {
      color: #409eff;
    }
  }
}
.status-button {
  height: 50px;
  margin-right: 20px;
  text-align: right;
}
.product_img {
  width: 100px;
  height: 100px;
  margin: 0px 10px 0px 0px;
}
.aaaa {
  max-height: 65vh;
  overflow-y: scroll;
}
</style>
