<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <div class="addFieid-box">
      <div class="form-box">
        <div class="t-title"
             v-if="activeName == 'input'">用于姓名、公司名称等文字信息的输入</div>
        <div class="t-title"
             v-if="activeName == 'text_area'">用于多行文字信息输入，详细介绍及备注信息等</div>
        <div class="t-title"
             v-if="activeName == 'radio'">选项值低于5项时使用，低于超过5项时建议使用下拉单选</div>
        <div class="t-title"
             v-if="activeName == 'check_box'">选项值低于5项时使用，低于超过5项时建议使用下拉多选</div>
        <div class="t-title"
             v-if="activeName == 'select'">单选下拉框，选项值超过5项时使用，低于5项时建议使用单选输入</div>
        <div class="t-title"
             v-if="activeName == 'image'">用于图片的上传，支持格式：.jpg .png ，单个文件不能超过2MB</div>
        <div class="t-title"
             v-if="activeName == 'file_upload'">用于文件数据的上传，支持格式：.rar .zip，单个文件不能超过20MB</div>
        <el-form ref="ruleForm"
                 label-width="110px"
                 class="formList">
          <el-form-item label="显示名称：">
            <el-input v-model.trim="formData.dictName"
                      placeholder="单行文本"
                      clearable />
          </el-form-item>
          <el-form-item label=" 输入提示："
                        v-if="['input','text_area','select', ].includes(activeName)">
            <el-input v-model.trim="formData.dictValue.inputTip"
                      placeholder="输入提示最长20个字符"
                      clearable />
            <div class="t-tips">显示在输入框里面的提示用户输入的灰色文字</div>
          </el-form-item>
          <el-form-item label="字段描述："
                        v-if="['input','text_area','select','check_box','radio'].includes(activeName)">
            <el-input v-model.trim="formData.dictValue.fieldDesc"
                      placeholder="字段描述最长20个字符"
                      clearable />
            <div class="t-tips">显示在输入框下方的描述文字</div>
          </el-form-item>
          <el-form-item label="字段最小长度："
                        v-if="activeName == 'text_area'">
            <el-input v-model.trim="formData.dictValue.fieldMin"
                      placeholder="输入提示最长20个字符"
                      clearable />
            <div class="t-tips">字段可输入的最小长度</div>
          </el-form-item>
          <el-form-item label="字段最大长度："
                        v-if="activeName == 'input' || activeName == 'text_area'">
            <el-input v-model.trim="formData.dictValue.fieldLength"
                      placeholder="输入提示最长50个字符"
                      clearable />
            <div class="t-tips">字段可输入的最大长度</div>
          </el-form-item>
          <el-form-item label="是否必填：">
            <el-radio v-model="formData.dictValue.must"
                      :label="true">是</el-radio>
            <el-radio v-model="formData.dictValue.must"
                      :label="false">否</el-radio>
          </el-form-item>
          <el-form-item label="选项编辑："
                        prop="name"
                        class="edit-box"
                        v-if="['radio','check_box','select'].includes(activeName)">
            <div class="flex-between">
              <el-button icon="el-icon-plus"
                         @click="addChooseList">添加选项</el-button>
            </div>
            <div>
              <el-table ref="level"
                        :show-header="showHeader"
                        :data="formData.dictValue.options"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        class="mb_30"
                        row-key="dictCode"
                        border
                        fit
                        highlight-current-row>
                <el-table-column label="字段类型"
                                 align="center">
                  <template slot-scope="scope">
                    <el-input placeholder="选项一"
                              v-model.trim="scope.row.optionName"
                              clearable />
                  </template>
                </el-table-column>
                <el-table-column label="删除"
                                 width="60"
                                 align="center"
                                 class-name="levelAllowDrag">
                  <template slot-scope="scope">
                    <i @click="delChooseList(scope.$index,scope.row)"
                       class="el-icon-delete"></i>
                  </template>
                </el-table-column>
                <el-table-column label="排序"
                                 width="60"
                                 align="center"
                                 prop="optionSort"
                                 class-name="levelAllowDrag">
                  <template slot-scope="scope">
                    <i class=" iconfont icon-bars move-icon"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

        </el-form>
      </div>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">保 存</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import Sortable from "sortablejs";
import { fieldSave, getFieldDictValue, saveOrUpdateFieldDataValue } from "@/api/system/config";
export default {
  components: {
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: Object,
      default: {
        operatorType: "update",
        option: {}
      }
    },
    dictCode: {
      required: false,
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      textMap: {
        add: "新增字段",
        update: "编辑字段"
      },
      radio: 1,
      checked: true,
      showHeader: false,
      checkList: ['选中且禁用', '复选框 A'],
      activeName: 'input',
      tabPosition: 'left',
      customerLevelList: [],
      value: '',
      formData: {
        dictCode: 0,
        dictLabel: "",
        dictName: "",
        dictSort: 0,
        dictType: "",
        dictValue: {
          fieldDesc: "",
          fieldLength: 0,
          fieldMin: 0,
          inputTip: "",
          must: true,
          options: [
            {
              defaultSelect: 0,
              optionId: 0,
              optionName: "",
              optionSort: 0
            }
          ]
        },
        status: ""
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
  mounted () { },
  // 添加组件内的导航钩子，在跳转路由前，将函数清空
  beforeRouteLeave (to, from, next) {
    this.tableHeight = 500
    window.onresize = function () {
    }
    next()
  },
  methods: {
    levelSort () {
      const el = this.$refs.level.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = Sortable.create(el, {
        handle: ".levelAllowDrag",
        onEnd: evt => {
          // 获取排序之后的data数据
          this.formData.dictValue.options.splice(evt.newIndex, 0, this.formData.dictValue.options.splice(evt.oldIndex, 1)[0])
          let newArray = this.formData.dictValue.options.slice(0)
          this.formData.dictValue.options = []
          this.$nextTick(function () {
            this.formData.dictValue.options = newArray
          })
          // console.log(this.formData.dictValue.options)
        }
      });
    },
    // 添加数据
    addChooseList () {
      if (this.formData.dictValue.options == null) {
        this.formData.dictValue.options = []
      }
      let newObj = {
        optionName: '',
        optionSort: '',
        optionId: ''
      }
      this.formData.dictValue.options.push(newObj);
    },
    // 删除数据
    delChooseList (index, val) {
      this.formData.dictValue.options.splice(index, 1);
    },
    // 查看详情
    getFieldDictValue () {
      getFieldDictValue({ dictCode: this.option.option.dictCode })
        .then(res => {
          if (res.resp_code == 0) {
            this.formData = res.data
          }
        })
        .catch(() => {

        });
    },
    save () {
      if (this.formData.dictValue.options) {
        this.formData.dictValue.options = this.formData.dictValue.options.filter(item => item.optionName)
      }
      if (this.activeName == 'file_upload' || this.activeName == 'image'
        || this.activeName == 'text_area' || this.activeName == 'input') {
        delete this.formData.dictValue.options
      }
      // console.log(this.formData.dictValue.options)
      this.formData.handleType = 2// 0删除1启用、禁用2编辑、必填 
      // 多文本情况
      if (this.activeName == 'text_area' && Number(this.formData.dictValue.fieldLength) < Number(this.formData.dictValue.fieldMin)) {
        this.$message({
          message: "字段最小长度不能大于字段最大长度",
          type: "warning"
        });
        return
      }
      saveOrUpdateFieldDataValue(this.formData)
        .then(res => {
          if (res.resp_code == 0) {
            this.$message({ message: res.resp_msg, type: "success" });
            this.$emit("insertFollow");
            this.dialogVisible = false;
          }
        })
        .catch(() => {

        });
    },

    open () {
      this.getFieldDictValue()
      this.activeName = this.option.option.dictLabel
      this.$nextTick(function () {
        if (this.$refs.level) {
          this.levelSort()
        }
        // this.levelSort()
      })
    },
    close () {
      Object.assign(this.formData, {
        handleType: '',
        dictCode: 0,
        dictLabel: "",
        dictName: "",
        dictSort: 0,
        dictType: "",
        dictValue: {
          fieldDesc: "",
          fieldLength: 0,
          fieldMin: 0,
          inputTip: "",
          must: true,
          options: [
            {
              defaultSelect: 0,
              optionId: 0,
              optionName: "",
              optionSort: 0
            }
          ]
        },
        status: ""
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
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
.formList {
  .t-tips {
    font-size: 12px;
    line-height: 1.8em;
    color: #999;
  }
}
.edit-box {
  .flex-between {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
}
/deep/.el-table {
  .cell {
    display: flex;
    justify-content: space-around;
  }
}
/deep/.el-tabs__content {
  height: 500px;
  overflow: scroll;
}
.form-box {
  .t-title {
    border: 1px solid #00c1de;
    padding: 10px;
    box-sizing: border-box;
    color: #00c1de;
    font-size: 12px;
    margin: 0px 0px 20px 0px;
  }
}
.move-icon {
  cursor: move;
}
</style>
