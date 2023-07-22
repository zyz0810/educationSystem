<template>
  <div>
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="选择时间">
        <el-date-picker v-model="listQuery.year"
                        type="year"
                        value-format="yyyy"
                        @change="queryList"
                        placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   v-model.trim="listQuery.ids"
                   @change="queryList"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   type="primary"
                   @click="queryList"
                   icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item"
                   icon="el-icon-refresh"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="broken">
      <!--柱形图-->
      <ColumnChart :name="'staffChart'"
                   :echartData='echartData'
                   style="width:100%;height: 400px;"></ColumnChart>
    </div>
    <div class="total">
      <el-table v-loading="listLoading"
                class="mt_20"
                :data="dataList"
                :header-cell-style="{ background: '#f5f7fa' }"
                element-loading-text="拼命加载中"
                border
                :height="400"
                highlight-current-row>
        <el-table-column label="姓名"
                         align="center"
                         min-width="120"
                         show-overflow-tooltip
                         prop="userName"></el-table-column>
        <el-table-column label="部门"
                         align="center"
                         min-width="130"
                         show-overflow-tooltip
                         prop="deptName"></el-table-column>
        <el-table-column label="年度目标"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="quarter[0].total"></el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="quarter[0].compelet"></el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="quarter[0].compeletPercent"></el-table-column>
        </el-table-column>
        <el-table-column label="第一季度"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="quarter[1].total"></el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="quarter[1].compelet"></el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="quarter[1].compeletPercent"></el-table-column>
        </el-table-column>
        <el-table-column label="第二季度"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="quarter[2].total"></el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="quarter[2].compelet"></el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="quarter[2].compeletPercent"></el-table-column>
        </el-table-column>
        <el-table-column label="第三季度"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="quarter[3].total"></el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="quarter[3].compelet"></el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="quarter[3].compeletPercent"></el-table-column>
        </el-table-column>
        <el-table-column label="第四季度"
                         align="center">
          <el-table-column label="目标"
                           align="center"
                           prop="quarter[4].total"></el-table-column>
          <el-table-column label="完成"
                           align="center"
                           prop="quarter[4].compelet"></el-table-column>
          <el-table-column label="完成率"
                           align="center"
                           prop="quarter[4].compeletPercent"></el-table-column>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         v-if="permissions.includes('admin') || permissions.includes('performance:point:view')"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="getDetail(scope.row)"
                       v-rules="{ admin: 'admin', ordinary: 'performance:point:view' }">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="achievementList"
                  class="text-right" />
      <targetDetail :showDialog.sync="showDialog"
                    :detailData="detailData" />
    </div>
  </div>
</template>

<script>
import targetDetail from "./targetDetail";
import { getCascaderOptionsByDeptName } from "@/utils/common";
import {
  getChildUsers,
  findDeptTree,
} from "@/api/statistics";
import {
  achievementList,
  achievementByOrderEchars
} from "@/api/performanceCompletion";
import { getUsersByRole } from "@/api/common";
import { mapGetters, mapState } from "vuex";
export default {
  props: {
  },
  data () {
    return {
      listLoading: false,
      dataList: [],
      dataInfo: {},
      total: 0,
      detailData: {
        year: "",
        performanceEnum: "",
        ids: '',
      },
      showDialog: false,
      listQuery: {
        performanceEnum: 'USER',//DEPT: 对应部门   USER: 对应员工
        year: '',
        ids: "",
        page: 1,
        limit: 10
      },
      echartData: {
        name: []
      },
      deptList: [],
      userList: [],
      deptIdList: [],
      userOptions: [],
    };
  },
  components: {
    targetDetail
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
      permissions: state => state.user.permissions
    }),
  },
  mounted () {
    this.getYear()
    this.achievementByOrderEchars();
    this.getUsersByRole();
    this.achievementList();
  },
  methods: {
    getYear () {
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);   //获取年份
      this.listQuery.year = this.$moment(date).format("YYYY");
    },
    // 目标详情
    getDetail (row) {
      const { year, performanceEnum, id } = row;
      Object.assign(this.detailData, {
        year: this.listQuery.year,
        performanceEnum: this.listQuery.performanceEnum,
        ids: row.userId
      });
      this.showDialog = true;
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.query();
    },
    // 切换刷新
    query () {
      this.achievementByOrderEchars();
      this.achievementList();
    },
    // 所有下拉用户列表数据
    getUsersByRole () {
      let data = {};
      getUsersByRole(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.userOptions = res.data;

          } else {
            this.$message({
              message: res.data.resp_msg,
              type: "warning"
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        performanceEnum: 'USER',//DEPT: 对应部门   USER: 对应员工
        // year: '',
        ids: "",
        page: 1,
        limit: 10
      });
      this.getYear()
      this.query();
    },
    // 统计列表
    achievementList () {
      achievementList({
        ...this.listQuery,
      }).then(res => {
        this.total = res.data.count;
        this.dataList = res.data.data;
      });
    },
    // echars 数据
    achievementByOrderEchars () {
      achievementByOrderEchars({
        ...this.listQuery,
      }).then(res => {
        this.echartData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scope>
.broken {
  height: 400px;
  display: grid;
}
.total {
  color: #666666;
  font-family: "微软雅黑";
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  text-align: left;
  line-height: 22px;
  padding: 20px;
}
</style>
