<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="36%"
             @close="close"
             @open="open"
             :title="title[optionsValue.status]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item label="类型名称："
                    prop="taskTypeName">
        <el-input v-model.trim="formData.taskTypeName"
                  placeholder="请输入类型名称"
                  maxlength=10
                  :disabled='optionsValue.status == "view"'
                  minlength=2
                  clearable />
      </el-form-item>
      <el-form-item label="任务内容："
                    prop="taskContentIds">
        <el-checkbox-group v-model="formData.taskContentIds">
          <el-checkbox v-for="(item,index) in workConList"
                       :label="item.id"
                       :disabled='optionsValue.status == "view"'
                       :key="index">{{item.contentName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="停留时长："
                    :prop="formData.taskTypeRule == '1' ? 'residentMinute' :''">
        <el-input v-model.trim="formData.residentMinute"
                  placeholder="请输入停留时长"
                  :disabled='optionsValue.status == "view"'
                  clearable />
        <span class="font13">单位分钟；从“签到”开始计时，达到时长才能签退，不填表示不用签退</span>
      </el-form-item>
      <el-form-item label="任务间隔："
                    prop="completeInterval">
        <el-input v-model.trim="formData.completeInterval"
                  placeholder="请输入任务间隔"
                  :disabled='optionsValue.status == "view"'
                  clearable />
        <span class="font13">单位天；同一客户连续做任务的时间间隔，最小1天</span>
      </el-form-item>
      <el-form-item label="适用客户："
                    prop="customerLevelIds">
        <el-checkbox-group v-model="formData.customerLevelIds">
          <el-checkbox v-for="(item,index) in levelList"
                       :label="item.dictCode"
                       :disabled='optionsValue.status == "view"'
                       :key="index">{{item.dictName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生成规则："
                    prop='taskTypeRule'>
        <el-radio-group v-model="formData.taskTypeRule">
          <el-radio :label="1"
                    :disabled='optionsValue.status == "view"'>指标任务</el-radio>
          <el-radio :label="2"
                    :disabled='optionsValue.status == "view"'>临时任务</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer"
         v-if='optionsValue.status != "view"'
         class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { dict } from "@/api/common";
import { taskType, typeDetail, getListByStatus } from "@/api/taskType";
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
  },
  data () {
    return {
      title: {
        add: "新增任务类型",
        update: "编辑任务类型",
        view: "查看任务类型",
      },
      workConList: [
        { name: '拍门头', value: 1, },
        { name: '拍陈列', value: 2, },
      ],
      applyList: [
        { name: 'A', value: 1, },
        { name: 'B', value: 2, },
        { name: 'C', value: 3, },
        { name: 'D', value: 4, },
      ],
      formData: {
        id: '',
        taskTypeName: "",
        taskContentIds: [],
        residentMinute: '',
        completeInterval: '',
        taskTypeRule: 1,
        customerLevelIds: [],
      },
      rules: {
        taskTypeName: [{ required: true, message: "请输入任务名称", trigger: "blur" },
        { min: 2, max: 10, message: '任务名称限制2-10个字', trigger: 'blur' },],
        taskContentIds: [{ required: true, message: "请选择任务内容", trigger: "blur" }],
        completeInterval: [{ required: true, message: "请输入任务间隔", trigger: "blur" }],
        residentMinute: [{ required: true, message: "请输入停留时长", trigger: "blur" }],
        taskTypeRule: [{ required: true, message: "请选择生成规则", trigger: "blur" }],
        customerLevelIds: [{ required: true, message: "请选择适用客户", trigger: "blur" }],
      },
      levelList: [],
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
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.formData.residentMinute < 0) {
            this.$message({
              message: '停留时长不能小于0分钟',
              type: "warning"
            });
            return
          }
          if (this.formData.completeInterval < 1) {
            this.$message({
              message: '任务间隔不能小于1天',
              type: "warning"
            });
            return
          }
          taskType(this.formData).then(res => {
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
    // 查看详情
    typeDetail () {
      typeDetail({ id: this.formData.id }).then(res => {
        this.formData.id = res.data.id
        this.formData.taskTypeName = res.data.taskTypeName
        this.formData.taskContentIds = res.data.contentIdList
        this.formData.residentMinute = res.data.residentMinute
        this.formData.completeInterval = res.data.completeInterval
        this.formData.customerLevelIds = res.data.customerLevelIdList
        this.formData.taskTypeRule = res.data.taskTypeRule

      })
        .catch(err => console.log(err));
    },
    // 任务内容
    getListByStatus () {
      getListByStatus({ id: this.formData.id }).then(res => {
        this.workConList = res.data
      })
        .catch(err => console.log(err));
    },
    getDict () {
      dict().then(res => {
        const data = res.data
        this.levelList = data.find(item => item.dictType == 'customer_level').dataList
      })
        .catch(err => console.log(err));
    },
    open () {
      this.getDict() //适用类型
      if (this.optionsValue.status != 'add') {
        this.formData.id = this.optionsValue.rowList.taskTypeId || this.optionsValue.rowList.id//编辑
        this.typeDetail()
      }
      this.getListByStatus() //任务内容
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: '',
        taskTypeName: "",
        taskContentIds: [],
        residentMinute: '',
        completeInterval: '',
        taskTypeRule: 1,
        customerLevelIds: [],
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 20px;
}
.font13 {
  font-size: 11px;
  line-height: 18px !important;
  color: #999;
}
</style>
