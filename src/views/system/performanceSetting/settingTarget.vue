<template>
  <my-dialog :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%"
             @close="close"
             @open="open"
             top="15vh"
             :append-to-body="true"
             :title="textMap[typeOptions.optionType]">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="100px"
             :rules="rules"
             class="formList">
      <el-form-item v-if=" ['USER'].includes(typeOptions.identity)"
                    label="考核人员"
                    prop="ids">
        <el-select v-model="formData.ids"
                   filterable
                   multiple
                   clearable
                   @change='selectChangeMethod'
                   :disabled="typeOptions.optionType == 'edit'"
                   placeholder="请选择">
          <el-option v-for="item in usersList"
                     :label="item.nickname"
                     :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if=" ['DEPT'].includes(typeOptions.identity) && typeOptions.optionType == 'add'"
                    label="选择部门"
                    prop="ids">
        <el-cascader :options="paementIds"
                     change-on-select
                     v-model="formData.ids"
                     :props="propsParm"
                     @change="depart"
                     clearable></el-cascader>
      </el-form-item>
      <el-form-item v-if=" ['DEPT'].includes(typeOptions.identity) && typeOptions.optionType == 'edit' "
                    label="选择部门"
                    prop="ids">
        <el-input v-model.trim="deptName"
                  disabled
                  suffix-icon="el-icon-arrow-down"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="选择年份"
                    prop="year">
        <el-date-picker v-model.trim="formData.year"
                        :disabled="typeOptions.optionType == 'edit'"
                        type="year"
                        :picker-options="pickerOptions"
                        value-format="yyyy"
                        placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="年度目标"
                    prop="yearly">
        <el-input v-model.trim="formData.yearly"
                  @change="getYearly"
                  disabled
                  placeholder="请输入"
                  clearable />
        <span class="right">元</span>
      </el-form-item>
      <div class="decompose-box">
        <p class="x-p">目标分解</p>
        <div class="x-div">
          <div class="v-list">
            <div class="t-item">
              <span>第一季度</span>
              <el-input v-model.trim="formData.firstQuarter"
                        disabled
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>1月份</span>
              <el-input v-model.trim="formData.january"
                        @input="getJanuary($event)"
                        placeholder="请输入"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 1)'
                        @clear='clearInput("1")'
                        clearable />
            </div>
            <div class="t-item">
              <span>2月份</span>
              <el-input v-model.trim="formData.february"
                        @input="getFebruary($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 2)'
                        @clear='clearInput("2")'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>3月份</span>
              <el-input v-model.trim="formData.march"
                        @input="getMarch($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 3)'
                        @clear='clearInput("3")'
                        placeholder="请输入"
                        clearable />
            </div>
          </div>
          <div class="v-list">
            <div class="t-item">
              <span>第二季度</span>
              <el-input v-model.trim="formData.secondQuarter"
                        disabled
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>4月份</span>
              <el-input v-model.trim="formData.april"
                        @input="getApril($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 4)'
                        @clear='clearInput("4")'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>5月份</span>
              <el-input v-model.trim="formData.may"
                        @input="getMay($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 5)'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>6月份</span>
              <el-input v-model.trim="formData.june"
                        @input="getJune($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 6)'
                        placeholder="请输入"
                        clearable />
            </div>
          </div>
          <div class="v-list">
            <div class="t-item">
              <span>第三季度</span>
              <el-input v-model.trim="formData.thirdQuarter"
                        disabled
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>7月份</span>
              <el-input v-model.trim="formData.july"
                        @input="getJuly($event)"
                        @clear='clearInput("7")'
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 7)'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>8月份</span>
              <el-input v-model.trim="formData.august"
                        @input="getAugust($event)"
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 8)'
                        @clear='clearInput("8")'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>9月份</span>
              <el-input v-model.trim="formData.september"
                        @input="getSeptember($event)"
                        @clear='clearInput("9")'
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 9)'
                        placeholder="请输入"
                        clearable />
            </div>
          </div>
          <div class="v-list">
            <div class="t-item">
              <span>第四季度</span>
              <el-input v-model.trim="formData.fourthQuarter"
                        disabled
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>10月份</span>
              <el-input v-model.trim="formData.october"
                        @input="getOctober($event)"
                        @clear='clearInput("10")'
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 10)'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>11月份</span>
              <el-input v-model.trim="formData.november"
                        @input="getNovember($event)"
                        @clear='clearInput("11")'
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 11)'
                        placeholder="请输入"
                        clearable />
            </div>
            <div class="t-item">
              <span>12月份</span>
              <el-input v-model.trim="formData.december"
                        @input="getDecember($event)"
                        @clear='clearInput("12")'
                        :disabled='(Number(formData.year) < Number(yearCurrent)) || ((Number(formData.year) == Number(yearCurrent))&&mounth >= 12)'
                        placeholder="请输入"
                        clearable />
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">保 存</el-button>
      <el-button class="ml_30"
                 @click="dialogVisible = false">取 消</el-button>
    </span>
  </my-dialog>
</template>

<script>
import {
  customerList
} from "@/api/customer/customer";
import {
  findDeptTree
} from "@/api/system/staff";
import {
  usersList
} from "@/api/task";
import {
  savePerformanceQQ,
  updateById,
  getPerformanceById
} from "@/api/performanceSetting";
export default {
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
    }
  },
  data () {
    return {
      textMap: {
        add: "新建目标",
        edit: "编辑目标",
      },
      formData: {
        performanceEnum: this.typeOptions.identity,// DEPT: 对应部门   USER: 对应员工
        ids: [], //保存员工就员工的数组ids; 保存部门就是部门的数组ids
        year: "",
        yearly: 0,
        firstQuarter: 0,
        secondQuarter: 0,
        thirdQuarter: 0,
        fourthQuarter: 0,
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0,
      },
      usersList: [],
      customerQuery: {
        limit: 999,
        page: 1
      },
      customerList: [],
      rules: {
        // yearly: [{ required: true, message: "请输入全年业绩", trigger: "blur" }],
        year: [{ required: true, message: "请选择年份", trigger: "blur" }],
        ids: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      showMapDialog: false,
      // 部门插件
      departmentList: [],
      paementIds: [],
      propsParm: {
        multiple: true,
        checkStrictly: true,
        value: "id",
        label: "deptName",
        children: "childrens"
      },
      arr: [],
      deptName: '',
      mounth: "",
      yearCurrent:'',
      pickerOptions: {
        disabledDate (time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
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
    // // 第一季度
    // getFirstQuarter () {
    //   this.formData.firstQuarter = (Number(this.formData.january) + Number(this.formData.february) + Number(this.formData.march)).toFixed(0)
    //   // this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
    //   //   + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    //   return this.formData.firstQuarter
    // },
    // // // 第二季度
    // getSecondQuarter () {
    //   this.formData.secondQuarter = (Number(this.formData.april) + Number(this.formData.may) + Number(this.formData.june)).toFixed(0)
    //   // this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
    //   //   + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    //   return this.formData.secondQuarter
    // },
    // // // 第三季度
    // getThirdQuarter () {
    //   this.formData.thirdQuarter = (Number(this.formData.july) + Number(this.formData.august) + Number(this.formData.september)).toFixed(0)
    //   // this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
    //   //   + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    //   return this.formData.thirdQuarter
    // },
    // // // 第四季度
    // getFourthQuarter () {
    //   this.formData.fourthQuarter = (Number(this.formData.october) + Number(this.formData.november) + Number(this.formData.december)).toFixed(0)
    //   // this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
    //   //   + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    //   return this.formData.fourthQuarter
    // },
  },
  methods: {
    selectChangeMethod(){
      this.$forceUpdate();
    },
    getYear () {
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);   //获取年份
      this.formData.year = this.$moment(date).format("YYYY");
    },
    // 查询部门树
    findDeptTree () {
      findDeptTree()
        .then(res => {
          this.departmentList = res.data;
          this.paementIds = this.department(this.departmentList, []);
        })
        .catch(err => console.log(err));
    },
    // 部门
    depart (value) {
      if (value) {
        // this.formData.ids = value[value.length - 1];
        this.formData.ids = value;
      }
    },
    // 部门筛选
    department (list, ids) {
      list.forEach((item, index) => {
        const data = {
          deptName: item.deptName,
          id: item.id
        };
        if (item.childrens.length) {
          this.department(item.childrens, (data.childrens = []));
        }
        ids.push(data);
      });
      return ids;
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.formData.ids = val.id;
    },
    // 员工列表
    getUsersList () {
      usersList(this.formData)
        .then(res => {
          this.usersList = res.data;
        })
        .catch(err => console.log(err));
    },
    // 获取客户列表
    getCustomerList () {
      customerList({ ...this.customerQuery, claimSearchType: 0, sortType: 4 })
        .then(res => {
        })
        .catch(err => console.log(err));
    },
    // 查询详情
    getPerformanceById () {
      getPerformanceById({ id: this.typeOptions.option.id })
        .then(res => {
          this.formData = res.data
          if (this.typeOptions.identity == 'USER') {
            this.formData.ids = [res.data.userId]
          } else {
            this.formData.ids = res.data.deptId
            this.deptName = res.data.userName
          }
        })
        .catch(err => console.log(err));
    },
    save () {
      if (this.typeOptions.identity == 'DEPT' && this.typeOptions.optionType == 'add') {  // 部门多选数组合并格式化
        // const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));
        // this.formData.ids = deepFlatten(this.formData.ids)
        let arr = this.formData.ids
        this.formData.ids = arr.map(item => item.length ? item[item.length - 1] : "").filter(item => item != "")
      }
      this.formData.performanceEnum = this.typeOptions.identity
      // 年度目标为0不能保存
      if (Number(this.formData.yearly) <= 0) {
        this.$message({
          message: '年度目标不能小于等于0，请完善信息',
          type: "warning"
        });
        return
      }
      // if (this.formData.january == '' && this.formData.january == undefined &&
      //   this.formData.february == '' && this.formData.february == undefined &&
      //   this.formData.march == '' && this.formData.march == undefined) {
      //   this.$message({
      //     message: '月份目标不能为空，请重新修改',
      //     type: "warning"
      //   });
      //   console.log(this.formData.january)
      //   console.log(this.formData.february)
      //   console.log(this.formData.march)
      //   console.log(1)
      //   return
      // }
      // if (this.formData.april == '' && this.formData.april == undefined &&
      //   this.formData.may == '' && this.formData.may == undefined &&
      //   this.formData.june == '' && this.formData.june == undefined) {
      //   this.$message({
      //     message: '月份目标不能为空，请重新修改',
      //     type: "warning"
      //   });
      //   console.log(this.formData.april)
      //   console.log(this.formData.may)
      //   console.log(this.formData.june)
      //   console.log(2)
      //   return
      // }
      // if (this.formData.july == '' && this.formData.july == undefined &&
      //   this.formData.august == '' && this.formData.august == undefined &&
      //   this.formData.september == '' && this.formData.september == undefined) {
      //   this.$message({
      //     message: '月份目标不能为空，请重新修改',
      //     type: "warning"
      //   });
      //   console.log(this.formData.july)
      //   console.log(this.formData.august)
      //   console.log(this.formData.september)
      //   console.log(3)
      //   return
      // }
      // if (this.formData.october == '' && this.formData.october == undefined &&
      //   this.formData.november == '' && this.formData.november == undefined &&
      //   this.formData.december == '' && this.formData.december == undefined) {
      //   this.$message({
      //     message: '月份目标不能为空，请重新修改',
      //     type: "warning"
      //   });
      //   console.log(this.formData.october)
      //   console.log(this.formData.november)
      //   console.log(this.formData.december)
      //   console.log(4)
      //   return
      // }
      this.formData.january = this.formData.january || 0
      this.formData.february = this.formData.february || 0
      this.formData.march = this.formData.march || 0
      this.formData.april = this.formData.april || 0
      this.formData.may = this.formData.may || 0
      this.formData.june = this.formData.june || 0
      this.formData.july = this.formData.july || 0
      this.formData.august = this.formData.august || 0
      this.formData.september = this.formData.september || 0
      this.formData.october = this.formData.october || 0
      this.formData.november = this.formData.november || 0
      this.formData.december = this.formData.december || 0
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.typeOptions.optionType == 'add') { //新增
            savePerformanceQQ(this.formData)
              .then(res => {
                if (res.resp_code == 0) {
                  this.$message({
                    message: res.resp_msg,
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.$emit("insertTask");
                } else {
                  this.$message({
                    message: res.resp_msg,
                    type: "warning"
                  });
                }
              })
              .catch(err => console.log(err));
          } else { //编辑
            delete this.formData.updateTime
            delete this.formData.createTime
            updateById(this.formData)
              .then(res => {
                this.dialogVisible = false;
                this.$emit("insertTask");
                this.$message({
                  message: '成功',
                  type: "success"
                });
              })
              .catch(err => console.log(err));
          }
        } else {
          return false;
        }
      });
    },
    // 年度目标
    getYearly (val) {
      // let yearlySum = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
      //   + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
      // if (Number(val) < Number(yearlySum)) {
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
      // } else {
      //   this.formData.yearly = val
      // }
    },
    // 一月
    getJanuary (val) {
      this.formData.january = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.firstQuarter = (Number(val) + Number(this.formData.february) + Number(this.formData.march)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 二月
    getFebruary (val) {
      this.formData.february = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.firstQuarter = (Number(this.formData.january) + Number(val) + Number(this.formData.march)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 三月
    getMarch (val) {
      this.formData.march = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.firstQuarter = (Number(this.formData.january) + Number(this.formData.february) + Number(val)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 四月
    getApril (val) {
      this.formData.april = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.secondQuarter = (Number(val) + Number(this.formData.may) + Number(this.formData.june)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 五月
    getMay (val) {
      this.formData.may = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.secondQuarter = (Number(this.formData.april) + Number(val) + Number(this.formData.june)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 六月
    getJune (val) {
      this.formData.june = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.secondQuarter = (Number(this.formData.april) + Number(this.formData.may) + Number(val)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 七月
    getJuly (val) {
      this.formData.july = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.thirdQuarter = (Number(val) + Number(this.formData.august) + Number(this.formData.september)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 八月
    getAugust (val) {
      this.formData.august = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.thirdQuarter = (Number(this.formData.july) + Number(val) + Number(this.formData.september)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 九月
    getSeptember (val) {
      this.formData.september = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.thirdQuarter = (Number(this.formData.july) + Number(this.formData.august) + Number(val)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 十月
    getOctober (val) {
      this.formData.october = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.fourthQuarter = (Number(val) + Number(this.formData.november) + Number(this.formData.december)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 十一月
    getNovember (val) {
      this.formData.november = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.fourthQuarter = (Number(this.formData.october) + Number(val) + Number(this.formData.december)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 十二月
    getDecember (val) {
      this.formData.december = val = (val.replace(/\D/g, '') == '' ? '' : parseInt(val))
      this.formData.fourthQuarter = (Number(this.formData.october) + Number(this.formData.november) + Number(val)).toFixed(0)
      this.formData.yearly = (Number(this.formData.firstQuarter) + Number(this.formData.secondQuarter)
        + Number(this.formData.thirdQuarter) + Number(this.formData.fourthQuarter)).toFixed(0)
    },
    // 清除默认0
    clearInput (val) {
      if (val == 1) {
        this.formData.january = 0
      } else if (val == 2) {
        this.formData.february = 0
      } else if (val == 3) {
        this.formData.march = 0
      } else if (val == 4) {
        this.formData.april = 0
      } else if (val == 5) {
        this.formData.may = 0
      } else if (val == 6) {
        this.formData.june = 0
      } else if (val == 7) {
        this.formData.july = 0
      } else if (val == 8) {
        this.formData.august = 0
      } else if (val == 9) {
        this.formData.september = 0
      } else if (val == 10) {
        this.formData.october = 0
      } else if (val == 11) {
        this.formData.november = 0
      } else if (val == 12) {
        this.formData.december = 0
      }
    },
    open () {
      var ndate = new Date();
      this.mounth = ndate.getMonth() + 1  //获取当前月份
      this.yearCurrent = ndate.getFullYear();
      console.log('mounth'+this.mounth)
      console.log('yearCurrent'+this.yearCurrent)
      // this.getCustomerList();
      this.getUsersList();
      this.findDeptTree()
      if (this.typeOptions.optionType == 'edit') {
        this.getPerformanceById()
      } else {
        this.getYear()
      }
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        performanceEnum: '',// DEPT: 对应部门   USER: 对应员工
        ids: [], //保存员工就员工的数组ids; 保存部门就是部门的数组ids
        year: "",
        yearly: 0,
        firstQuarter: 0,
        secondQuarter: 0,
        thirdQuarter: 0,
        fourthQuarter: 0,
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0,
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0,
      });
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
.right {
  position: absolute;
  padding: 0px 0px 0px 10px;
}
.decompose-box {
  margin-bottom: 20px;
  .x-div {
    display: flex;
    justify-content: space-between;
    .t-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span {
        width: 100px;
        text-align: center;
      }
    }
    .v-list {
      padding: 10px 10px 0px 10px;
      border: 1px solid #dedede;
      // margin-left: 20px;
      margin-left: 1%;
      width: 24%;
    }
  }
}
</style>
