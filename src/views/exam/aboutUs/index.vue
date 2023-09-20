<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
<!--      <el-form-item label="">-->
<!--        <el-input v-model.trim="listQuery.keyword"-->
<!--                  clearable suffix-icon="el-icon-search"-->
<!--                  @change="queryCustomerList"-->
<!--                  placeholder="标题/关键词" />-->
<!--      </el-form-item>-->
      <el-button type="primary" class="fr mt_10 mb_10" :disabled="dataList.length > 0" @click="handelDetail('create', '')">新建</el-button>
    </el-form>
    <div class="container mt_10">
      <el-table v-loading="listLoading"
                :data="dataList"
                :max-height="tableHeight"
                ref="activityTable"
                :header-cell-style="{ background: '#F8F9FA' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column label="关于我们"
                         min-width="200"
                         align="left"
                         show-overflow-tooltip
                         prop="cover">
          <template slot-scope="scope">
            <div class="flex">
              <viewer :images="[scope.row.logo]">
                <span class="list_img mr5">
                  <img :src="scope.row.logo" />
                </span>
              </viewer>
              {{scope.row.content}}
            </div>

          </template>
        </el-table-column>

        <el-table-column label="更新日期"
                         min-width="160"
                         align="left"
                         show-overflow-tooltip
                         prop="update_time" :formatter="formatTime"></el-table-column>
        <el-table-column label="发布人"
                         min-width="100"
                         align="left"
                         prop="operator">
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="100"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelDetail('detail',scope.row)">详情</el-button>
            <el-button type="text" @click.stop="handelDetail('update', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
    </div>
    <!--修改定位-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData'
                    @updateList='getList' />
  </div>
</template>

<script>
import {getaboutus,} from "@/api/aboutUs";
import detail from './detail';
export default {
  data () {
    return {
      listQuery: {
        keyword: "",
        rn: 10,
        pn: 1,
      },
      listLoading: false,
      selectList: [],
      dataList: [],
      tableHeight: 520,
      showDetail: false,
      infoData: {
        type:'',
        option:{},
      },
    };
  },
  components: {detail},
  computed: {},
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      };
    });
    this.getList();
  },
  methods: {
    formatTime (row, column, cellValue, index) {
      return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    // 修改定位
    handelDetail (type, row) {
      this.showDetail = true
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      }
    },
    // 获取客户列表
    getList () {
      getaboutus()
        .then(res => {
          let json = res.data;
          this.dataList = [json];
        })
        .catch(err => console.log(err));
    },

  },
};
</script>

<style lang="scss" scoped>

/deep/.border-card {
  margin-top: 10px !important;
}
.iconfont::before {
  margin-right: 4px;
  font-size: 12px;
}
.filter-item {
  height: 38px;
}
/deep/.search_box .el-form-item {
  float: none;
}
</style>
