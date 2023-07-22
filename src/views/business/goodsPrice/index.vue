<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="名称"
                    prop="name">
        <el-input v-model.trim="listQuery.name"
                  @change="queryGetList"
                  placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="状态"
                    prop="status">
        <el-select v-model="listQuery.status"
                   filterable
                   @change="queryGetList"
                   placeholder="请选择状态">
          <el-option v-for="item in statusOption"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="dateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="请选择时间"
                        @change="queryGetList"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="queryGetList">查询</el-button>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="mt10 p_10 bg_white">
      <el-button class="filter-item ml_10"
                 icon="el-icon-plus"
                 v-rules="{admin:'admin',ordinary:'price:strategy:add'}"
                 @click="handleAdd('add','')">新增</el-button>
      <el-button class="filter-item ml_10"
                 :disabled="isCanDown"
                 icon="el-icon-lock"
                 v-rules="{admin:'admin',ordinary:'price:strategy:disable'}"
                 @click="handleEnable('')">禁用</el-button>
      <el-table v-loading="listLoading"
                :data="list"
                :header-cell-style="{background:'#f5f7fa'}"
                element-loading-text="拼命加载中"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                border
                fit
                ref="activityTable"
                @row-click="(row,column,event)=>{$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row
                class="mt_20">
        <el-table-column type="selection"
                         width="40"
                         align="center"
                         fixed></el-table-column>
        <el-table-column label="名称"
                         min-width="120"
                         show-overflow-tooltip
                         align="center"
                         prop="name"></el-table-column>
        <el-table-column label="时间"
                         align="center"
                         min-width="260">
          <template slot-scope="scope">
            <span>{{$moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss')}}至{{$moment(scope.row.endTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         min-width="80"
                         align="center"
                         prop="status">
          <template slot-scope="scope">
            {{scope.row.status | filtersStatus}}
          </template>
        </el-table-column>
        <el-table-column label="商品"
                         align="center"
                         min-width="300"
                         show-overflow-tooltip
                         prop="products"></el-table-column>
        <el-table-column label="操作"
                         min-width="140"
                         align="center"
                         v-if="permissions.includes('admin') || permissions.includes('price:strategy:view') || permissions.includes('price:strategy:edit') || permissions.includes('price:strategy:disable') "
                         fixed="right">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'price:strategy:view'}"
                       @click.stop="handleAdd('view',scope.row)">查看</el-button>
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'price:strategy:edit'}"
                       :disabled='[1,2].includes(scope.row.agentCheckStatus)'
                       @click.stop="handleAdd('update',scope.row)">编辑</el-button>
            <!--          <el-button type="text"-->
            <!--                     :disabled='[1,2].includes(scope.row.agentCheckStatus)'-->
            <!--                     @click.stop="handleLog(scope.row)">日志</el-button>-->
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'price:strategy:disable'}"
                       :disabled='[0].includes(scope.row.status)'
                       @click.stop="handleEnable(scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="getList"
                  class="text-right" />
    </div>
    <addPrice :showDialog.sync="dialogVisible"
              :priceData="priceData"
              @insertPrice="getList" />
    <log :showDialog.sync="dialogLogVisible"
         :logData="logData" />
  </div>
</template>
<script>
import addPrice from "./addPrice";
import log from "./log";
import { productPriceList, productPriceStatus, productPriceLog } from "@/api/productPriceSale";
import Pagination from "@/components/Pagination/index";
import { mapState } from "vuex";
export default {
  name: "goodsPrice",
  components: {
    Pagination,
    addPrice,
    log
  },
  data () {
    return {
      // "状态： 未开始-1，进行中1，禁用0，已结束，2"
      statusOption: [{
        id: -1,
        name: '未开始'
      }, {
        id: 1,
        name: '进行中'
      }, {
        id: 2,
        name: '已结束'
      }, {
        id: 0,
        name: '禁用'
      }],
      logData: {
        name: "",
        operatorType: "add",
        id: ""
      },
      dialogLogVisible: false,
      dialogVisible: false,
      total: 0,
      list: null,
      listLoading: false,
      listQuery: {
        name: "",
        status: "",
        startTime: '',
        endTime: '',
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      isActivated: false,
      selectList: [],
      updateBtn: true,
      deleteBtn: true,
      examBtn: true,
      tableHeight: "400",
      priceData: {
        id: "",
        operatorType: "",
        option: ""
      },
    };
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    dateTime: {
      get () {
        if (this.listQuery.startTime && this.listQuery.endTime) {
          return [this.listQuery.startTime, this.listQuery.endTime]
        } else {
          return []
        }
      },
      set (v) {
        if (v) {
          this.listQuery.startTime = v[0] + ' 00:00:00';
          this.listQuery.endTime = v[1] + ' 23:59:59';
        } else {
          this.listQuery.startTime = "";
          this.listQuery.endTime = "";
        }
      }
    },
    // 撤销服务
    isCanDown () {
      return !(
        this.selectList.length == 1 && this.selectList[0].status != 0
      );
    },
  },
  filters: {
    filtersStatus: function (value) {
      // "状态： 未开始-1，进行中1，禁用0，已结束，2"
      let StatusArr = { '-1': "未开始", 0: "禁用", 1: "进行中", 2: "已结束" };
      return StatusArr[value];
    }
  },
  async mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 180;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 180;
      };
    });
    this.getList();
    await this.$on("hook:activated", () => {
      if (this.isActivated) {
        this.getList();
      }
    });
    this.isActivated = true;
  },
  methods: {
    queryGetList () {
      this.listQuery.page = 1
      this.getList()
    },
    resetList () {
      this.listQuery = {
        name: "",
        status: "",
        page: 1,
        limit: 10
      };
      this.getList();
    },
    handleSelectionChange (val) {
      this.selectList = val;
      let arr = this.selectList.filter(item => item.result == "1");
      if (arr.length > 0) {
        this.examBtn = true;
      } else {
        this.examBtn = false;
      }
      if (val.length > 1) {
        this.updateBtn = true;
        this.deleteBtn = false;
      } else if (val.length == 1) {
        this.updateBtn = false;
        this.deleteBtn = false;
      } else {
        this.updateBtn = true;
        this.deleteBtn = true;
        this.examBtn = true;
      }
    },
    getList () {
      productPriceList(this.listQuery).then(res => {
        this.list = res.data.data;
        this.total = res.data.count;
      });
    },

    goView () {
      // this.$router.push({
      //   path: "/product/view",
      //   query: { id: this.rowInfo[0].id }
      // });
      let id = "";
      if (value != "add") {
        id = this.selectList[0].id;
      }
      Object.assign(this.priceData, {
        operatorType: value,
        id,
        option: ""
      });
      this.dialogVisible = true;
    },
    handleAdd (type, val) {
      let id = "";
      if (val != "add") {
        id = val.id;
      }
      Object.assign(this.priceData, {
        operatorType: type,
        id,
        option: ""
      });
      this.dialogVisible = true;
    },

    handleEnable (val) {
      this.$confirm("确定禁用吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let param = {}
          if (val.id) {
            param = { id: val.id, status: 0 }
          } else {
            param = { id: this.selectList[0].id, status: 0 }
          }
          productPriceStatus(param).then(res => {
            this.listLoading = false;
            if (res.resp_code == 0) {
              this.getList();
              //NProgress.done();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleLog () {
      this.logData = {
        name: this.selectList[0].name,
        operatorType: "view",
        id: this.selectList[0].id
      }
      this.logName = this.selectList[0].name;
      this.dialogLogVisible = true
    },
    resetTemp () {
      this.temp = {
        // id: undefined,
        name: "",
        address: ""
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 80px);
  overflow: auto;
  box-sizing: border-box;
}
/deep/.search_box .el-form-item {
  float: none;
}
</style>
