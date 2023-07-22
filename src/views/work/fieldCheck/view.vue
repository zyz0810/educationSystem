<template>
  <div>
    <el-button class="filter-item"
               v-rules="{admin:'admin',ordinary:'tast-notes:export'}"
               icon="iconfont icon-daochu" :loading="exportAll"
               @click="exportFile">导出全部</el-button>
    <el-button class="filter-item" :disabled="selectList.length<1"
               v-rules="{admin:'admin',ordinary:'tast-notes:export'}"
               icon="iconfont icon-daochu" :loading="exportId"
               @click="exportFileId">导出</el-button>
    <el-table ref="activityTable"
              v-loading="listLoading"
              class="mt_20"
              :data="dataList"
              :header-cell-style="{ background: '#f5f7fa' }"
              element-loading-text="拼命加载中"
              @selection-change="list => (selectList = list)"
              :row-key="(row) => {return row.id}"
              border
              :height="tableHeight"
              @row-click="(row,column,event)=>{$refs.activityTable.toggleRowSelection(row)}"
              highlight-current-row>
      <el-table-column type="selection"
                       :reserve-selection="true"
                       width="50"
                       align="center"
                       fixed></el-table-column>
      <el-table-column label="到店签到时间"
                       align="center"
                       prop="visitStartTime"
                       min-width="150"
                       :formatter="formatTime"></el-table-column>
      <el-table-column label="离店签退时间"
                       align="center"
                       prop="visitEndTime"
                       min-width="150"
                       :formatter="formatTime"></el-table-column>
      <el-table-column label="签到照片"
                       align="center"
                       prop="visitEndTime"
                       width="100">
        <template slot-scope="scope">
          <viewer :images="[scope.row.visitStartImageUrl]" v-if="scope.row.visitStartImageUrl!=null && scope.row.visitStartImageUrl!=''">
            <span class="money_ewm">
              <img :src="scope.row.visitStartImageUrl" />
            </span>
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="签退照片"
                       align="center"
                       prop="visitEndTime"
                       width="100">
        <template slot-scope="scope">
          <viewer :images="[scope.row.visitEndImageUrl]" v-if="scope.row.visitEndImageUrl!=null && scope.row.visitEndImageUrl!=''">
            <span class="money_ewm">
              <img :src="scope.row.visitEndImageUrl" />
            </span>
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="驻店时长"
                       align="center"
                       prop="staySignTime"></el-table-column>
      <el-table-column label="业务经理"
                       align="center"
                       show-overflow-tooltip
                       prop="userName"></el-table-column>
      <el-table-column label="所属部门"
                       align="center"
                       show-overflow-tooltip
                       prop="deptName"></el-table-column>
      <el-table-column label="关联客户"
                       align="center"
                       show-overflow-tooltip
                       prop="customerStoreName">
        <template slot-scope="scope">
          <a class="link"
             @click.stop="associatedVisit('view',scope.row)">{{scope.row.customerStoreName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="签到地址"
                       align="center"
                       min-width="200"
                       show-overflow-tooltip
                       prop="signAddress">
        <template slot-scope="scope">
          <a class="link"
             type="text"
             @click.stop="showMap('look',scope.row)">{{scope.row.signAddress}}</a>
        </template>
      </el-table-column>
      <el-table-column label="签到状态"
                       align="center"
                       min-width="100"
                       show-overflow-tooltip
                       prop="signStatus"></el-table-column>
      <el-table-column label="关联拜访"
                       flxed='righta'
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     v-rules="{admin:'admin',ordinary:'task-notes:view'}"
                     @click.stop="detail('view',scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="recondList"
                class="text-right" />
    <!--地图中心点-->
    <Map :showDialog.sync="showMapDialog"
         :option="mapType"></Map>
    <!--查看拜访-->
    <taskDetail :showDialog.sync="showDetailDialog"
                :visitTaskId='visitTaskId'></taskDetail>
    <!--地图轨迹-->
    <mapTrack :showDialog.sync="showMapTrackDialog"
              :id="id"></mapTrack>
    <!--签退补录-->
    <addSupplement :showDialog.sync="showSupplementDialog"
                   :signSupplement='signSupplement'
                   @modify='recondList'></addSupplement>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import taskDetail from "./taskDetail";
import mapTrack from "./mapTrack";
import addSupplement from "./addSupplement";
import {
  recondList,
  recondExport,
  findById,
  findTrailById
} from "@/api/fieldCheck";
import {
  taskList,
  taskSave,
  taskDel,
  taskComplete
} from "@/api/task";
export default {
  props: {
    listQuery: {
      required: true,
      type: Object,
      default: false
    },
    claimType: {
      required: true,
      type: [String, Number],
      default: ""
    }
  },
  components: {
    taskDetail,
    mapTrack,
    addSupplement
  },
  data () {
    return {
      listLoading: false,
      taskType: "",
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
      typeOptions: {
        type: "",
        optionType: "",
        option: {}
      },
      levelOptions: [],
      sourceOptions: [],
      showMapDialog: false,
      showMapTrackDialog: false,
      mapType: {
        operatorType: "",
        option: {}
      },
      showDetailDialog: false,
      tableHeight: 400,
      visitTaskId: '',//拜访id
      id: '',
      isDeleteList: {
        0: '查看',
        1: '已删除',
      },
      signType: '',
      showSupplementDialog: false,
      signSupplement: {},
      checkRecord: 'checkRecord',
      exportAll:false,
      exportId:false,
    };
  },
  filters: {
    filtersPriority: function (value) {
      let StatusArr = { 1: "高", 2: "中", 3: "低", 4: "无" };
      return StatusArr[value];
    },
    // 任务状态 0 未开始 1 进行中 2已完成
    filtersStatus: function (value) {
      let StatusArr = { 0: "未开始", 1: "进行中", 2: "已完成" };
      return StatusArr[value];
    }
  },
  mounted () {
    this.$nextTick(function () {
      // this.$refs.filter-container.offsetHeight
      let height =
        window.innerHeight - this.$refs.activityTable.$el.offsetTop - 210;
      if (height > 100) {
        this.tableHeight = height;
      } else {
        this.tableHeight = 100;
      }
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        let height =
          window.innerHeight - self.$refs.activityTable.$el.offsetTop - 210;
        if (height > 100) {
          self.tableHeight = height;
        } else {
          self.tableHeight = 100;
        }
      };
    });
    this.recondList(); // 获取任务列表
    this.$nextTick(() => {
      this.$refs.activityTable.doLayout();
    });
  },
  computed: {
    ...mapGetters(["permission_routes"]),
  },
  methods: {
    // 文件导出
    exportFile () {
      this.exportAll = true;
      const parm = {
        sysUserId: this.listQuery.sysUserId,
        deptId: this.listQuery.deptId,
        customerStoreName: this.listQuery.customerStoreName,
        searchStartTime: this.listQuery.searchStartTime,
        searchEndTime: this.listQuery.searchEndTime,
      }
      recondExport(parm).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "任务记录";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
        this.exportAll = false;
      }).catch(() => {
        this.exportAll = false;
      });
    },
    // 文件导出多选
    exportFileId () {
      this.exportId = true;
      const ids = this.selectList.map(item=> {return item.id});
      const parm = {
        sysUserId: this.listQuery.sysUserId,
        deptId: this.listQuery.deptId,
        customerStoreName: this.listQuery.customerStoreName,
        searchStartTime: this.listQuery.searchStartTime,
        searchEndTime: this.listQuery.searchEndTime,
        idList:ids
      }
      recondExport(parm).then(res => {
        const blob = new Blob([res]);
        let myDate = new Date();
        let timename = myDate
          .toLocaleDateString()
          .split("/")
          .join("-");
        const str = "任务记录";
        const fileName = str + timename + ".xls";
        const linkNode = document.createElement("a");
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = "none";
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click(); //模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
        this.exportId = false;
      }).catch(() => {
        this.exportId = false;
      });
    },
    // 签退补录弹窗
    addSignSupplement (val, val2) {
      this.showSupplementDialog = true
      this.signSupplement = val
    },
    // 详情
    detail (va1, val2) {
      this.showDetailDialog = true
      // 临时拜访任务visitTaskId 取id   其他情况取visitTaskId
      this.visitTaskId = val2.id
      this.signType = val2.signType //签到类型
    },
    // 查看地图
    showMap (val, val2) {
      this.mapType = {
        operatorType: val,
        option: {
          signAddressLatitude: val2.signAddressLatitude,
          signAddressLongitude: val2.signAddressLongitude,
          signAddress: val2.signAddress
        }
      };
      this.showMapDialog = true
    },
    showMapTrack (val, val2) {
      this.id = val2.id
      this.showMapTrackDialog = true
    },
    //关联跳转
    associatedVisit (val, val2) {
      this.$store.dispatch("set_route", "");
      this.$router.push({
        name: "customer",
        query: {
          customerStoreId: val2.customerStoreId,
        },
      });
      const arr = this.permission_routes.find((item) => item.path == "");
      this.$store.dispatch("set_route_List", arr.children || []);
      this.$nextTick(() => {
        this.$store.dispatch("set_sidebar_menu", "/customer");
      });
    },
    open () { },
    // 获取客户列表
    recondList () {
      recondList({
        ...this.listQuery,
        claimType: this.claimType,
      })
        .then(res => {
          this.dataList = res.data.data;
          this.total = res.data.count || res.data.total || 0;
          this.$nextTick(() => {
            this.$refs.activityTable.doLayout();
          });
        })
        .catch(err => console.log(err));
    },
    addTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: val
      };
      this.showAddDialog = true;
    },
    completeTask () {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let ids = this.selectList.map(item => item.id);
          taskComplete({ ids: ids })
            .then(res => {
              this.listLoading = false;
              this.recondList();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    },
    // 签到状态
    formarStatus (row, column, value, index) {
      // 签到状态：0 到店未打卡 , 1: 到店已打卡 ; 2: 离店未打卡 ; 3: 离店已打卡
      return value == 0 ? "到店未签到" : value == 1 ? "到店已签到" : value == 2 ? "离店未签到" : value == 3 ? "离店已签到" : "--";
    },
    // // 签退补录
    // formarSupplement (row, column, value, index) {
    //   // 补录异常: 0: 申请补录, 1: 补录通过
    //   return value == 0 ? "申请补录" : value == 1 ? "补录通过" : "--";
    // },
    //签到类型  VISIT(0, "拜访"), TASK (1, "任务"), TEMP (2, "临时");
    formarSignType (row, column, value, index) {
      return value == 0 ? "拜访签到" : value == 1 ? "任务签到" : value == 2 ? "临时签到" : "--";
    },
    formatTime (row, column, cellValue, index) {
      return cellValue
        ? this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        : "暂无";
    },
    delTask (type, val) {
      this.$confirm("确定执行此操作吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let ids;
          if (type == "one") {
            ids = val.id;
          } else if (type == "all") {
            ids = this.selectList.map(item => item.id);
          }
          taskDel({ ids: ids })
            .then(res => {
              this.listLoading = false;
              this.recondList();
              this.$message({
                message: res.resp_msg,
                type: "success"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => { });
    }
  }
};
</script>

<style lang="scss" scope>
.link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.money_ewm{
  width: 50px;
  height: 80px;
  display: inline-block;
  font-size: 0;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
