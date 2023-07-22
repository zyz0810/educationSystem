<template>
  <div class="app-container">
    <div class="mt10 p_10 bg_white">
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-plus"
                 v-rules="{admin:'admin',ordinary:'manage:classify:add'}"
                 @click="addStaff('add')">新增</el-button>
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                border
                :height="tableHeight"
                ref="activityTable"
                @row-click="  (row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column label="ID"
                         align="center"
                         prop="id"></el-table-column>
        <el-table-column label="分类名称"
                         align="center"
                         prop="productSortName"></el-table-column>
        <el-table-column label="关联商品类目"
                         align="center"
                         min-width="180"
                         show-overflow-tooltip
                         prop="productCateGory">
          <template slot-scope="scope">
            <span v-for='(item,index) in scope.row.productCateGory'
                  :key='index'>
              {{item.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         prop="remarks"
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'manage:classify:view'}"
                       @click.stop="addStaff('view',scope.row.id,scope.row)">详情</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'manage:classify:edit'}"
                       @click.stop="addStaff('update',scope.row.id,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @pagination="getList"
                  v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right" />
      <addStaff ref="child"
                :showDialog.sync="showAddDialog"
                @modify="getList"
                :id='id'
                :option="optionType" />
    </div>
  </div>
</template>

<script>
import addStaff from "./add";
import {
  selectProductSortPage,
} from "@/api/classManagement";
export default {
  components: {
    addStaff,
  },
  data () {
    return {
      optionType: "",
      showAddDialog: false,
      listQuery: {
        limit: 10,
        page: 1
      },
      dataList: [],
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      tableHeight: 400,
      id: '',
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 200;
      };
    });
    this.getList(); // 分类设置列表
  },
  computed: {
  },
  methods: {
    // 分类设置列表
    getList () {
      selectProductSortPage(this.listQuery)
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count || 0;
        })
        .catch(err => console.log(err));
    },
    // 新增编辑员工
    addStaff (val, id, val3) {
      //操作中的编辑
      this.optionType = val;
      this.showAddDialog = true;
      this.id = id
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
