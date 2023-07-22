<template>
  <div>
    <!--
       @node-click="aa"
        show-checkbox
         @node-click="handleNodeClick"
  -->
    <div style="height: 45vh; overflow: auto">
      <el-tree :props="props"
               :data="treeList"
               node-key="id"
               ref="tree"
               :expand-on-click-node="true"
               @node-click="handleNodeClick"
               @check-change="save"></el-tree>
    </div>
    <!--
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="close">取 消</el-button>
    </span>
     -->

  </div>
</template>

<script>
// import { getTreeOptions } from "@/utils/common";
import {
  findAreaChilds,
  saveOrUpdateArea,
  deleteArea,
  findAreaTree,
} from "@/api/area";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    treeList: {
      required: true,
      type: Array,
      default: [],
    },
    // checkTreeList: {
    //   required: false,
    //   type: Array,
    //   default: [],
    // },
  },
  data () {
    return {
      props: {
        label: "name",
        children: "childrens",
        // disabled: this.checkDisabled
      },
      listQuery: {
        limit: 10,
        page: 1,
        name: "",
        goodsSn: "",
        mnemonicCode: "",
        isMarketable: 1,
        result: 1,
        skuCode: "",
      },
      total: 0,
      selectList: [],
      dataList: [],
      listLoading: false,
      streetSelect: [],
      streetList: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      provinceActive: 0,
      cityActive: 0,
      areaActive: 0,
      // treeList:[]
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      },
    },
  },
  methods: {
    handleNodeClick (val) {
      let data = [val]
      let arr = [];
      function getIdFn (data) {
        data.forEach(item => {
          arr.push(item.id)
          if (item.hasOwnProperty("childrens")) {
            getIdFn(item.childrens)
          }
        })
        return arr
      }
      let res = getIdFn(data)
      this.$emit("insertAreas", res);
    },
    save () {
      const customerRangeId = this.$refs.tree
        .getCheckedNodes(true)
        .map((item) => {
          let json = {
            id: item.id,
            fullName: item.fullName,
          };
          return json;
        });
      const areaIdList = customerRangeId.map((item, index) => {
        return item.id
      })
      this.$emit("insertAreas", areaIdList);
    },
    childmethod (e) {
      this.$refs.tree.setCheckedKeys([]);
    },
    getArea () {
      findAreaTree().then((res) => {
        this.treeList = res.data;
      });
    },
    open () {
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys(this.checkTreeList);
      });
    },
    close () {
      Object.assign(this.listQuery, {
        limit: 10,
        page: 1,
        name: "",
        mnemonicCode: "",
        goodsSn: "",
        isMarketable: 1,
        skuCode: "",
      });
      this.streetSelect = [];
      this.dialogVisible = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    formatStatus (row, column, cellValue, index) {
      return cellValue == 0
        ? "下架"
        : cellValue == 1
          ? "上架"
          : cellValue == 2
            ? "售罄"
            : "";
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/styles/variables.scss";
.el-form-item--mini.el-form-item {
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button:nth-child(2) {
    margin-left: 30px;
  }
}
.el-form {
  padding: 0 20px;
}
.area_list {
  border: 1px solid #f4f4f4;
  & > div {
    border-right: 1px solid #f8f8f8;
    p {
      padding: 0 10px;
      margin: 0;
      line-height: 3;
      &.area_title {
        background: #f4f4f4;
      }
      &.active {
        color: #fff;
        // background: $baseColor;
      }
    }
  }
  .area_cont {
    /*padding: 0 10px;*/
    min-width: 200px;
    height: 400px;
    overflow: auto;
    .el-checkbox-group {
      padding: 0 10px;
    }
    p {
      cursor: pointer;
    }
    .el-checkbox {
      line-height: 3;
    }
  }
}
.chooseAera {
  text-align: center;
  background: #eee;
  height: 30px;
  line-height: 30px;
}
// /deep/.el-checkbox {
//   display: none;
// }
</style>
