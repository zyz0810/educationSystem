<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="50 %"
             @close="close"
             @open="open"
             :title="textMap[option]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="150px"
             :rules="rules"
             class="formList">
      <el-form-item label="分类名称"
                    prop="productSortName">
        <el-input v-model.trim="formData.productSortName"
                  maxlength=18
                  placeholder="请输入分类名称"
                  clearable />
      </el-form-item>
      <el-form-item label="关联商品类目"
                    prop="productCategoryIds">
        <el-checkbox-group v-model="formData.productCategoryIds">
          <el-checkbox v-for='(item,index) in dataList'
                       :disabled="option == 'view'"
                       :key='index'
                       :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer"
          v-if="option != 'view'"
          class="dialog-footer">
      <el-button type="primary"
                 :loading="load"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script> 
import {
  selectAllProductCategory,
  saveOrUpdate,
  selectProductSortDetail,
} from "@/api/classManagement";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: String,
      default: "add"
    },
    id: {
      required: false,
      type: String / Number,
      default: ""
    },
  },
  data () {
    return {
      textMap: {
        add: "新建分类",
        update: "编辑分类",
        view: "查看分类"
      },
      formData: {
        id: "", //编辑id
        productSortName: "",
        productCategoryIds: [],
      },
      load: false,
      rules: {
        productSortName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        productCategoryIds: [
          { required: true, message: "请选择关联商品类目", trigger: "blur" },
        ],
      },
      dataList: [],
      idsList: []
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
    // 新增
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.load = true
          saveOrUpdate(this.formData)
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.load = false
                this.dialogVisible = false;
                this.$emit("modify");
              } else {
                this.$message({ message: res.resp_msg, type: "warning" });
              }
            })
            .catch(err => {
              this.load = false
            });
        } else {
          return false;
        }
      });
    },
    // 获取所有一级商品等级名称
    selectAllProductCategory () {
      selectAllProductCategory()
        .then(res => {
          this.$nextTick(() => {
            this.dataList = res.data || []
            if (this.option != 'add') {
              this.dataList = [...this.idsList, ...this.dataList,]
            }
            if (this.option == 'view') {
              this.dataList = [...this.idsList]
            }
          })
        })
        .catch(err => {
          this.load = false
        });
    },
    // 查询详情
    selectProductSortDetail () {
      selectProductSortDetail({ id: this.id })
        .then(res => {
          this.formData.productSortName = res.data.productSortName
          this.idsList = res.data.productCategoryIds
          this.$nextTick(() => {
            this.selectAllProductCategory()
            let idsStr = res.data.productCategoryIds.map(function (obj, index) {
              return obj.id;
            }).join(",").split(',');
            this.formData.productCategoryIds = idsStr.map(Number)
            this.dataList = [...res.data.productCategoryIds, ...this.dataList,]
            if (this.option == 'view') {
              this.dataList = [...res.data.productCategoryIds]
            }
          })
        })
        .catch(err => {
          this.load = false
        });
    },
    open () {
      this.selectAllProductCategory()
      if (this.option != 'add') { //查看详情
        this.formData.id = this.id
        this.selectProductSortDetail()
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: "", //编辑id
        productSortName: "",
        productCategoryIds: []
      });
      this.dataList = []
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 40px;
  .choose-input {
    border: 1px solid #dedede;
    padding: 0px 10px;
    box-sizing: border-box;
  }
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
.address-tab {
  position: absolute;
  top: 38px;
  left: 0;
  width: 400px;
  z-index: 2003;
  /deep/.el-tabs__content {
    height: 180px;
    overflow-y: scroll;
    max-height: 180px !important;
    overflow: auto;
    padding: 15px 0 15px 15px !important;
  }
}
</style>
