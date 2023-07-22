<template>
  <div class>
    <el-table v-loading="listLoading"
              class="mt_20"
              :data="dataList"
              :height="tableHeight"
              ref="activityTable"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              border
              @row-click="(row, column, event) => {$refs.activityTable.toggleRowSelection(row)}"
              highlight-current-row>
      <el-table-column label="线索名称"
                       fixed="left"
                       align="center"
                       show-overflow-tooltip
                       min-width='100'
                       prop="name">
        <template slot-scope="scope">
          <a class="link"
             v-if="permissions.includes('admin') ||permissions.includes('clue:view')"
             @click="goDetail(scope.row)">
            {{ scope.row.name }}
          </a>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人"
                       align="center"
                       show-overflow-tooltip
                       min-width='100'
                       prop="linkman"></el-table-column>
      <el-table-column label="手机号"
                       show-overflow-tooltip
                       min-width='100'
                       align="center"
                       prop="telephone">
      </el-table-column>
      <el-table-column label="客户地址"
                       min-width="220"
                       show-overflow-tooltip
                       align="center"
                       prop="address">
        <template slot-scope="scope">
          <a class="link"
             @click="showMap('look',scope.row)">
            {{ scope.row.address }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="线索状态"
                       align="center"
                       :formatter="formatStatus"
                       prop="status"></el-table-column>
      <el-table-column label="负责人"
                       align="center"
                       show-overflow-tooltip
                       min-width='100'
                       prop="userName"></el-table-column>
      <el-table-column label="创建时间"
                       width="140"
                       align="center"
                       :formatter="formatTime"
                       prop="createTime"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       fixed="right"
                       width="120"
                       prop="remarks">
        <template slot-scope="scope">
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'clue:view'}"
                     @click.stop="goDetail(scope.row)">详情</el-button>
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'clue:customer'}"
                     @click.stop="addCustomer('transform', scope.row.id,scope.row.result)">转为客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="clueList"
                class="text-right" />
    <!--新建客户 -->
    <addCustomer :showDialog.sync="showAddDialog"
                 :typeOptions="typeOptions"
                 :option="option"
                 :title="title"
                 ref="child"
                 :levelOptions="levelOptions"
                 @modify="clueList"
                 :sourceOptions="sourceOptions"
                 :detailId="detailId" />
    <!--线索详情 -->
    <detail :showDialog.sync="showDetailDialog"
            :detailId="detailId"></detail>
    <!--新建客户 -->
    <Map :showDialog.sync="showMapDialog"
         :option="mapType"></Map>
  </div>
</template>

<script>
import addCustomer from "../customerList/add";
import detail from "./detail";
import {
  usable,
} from "@/api/customer/customer";
import {
  clueList
} from "@/api/clue";
import { dict } from "@/api/common";
import { mapState } from "vuex";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    searchType: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  components: {
    addCustomer,
    detail,
  },
  data () {
    return {
      customer: 1,
      listLoading: false,
      showAddDialog: false,
      showTaskDialog: false,
      showFollowDialog: false,
      showTransferDialog: false,
      showDistributionDialog: false, //转移客户弹窗
      dialogVisible: false,
      dataList: [],
      total: 0,
      selectList: [],
      dialogComponents: false,
      titlleDialog: "",
      contentDialog: "",
      operationValue: "",
      typeOptions: [],
      levelOptions: [],
      sourceOptions: [],
      visitOptions: [], //拜访记录
      option: "",
      id: '',
      title: "转为客户",
      tableHeight: 520,
      customerCrmId: '',
      showDetailDialog: false,//详情弹窗
      detailId: '',
      showMapDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
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
    // 不可批量导出
    isExport () {
      return this.selectList.length >= 1;
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 370;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 370;
      };
    });
    this.usable(); //客户列表中客户类型接口
    this.getSource();
    this.getLevel();
    this.getVisit();
    // 防止table错位
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
    this.clueList()
  },
  methods: {
    showMap (val, row) {
      let clueLngAndLat = row.clueLngAndLat.split(',')
      this.mapType = {
        operatorType: val,
        option: {
          signAddressLatitude: clueLngAndLat[1],
          signAddressLongitude: clueLngAndLat[0],
          signAddress: row.address
        }
      };
      this.showMapDialog = true
    },
    // 转为客户
    addCustomer (val, id, result) {
      this.option = val;
      this.detailId = id
      this.showAddDialog = true;
    },
    // 查看线索详情
    goDetail (row) {
      this.detailId = row.id
      this.showDetailDialog = true;
    },
    callBack () {
      if (this.tab == "first") {
        this.$refs.followLog.getCustomerFollow();
      }
    },
    // 客户跟进类型
    getVisit () {
      let data = {
        dictType: "customer_follow"
      };
      dict(data)
        .then(res => {
          this.visitOptions = res.data[0].dataList;
        })
        .catch(err => console.log(err));
    },
    // 客户来源
    getSource () {
      let data = {
        dictType: "customer_source"
      };
      dict(data)
        .then(res => {
          this.sourceOptions = res.data[0].dataList;
        })
        .catch(err => console.log(err));
    },
    // 客户级别
    getLevel () {
      let data = {
        dictType: "customer_level"
      };
      dict(data)
        .then(res => {
          this.levelOptions = res.data[0].dataList;
          this.$emit("levelValue", this.levelOptions);
        })
        .catch(err => console.log(err));
    },
    // 客户列表中客户类型接口
    usable () {
      usable()
        .then(res => {
          this.typeOptions = res.data.data;
          this.$emit("typeValue", this.typeOptions);
        })
        .catch(err => console.log(err));
    },
    // 获取客户列表
    clueList () {
      this.listQuery.endTime = this.listQuery.endTime
      clueList({ ...this.listQuery, searchType: this.searchType })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    // 状态格式化
    formatStatus (row, column, value, index) {
      return value == 0
        ? "待转客户"
        : value == 1
          ? "已转客户"
          : "--";
    },
    // 时间格式化
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    toggleRowSelection () { },
  }
};
</script>

<style lang="scss" scope>
.link {
  color: #1890ff;
  text-decoration: underline;
}
</style>
