<template>
  <my-dialog title="选择部门" :append-to-body="true" :visible.sync="dialogVisible">
    <template>
      <div class="dialog-title">
        <i class="el-icon-caret-bottom"></i>公司名称
      </div>
      <el-radio-group v-model="radio2" class="radio-box">
        <el-radio
          v-for="(item, index) in departmentList"
          @change="chooseDepartment(item)"
          :key="index"
          :label="item.id"
        >{{ item.deptName }}</el-radio>
      </el-radio-group>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </my-dialog>
</template>

<script>
import { findDeptTree } from "@/api/system/staff";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFullscreen: false,
      departmentList: [],
      radio2: ""
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.showDialog;
      },
      set(value) {
        this.$emit("update:showDialog", value);
      }
    }
  },
  mounted() {
    this.findDeptTree();
  },
  methods: {
    // 查询部门树
    findDeptTree() {
      findDeptTree()
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 父组件传值
    chooseDepartment(item) {
      this.$emit("depart", item);
    },
    open() {
      this.$emit("open");
    },
    close() {
      this.dialogVisible = false;
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
i {
  font-size: 20px;
}
.dialog-title {
  margin-bottom: 10px;
  margin: 0px 0px 10px 10px;
  font-size: 17px;
}
.radio-box {
  label {
    display: block;
    height: 35px;
    line-height: 35px;
    margin-left: 40px;
  }
}
</style>
