<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%"
             @close="close"
             :append-to-body="true"
             top="10vh"
             class="dialogContainer"
             @open="open"
             :title='optionValue == "edit" ? "设置服务商销售业绩" : "查看服务商销售业绩"'>
    <div class="dialog-button"
         v-if='optionValue == "edit"'>
      <el-button type="primary"
                 @click="add">新增</el-button>
    </div>
    <el-table :data="dataList"
              border
              height="300">
      <el-table-column min-width="110"
                       label="商品类目（发布分类）"
                       align="center">
        <template slot-scope="scope">
          <el-select placeholder="请选择商品类目"
                     filterable
                     @focus="querySelect"
                     :disabled='optionValue != "edit"'
                     v-model="scope.row.productSortId"
                     clearable>
            <el-option v-for="(item, index) in userOptions"
                       :key="index"
                       :disabled="item.disabled"
                       :label="item.productSortName"
                       :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="target"
                       align="center"
                       label="销售业绩（元）">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.performanceTarget"
                    type="number"
                    :disabled='optionValue != "edit"'
                    @mousewheel.native.prevent
                    placeholder="请输入"
                    clearable />
        </template>
      </el-table-column>
      <el-table-column prop="realComplate"
                       align="center"
                       label="权重（%）">
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.performanceWeight"
                    type="number"
                    :disabled='optionValue != "edit"'
                    @mousewheel.native.prevent
                    placeholder="请输入"
                    clearable />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer"
          v-if='optionValue == "edit"'
          class="page_footer">
      <el-button type="primary"
                 @click="save">保存</el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </my-dialog>
</template>

<script> 
import {
  selectProductSortPage,
} from "@/api/classManagement";
export default {
  components: {
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false,
    },
    optionValue: {
      required: true,
      type: String,
      default: '',
    },
    settingPerformance: {
      required: true,
      type: Array,
      default: () => { return [] }
    },
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10,
      },
      dataList: [{}],
      userOptions: [],
    };
  },
  mounted () {

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
    // 分类设置列表
    getList () {
      selectProductSortPage({ page: 1, limit: 9999 })
        .then(res => {
          this.userOptions = res.data.data;
        })
        .catch(err => console.log(err));
    },
    // 下拉查询
    querySelect () {
      const arrs = this.userOptions.map(item => {
        const data = this.dataList.find((i) => item.id == i.productSortId)
        return {
          ...data,
          ...item,
          disabled: data ? true : false
        }
      })
      this.userOptions = arrs
    },
    // 保存
    save () {
      // 先判断空在判断和
      const dataList = this.dataList.filter(item => item.productSortId)
      let getNull = dataList.filter(item => !item.performanceTarget || !item.performanceWeight)
      if (getNull.length != 0) {
        return this.$message({ message: "请完善销售业绩或权重", type: "warning" });
      }
      let weights = dataList.reduce((p, e) => Number(p) + Number(e.performanceWeight), 0);
      if (weights != 100) {
        return this.$message({ message: "当前所有商品类目权重总和不等于100，请重新输入", type: "warning" });
      }
      // console.log(this.dataList)
      // const arr = this.dataList.map((item, index) => {
      //   const data = this.userOptions.find((i) => item.productSortId == i.id)
      //   return {
      //     ...data,
      //     ...item,
      //   }
      // })
      // const aaa = arr.map((item, index) => {
      //   return {
      //     productSortId: item.productCateGory[0].id,
      //     performanceWeight: item.performanceWeight,
      //     performanceTarget: item.performanceTarget,
      //   }
      // })
      // console.log(aaa)
      this.$emit('settingPerformanceInfo', this.dataList)
      this.dialogVisible = false;
    },
    //新增
    add () {
      this.querySelect()
      this.dataList.push({})
    },
    open () {
      this.dataList = this.settingPerformance
      this.getList()
      this.querySelect()
    },
    close () {
      Object.assign(this.listQuery, {
        page: 1,
        limit: 10,
      });
      this.dataList = []
      this.dialogVisible = false;
    },

  },
};
</script>

 <style lang='scss' scope>
/deep/.el-dialog__body {
  padding: 20px 20px 0px;
}
.dialog-button {
  display: flex;
  margin: 0px 0px 20px 0px;
}
</style>