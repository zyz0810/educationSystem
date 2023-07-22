<template>
  <div class="app-container">
    <el-form :inline="true"
             :model="listQuery"
             class="search_box mb_10">
      <el-form-item label="服务商名称"
                    prop="balanceSn">
        <el-input v-model.trim="listQuery.agentName"
                  @change="handleFilter"
                  clearable
                  placeholder="请输入服务商名称" />
      </el-form-item>
      <el-form-item label="结算单号"
                    prop="balanceSn">
        <el-input v-model.trim="listQuery.balanceSn"
                  @change="handleFilter"
                  clearable
                  placeholder="请输入结算单号" />
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select v-model="listQuery.balanceStatus"
                   @change="handleFilter"
                   clearable
                   placeholder="请选择结算状态">
          <el-option v-for="(item,index) in balanceOption"
                     :key="index"
                     :label="item.val"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="listQuery.checkStatus"
                   @change="handleFilter"
                   clearable
                   placeholder="请选择审核状态">
          <el-option v-for="(item,index) in checkOption"
                     :key="index"
                     :label="item.val"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生成时间：">
        <el-date-picker v-model="createTime"
                        @change="handleFilter"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间：">
        <el-date-picker v-model="checkTime"
                        @change="handleFilter"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   @click="handleFilter">查询</el-button>
        <el-button icon="el-icon-refresh"
                   @click="resetList">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="container">
      <el-form :inline="true"
               :model="listQuery"
               class="search">
        <el-form-item>
          <el-button class="filter-item"
                     icon="el-icon-finished"
                     v-rules="{admin:'admin',ordinary:'settlement:apply'}"
                     :disabled="isApply"
                     @click="handleSettlement">申请结算</el-button>
          <el-button class="filter-item"
                     icon="iconfont icon-daochu"
                     :disabled="isDisabled"
                     v-rules="{admin:'admin',ordinary:'settlement:export'}"
                     @click="exportView"
                     :loading="exportLoading">导出选中</el-button>
          <el-button class="filter-item"
                     icon="iconfont icon-daochu"
                     :disabled="isDisabled"
                     v-rules="{admin:'admin',ordinary:'service:settle:exportselect'}"
                     @click="exportBalanceDetail"
                     :loading="exportLoading">导出选中明细</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading"
                :data="list"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                @selection-change="(list) => (selectList = list)"
                border
                ref="activityTable"
                :height="tableHeight"
                :row-key="(row) => {return row.id}"
                @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
                highlight-current-row>
        <el-table-column fixed
                         :reserve-selection="true"
                         type="selection"
                         width="40"
                         align="center"></el-table-column>
        <el-table-column fixed
                         label="服务商名称"
                         align="center"
                         prop="providerName"
                         show-overflow-tooltip
                         min-width="180"></el-table-column>
        <el-table-column label="结算单单号"
                         align="center"
                         prop="balanceSn"
                         width="210"></el-table-column>

        <el-table-column fixed="right"
                         label="审核状态"
                         width="120"
                         align="center">
          <template slot-scope="scope">{{ scope.row.checkStatus | filtersCheck}}</template>
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         v-if="permissions.includes('admin') || permissions.includes('settlement:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-rules="{admin:'admin',ordinary:'settlement:view'}"
                       @click.stop="goDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品总额"
                         align="center"
                         prop="payPrice"
                         width="100"></el-table-column>
        <el-table-column label="供应商优惠金额"
                         width="120"
                         align="center"
                         prop="storeCouponPrice">
          <template slot-scope="scope">
            {{((Number(scope.row.storeCouponPrice) + Number(scope.row.storePromotionPrice))).toFixed(2)}}
          </template>
        </el-table-column>
        <!--
          <el-table-column label="余额抵扣"
                         align="center"
                         prop="useRebatePrice"></el-table-column>
     -->
        <el-table-column label="返利扣减"
                         align="center"
                         prop="useRebatePrice"
                         width="100"></el-table-column>
        <el-table-column label="商品实付总额"
                         align="center"
                         prop="realPayPrice"
                         width="130"></el-table-column>
        <el-table-column label="退款金额"
                         align="center"
                         prop="refundPrice"
                         width="120"></el-table-column>
        <el-table-column label="收益总额"
                         align="center"
                         prop="profitPrice"
                         width="120"></el-table-column>
        <el-table-column label="考核达成率(%)"
                         align="center"
                         prop="assessmentRateShow"
                         width="120">
          <!--
            <template slot-scope="scope">
            {{(Number(scope.row.assessmentRate || 0)*100).toFixed(2)}}
          </template>
       -->
        </el-table-column>
        <el-table-column label="保证金还款"
                         width="120"
                         prop="repaymentDeposit"
                         align="center">
        </el-table-column>
        <el-table-column label="应结算金额"
                         align="center"
                         prop="balancePrice"
                         width="120"></el-table-column>
        <el-table-column label="实结算金额"
                         align="center"
                         prop="realBalancePrice"
                         width="120"></el-table-column>
        <el-table-column label="生成时间"
                         width="140"
                         align="center">
          <template slot-scope="scope">{{scope.row.createTime?$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss'):' '}}</template>
        </el-table-column>
        <el-table-column label="审核时间"
                         width="140"
                         align="center">
          <template slot-scope="scope">{{scope.row.checkTime?$moment(scope.row.checkTime).format('YYYY-MM-DD HH:mm:ss'):''}}</template>
        </el-table-column>
        <!--状态0有效1无效-->
        <el-table-column label="状态"
                         align="center"
                         prop="isDelete"
                         width="120">
          <template slot-scope="scope">{{ scope.row.isDelete | filtersIsDelete}}</template>
        </el-table-column>
        <el-table-column label="结算状态"
                         align="center">
          <template slot-scope="scope">{{ scope.row.balanceStatus | filtersBalance }}</template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  class="text-right"
                  @pagination="getList" />
    </div>
    <orders :showDialog.sync="showDetailsDialog"
            :settlementDetail='settlementDetail'></orders>
  </div>
</template>

<script>
import {
  listByPage,
  check,
  exportBalance,
  exportBalanceDetail
} from "@/api/settlementAccount";
import Details from "./details";
import orders from './orders'
import { mapState } from "vuex";
export default {
  components: {
    Details,
    orders
  },
  data () {
    return {
      total: 0,
      isCanAudit: true,
      balanceBtn: true,
      exportBtn: true,
      exportLoading: false,
      list: [],
      listLoading: false,
      listQuery: {
        agentName: '',
        balanceSn: "",
        balanceStatus: "",
        checkStatus: "",
        createStartTime: "",
        createEndTime: "",
        checkStartTime: "",
        checkEndTime: "",
        page: 1,
        limit: 10
      },
      selectList: [],
      updateId: undefined,
      dialogFormVisible: false,
      temp: {
        ids: "",
        remark: ""
      },
      textMap: {
        refuse: "审核不通过原因"
      },
      dialogStatus: "",
      rules: {
        remark: [
          { required: true, message: "请输入审核不通过原因", trigger: "change" }
        ]
      },
      // 结算状态【0-未结算 1-结算成功 2-待确定3-结算中4-结算失败】
      balanceOption: [{
        id: 0,
        val: "未结算"
      }, {
        id: 1,
        val: "结算成功"
      }, {
        id: 2,
        val: "待确定"
      }, {
        id: 3,
        val: "结算中"
      }, {
        id: 4,
        val: "结算失败"
      }],
      // 0待审核1审核通过2审核不通过3待提交
      checkOption: [
        {
          id: 0,
          val: "待审核"
        },
        {
          id: 1,
          val: "审核通过"
        },
        {
          id: 2,
          val: "审核不通过"
        },
        {
          id: 3,
          val: "未提交审核"
        },
      ],
      isActivated: false,
      tableHeight: 200,
      showDetailsDialog: false,
      settlementDetail: {},
    };
  },

  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
    isDisabled () {
      return this.selectList.length < 1;
    },
    isApply () {
      return (
        this.selectList.length < 1 ||
        this.selectList.some(item => [0, 1, 2].includes(item.checkStatus)) ||
        this.selectList.some(item => [1].includes(item.isDelete))
      )
    },
    createTime: {
      get () {
        if (this.listQuery.createStartTime && this.listQuery.createEndTime) {
          return [this.listQuery.createStartTime, this.listQuery.createEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        this.listQuery.createStartTime = v[0] + ' 00:00:00';;
        this.listQuery.createEndTime = v[1] + ' 23:59:59';
      }
    },
    checkTime: {
      get () {
        if (this.listQuery.checkStartTime && this.listQuery.checkEndTime) {
          return [this.listQuery.checkStartTime, this.listQuery.checkEndTime];
        } else {
          return [];
        }
      },
      set (v) {
        this.listQuery.checkStartTime = v[0] + ' 00:00:00';;
        this.listQuery.checkEndTime = v[1] + ' 23:59:59';
      }
    }
  },
  filters: {
    filtersBalance: function (value) {
      let StatusArr = { 0: "未结算", 1: "结算成功", 2: "待确定", 3: "结算中", 4: "结算失败" };
      return StatusArr[value];
    },
    filtersCheck: function (value) {
      let StatusArr = {
        0: "待审核",
        1: "审核通过",
        2: "审核不通过",
        3: "未提交审核"
      };
      return StatusArr[value];
    },
    filtersIsDelete: function (value) {
      let StatusArr = {
        0: "有效",
        1: "无效",
      };
      return StatusArr[value];
    },
  },
  mounted () {
    this.getList();
    // this.$nextTick(() => {
    //   this.tableHeight =
    //     window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
    //   window.onresize = () => {
    //     this.tableHeight =
    //       window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
    //   };
    // });
    this.$nextTick(function () {
      let height = window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height = window.innerHeight - self.$refs.activityTable.$el.offsetTop - 210;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
  },
  methods: {
    goDetail (val) {
      this.settlementDetail = val
      this.showDetailsDialog = true
    },
    resetList () {
      this.listQuery = {
        agentName: '',
        balanceSn: "",
        balanceStatus: "",
        checkStatus: "",
        createStartTime: "",
        createEndTime: "",
        checkStartTime: "",
        checkEndTime: "",
        page: 1,
        limit: 10
      };
      this.$refs.activityTable.clearSelection()  //清空选中
      this.getList();
    },
    exportView () {
      let ids = []
      this.selectList.forEach((item, index) => {
        ids.push(item.id);
      });
      exportBalance({
        ids
      }).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "结算单";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      });
    },
    // 导出结算单明细
    exportBalanceDetail () {
      let balanceSns = []
      this.selectList.forEach((item, index) => {
        balanceSns.push(item.balanceSn);
      });
      exportBalanceDetail({
        balanceSns
      }).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "结算单明细";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      });
    },
    handleFilter () {
      this.$refs.activityTable.clearSelection()  //清空选中
      this.listQuery.page = 1;
      this.getList();
    },
    getList () {
      listByPage(this.listQuery).then(res => {
        this.list = res.data.data;
        this.total = res.data.count;
      });
    },
    // 申请结算
    handleSettlement () {
      this.$confirm("确认提交结算单?", "提示", {
        type: "warning"
      })
        .then(() => {
          let arr = this.selectList.map(item => item.id);
          check({ ids: arr }).then(res => {
            if (res.resp_code == 0) {
              this.getList();
              this.$message({
                message: "申请结算成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => { });
    },
    resetTemp () {
      this.temp = {
        ids: "",
        remark: ""
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background: #ffffff;
  padding: 15px;
}
.search {
  border-color: rgb(233, 233, 233);
  background: #ffffff;
  overflow: hidden;
  padding: 0 !important;
}
/deep/.search_box .el-form-item {
  float: none;
}
/deep/.el-icon-finished {
  font-size: 16px !important;
}
</style>
