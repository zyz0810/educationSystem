<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="85%"
             top="8vh"
             @close="close"
             @open="open"
             :title="textMap[rowInfo.operatorType]">
    <el-form :inline="true"
             :model="listQuery">
      <el-form-item label="选择员工">
        <el-select placeholder="选择员工"
                   filterable
                   :disabled='isCanView || rowInfo.operatorType == "update"'
                   v-model.trim="formData.userId"
                   clearable>
          <el-option v-for="(item, index) in userOptions"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="assessment-box">
      <div class="table-box">
        <div class="x-tr">
          <div class="border"></div>
          <div class="border2"></div>
          <div class="border3"></div>
          <div class="x-list t-header">指标名称</div>
          <div class="x-list2 t-header">权重%</div>
          <div class="x-list3 t-header">任务目标明细</div>
          <div class="x-list4 t-header">分数</div>
        </div>
        <div class="x-tr">
          <div class=" x-list t-border">销售业绩</div>
          <div class="border"></div>
          <div class="border2"></div>
          <div class="border3"></div>
          <div class=" x-list2 t-border">
            <el-input class="t-input"
                      :disabled='isCanView'
                      v-inputLimit='2'
                      v-model="formData.performanceWeight"
                      placeholder="请输入"></el-input>
          </div>
          <div class=" x-list3 t-border"></div>
          <div class=" x-list4 t-border">
            <div>
              <span>完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.performanceMinProportion"
                        placeholder="请输入"></el-input>
              <span>% 按实际达成核算，否则0分；是否100%封顶</span>
              <el-switch v-model="formData.isCap"
                         :disabled='isCanView'>
              </el-switch>
            </div>
          </div>
        </div>
        <div class="x-tr">
          <div class="x-list t-border">客户拜访</div>
          <div class="border"></div>
          <div class="border2"></div>
          <div class="border3"></div>
          <div class="x-list2 t-border">
            <el-input class="t-input"
                      :disabled='isCanView'
                      v-inputLimit='2'
                      v-model="formData.customerVisitWeight"
                      placeholder="请输入"></el-input>
          </div>
          <div class="x-list3 t-border">
            <div class="t-div"
                 v-for="(item,ia) in formData.crmAssessmentSettingCustomerVisitTargetList"
                 :key='ia'>
              <span>{{item.dictName}}：</span>
              <el-select placeholder="选择任务类型"
                         filterable
                         :disabled='isCanView'
                         v-model.trim="item.taskTypeId"
                         clearable>
                <el-option v-for="(items, indexs) in item.typeList"
                           :key="indexs"
                           :label="items.typeName"
                           :value="items.id" />
              </el-select>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='0'
                        v-model="item.targetQuantity"
                        placeholder="目标次数"></el-input>
              <el-input class="t-input"
                        type="number"
                        v-inputLimit='2'
                        :disabled='isCanView'
                        v-model="item.weight"
                        placeholder="权重"></el-input>
            </div>
          </div>
          <div class="x-list4 t-border">
            <div>
              <span>最低完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.customerVisitMinProportion"
                        placeholder="请输入"></el-input>
              <span>% 按实际达成核算，否则0分</span>
            </div>
            <div>
              <span>最高完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.customerVisitMaxProportion"
                        placeholder="请输入"></el-input>
              <span>% 按100%核算，封顶100%</span>
            </div>
          </div>
        </div>
        <div class="x-tr">
          <div class="x-list t-border">门店动销率</div>
          <div class="border"></div>
          <div class="border2"></div>
          <div class="border3"></div>
          <div class="x-list2 t-border">
            <el-input class="t-input"
                      :disabled='isCanView'
                      v-model="formData.storeSalesRateWeight"
                      v-inputLimit='2'
                      placeholder="请输入"></el-input>
          </div>
          <div class="x-list3 t-border">
            <div class="t-div"
                 v-for='(item,index) in formData.crmAssessmentSettingStoreSalesRateTargetList'
                 :key='index'>
              <span>{{item.dictName}}：</span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-model="item.rate"
                        v-inputLimit='2'
                        placeholder="动销率%"></el-input>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="item.weight"
                        placeholder="权重"></el-input>
            </div>
          </div>
          <div class="x-list4 t-border">
            <div>
              <span>最低完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.storeSalesRateMinProportion"
                        placeholder="请输入"></el-input>
              <span>% 按实际达成核算，否则0分</span>
            </div>
            <div>
              <span>最高完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.storeSalesRateMaxProportion"
                        placeholder="请输入"></el-input>
              <span>% 按100%核算，封顶100%</span>
            </div>
          </div>
        </div>
        <div class="x-tr">
          <div class="x-list t-border">单店销售额</div>
          <div class="border"></div>
          <div class="border2"></div>
          <div class="border3"></div>
          <div class="x-list2 t-border">
            <el-input class="t-input"
                      :disabled='isCanView'
                      v-inputLimit='2'
                      v-model="formData.storeAverageWeight"
                      placeholder="请输入"></el-input>
          </div>
          <div class="x-list3 t-border">
            <div class="t-div"
                 v-for='(item,index) in formData.crmAssessmentSettingStoreAverageAmountTargetList'
                 :key='index'>
              <span>{{item.dictName}}：</span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="item.weight"
                        placeholder="权重"></el-input>
            </div>
          </div>
          <div class="x-list4 t-border">
            <div>
              <span>最低完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.storeAverageMinProportion"
                        placeholder="请输入"></el-input>
              <span>% 按实际达成核算，否则0分</span>
            </div>
            <div>
              <span>最高完成率 ≥ </span>
              <el-input class="t-input"
                        :disabled='isCanView'
                        v-inputLimit='2'
                        v-model="formData.storeAverageMaxProportion"
                        placeholder="请输入"></el-input>
              <span>% 按100%核算，封顶100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer"
          v-if='!isCanView'
          class="dialog-footer">
      <el-button type="primary"
                 :loading="load"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  updateEnabled,
  findDeptTree,
  getRoles,
  saveSysUser,
  getCrmUserById,
  getUsers,
  getUsersSuperior,
} from "@/api/system/staff";
import { getUsersByRole } from "@/api/common";
import { getCascaderOptions } from "@/utils/common";
import { preventReClick } from "@/utils/prevent";
import { mapGetters } from "vuex";
import { findAreaTree, findAreaChilds } from "@/api/area";
import {
  settingPage,
  saveConfig,
  updateConfig,
  selectList,
  detail,
} from "@/api/appraisalIndicatorSetting";
import { dict } from "@/api/common";
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    rowInfo: {
      required: true,
      type: Object,
      default: {
        operatorType: "add",
      },
    },
    userOptions: {
      required: true,
      type: Array,
      default: [],
    },
  },
  data () {
    return {
      textMap: {
        update: "编辑考核指标",
        add: "新增考核指标",
        view: "查看考核指标",
        copy: "复制考核指标",
      },
      imgDialogVisible: false,
      step: 0,
      crmAssessmentSettingCustomerVisitTargetList: [],
      crmAssessmentSettingStoreSalesRateTargetList: [],
      crmAssessmentSettingStoreAverageAmountTargetList: [],
      formData: {
        id: '',//编辑需要
        userId: '',//员工id
        isCap: false, //销售业绩分数是否封顶	

        performanceMinProportion: '',//销售业绩完成率
        performanceWeight: '',//	销售业绩权重 	
        storeAverageMaxProportion: '',//	单店销售额最高完成率 
        storeAverageMinProportion: '',//	单店销售额最低完成率 

        customerVisitWeight: '',//客户拜访权重
        customerVisitMaxProportion: '',//客户拜访最高完成率
        customerVisitMinProportion: '',//客户拜访最低完成率
        // customerLevelId	客户等级id targetQuantity	客户拜访任务目标次数 taskTypeId	任务类型id weight	客户拜访任务目标权重
        crmAssessmentSettingCustomerVisitTargetList: [
          { customerLevelId: 'A', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          { customerLevelId: 'B', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          { customerLevelId: 'C', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          { customerLevelId: 'D', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
        ],

        storeSalesRateMaxProportion: '', //门店动销最高完成率	 
        storeSalesRateMinProportion: '',// 门店动销最低完成率	 
        storeSalesRateWeight: '', //门店动销率权重
        crmAssessmentSettingStoreSalesRateTargetList: [
          // { customerLevelId: 'A', rate: '', weight: '', },
          // { customerLevelId: 'B', rate: '', weight: '', },
          // { customerLevelId: 'C', rate: '', weight: '', },
          // { customerLevelId: 'D', rate: '', weight: '', },
        ], // customerLevelId	客户等级id weight门店动销率任务目标权重 rate门店动销率任务目标动销率

        storeAverageMaxProportion: '',//	单店销售额最高完成率 
        storeAverageMinProportion: '',//	单店销售额最低完成率 
        storeAverageWeight: '',//	单店销售额权重
        crmAssessmentSettingStoreAverageAmountTargetList: [
          // { customerLevelId: 'A', weight: '', },
          // { customerLevelId: 'B', weight: '', },
          // { customerLevelId: 'C', weight: '', },
          // { customerLevelId: 'D', weight: '', },
        ] //customerLevelId 客户等级 weight 单店销售额任务目标权重
      },
      dialogFormVisible: false,
      // areaList: [],
      propsParm: {
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      paementIds: [],
      dataListAll: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      load: false,
      areaList: [],
      areaNameActive: "province",
      state: "",
      // speed: 0,
      status: this.$route.query.status ? this.$route.query.status : "",
      areaTab: false,
      categoryOption: [],
      princeOptions: null,
      cityOptions: null,
      areaOptions: null,
      streetOptions: null,
      addressList: [],
      workTypeList: [],
    };
  },
  computed: {
    ...mapGetters(["name", 'level_List']),
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    },
    isCanView () {
      return this.rowInfo.operatorType == "view";
    },
  },
  mounted () {
  },
  methods: {
    // 新增
    save () {
      this.load = true
      delete this.formData.crmAssessmentSettingCustomerVisitTargetList.typeList
      if (this.formData.userId == '') {
        this.$message({
          message: '请选择员工',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.performanceWeight == '' || this.formData.performanceWeight < 0 || this.formData.performanceWeight > 100) {
        this.$message({
          message: '请输入销售业绩权重，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.performanceMinProportion == '' || this.formData.performanceMinProportion < 0 || this.formData.performanceMinProportion > 100) {
        this.$message({
          message: '请输入销售业绩完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.customerVisitWeight == '' || this.formData.customerVisitWeight < 0 || this.formData.customerVisitWeight > 100) {
        this.$message({
          message: '请输入客户拜访权重，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.customerVisitMinProportion == '' || this.formData.customerVisitMinProportion < 0 || this.formData.customerVisitMinProportion > 100) {
        this.$message({
          message: '请输入客户拜访最低完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.customerVisitMaxProportion == '' || this.formData.customerVisitMaxProportion < 0 || this.formData.customerVisitMaxProportion > 100) {
        this.$message({
          message: '请输入客户拜访最高完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeSalesRateWeight == '' || this.formData.storeSalesRateWeight < 0 || this.formData.storeSalesRateWeight > 100) {
        this.$message({
          message: '请输入门店动销率权重，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeSalesRateMinProportion == '' || this.formData.storeSalesRateMinProportion < 0 || this.formData.storeSalesRateMinProportion > 100) {
        this.$message({
          message: '请输入门店动销率最低完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeSalesRateMaxProportion == '' || this.formData.storeSalesRateMaxProportion < 0 || this.formData.storeSalesRateMaxProportion > 100) {
        this.$message({
          message: '请输入门店动销率最高完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeAverageWeight == '' || this.formData.storeAverageWeight < 0 || this.formData.storeAverageWeight > 100) {
        this.$message({
          message: '请输入单店销售额权重，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeAverageMinProportion == '' || this.formData.storeAverageMinProportion < 0 || this.formData.storeAverageMinProportion > 100) {
        this.$message({
          message: '请输入单店销售额最低完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.formData.storeAverageMaxProportion == '' || this.formData.storeAverageMaxProportion < 0 || this.formData.storeAverageMaxProportion > 100) {
        this.$message({
          message: '请输入单店销售额最高完成率，且不能大于100',
          type: "warning"
        });
        this.load = false
        return
      }
      if (this.rowInfo.operatorType == "add" || this.rowInfo.operatorType == "copy") {
        saveConfig(this.formData)
          .then(res => {
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.load = false
              this.dialogVisible = false;
              this.$emit("modify");
            } else {
              this.$message({ message: res.resp_msg, type: "warning" });
            }
          })
          .catch(err => {
            this.load = false
          });
      } else { //编辑
        updateConfig(this.formData)
          .then(res => {
            if (res.resp_code == 0) {
              this.$message({ message: res.resp_msg, type: "success" });
              this.load = false
              this.dialogVisible = false;
              this.$emit("modify");
            } else {
              this.$message({ message: res.resp_msg, type: "warning" });
            }
          })
          .catch(err => {
            this.load = false
          });
      }
    },
    getDict () {
      dict().then(res => {
        const data = res.data
        const arr = data.find(item => item.dictType == 'customer_level').dataList
        this.formData.crmAssessmentSettingCustomerVisitTargetList = arr.map((item, index) => {
          return {
            customerLevelId: item.dictCode,
            dictName: item.dictName,
          }
        })
        this.formData.crmAssessmentSettingStoreAverageAmountTargetList = arr.map((item, index) => {
          return {
            customerLevelId: item.dictCode,
            dictName: item.dictName,
          }
        })
        this.formData.crmAssessmentSettingStoreSalesRateTargetList = arr.map((item, index) => {
          return {
            customerLevelId: item.dictCode,
            dictName: item.dictName,
          }
        })
        // 选择任务类型  
        // 1 
        selectList({ customerLevelId: arr[0].dictCode })
          .then(res => {
            this.$set(this.formData.crmAssessmentSettingCustomerVisitTargetList[0], 'typeList', res.data)
            // this.formData.crmAssessmentSettingCustomerVisitTargetList[0].typeList = res.data
          })
          .catch(err => {
            this.load = false
          });
        // 2
        selectList({ customerLevelId: arr[1].dictCode })
          .then(res => {
            this.$set(this.formData.crmAssessmentSettingCustomerVisitTargetList[1], 'typeList', res.data)
            // this.formData.crmAssessmentSettingCustomerVisitTargetList[1].typeList = res.data
          })
          .catch(err => {
            this.load = false
          });
        // 3
        selectList({ customerLevelId: arr[2].dictCode })
          .then(res => {
            this.$set(this.formData.crmAssessmentSettingCustomerVisitTargetList[2], 'typeList', res.data)
            // this.formData.crmAssessmentSettingCustomerVisitTargetList[2].typeList = res.data
          })
          .catch(err => {
            this.load = false
          });
        // 4
        selectList({ customerLevelId: arr[3].dictCode })
          .then(res => {
            this.$set(this.formData.crmAssessmentSettingCustomerVisitTargetList[3], 'typeList', res.data)
            // this.formData.crmAssessmentSettingCustomerVisitTargetList[3].typeList = res.data
          })
          .catch(err => {
            this.load = false
          });
        if (this.rowInfo.operatorType != 'add') {
          this.listQuery.id = this.rowInfo.optionInfor.id
          this.detail()
        }
      })
        .catch(err => console.log(err));
    },
    // 获取所有的用户列表
    getListAll () {
      this.listQuery.limit = 10000000;
      getUsersSuperior(this.listQuery)
        .then(res => {
          this.dataListAll = res.data
        })
        .catch(err => console.log(err));
    },
    // 获取详情
    detail () {
      detail({ id: this.listQuery.id })
        .then(res => {
          const arr = res.data.crmAssessmentSettingCustomerVisitTargetList.map((item, index) => {
            const brr = this.formData.crmAssessmentSettingCustomerVisitTargetList.find(i => item.customerLevelId == i.customerLevelId)
            return {
              customerLevelId: item.customerLevelId,
              dictName: item.dictName,
              targetQuantity: item.targetQuantity,
              taskTypeId: item.taskTypeId,
              weight: item.weight,
              typeList: brr ? brr.typeList : []
            }
          })
          this.formData = res.data
          this.formData.crmAssessmentSettingCustomerVisitTargetList = arr
        })
        .catch(err => console.log(err));
    },
    open () {
      this.getListAll();
      this.getDict() //客户等级
      if (this.rowInfo.operatorType != 'add') {
        this.listQuery.id = this.rowInfo.optionInfor.id
        this.detail()
      }
    },

    close () {
      Object.assign(this.formData, {
        id: '',//编辑需要
        userId: '',//员工id
        isCap: false, //销售业绩分数是否封顶	

        performanceMinProportion: '',//销售业绩完成率
        performanceWeight: '',//	销售业绩权重 	
        storeAverageMaxProportion: '',//	单店销售额最高完成率 
        storeAverageMinProportion: '',//	单店销售额最低完成率 

        customerVisitWeight: '',//客户拜访权重
        customerVisitMaxProportion: '',//客户拜访最高完成率
        customerVisitMinProportion: '',//客户拜访最低完成率
        // customerLevelId	客户等级id targetQuantity	客户拜访任务目标次数 taskTypeId	任务类型id weight	客户拜访任务目标权重
        crmAssessmentSettingCustomerVisitTargetList: [
          // { customerLevelId: 'A', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          // { customerLevelId: 'B', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          // { customerLevelId: 'C', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
          // { customerLevelId: 'D', taskTypeId: '', targetQuantity: '', weight: '', typeList: [] },
        ],

        storeSalesRateMaxProportion: '', //门店动销最高完成率	 
        storeSalesRateMinProportion: '',// 门店动销最低完成率	 
        storeSalesRateWeight: '', //门店动销率权重
        crmAssessmentSettingStoreSalesRateTargetList: [
          // { customerLevelId: 'A', rate: '', weight: '', },
          // { customerLevelId: 'B', rate: '', weight: '', },
          // { customerLevelId: 'C', rate: '', weight: '', },
          // { customerLevelId: 'D', rate: '', weight: '', },
        ], // customerLevelId	客户等级id weight门店动销率任务目标权重 rate门店动销率任务目标动销率

        storeAverageMaxProportion: '',//	单店销售额最高完成率 
        storeAverageMinProportion: '',//	单店销售额最低完成率 
        storeAverageWeight: '',//	单店销售额权重
        crmAssessmentSettingStoreAverageAmountTargetList: [
          // { customerLevelId: 'A', weight: '', },
          // { customerLevelId: 'B', weight: '', },
          // { customerLevelId: 'C', weight: '', },
          // { customerLevelId: 'D', weight: '', },
        ] //customerLevelId 客户等级 weight 单店销售额任务目标权重
      });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 40px;
  .choose-input {
    border: 1px solid #dedede;
    padding: 0px 10px;
    box-sizing: border-box;
  }
}
.uploader {
  .el-upload--picture-card {
    display: none;
  }
}
#image_slot {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.address-tab {
  position: absolute;
  top: 38px;
  left: 0;
  width: 400px;
  z-index: 2003;
  /deep/.el-tabs__content {
    height: 180px;
    overflow-y: scroll;
    max-height: 180px !important;
    overflow: auto;
    padding: 15px 0 15px 15px !important;
  }
}
.table-box {
  width: 100%;
  border: 1px solid #f4f4f4;
  .x-tr {
    width: 100%;
    display: flex;
    align-items: center;
    justify-items: center;
    border: 1px solid #f4f4f4;
    position: relative;
    .x-list {
      flex: 0.2;
      padding: 8px 0px;
      box-sizing: border-box;
      text-align: center;
    }
    .x-list2 {
      flex: 0.3;
      text-align: center;
      padding: 8px 0px;
      box-sizing: border-box;
      .t-input {
        width: 90px;
      }
    }
    .x-list3 {
      flex: 0.9;
      text-align: left;
      padding: 8px 10px 8px 20px;
      box-sizing: border-box;
      // border-right: 1px solid #dedede;
      // border-left: 1px solid #dedede;
      .el-select {
        width: 140px;
        padding-right: 10px;
        .el-input {
          width: 140px;
        }
      }
      .t-input {
        width: 90px;
        margin: 0px 10px 4px 0px;
      }
    }
    .x-list4 {
      text-align: left;
      padding: 8px 15px;
      box-sizing: border-box;
      flex: 1;
      width: 45%;
      .t-input {
        width: 90px;
        margin-bottom: 4px;
      }
      /deep/.el-switch__core {
        margin-left: 10px !important;
      }
    }
    .t-header {
      background: #edf1f4;
      text-align: center;
      height: 36px;
      // border-left: 1px solid #dedede;
      // border-right: 1px solid #dedede;
      border-top: 1px solid #f4f4f4;
    }
    .t-border {
      // border: 1px solid #dedede;
    }
  }
}
/deep/table {
  border-spacing: 0px;
}
/deep/.el-form {
  padding: 0 0px;
}
.assessment-box {
  height: 64vh;
  overflow-y: scroll;
  padding: 0px 15px 0px 0px;
}
/deep/.dialog-footer {
  margin-top: 15px;
}
.border {
  position: absolute;
  border: 0.1px solid #f4f4f4;
  height: 100%;
  left: 8%;
}
.border2 {
  position: absolute;
  border: 0.1px solid #f4f4f4;
  height: 100%;
  left: 19.5%;
}
.border3 {
  position: absolute;
  border: 0.1px solid #f4f4f4;
  height: 100%;
  left: 57.8%;
}
</style>
