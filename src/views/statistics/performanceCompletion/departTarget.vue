<template>
  <div>
    <el-form :inline="true"
             :model="listQuery"
             class="search_box">
      <el-form-item label="选择时间">
        <el-date-picker v-model.trim="listQuery.year"
                        type="year"
                        value-format="yyyy"
                        @change="queryList"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader :options="deptList"
                     @change="queryList"
                     :props="cascaderProps"
                     :show-all-levels="false"
                     v-model="listQuery.departIds"
                     clearable></el-cascader>
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
      <ColumnChart :name="'departChart'"
                   :echartData="echartData"
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
        <el-table-column label="部门"
                         min-width="130"
                         show-overflow-tooltip
                         align="center"
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
                  @pagination="achievementList"
                  :limit.sync="listQuery.limit"
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
  findDeptTree,
} from "@/api/statistics";
import {
  achievementList,
  achievementByOrderEchars
} from "@/api/performanceCompletion";
import { mapGetters, mapState } from "vuex";
export default {
  props: {},
  data () {
    return {
      listLoading: false,
      dataList: [],
      dataInfo: {},
      showDialog: false,
      total: 0,
      detailData: {
        year: "",
        performanceEnum: "",
        departIds: '',
      },
      listQuery: {
        performanceEnum: 'DEPT',//DEPT: 对应部门   USER: 对应员工
        year: "",
        departIds: [],
        ids: [],
        page: 1,
        limit: 10
      },
      cascaderProps: {
        checkStrictly: true
      },
      echartData: {
        name: []
      },
      deptList: [],
      userList: [],
      deptIdList: [],
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
    this.findDeptTree();
    this.achievementByOrderEchars();
    this.achievementList();
  },
  methods: {
    getYear () {
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);   //获取年份
      this.listQuery.year = this.$moment(date).format("YYYY");
    },
    findDeptTree () {
      findDeptTree().then(res => {
        this.deptList = getCascaderOptionsByDeptName(res.data);
      });
    },
    // 部门
    depart (value) {
      if (value) {
        this.listQuery.departIds = [value[value.length - 1]];
        this.selectPerformanceList();
      }
    },
    // 部门筛选
    department (list, departIds) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        departIds.push(data);
      });
      return departIds;
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.listQuery.departIds = val.id;
    },
    getDetail (row) {
      const { year, performanceEnum, ids } = row;
      Object.assign(this.detailData, {
        year: this.listQuery.year,
        performanceEnum: this.listQuery.performanceEnum,
        ids: row.deptId
      });
      this.showDialog = true;
    },
    query () {
      this.achievementByOrderEchars();
      this.achievementList();
    },
    queryList () {
      Object.assign(this.listQuery, {
        page: 1,
      });
      this.query();
    },
    // 重置
    resetQuery () {
      Object.assign(this.listQuery, {
        performanceEnum: 'DEPT',//DEPT: 对应部门   USER: 对应员工
        // year: "",
        departIds: [],
        ids: [],
        page: 1,
        limit: 10
      });
      this.deptIdList = [];
      this.getYear()
      this.query();
    },
    achievementList () {
      if (this.listQuery.departIds != '') {
        this.listQuery.ids = this.listQuery.departIds.slice(-1);
      }
      achievementList({
        ...this.listQuery,
      }).then(res => {
        this.total = res.data.count;
        this.dataList = res.data.data;
      });
    },
    achievementByOrderEchars () {
      if (this.listQuery.departIds != '') {
        this.listQuery.ids = this.listQuery.departIds.slice(-1);
      }
      achievementByOrderEchars({
        ...this.listQuery
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
