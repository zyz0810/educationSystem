<template>
  <div class="app-container">
    <el-form :inline="true"
             class="search_box">
      <el-form-item label="">
        <el-input v-model.trim="listQuery.key_word"
                  clearable suffix-icon="el-icon-search"
                  @change="queryGetList"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="listQuery.status" placeholder="请选择" @change="queryGetList">
          <el-option label="全部状态" value=""></el-option>
<!--          收益单的状态 (1: 待审核， 2 审核中， 3: 结算中，4已结算， 5: 结算失败)-->
          <el-option label="全部状态" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核中" :value="2"></el-option>
          <el-option label="结算中" :value="3"></el-option>
          <el-option label="已结算" :value="4"></el-option>
          <el-option label="结算失败" :value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="container mt_10">
      <div v-if="selectList.length > 0" class="mb_10">
        <span class="mr10 f12 choose_span">已选择<span class="blue01 bold choose_num">{{selectList.length}}</span>条<i class="el-icon-close gray01 ml5"></i></span>
        <el-button type="primary" plain>批量同意</el-button>
        <el-button type="primary" plain>批量结算</el-button>
        <el-button type="primary" plain>批量导出</el-button>
      </div>
      <el-table v-loading="listLoading"
                :data="dataList"
                :max-height="tableHeight"
                ref="activityTable"
                :header-cell-style="{ background: '#F8F9FA' }"
                element-loading-text="拼命加载中"
                @selection-change="list => (selectList = list)"
                :row-key=" (row) => { return row.id; }  "
                @row-click="
          (row, column, event) => {
            $refs.activityTable.toggleRowSelection(row);
          }
        "
                highlight-current-row>
        <el-table-column :reserve-selection="true"
                         fixed
                         type="selection"></el-table-column>
        <el-table-column label="个人姓名"
                         min-width="120"
                         align="left"
                         show-overflow-tooltip
                         prop="storeName">
          <template slot-scope="scope">
            <span class="flex pointer blue01" >
                <span class="header_img mr5">
                  <img :src="scope.row.apply_user_portrait" alt=""/>
                </span>
            {{scope.row.apply_user_name}}
            </span>

          </template>
        </el-table-column>
        <el-table-column label="ID"
                         min-width="100"
                         align="left"
                         prop="apply_user_id">
        </el-table-column>
        <el-table-column label="手机"
                         min-width="100"
                         align="left"
                         show-overflow-tooltip
                         prop="phone_number"></el-table-column>
        <el-table-column label="申请金额"
                         min-width="100"
                         align="left"
                         prop="apply_cash">
        </el-table-column>
        <el-table-column label="结算金额"
                         min-width="100"
                         align="left"
                         prop="settlement_cash">
        </el-table-column>
        <el-table-column label="申请时间"
                         min-width="160"
                         align="left"
                         prop="apply_time" :formatter="formatTime">
        </el-table-column>
        <el-table-column label="状态"
                         min-width="100"
                         align="left"
                         prop="status" :formatter="formatterStatus">
<!--          收益单的状态 (1: 待审核， 2 审核中， 3: 结算中，4已结算， 5: 结算失败)-->
        </el-table-column>
        <el-table-column label="操作"
                         align="left"
                         width="120"
                         prop="remarks">
          <template slot-scope="scope">
            <el-button type="text" @click.stop="handelPass(scope.row)">同意</el-button>
            <el-button type="text" @click.stop="handelSettlement( scope.row)">结算</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <empty-table/>
        </template>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.pn"
                  :limit.sync="listQuery.rn"
                  @pagination="getList"
                  class="text-right" />
    </div>

    <settlement :showDialog.sync="showSettlementDialog" :infoData="infoData"></settlement>
  </div>
</template>

<script>
  import {getProfits,} from "@/api/income";
  import settlement from "./settlement";
  export default {
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        listQuery: {
          key_word: "",
          start_time:'',
          end_time:'',
          status:'',
          rn: 10,
          pn: 1,
        },
        total: 0,
        listLoading: false,
        selectList: [],
        dataList: [{id:1,storeName:'111',storeSn:'11',linkman:'张三',mobile:'18656547892'}],
        tableHeight: 520,
        showSettlementDialog:false,
        infoData:{},
      };
    },
    components:{settlement},
    computed: {
      dateTime: {
        get() {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set(v) {
          if (v == null) {
            this.listQuery.start_time = "";
            this.listQuery.end_time = "";
          } else {
            this.listQuery.start_time = v[0];
            this.listQuery.end_time = v[1];
          }
        },
      },
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
      this.getList();
    },
    methods: {
      // 收益单的状态 (1: 待审核， 2 审核中， 3: 结算中，4已结算， 5: 结算失败)
      formatterStatus (row, column, cellValue, index) {
        // 1男 2女
        return cellValue == 1 ? "待审核" : cellValue == 2? "审核中" : cellValue == 3? "结算中" : cellValue == 4? "已结算" : cellValue == 5? "结算失败" : "--";
      },
      formatTime (row, column, cellValue, index) {
        return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
      // 获取客户列表
      getList () {
        getProfits({ ...this.listQuery, })
          .then(res => {
            this.dataList = res.data.list;
            this.total = res.data.totalCount;
          })
          .catch(err => console.log(err));
      },
      queryGetList () {
        this.listQuery.pn = 1;
        this.getList();
      },
      handelSettlement(row){
        this.showSettlementDialog = true;
        this.infoData=row;
      },
      async handelPass(row){
        const res = await this.$confirm("<span style='margin-left: 35px;'>确定同意"+ row.apply_user_name +"的结算审核</span>", "审核通过", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          // type: "info",
          dangerouslyUseHTMLString: true,
          customClass:'del_confirm'
        }).catch((err)=>{console.log('err',err)})
        if(res){
          // this.$success("你确认惹删除！")
          deleteuser({ id: row.id }).then(res => {
            this.$message({ message: res.resp_msg, type: 'success' });
            this.getList();
          });
          console.log('确定',res)
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
 .choose_span{
   color: #3D3D3D;
   padding-right: 5px;
   border-right: 1px solid #ccc;
   .choose_num{
     margin: 0 3px;
   }
 }
</style>
