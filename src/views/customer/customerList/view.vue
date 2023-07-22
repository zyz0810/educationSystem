  <template>
  <div class>

    <el-table v-loading="listLoading"
              :row-class-name="tableRowClassName"
              :data="dataList"
              :max-height="tableHeight"
              ref="activityTable"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"

              @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
              highlight-current-row>
      <el-table-column type="selection"
                       width="55"></el-table-column>
      <el-table-column label="客户名称"
                       fixed="left"
                       width="120"
                       align="center"
                       show-overflow-tooltip
                       prop="storeName">
        <template slot-scope="scope">
          <a class="link link_a link_b"
             @click="toDetail(scope.row)">
            {{ scope.row.storeName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="客户编号"
                       min-width="160"
                       align="center"
                       prop="storeSn">
      </el-table-column>
      <el-table-column label="联系人"
                       min-width="100"
                       align="center"
                       show-overflow-tooltip
                       prop="linkman"></el-table-column>
      <el-table-column label="手机号"
                       width="100"
                       align="center"
                       prop="mobile">
      </el-table-column>
      <el-table-column label="联系方式"
                       width="100"
                       align="center"
                       prop="telephone">
      </el-table-column>
      <el-table-column label="客户类型"
                       align="center"
                       show-overflow-tooltip
                       prop="customerTypeStr"></el-table-column>
      <el-table-column label="证件状态"
                       align="center"
                       :formatter="formatCertificateStatusCrm"
                       prop="certificateStatusCrm"></el-table-column>
      <el-table-column label="客户级别"
                       align="center"
                       prop="storeLevelStr"></el-table-column>
      <el-table-column label="客户来源"
                       align="center"
                       prop="sourceStr"></el-table-column>
      <el-table-column label="负责人"
                       align="center"
                       width="120"
                       show-overflow-tooltip
                       prop="clerkName"></el-table-column>
      <el-table-column label="客户状态"
                       align="center"
                       :formatter="formatterEnabled"
                       prop="enabled"></el-table-column>
      <el-table-column label="审核状态"
                       align="center"
                       :formatter="formatAuditStatus"
                       prop="result">
        <template slot-scope="scope">
          <div v-if="scope.row.result == 0">审核中</div>
          <div v-if="scope.row.result == 1">已通过</div>
          <el-button type="text"
                     v-if="scope.row.result == 2"
                     @click.stop="showReason(scope.row.failedReason)">审核失败</el-button>
        </template>
      </el-table-column>
      <el-table-column label="成交状态"
                       align="center"
                       :formatter="formatStatus"
                       prop="bargain"></el-table-column>
      <el-table-column label="下单状态"
                       align="center"
                       :formatter="formatOrderStatus"
                       prop="orderStatus"></el-table-column>
      <el-table-column label="最后拜访时间"
                       width="140"
                       align="center"
                       prop="signTime"></el-table-column>
      <el-table-column label="最后下单时间"
                       width="140"
                       align="center"
                       prop="orderTime"></el-table-column>
      <el-table-column label="最后跟进时间"
                       width="140"
                       align="center"
                       prop="followTime"></el-table-column>
      <el-table-column label="更新时间"
                       width="140"
                       align="center"
                       prop="updateTime"></el-table-column>
      <el-table-column label="创建时间"
                       width="140"
                       align="center"
                       prop="createTime"></el-table-column>
      <el-table-column label="领取时间"
                       width="140"
                       align="center"
                       prop="claimTime"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       fixed="right"
                       width="160"
                       prop="remarks">
        <template slot-scope="scope">
          <el-button type="text"
                     @click="editorNewFollow(scope.row.id)">跟进</el-button>
          <el-button type="text"
                     @click.stop="toDetail(scope.row)">详情</el-button>
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'customer:edit'}"
                     :disabled="scope.row.result == 0"
                     @click.stop="addCustomer('edit', scope.row.id,scope.row.result)">编辑</el-button>
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'customer:update:location'}"
                     @click.stop="modifyLocation(scope.row)">定位</el-button>
          <!--          <el-button type="text"-->
          <!--                     v-rules="{admin:'admin',ordinary:'customer:del'}"-->
          <!--                     :disabled="scope.row.result == 1"-->
          <!--                     @click="deleteRow(scope.row.customerStoreId, scope.$index)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="customerList"
                class="text-right" />
    <!--新建客户 -->
    <addCustomer :showDialog.sync="showAddDialog"
                 :typeOptions="typeOptions"
                 :option="option"
                 :title="title"
                 ref="child"
                 :levelOptions="levelOptions"
                 @modify="customerList"
                 :sourceOptions="sourceOptions" />
    <!--新建任务-->
    <addTask :showDialog.sync="showTaskDialog"
             @modify="customerList" />
    <!--新建任务-->
    <transfer :showDialog.sync="showTransferDialog"
              @modify="customerList" />
    <!-- 跟进弹窗
      <follow
        :showDialog.sync="showFollowDialog"
        :visitOptions="visitOptions"
        @modify="customerList"
      />-->
    <addFollow :showDialog.sync="showFollowDialog"
               :customerCrmId="customerCrmId"
               @success="callBack" />
    <!-- 转移客户 -->
    <distribution :showDialog.sync="showDistributionDialog"
                  :sourceOptions="sourceOptions"
                  :selectList="selectList"
                  @modify="customerList"></distribution>
    <!-- 详情 -->
    <detail :showDialog.sync="showDetailDialog"
            :customer="customer"
            :customerCrmId="customerCrmId"
            :customerStoreId="customerStoreId"
            :signTime="signTime"
            :id="id" />
    <!--修改定位-->
    <modifyLocation :showDialog.sync="showLocation"
                    :rowList='rowList'
                    @modif='customerList' />
    <!--修改级别-->
    <modifLevel :showDialog.sync='showLevel'
                @modify="customerList"></modifLevel>
    <!-- 审核不通过原因弹窗 -->
    <el-dialog title="审核失败原因"
               :visible.sync="dialogVisible">
      <div>{{failedReason}}</div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
import addCustomer from "./add";
import addTask from "./addTask";
import transfer from "./transfer";
import follow from "./follow";
import distribution from "./distribution";
import detail from '../seas/detail/index'
import modifyLocation from './modifyLocation'
import modifLevel from './modifLevel'
import {
  customerList,
  usable,
  deleteCustomer,
  highSeas,
  bargain,
  taskSave,
  exportCustomers
} from "@/api/customer/customer";
import { dict } from "@/api/common";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    claimSearchType: {
      required: true,
      type: [String, Number],
      default: ""
    }
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
      formData: "",
      customerStoreId: "",
      id: '',
      title: "",
      showDetailDialog: false,
      showAllocationDialog: false,
      tableHeight: 520,
      dataList: [],
      failedReason: "",//审核失败原因
      customerCrmId: '',
      showLocation: false,
      showLevel: false,
      rowList: {},
      signTime: '',//最后拜访时间
    };
  },
  components: {
    addCustomer,
    follow,
    addTask,
    transfer,
    distribution,
    detail,
    modifyLocation,
    modifLevel
  },
  computed: {
    ...mapGetters([
      "customer_store_ids"
    ]),
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
  watch: {
    '$route': {
      immediate: true,
      handler: function (to, from) {
        //拿到目标参数 to.query.id 去再次请求数据接口
        this.listQuery.certificateStatus = this.$route.query.certificateStatus || ''//证件状态
        this.listQuery.commission = this.$route.query.customerStoreIds == 'ids' ? 1 : ''
        this.customerList();
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeight =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      window.onresize = () => {
        this.tableHeight =
          window.innerHeight - this.$refs.activityTable.$el.offsetTop - 150;
      };
    });
    this.listQuery.customerStoreId = this.$route.query.customerStoreId;
    this.listQuery.bargain = this.$route.query.bargain == '已成交' ? '1' : ''; //状态
    this.listQuery.certificateStatus = this.$route.query.certificateStatus || ''; //证件状态
    // commission: '', //代办事项  分配我的客户传参1
    this.listQuery.commission = this.$route.query.customerStoreIds == 'ids' ? 1 : ''
    this.listQuery.rStartTime = this.$route.query.rStartTime; //开始时间
    this.listQuery.rEndTime = this.$route.query.rEndTime; //结束时间
    this.listQuery.staffId = this.$route.query.staffId;  //负责人id
    this.usable(); //客户列表中客户类型接口
    this.getSource();
    this.getLevel();
    this.getVisit();
    this.getBacklog()
    // 防止table错位
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
  },
  methods: {
    ...mapActions(["getBacklog"]),
    // 给行添加字体颜色
    tableRowClassName ({ row, rowIndex }) {
      if (row.certificateStatusCrm === 1) {
        return 'warning-row link_a';
      } else if (row.certificateStatusCrm === 3) {
        return 'success-row link_b';
      }
      return '';
    },
    //批量修改级别
    modifLevel (val) {
      this.showLevel = true
    },
    // 修改定位
    modifyLocation (val, val2) {
      this.showLocation = true
      this.rowList = val
    },
    // 审核失败原因
    showReason (val) {
      this.dialogVisible = true
      this.failedReason = val || "--"
    },
    toDetail (row) {
      const { customerStoreId, id } = row;
      this.customerStoreId = customerStoreId;
      this.customerCrmId = id
      this.id = id;
      this.signTime = row.signTime
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
    customerList () {
      customerList({ ...this.listQuery, claimSearchType: this.claimSearchType })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count;
        })
        .catch(err => console.log(err));
    },
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // 放入公海
    IntoSea () {
      let arrs = this.selectList;
      let b = [];
      arrs.forEach((item, index) => {
        b.push(item.id);
      });
      this.hint("确定要放入公海？").then(res => {
        if (res) {
          highSeas({ ids: b }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.customerList();
          });
        }
      });
    },
    //更改成交状态
    bargain () {
      let arrs = this.selectList;
      let b = [];
      arrs.forEach((item, index) => {
        b.push(item.id);
      });
      this.hint("确定要更改成交状态？").then(res => {
        if (res) {
          bargain({ ids: b }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.customerList();
          });
        }
      });
    },
    // 删除单个
    deleteRow (id, index) {
      this.hint("确定要删除客户？").then(res => {
        if (res) {
          deleteCustomer({ storeIds: [id] }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.dataList.splice(index, 1);
          });
        }
      });
    },
    // 删除多个
    deleteMore () {
      let arrs = this.selectList;
      let a = [];//判断是否有审核通过的客户 给出不能删除提示
      let b = [];//获取客户id
      arrs.forEach((item, index) => {
        a.push(item.result)
        b.push(item.customerStoreId);
      });
      this.prohibit = a.includes(1)
      if (this.prohibit) {
        this.$message({ message: "有审核通过的客户不能删除，请重新选择。", type: "warning" });
        return
      }
      this.hint("确定要删除客户？").then(res => {
        if (res) {
          deleteCustomer({ storeIds: b }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.customerList();
          });
        }
      });
    },
    // 客户状态
    formatterEnabled (row, column, value, index) {
      return value == 0
        ? "禁用"
        : value == 1
          ? "启用"
          : "--";
    },
    // 证件状态:0:暂无,1:已过期,2,未过期,3:即将过期
    formatCertificateStatusCrm (row, column, value, index) {
      return value == 0
        ? "暂无"
        : value == 1
          ? "已过期"
          : value == 2
            ? "未过期"
            : value == 3
              ? "即将过期"
              : "--";
    },
    // 审核状态
    formatAuditStatus (row, column, value, index) {
      return value == 0
        ? "审核中"
        : value == 1
          ? "已通过"
          : value == 2
            ? "审核失败"
            : "--";
    },
    // 成交状态
    formatStatus (row, column, value, index) {
      return value == 0 ? "未成交" : value == 1 ? "已成交" : "";
    },
    // 下单状态
    formatOrderStatus (row, column, value, index) {
      return value == 2 ? "未下单" : value == 1 ? "已下单" : "";
    },
    handleClose (done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    // 跟进弹窗
    editorNewFollow (val) {
      this.customerCrmId = val
      this.showFollowDialog = true;
    },
    addCustomer (val, id, result) {
      if (val == "edit") {
        this.$refs.child.parentMsg(id);
      }
      this.option = val;
      this.showAddDialog = true;
    },
    toggleRowSelection () { },
    // 文件导出
    exportFile () {
      const {
        customerName,
        mobile,
        customerTypeId,
        storeLevel,
        bargain,
        followTime
      } = this.listQuery;
      let b = [];
      this.selectList.forEach((item, index) => {
        b.push(item.customerStoreId);
      });
      exportCustomers({
        customerName,
        claimSearchType: this.claimSearchType,
        mobile,
        storeIds: b,
        customerTypeId,
        storeLevel,
        bargain,
        followTime
      }).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "认领客户";
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
    }
  }
};
  </script>

<style lang="scss" scope>
.link {
  color: #1890ff;
  text-decoration: underline;
}
.el-table__fixed,
.el-table__fixed-right {
  height: auto !important; // 此处的important表示优先于element.style
  bottom: 17px !important; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
}
.iconfont {
  margin-right: 8px !important;
}
/deep/.el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.el-table .warning-row {
  color: rgb(217, 0, 27);
  .link_a {
    color: rgb(217, 0, 27);
  }
}

.el-table .success-row {
  color: rgb(245, 154, 35);
  .link_b {
    color: rgb(245, 154, 35);
  }
}
</style>
