<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="78%"
             @close="close"
             @open="open"
             top="10vh"
             :append-to-body="true"
             :title="title">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="120px"
             :rules="rules"
             class="formList">
      <el-form-item v-if="role=='serviceProvider'"
                    label="考核服务商人员"
                    prop="providerIds">
        <el-select v-model="formData.providerIds"
                   filterable
                   @change="getProvider"
                   :disabled="typeOptions.optionType == 'view' || typeOptions.optionType == 'update'"
                   placeholder="请选择考核服务商人员">
          <el-option v-for="(item,index) in providerList"
                     :label="item.providerName"
                     :disabled='item.disable'
                     :value="item.serviceProviderId"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="role=='staff'"
                    label="考核员工"
                    prop="providerIds">
        <el-select placeholder="考核员工"
                   v-model="formData.providerIds"
                   filterable
                   @change="getProvider"
                   :disabled="typeOptions.optionType == 'view' || typeOptions.optionType == 'update'">
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :disabled='item.disable'
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="考核时间"
                    prop="param.assessmentDate">
        <el-date-picker v-model="formData.param.assessmentDate"
                        type="month"
                        @change='getMonth'
                        :disabled="typeOptions.optionType == 'view'"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM"
                        placeholder="选择月份">
        </el-date-picker>
      </el-form-item>
      <div class="decompose-box">
        <div class="x-div">
          <div class="v-list">
            <div class="t-item flex1 center">指标名称</div>
            <div class="t-item flex2 center">目标</div>
            <div class="t-item flex3 center">权重</div>
            <div class="t-item flex4 center">分数</div>
          </div>
          <div class="x-div2">
            <div class="v-list">
              <div class="t-item flex1">销售业绩</div>
              <div class="t-item inline">
                <!--
                  <el-input v-model.trim="formData.param.performanceTarget"
                          :disabled='isLook'
                          type="number"
                          @mousewheel.native.prevent
                          placeholder="请输入"
                          clearable /> 元
               -->
                <el-button v-if="this.typeOptions.optionType == 'view'"
                           @click="serviceBuyPerformance('view')">查看</el-button>
                <el-button v-if="this.typeOptions.optionType != 'view'"
                           @click="serviceBuyPerformance('edit')">编辑</el-button>
              </div>
              <div class="t-item flex3">
                <el-input v-model.trim="formData.param.performanceWeight"
                          :disabled='isLook'
                          type="number"
                          @mousewheel.native.prevent
                          placeholder="请输入"
                          clearable /> %
              </div>
              <div class="t-item flex4">
                完成率≥
                <el-input v-model.trim="formData.param.performanceProportion"
                          :disabled='isLook'
                          style='margin-left:32px'
                          type="number"
                          @mousewheel.native.prevent
                          placeholder="请输入"
                          clearable /> % 按实际达成核算，否则0分
              </div>
            </div>
            <div class="v-list">
              <div class="t-item flex1">客户拜访</div>
              <div class="t-item flex2">
                <el-input v-model.trim="formData.param.customerVisitTarget"
                          placeholder="请输入"
                          type="number"
                          @mousewheel.native.prevent
                          :disabled='isLook'
                          clearable />次
              </div>
              <div class="t-item flex3">
                <el-input v-model.trim="formData.param.customerVisitWeight"
                          placeholder="请输入"
                          type="number"
                          @mousewheel.native.prevent
                          :disabled='isLook'
                          clearable />%
              </div>
              <div class="t-item flex4">
                完成率≥
                <el-input v-model.trim="formData.param.customerVisitProportion"
                          :disabled='isLook'
                          style='margin-left:32px'
                          type="number"
                          @mousewheel.native.prevent
                          placeholder="请输入"
                          clearable />% 超过100%按照100%核算，否则0分
              </div>
            </div>
            <div class="v-list m-b30">
              <div class="t-item flex1">门店动销数</div>
              <div class="t-item flex2 relative">
                指标按级别分解
                <!--
                  <el-input v-model.trim="formData.param.storeSalesTarget"
                          type="number"
                          @change="getStoreSalesTarget"
                          :disabled='isLook'
                          placeholder="请输入"
                          clearable />%
                <div class="absolute">客户数：<span>{{serviceProviderNumber || 0 }}</span>
                  目标数：<span>
                    {{ formData.providerIds.length == 0 ? 0  : formData.providerIds.length == 1 ? 
                Math.ceil(Number(this.serviceProviderNumber * formData.param.storeSalesTarget / 100)) || 0  : '--'  }}</span>
                </div>
                -->
              </div>
              <div class="t-item flex3">
                <el-input v-model.trim="formData.param.storeSalesWeight"
                          placeholder="请输入"
                          type="number"
                          @mousewheel.native.prevent
                          :disabled='isLook'
                          clearable />%
              </div>
              <div class="t-item flex4 relative">
                <div>
                  最低完成率≥
                  <el-input v-model.trim="formData.param.storeSalesProportion"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />% 按实际达成核算，否则0分
                </div>
                <!--storeTallestProportion-->
                <div class="absolute">
                  最高完成率≥
                  <el-input v-model.trim="formData.param.storeTallestProportion"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />% 按100%核算，封顶100%
                </div>
              </div>
            </div>
            <!--storeSalesInfo 门店动销数-->
            <el-table class="assessment-box"
                      :data="storeSalesInfo"
                      border>
              <el-table-column label="指标"
                               width="140"
                               align="right">
                <el-table-column prop="levelStr"
                                 label="级别"
                                 width="120"
                                 align="left"></el-table-column>
              </el-table-column>
              <el-table-column prop="num"
                               label="客户数"
                               align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.levelStore || scope.row.num || 0}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="target"
                               min-width="120"
                               align="left"
                               label="门店动销率">
                <template slot-scope="scope">
                  <!--客户数*门店动销率 向上取整-->
                  <el-input v-model.trim="scope.row.target"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />%<span v-if='scope.row.target'>，{{Math.ceil(Number((scope.row.target/100*(scope.row.num || 0))).toFixed(2) || '')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="weight"
                               align="center"
                               label="权重">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.weight"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />%
                </template>
              </el-table-column>
            </el-table>
            <div class="v-list">
              <div class="t-item flex1">平均单店产出</div>
              <div class="t-item flex2">
                指标按级别分解
                <!--
                  <el-input v-model.trim="formData.param.averageStoreTarget"
                          placeholder="请输入"
                          type="number"
                          :disabled='isLook'
                          clearable />元
               -->
              </div>
              <div class="t-item flex3">
                <el-input v-model.trim="formData.param.averageStoreWeight"
                          placeholder="请输入"
                          type="number"
                          @mousewheel.native.prevent
                          :disabled='isLook'
                          clearable />%
              </div>
              <div class="t-item flex4 relative">
                <div>最低完成率≥
                  <el-input v-model.trim="formData.param.averageStoreProportion"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />% 按实际达成核算，否则0分
                </div>
                <div class='absolute'>最高完成率≥
                  <el-input v-model.trim="formData.param.averageTallestProportion"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />% 按100%核算，封顶100%
                </div>
              </div>
            </div>
            <!--averageStoreInfo 平均单店产出-->
            <el-table class="assessment-box"
                      :data="averageStoreInfo"
                      border>
              <el-table-column label="指标"
                               width="140"
                               align="right">
                <el-table-column prop="levelStr"
                                 label="级别"
                                 width="120"
                                 align="left"></el-table-column>
              </el-table-column>
              <el-table-column prop="num"
                               label="客户数"
                               align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.levelStore || scope.row.num || 0}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="target"
                               align="center"
                               label="目标金额">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.target"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />元
                </template>
              </el-table-column>
              <el-table-column prop="weight"
                               align="center"
                               label="权重">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.weight"
                            :disabled='isLook'
                            type="number"
                            @mousewheel.native.prevent
                            placeholder="请输入"
                            clearable />%
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer"
          v-if="typeOptions.optionType!='view'"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">保 存</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
    <serviceBusinessPerformance :showDialog.sync='showServiceBuyialog'
                                @settingPerformanceInfo='getSettingPerformanceInfo'
                                :optionValue='optionValue'
                                :settingPerformance='formData.param.settingPerformanceInfo'></serviceBusinessPerformance>
  </my-dialog>
</template>

<script> 
import {
  customerList
} from "@/api/customer/customer";
import { findProviderDept, getUsersByRole } from "@/api/common";
import serviceBusinessPerformance from './serviceBusinessPerformance'
import {
  modify,
  detail,
  settingDate,
  settingProvider,
  queryProviderStore,
  queryProviderStoreV2
} from "@/api/assessmentSettings";
export default {
  components: {
    serviceBusinessPerformance
  },
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    typeOptions: {
      required: false,
      type: Object,
      default: {
        identity: '',//身份 staff depart
        optionType: "add",
      }
    },
    role: {
      required: false,
      type: String,
      default: 'serviceProvider'
    }
  },
  data () {
    return {
      isChoose: [195],
      creatMonthArr: [],
      pickerOptions: this.getPickerOptions(),
      formData: {
        operatorType: '', //操作类型:add新增;update编辑;forbidden 禁用
        providerIds: '', //保存部门就是部门的数组providerIds
        param: {
          assessmentDate: '', //考核时段 yyyy-MM 暂时只有月份
          performanceTarget: '',//销售业绩目标
          performanceWeight: '',//销售业绩权重
          performanceProportion: "",// 销售业绩最低完成比例
          customerVisitTarget: '',//客户拜访目标数
          customerVisitWeight: '',//客户拜访权重
          customerVisitProportion: '',//客户拜最低完成比例
          storeSalesTarget: '',//门店动销数目标
          storeSalesWeight: '',//门店客户销量权重
          storeSalesProportion: '',//门店客户销量最低完成比例
          storeTallestProportion: '',//门店客户销量最高完成比例
          averageStoreTarget: '',//平均客户门店销量金额
          averageStoreWeight: '',//平均客户门店销量权重
          averageStoreProportion: '',//平均客户门店完成比例最低
          averageTallestProportion: '',//平均客户门店完成比例最高
          // storeSalesInfo: [],
          // averageStoreInfo: [],
          settingInfo: [],
          settingPerformanceInfo: [],//销售业绩目标
        },
      },
      customerQuery: {
        limit: 999,
        page: 1
      },
      customerList: [],
      rules: {
        providerIds: [{ required: true, message: "请选择", trigger: "blur" }],
        providerIds: [{ required: true, message: "请选择", trigger: "blur" }],
        'param.assessmentDate': [{ required: true, message: "请选择", trigger: "blur" }],
      },
      showMapDialog: false,
      // 部门插件
      departmentList: [],
      paementIds: [],
      arr: [],
      deptName: '',
      providerList: [],
      time: Date.now(),
      disProviderIds: [],//不可点击的服务商id
      disEdits: false,
      serviceProviderNumber: 0,
      userOptions: [],
      title: '',
      storeSalesInfo: [],
      averageStoreInfo: [],
      showServiceBuyialog: false,
      optionValue: '',
    };
  },
  watch: {
  },
  computed: {
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
    isLook () {
      return this.typeOptions.optionType == "view";
    },
  },
  methods: {
    // 销售业绩目标
    getSettingPerformanceInfo (val) {
      this.formData.param.settingPerformanceInfo = val
    },
    serviceBuyPerformance (val) {
      this.optionValue = val
      this.showServiceBuyialog = true
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
    // 门店动销数目标等于分数最高完成率
    getStoreSalesTarget (val) {

    },
    // 获取不可选择的日期
    getProvider (val) {
      if (val.length == 1) {
        this.serviceProviderNumber = 0
        this.queryProviderStore()
      } else {
        this.serviceProviderNumber = '--'
      }
      this.creatMonthArr = []
      let assessmentType = this.role == 'serviceProvider' ? 1 : 2
      settingDate({ providerIds: val, assessmentType: assessmentType }).then(res => {
        this.creatMonthArr = res.data
      })
        .catch(err => console.log(err));
      this.queryProviderStoreV2()//查询客户数
    },
    setVallNull (val) {
      this.averageStoreInfo = []
      this.storeSalesInfo = []
    },
    // 获取服务商已有门店数量
    queryProviderStore () {
      let providerId = this.formData.providerIds.length == 1 ? this.formData.providerIds[0] : ''
      let assessmentType = this.role == 'serviceProvider' ? 1 : 2
      queryProviderStore({ providerId: providerId, assessmentDate: this.formData.param.assessmentDate, assessmentType: assessmentType })
        .then(res => {
          this.serviceProviderNumber = res.data || 0
        })
        .catch(err => console.log(err));
    },
    // 查询客户数
    queryProviderStoreV2 () {
      let providerId = this.formData.providerIds
      let assessmentType = this.role == 'serviceProvider' ? 1 : 2
      let assessmentDate = this.formData.param.assessmentDate || this.$moment(new Date()).format("YYYY-MM")
      queryProviderStoreV2({ providerId: providerId, assessmentDate: assessmentDate, assessmentType: assessmentType })
        .then(res => {
          let tiem = JSON.parse(JSON.stringify(res.data));
          this.averageStoreInfo = tiem
          this.storeSalesInfo = res.data
          this.averageStoreInfo.forEach((item, index) => {
            item.type = 4 //指标类型 1销售业绩 2拜访 3动销 4 单店产出
          })
          this.storeSalesInfo.forEach((item, index) => {
            item.type = 3 //指标类型 1销售业绩 2拜访 3动销 4 单店产出
          })
        })
        .catch(err => console.log(err));
    },
    // 获取不能选中的服务商
    getMonth (val) {
      this.providerList.forEach((item, index) => {
        delete item.disable
      })
      // 清除员工
      this.userOptions.forEach((item, index) => {
        delete item.disable
      })
      let assessmentType = this.role == 'serviceProvider' ? 1 : 2
      settingProvider({ queryDate: val, assessmentType: assessmentType }).then(res => {
        this.disProviderIds = res.data
        let newArr = []
        this.disProviderIds.forEach((item, index) => {
          newArr.push({
            serviceProviderId: item,
            disable: true
          })
        })
        if (this.role == 'serviceProvider') {
          const arrs = this.providerList.map(item => {
            const data = newArr.find((i) => item.serviceProviderId == i.serviceProviderId)
            return {
              ...item,
              ...data,
            }
          })
          this.providerList = arrs
        } else {
          const arrs = this.userOptions.map(item => {
            const data = newArr.find((i) => item.id == i.serviceProviderId)
            return {
              ...item,
              ...data,
            }
          })
          this.userOptions = arrs
        }
      })
        .catch(err => console.log(err));

      if (this.formData.providerIds.length == 1) {
        this.queryProviderStore()
      } else {
        this.serviceProviderNumber = '--'
      }
      this.queryProviderStoreV2()
    },
    getPickerOptions () {
      const self = this
      return {
        disabledDate: (time) => {
          var year = time.getFullYear()
          var month = time.getMonth() + 1
          if (month < 10) { month = '0' + month }
          var ym = year + '-' + month
          //把所有年月和需要建立的月份匹配,把没有匹配上的返回出去,让月份选择器可选
          return ((time.getTime() < Date.now() - 8.64e7) || this.creatMonthArr.includes(ym))
        }
        // 不能选择当天之前的
        // disabledDate (time) {
        //   return time.getTime() < 1622512084390 - 8.64e7;
        // },
      };
    },
    // 查询所有服务商
    findProviderDept () {
      findProviderDept()
        .then(res => {
          this.providerList = res.data;
        })
        .catch(err => console.log(err));
    },
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let param = this.formData.param
          // !Number(param.performanceTarget) ||
          if (Number(param.performanceWeight) && (!Number(param.performanceProportion))) {
            this.$message({
              message: '请完善销售业绩的分数',
              type: "warning"
            });
            return
          }
          if ((Number(param.performanceWeight) || (Number(param.performanceProportion))) && (param.settingPerformanceInfo.length) == 0) {
            this.$message({
              message: '请完善销售目标的编辑',
              type: "warning"
            });
            return
          }
          if (Number(param.performanceProportion) && (!Number(param.performanceWeight))) {
            this.$message({
              message: '请完善销售业绩的权重',
              type: "warning"
            });
            return
          }
          if (Number(param.customerVisitWeight) && (!Number(param.customerVisitTarget) || !Number(param.customerVisitProportion))) {
            this.$message({
              message: '请完善客户拜访的目标或分数',
              type: "warning"
            });
            return
          }
          if (Number(param.customerVisitTarget) && (!Number(param.customerVisitWeight) || !Number(param.customerVisitProportion))) {
            this.$message({
              message: '请完善客户拜访的权重或分数',
              type: "warning"
            });
            return
          }
          if (Number(param.customerVisitProportion) && (!Number(param.customerVisitTarget) || !Number(param.customerVisitWeight))) {
            this.$message({
              message: '请完善客户拜访的目标或权重',
              type: "warning"
            });
            return
          }
          // !Number(param.storeSalesTarget) ||
          if (Number(param.storeSalesWeight) && (!Number(param.storeSalesProportion))) {
            this.$message({
              message: '请完善门店动销数的分数',
              type: "warning"
            });
            return
          }
          if (Number(param.storeSalesProportion) && (!Number(param.storeSalesWeight))) {
            this.$message({
              message: '请完善门店动销数的权重',
              type: "warning"
            });
            return
          }
          // !Number(param.averageStoreTarget) ||
          if (Number(param.averageStoreWeight) && (!Number(param.averageStoreProportion) || !Number(param.averageTallestProportion))) {
            this.$message({
              message: '请完善平均单店产出的目标或最低最高完成率',
              type: "warning"
            });
            return
          }
          // if (Number(param.averageStoreTarget) && (!Number(param.averageStoreWeight) || !Number(param.averageStoreProportion) || !Number(param.averageTallestProportion))) {
          //   this.$message({
          //     message: '请完善平均单店产出的权重或最低最高完成率',
          //     type: "warning"
          //   });
          //   return
          // }
          // !Number(param.averageStoreTarget) ||
          if (Number(param.averageStoreProportion) && (!Number(param.averageStoreWeight) || !Number(param.averageTallestProportion))) {
            this.$message({
              message: '请完善平均单店产出的目标或权重或最高完成率',
              type: "warning"
            });
            return
          }
          // !Number(param.averageStoreTarget) ||
          if (Number(param.averageTallestProportion) && (!Number(param.averageStoreWeight) || !Number(param.averageStoreProportion))) {
            this.$message({
              message: '请完善平均单店产出的最低完成率或目标或权重',
              type: "warning"
            });
            return
          }

          // 权重为不能为小数
          if ((parseInt(Number(param.performanceWeight)) != Number(param.performanceWeight)) ||
            (parseInt(Number(param.customerVisitWeight)) != Number(param.customerVisitWeight)) ||
            (parseInt(Number(param.storeSalesWeight)) != Number(param.storeSalesWeight)) ||
            (parseInt(Number(param.averageStoreWeight)) != Number(param.averageStoreWeight))) {
            this.$message({
              message: '权重不能存在小数',
              type: "warning"
            });
            return
          }

          if ((parseInt(Number(param.customerVisitTarget)) != Number(param.customerVisitTarget))) {
            this.$message({
              message: '客户拜访的目标必须是整数',
              type: "warning"
            });
            return
          }

          if (Number(param.performanceWeight) + Number(param.customerVisitWeight) + Number(param.storeSalesWeight) + Number(param.averageStoreWeight) != 100) {
            this.$message({
              message: '权重之和必须为100，请重新输入',
              type: "warning"
            });
            return
          }

          // 门店动销数目标等于分数最高完成率
          // this.formData.param.storeTallestProportion = this.formData.param.storeSalesTarget

          if (Number(param.storeSalesProportion) > Number(param.storeTallestProportion)) {
            this.$message({
              message: '门店动销数的最低完成率不能高于最高完成率',
              type: "warning"
            });
            return
          }

          // averageStoreProportion: '',//平均客户门店完成比例最低
          // averageTallestProportion: '',//平均客户门店完成比例最高

          if (Number(param.averageTallestProportion) < Number(param.averageStoreProportion)) {
            this.$message({
              message: '平均单店产出的最低完成率不能高于最高完成率',
              type: "warning"
            });
            return
          }

          let storeSalesNum = this.storeSalesInfo.filter(item => item.weight).reduce((a, b) => {
            return a + Number(b.weight)
          }, 0);
          if (storeSalesNum != 100 && Number(param.storeSalesWeight)) {
            this.$message({
              message: '门店动销数权重和不为100，请重新输入',
              type: "warning"
            });
            return
          }
          let averageStoreNum = this.averageStoreInfo.filter(item => item.weight).reduce((a, b) => {
            return a + Number(b.weight)

          }, 0);
          if (averageStoreNum != 100 && Number(param.averageStoreWeight)) {
            this.$message({
              message: '平均单店产出权重和不为100，请重新输入',
              type: "warning"
            });
            return
          }
          this.formData.param.settingInfo = [...this.averageStoreInfo, ...this.storeSalesInfo]
          this.formData.operatorType = this.typeOptions.optionType
          modify(this.formData).then(res => {
            this.dialogVisible = false;
            this.$emit('updated')
          })
            .catch(err => console.log(err));
        } else {
          return false;
        }
      });
    },
    // 查询明细
    detail () {
      detail({ assessMentId: this.typeOptions.option.id })
        .then(res => {
          this.formData = res.data
          this.formData.providerIds = res.data.providerIds[0]
          this.time = new Date(this.formData.param.assessmentDate)
          this.averageStoreInfo = this.formData.param.averageStoreInfo
          this.storeSalesInfo = this.formData.param.storeSalesInfo
          this.averageStoreInfo.forEach((item, index) => { item.num = item.levelStore })
          this.storeSalesInfo.forEach((item, index) => { item.num = item.levelStore })
          this.getPickerOptions()
          this.queryProviderStore()
        })
        .catch(err => console.log(err));
    },
    open () {
      this.findProviderDept() //服务商列表
      this.getUsersByRole()
      this.formData.assessmentType = this.role == 'serviceProvider' ? 1 : 2
      this.title = this.typeOptions.optionType == 'add' && this.role == 'serviceProvider' ? '设置服务商考核规则' :
        this.typeOptions.optionType == 'update' && this.role == 'serviceProvider' ? '编辑服务商考核规则' :
          this.typeOptions.optionType == 'view' && this.role == 'serviceProvider' ? '查看服务商考核规则' :
            this.typeOptions.optionType == 'add' && this.role == 'staff' ? '设置员工考核规则' :
              this.typeOptions.optionType == 'update' && this.role == 'staff' ? '编辑员工考核规则' :
                this.typeOptions.optionType == 'view' && this.role == 'staff' ? '查看员工考核规则' : ''

      this.formData.operatorType = this.typeOptions.optionType
      if (this.formData.operatorType != 'add') {
        this.detail()
      } else {

      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        assessmentType: 1,// 服务商 2员工
        operatorType: '', //操作类型:add新增;update编辑;forbidden 禁用
        providerIds: '', //保存部门就是部门的数组providerIds
        param: {
          assessmentDate: '', //考核时段 yyyy-MM 暂时只有月份
          performanceTarget: '',//销售业绩目标
          performanceWeight: '',//销售业绩权重
          performanceProportion: "",// 销售业绩最低完成比例
          customerVisitTarget: '',//客户拜访目标数
          customerVisitWeight: '',//客户拜访权重
          customerVisitProportion: '',//客户拜最低完成比例
          storeSalesTarget: '',//门店动销数目标
          storeSalesWeight: '',//门店客户销量权重
          storeSalesProportion: '',//门店客户销量最低完成比例
          storeSalesTarget: '',//门店客户销量最高完成比例
          averageStoreTarget: '',//平均客户门店销量金额
          averageStoreWeight: '',//平均客户门店销量权重
          averageStoreProportion: '',//平均客户门店完成比例最低
          averageTallestProportion: '',//平均客户门店完成比例最高
          settingPerformanceInfo: [],
        },
      });
      this.disEdits = false
      this.creatMonthArr = []
      this.disProviderIds = []//不可点击的服务商id
      this.providerList = []
      this.time = Date.now()
      this.averageStoreInfo = []
      this.storeSalesInfo = []
      this.dialogVisible = false;

    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form {
  .el-form-item {
    width: 48%;
    display: inline-block;
  }
}
/deep/.el-input {
  width: 100px !important;
}
/deep/.el-select > .el-input {
  width: 100% !important;
}
/deep/.el-date-editor--month {
  width: 100% !important;
}
.decompose-box {
  .x-div2 {
    overflow: hidden;
    overflow-y: scroll;
    height: 400px;
  }
  .x-div2::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .x-div {
    .t-item {
      margin-bottom: 10px;
      display: flex;
      span {
        width: 100px;
        text-align: center;
      }
    }
    .inline {
      display: flex;
      width: 21%;
      button {
        margin: 0px 20px 0px 0px;
      }
    }
    .flex1 {
      flex: 0.3;
    }
    .flex2 {
      flex: 0.45;
    }
    .flex3 {
      flex: 0.4;
    }
    .flex4 {
      flex: 1;
    }
    .center {
      font-size: 15px;
      font-weight: 600;
    }
    .v-list {
      display: flex;
      align-items: center;
      padding: 0px 10px 10px 10px;
      line-height: 2em;
      justify-content: space-between;
    }
  }
}
/deep/.dialog-footer {
  padding: 30px 0 10px 0 !important;
}
.m-b30 {
  margin-bottom: 30px;
}
.rlative {
  position: relative;
}
.absolute {
  margin-top: 10px;
  left: 0px;
  position: absolute;
  top: 30px;
  font-size: 14px;
  span {
    color: red;
  }
}
</style>
<style >
.assessment-box {
  margin: 40px 0px 20px 130px;
  width: 80%;
}
.assessment-box thead.is-group th {
  background: none;
}
.assessment-box thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.assessment-box thead.is-group tr:first-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px;
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-57deg);
  transform-origin: top;
}
.assessment-box thead.is-group tr:last-of-type th:first-of-type:before {
  content: "";
  position: absolute;
  width: 1px;
  height: 100px;
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-56deg);
  transform-origin: bottom;
}
</style>