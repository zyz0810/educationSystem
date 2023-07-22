<template>
  <my-dialog :visible="dialogVisible"
             :close-on-click-modal="false"
             width="50 %"
             @close="close"
             @open="open"
             :title="option == 'add' ? '新增员工信息' : '编辑员工信息'">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="150px"
             :rules="rules"
             class="formList">
      <el-form-item label="员工姓名"
                    prop="nickname">
        <el-input v-model.trim="formData.nickname"
                  maxlength=18
                  placeholder="员工姓名"
                  clearable />
      </el-form-item>
      <el-form-item label="登录账号（手机号）"
                    prop="username">
        <el-input :disabled="option == 'update'"
                  v-model.trim="formData.username"
                  placeholder="登录账号（手机号）"
                  clearable />
      </el-form-item>
      <el-form-item label="登录密码"
                    prop="password">
        <el-input v-model.trim="formData.password"
                  placeholder="登录密码"
                  clearable />
      </el-form-item>
      <el-form-item label="部门"
                    prop="deptId">
        <el-cascader :options="paementIds"
                     change-on-select
                     v-model="formData.deptId"
                     :props="propsParm"
                     clearable
                     @change="depart"></el-cascader>
      </el-form-item>
      <el-form-item label="职务"
                    prop="roleIds">
        <el-select placeholder="请选择"
                   filterable
                   multiple
                   v-model="formData.roleIds"
                   clearable>
          <el-option v-for="(item, index) in rolesList"
                     :key="index"
                     :label="item.roleName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别"
                    prop="sex">
        <el-radio v-model="formData.sex"
                  :label="0">男</el-radio>
        <el-radio v-model="formData.sex"
                  :label="1">女</el-radio>
      </el-form-item>
      <!--  <el-form-item label="所在地区"
                    prop="areaId">
        <el-cascader v-model="formData.areaId"
                     :options="areaList"
                     @change="handleChange"></el-cascader>
      </el-form-item>-->
      <el-form-item label="经营地址"
                    prop="areaId">
        <el-input v-model.trim="formData.companyArea"
                  @focus="areaTab = true"
                  clearable
                  placeholder="请选择经营地址"
                  readonly
                  type="text" />
        <el-tabs type="border-card"
                 v-model="areaNameActive"
                 class="address-tab"
                 v-show="areaTab"
                 :before-leave="changeTab">
          <el-tab-pane label="省"
                       name="province">
            <p v-for="(item, index) in princeOptions"
               :key="index"
               @click="getCity(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="市"
                       name="city">
            <p v-for="(item, index) in cityOptions"
               :key="index"
               @click="getArea(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="区"
                       name="area">
            <p v-for="(item, index) in areaOptions"
               :key="index"
               @click="getStreet(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
          <el-tab-pane label="街道"
                       name="street">
            <p v-for="(item, index) in streetOptions"
               :key="index"
               @click="getAreaId(item.name, item.id)">
              {{ item.name }}
            </p>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="直属上级">
        <el-select filterable
                   v-model="formData.leaderId"
                   placeholder="直属上级">
          <el-option v-for="(item, index) in dataListAll"
                     :key="index"
                     :label="item.nickname"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                        clearable
                        type="datetime"
                        v-model="formData.joinDate"
                        placeholder="入职时间"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button v-if="option == 'add'"
                 type="primary"
                 :loading="load"
                 @click="save">确 定</el-button>
      <el-button v-else
                 type="primary"
                 :loading="load"
                 @click="modify">确 定</el-button>
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
export default {
  props: {
    showDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    option: {
      required: false,
      type: String,
      default: "add"
    },
    currentId: {
      required: false,
      type: [String, Number],
      default: ""
    },
    selectList: {
      required: false,
      type: Array,
      defalut: []
    },
    departmentList: {
      required: false,
      type: Array,
      defalut: []
    },
    rolesList: {
      type: Array,
      defalut: []
    },
    id: {
      required: false,
      type: String,
      default: ""
    },
    // areaList: {
    //   required: true,
    //   type: Array,
    //   defalut: []
    // }
  },
  data () {
    return {
      imgDialogVisible: false,
      step: 0,
      formData: {
        id: "", //编辑id
        nickname: "",
        username: "",
        password: "",
        deptId: "",
        roleIds: [],
        sex: "",
        areaId: "",
        companyArea: '',
        leaderId: "",
        joinDate: '',
      },
      dialogImageUrl: "",
      imageUrl: "",
      rules: {
        nickname: [
          { required: true, message: "请输入员工姓名", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输手机号(登录名)", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^1[3-9]\d{9}$/.test(value)) {
                cb();
              } else {
                cb(new Error("请输入正确的手机格式"));
              }
            }
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        roleIds: [{ required: true, message: "请选择职务", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        areaId: [
          { required: true, message: "请输入所在地区", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" }
        ]
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
    };
  },
  computed: {
    ...mapGetters(["name"]),
    idDisabled () {
      return this.selectList.length < 1;
    },
    dialogVisible: {
      get () {
        return this.showDialog;
      },
      set (value) {
        this.$emit("update:show-dialog", value);
      }
    }
  },
  mounted () {
    // this.findAreaTree(); // 获取省市区
    // this.findAreaChilds(); //区域名称
    this.getProvice();
  },
  methods: {
    get () {
      this.areaTab = true;
      this.getProvice();
    },
    // 省份
    getProvice () {
      this.formData.areaId = "0000"; //默认
      findAreaChilds().then((res) => {
        this.princeOptions = res.data;
      });
    },
    // 城市
    getCity (name, id) {
      this.provinceName = name;
      this.cityName = "";
      this.areaName = "";
      this.streetName = "";
      this.formData.companyArea = name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.cityOptions = res.data;
        this.areaNameActive = "city";
      });
    },
    // 区域
    getArea (name, id) {
      this.cityName = name;
      this.areaName = "";
      this.streetName = "";
      this.formData.companyArea = this.provinceName + " / " + name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.areaOptions = res.data;
        this.areaNameActive = "area";
        if (res.data.length < 1) {
          this.formData.areaId = id;
          this.areaTab = false;
        }
      });
    },
    // 街道
    getStreet (name, id) {
      this.areaName = name;
      this.streetName = "";
      this.formData.companyArea = this.provinceName + " / " + this.cityName + " / " + name;
      this.formData.areaId = id;
      findAreaChilds({ id: id }).then((res) => {
        this.streetOptions = res.data;
        this.areaNameActive = "street";
        if (res.data.length < 1) {
          this.areaTab = false;
        }
      });
    },
    // 获取区域id
    getAreaId (name, id) {
      this.streetName = name;
      this.formData.companyArea =
        this.provinceName +
        " / " +
        this.cityName +
        " / " +
        this.areaName +
        " / " +
        name;
      this.formData.areaId = id;
      this.areaTab = false;
    },
    // 省市区tab切换
    changeTab (activeName, oldActiveName) {
      if (activeName == "city") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        }
      } else if (activeName == "area") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        } else if (this.cityName == "") {
          this.areaNameActive = "city";
          return false;
        }
      } else if (activeName == "street") {
        if (this.provinceName == "") {
          this.areaNameActive = "province";
          return false;
        } else if (this.areaName == "") {
          this.areaNameActive = "area";
          return false;
        } else if (this.cityName == "") {
          this.areaNameActive = "city";
          return false;
        }
      }
    },
    // 获取所有的用户列表
    getListAll () {
      this.listQuery.limit = 10000000;
      getUsersSuperior(this.listQuery)
        .then(res => {
          // let peon = this.dataListAll.reduce((cur, next) => {
          //   obj[next.nickname] ? "" : (this.name = true && cur.push(next));
          //   return cur;
          // }, []); //设置cur默认类型为数组，并且初始值为空的数组

          // 直属上级过滤掉自己
          // this.dataListAll = res.data.filter(item => {
          //   return item.nickname !== this.name
          // }).map(item => {
          //   return item
          // })
          this.dataListAll = res.data

          // let hidden = "" //判断直属上级是否有权限   false没有权限
          // this.dataListAll.forEach((item) => {
          //   hidden = item.id == this.formData.leaderId
          // })
          // this.formData.leaderId = hidden != false ? this.formData.leaderId : ""
          // hidden == false ? this.dataListAll = [] : this.dataListAll
        })
        .catch(err => console.log(err));
    },
    // 父组件触发子组件
    parentMsg (id) {
      let data = {
        userId: id
      };
      getCrmUserById(data)
        .then(res => {
          if (res.resp_code == 0) {
            this.formData = res.data;
            this.formData.companyArea = this.formData.areaName  //地址回显
            this.formData.joinDate = this.$moment(this.formData.joinDate || this.formData.createTime).format("YYYY-MM-DD HH:mm:ss")
            // || this.$moment().format("YYYY-MM-DD HH:mm:ss")
            if (res.data.roleIds != "") {
              this.formData.roleIds = res.data.roleIds
                .split(",")
                .map(item => Number(item));
            } else {
              this.formData.roleIds = [];
            }
          } else {
            this.$message({ message: res.resp_msg, type: "warning" });
          }
        })
        .catch(err => console.log(err));
    },
    // 获取省市区
    findAreaTree () {
      findAreaTree()
        .then(res => {
          this.areaList = getCascaderOptions(res.data, []);
        })
        .catch(err => console.log(err));
    },
    // 地区选中的id
    handleChange (value) {
      this.formData.areaId = value[value.length - 1];
    },
    depart (value) {
      this.formData.deptId = value[value.length - 1];
    },
    // 获取部门
    getdeptId (val) {
      this.deptName = val.deptName;
      this.formData.deptId = val.id;
    },
    // 新增
    save () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.load = true
          let formData = Object.assign({}, this.formData);
          if (formData.roleIds.length > 0) {
            formData.roleIds = formData.roleIds.join(",");
          } else {
            formData.roleIds = "";
          }
          saveSysUser(formData)
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
        } else {
          return false;
        }
      });
    },
    // 编辑
    modify () {
      this.rules.password[0].required = false;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.load = true
          this.formData.id = this.selectList[0].id;
          let formData = Object.assign({}, this.formData);
          if (formData.roleIds.length > 0) {
            formData.roleIds = formData.roleIds.join(",");
          } else {
            formData.roleIds = "";
          }
          saveSysUser(formData)
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
        } else {
          return false;
        }
      });
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
    open () {
      Object.assign(this.formData, this.selectList);
      this.paementIds = this.department(this.departmentList, []);
      // this.findAreaTree();
      this.getListAll();
    },
    close () {
      this.$refs.ruleForm.clearValidate();
      Object.assign(this.formData, {
        id: "", //编辑id
        nickname: "",
        username: "",
        password: "",
        deptId: "",
        roleIds: "",
        sex: "",
        areaId: "",
        areaId: "0000",
        companyArea: '',
        leaderId: "",
        joinDate: "",
      });
      this.areaNameActive = "province"
      this.areaTab = false
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
</style>
