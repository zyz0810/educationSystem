<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.key"
                  clearable suffix-icon="el-icon-search"
                  @change="queryCustomerList"
                  placeholder="标题/关键词" />
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.one" placeholder="请选择" @change="queryCustomerList">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in userList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
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
        <el-table-column label="个人姓名"
                         fixed="left"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="storeName">
          <template slot-scope="scope">
            <a class="link link_a link_b"
               @click="toDetail(scope.row)">
              {{ scope.row.storeName }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="ID"
                         min-width="160"
                         align="left"
                         prop="storeSn">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="linkman"></el-table-column>
        <el-table-column label="性别"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="地域"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="个人简介"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="提交时间"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="状态和审核意见"
                         width="100"
                         align="left"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         fixed="right"
                         width="160"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text"
                       @click.stop="handelDetail('detail',scope.row)">详情</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'customer:edit'}"
                       :disabled="scope.row.result == 0"
                       @click.stop="handelDetail('update', scope.row)">同意</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'customer:update:location'}"
                       @click.stop="handleDel(scope.row)">退回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="customerList"
                  class="text-right" />
    </div>
    <!--详情-->
    <detail :showDialog.sync="showDetail"
                    :infoData='infoData'
                    @updateList='customerList' />
  </div>
</template>

<script>
import {customerList,} from "@/api/customer/customer";
import detail from './detail';
export default {
  data () {
    return {
      userList:[],
      listQuery: {
        key: "",
        limit: 10,
        page: 1,
      },
      total: 0,
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
    this.customerList();
  },
  methods: {
    // 修改定位
    handelDetail (type, row) {
      this.showDetail = true
      this.infoData = {
        type:type,
        option:row==''?{}:row,
      }
    },
    // 获取客户列表
    customerList () {
      customerList({ ...this.listQuery, })
        .then(res => {
          // this.dataList = res.data.data;
          this.dataList = [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}];
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },

    queryCustomerList () {
      this.listQuery.page = 1
      this.customerList()
    },
    // 删除单个
    handleDel (id, index) {
      // type,msg,title,option,callback

      this.$MyMessageBox(3,"<span style='margin-left: 35px;'>确定删除该项目？</span>", "确定删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        // type: "info",
        dangerouslyUseHTMLString: true,
        customClass:'del_confirm'
      }).then(res => {
        if (res) {
          // deleteCustomer({ storeIds: [id] }).then(res => {
          //   this.$message({ message: res.resp_msg, type: 'success' });
          //   this.dataList.splice(index, 1);
          // });
        }}).catch();

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
