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
      <el-form-item label="内容名称"
                    prop="contentName">
        <el-input v-model.trim="formData.contentName"
                  maxlength=10
                  minlength=2
                  placeholder="请输入内容名称"
                  clearable />
      </el-form-item>
      <el-form-item label=" 操作说明"
                    prop='taskContentType'>
        <el-select v-model="formData.taskContentType"
                   filterable
                   placeholder="请选择">
          <el-option v-for="(item, index) in operationList"
                     :label="item.name"
                     :value="item.value"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { contentAddEdit, contentDetail } from "@/api/taskContent";
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
        add: "新增任务内容",
        update: "编辑任务内容",
      },
      operationList: [
        { name: '上传照片（单张）', value: 1, },
        { name: '上传照片（多张）', value: 2, },
        { name: '单行输入', value: 3, },
        { name: '多行输入', value: 4, },
      ],
      // operationList: ['上传照片（单张）', '上传照片（多张）', '单行输入', '多行输入'],
      formData: {
        id: '',
        contentName: "",
        taskContentType: '',
      },
      rules: {
        contentName: [{ required: true, message: "请输入内容名称", trigger: "blur", },
        { min: 2, max: 10, message: '内容名称限制2-10个字', trigger: 'blur' },],
        taskContentType: [{ required: true, message: "请选择操作说明", trigger: "blur" }],
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
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          contentAddEdit(this.formData).then(res => {
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
    // 查看详情
    contentDetail () {
      contentDetail({ id: this.formData.id }).then(res => {
        this.formData.id = res.data.id
        this.formData.contentName = res.data.contentName
        this.formData.taskContentType = res.data.taskContentType
      })
        .catch(err => console.log(err));
    },
    open () {
      if (this.optionsValue.status != 'add') {
        this.formData.id = this.optionsValue.rowList.id  //编辑
        this.contentDetail()
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: '',
        contentName: "",
        taskContentType: '',
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
</style>
