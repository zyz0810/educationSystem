<template>
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
        <el-input v-model.trim="that_dictName"
                  placeholder="单行文本"
                  clearable />
      </el-form-item>
      <el-form-item label=" 输入提示："
                    v-if="['input','text_area','select', ].includes(dictLabel)">
        <el-input v-model.trim="that_inputTip"
                  placeholder="输入提示最长20个字符"
                  clearable />
        <div class="t-tips">显示在输入框里面的提示用户输入的灰色文字</div>
      </el-form-item>
      <el-form-item label="字段描述："
                    v-if="['input','text_area','select','check_box','radio'].includes(dictLabel)">
        <el-input v-model.trim="that_fieldDesc"
                  placeholder="字段描述最长20个字符"
                  clearable />
        <div class="t-tips">显示在输入框下方的描述文字</div>
      </el-form-item>
      <el-form-item label="字段最小长度："
                    v-if="activeName == 'text_area'">
        <el-input v-model.trim="that_fieldMin"
                  placeholder="输入提示最小20个字符"
                  clearable />
        <div class="t-tips">字段可输入的最小长度</div>
      </el-form-item>
      <el-form-item label="字段最大长度："
                    v-if="activeName == 'input' || activeName == 'text_area'">
        <el-input v-model.trim="that_fieldLength"
                  placeholder="输入提示最大50个字符"
                  clearable />
        <div class="t-tips">字段可输入的最大长度</div>
      </el-form-item>
      <el-form-item label="是否必填：">
        <el-radio-group v-model="that_must">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项编辑："
                    prop="name"
                    class="edit-box"
                    v-if="['radio','check_box','select'].includes(dictLabel)">
        <div class="flex-between">
          <el-button icon="el-icon-plus"
                     @click="addChooseList">添加选项</el-button>
        </div>
        <div>
          <el-table ref="level"
                    :show-header="showHeader"
                    :data="optionsTable"
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
                <i class="iconfont icon-bars move-icon"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  props: {
    activeName: {
      required: true,
      type: String,
      default: ''
    },
    fieldDesc: {
      required: false,
      type: [String, Number],
      default: ''
    },
    dictLabel: {
      required: false,
      type: [String, Number],
      default: ''
    },
    dictName: {
      required: false,
      type: [String, Number],
      default: ''
    },
    must: {
      required: false,
      type: Boolean,
      default: false
    },
    fieldLength: {
      required: false,
      type: [String, Number],
      default: ''
    },
    fieldMin: {
      required: false,
      type: [String, Number],
      default: ''
    },
    options: {
      required: false,
      type: [Array, Object],
      default: () => { }
    },
    inputTip: {
      required: false,
      type: [String, Number],
      default: ''
    },
  },
  data () {
    return {
      radio: 1,
      checked: true,
      showHeader: false,
      checkList: ['选中且禁用', '复选框 A'],
      chooseList: [],
      dictValue: {
        inputTip: "",
        fieldDesc: '',
        fieldLength: '',
        fieldMin: '',
        must: false,
      },
      optionsList: [{
        value: '选项1',
        label: '黄金糕'
      },],
      value: '',
      optionsTable: this.options
    };
  },
  computed: {
    that_dictName: {
      get () {
        return this.dictName
      },
      set (value) {
        this.$emit("update:dict-name", value)
      }
    },
    that_fieldDesc: {
      get () {
        return this.dictValue.fieldDesc
      },
      set (value) {
        this.dictValue.fieldDesc = value
        this.$emit("update:field-desc", value)
      }
    },
    that_inputTip: {
      get () {
        return this.dictValue.inputTip
      },
      set (value) {
        this.dictValue.inputTip = value
        this.$emit("update:input-tip", value)
      }
    },
    that_fieldLength: {
      get () {
        return this.dictValue.fieldLength
      },
      set (value) {
        this.dictValue.fieldLength = value
        this.$emit("update:field-length", value)
      }
    },
    that_fieldMin: {
      get () {
        return this.dictValue.fieldMin
      },
      set (value) {
        this.dictValue.fieldMin = value
        this.$emit("update:field-min", value)
      }
    },
    that_must: {
      get () {
        return this.dictValue.must
      },
      set (value) {
        this.dictValue.must = value
        this.$emit("update:must", value)
      }
    },
  },
  mounted () {
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
          this.optionsTable.splice(evt.newIndex, 0, this.optionsTable.splice(evt.oldIndex, 1)[0])
          let newArray = this.optionsTable.slice(0)
          this.optionsTable = []
          this.$nextTick(function () {
            this.optionsTable = newArray
          })
        }
      });
    },
    // 添加数据
    addChooseList () {
      let newObj = {
        optionName: '',
        optionSort: '',
        optionId: ''
      }
      this.optionsTable.push(newObj);
      this.$nextTick(function () {
        if (this.$refs.level) {
          this.levelSort()
        }
      })
    },
    // 删除数据
    delChooseList (index, val) {
      this.optionsTable.splice(index, 1);
      this.$nextTick(function () {
        if (this.$refs.level) {
          this.levelSort()
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
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
.formList {
  .t-tips {
    font-size: 12px;
    line-height: 1.8em;
  }
  /deep/.el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
}
.move-icon {
  cursor: move;
}
</style>
