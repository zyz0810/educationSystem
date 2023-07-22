<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             @close="close"
             @open="open"
             :title="textMap[option.operatorType]">
    <div class="addFieid-box">
      <el-tabs el-tabs
               :tab-position="tabPosition"
               v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane :label="item.name"
                     v-for="(item,index) in datas"
                     :key="index"
                     :name="item.dictLabel">
          <formList :activeName='activeName'
                    :dictLabel.sync="item.dictLabel"
                    :dictName.sync="item.dictName"
                    :fieldDesc.sync="item.dictValue.fieldDesc"
                    :must.sync="item.dictValue.must"
                    :fieldLength.sync="item.dictValue.fieldLength"
                    :fieldMin.sync="item.dictValue.fieldMin"
                    :inputTip.sync="item.dictValue.inputTip"
                    :options.sync="item.dictValue.options"></formList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="modify">保 存</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import { fieldSave, getFieldDictValue } from "@/api/system/config";
import formList from './formList'
export default {
  components: {
    formList
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
        operatorType: "add",
        option: {}
      }
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
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
      datas: [
        {
          name: '单行文本', dictLabel: 'input', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldMin: '', fieldDesc: '', dictName: '', dictSort: ''
          },
        },
        {
          name: '多行文本', dictLabel: 'text_area', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldMin: '', fieldDesc: '',
          }, dictName: '', dictSort: ''
        },
        {
          name: '单选输入', dictLabel: 'radio', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '多选输入', dictLabel: 'check_box', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '下拉单选', dictLabel: 'select', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '图片上传', dictLabel: 'image', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
          }, dictName: '', dictSort: ''
        },
        // {
        //   name: '附件上传', dictLabel: 'file_upload', dictValue: {
        //     inputTip: '', must: false, fieldLength: '', fieldDesc: '',
        //   }, dictName: '', dictSort: ''
        // },
      ],
      checkList: ['选中且禁用', '复选框 A'],
      activeName: 'input',
      tabPosition: 'left',
      customerLevelList: [
        {}, {}
      ],
      value: ''
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
  mounted () {

  },
  methods: {
    // tab切换
    handleClick (tab, event) {
      this.activeName = tab.name
    },
    modify () {
      const datas = this.datas.filter(item => item.dictName)
      if (datas.length < 1) {
        this.$message({
          message: "请填写字段的显示名称",
          type: "warning"
        });
        return
      }
      fieldSave({ datas })
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
    },
    close () {
      this.datas = [
        {
          name: '单行文本', dictLabel: 'input', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '', dictName: '', dictSort: ''
          },
        },
        {
          name: '多行文本', dictLabel: 'text_area', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
          }, dictName: '', dictSort: ''
        },
        {
          name: '单选输入', dictLabel: 'radio', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '多选输入', dictLabel: 'check_box', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '下拉单选', dictLabel: 'select', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
            options: [
              // { optionId: '', optionName: '', optionSort: '', }
            ]
          }, dictName: '', dictSort: ''
        },
        {
          name: '图片上传', dictLabel: 'image', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
          }, dictName: '', dictSort: ''
        },
        {
          name: '附件上传', dictLabel: 'file_upload', dictValue: {
            inputTip: '', must: false, fieldLength: '', fieldDesc: '',
          }, dictName: '', dictSort: ''
        },
      ]
      this.activeName = 'input'
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
  height: 480px;
  overflow-y: scroll;
}
</style>
