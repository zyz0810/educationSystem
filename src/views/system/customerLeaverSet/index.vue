<template>
  <div class="app-container leaver-set-box">
    <el-form ref="ruleForm"
             :model="formData"
             label-width="30vw"
             class="formList ">
      <el-form-item v-for='(item,index) in leaveList'
                    :key='index'
                    :label="item.dictName"
                    prop="leaveId">
        <span class="star">*</span>
        <span class="m-r">≥</span>
        <el-input v-model.trim="item.value"
                  maxlength=18
                  type="number"
                  placeholder="请输入月销售额指标"
                  clearable />
        <span v-if=' index !=0 '> 且< </span>
            <el-input v-if='index != 0 '
                      v-model.trim="leaveList[index-1].value"
                      disabled
                      placeholder="月销售额指标"
                      clearable />
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 v-rules="{ admin: 'admin', ordinary: 'customer-level:edit' }"
                 @click="save">确 定</el-button>
      <el-button class="ml_30"
                 @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { dict } from "@/api/common";
import {
  getConfig,
  saveConfig,
} from "@/api/customerLeaverSet";
import { mapActions, mapGetters } from "vuex";
export default {
  data () {
    return {
      leaveList: [],
      formData: {
        id: "", //编辑id 
      },
    }
  },
  computed: {
    ...mapGetters(["follow_List", "level_List"]),
  },
  mounted () {
    this.getDict()
  },
  methods: {
    getDict () {
      dict().then(res => {
        const data = res.data
        this.leaveList = data.find(item => item.dictType == 'customer_level').dataList
        this.getConfig()
      })
        .catch(err => console.log(err));
    },
    getConfig () {
      getConfig()
        .then(res => {
          const arr = res.data.map((item, index) => {
            return {
              dictName: item.customerLevelName,
              dictCode: item.customerLevelId,
              value: item.value,
              id: item.id,
            }
          })
          this.leaveList = arr
        })
        .catch(err => {
          this.load = false
        });
    },
    save () {
      const crmCustomerLevelAmountList = this.leaveList.map((item, index) => {
        return {
          customerLevelId: item.dictCode,
          id: item.id,
          value: item.value
        }
      })
      const boo = crmCustomerLevelAmountList.every((item) => {
        if (!item.value) {
          return false
        } else {
          return true;
        }
      });
      if (!boo) {
        this.$message({ message: "请完善等级设置", type: "warning" });
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          saveConfig({ crmCustomerLevelAmountList: crmCustomerLevelAmountList })
            .then(res => {
              if (res.resp_code == 0) {
                this.$message({ message: res.resp_msg, type: "success" });
                this.getConfig()
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
    cancel () {
      this.getConfig()
    }
  }
}
</script>

<style lang="scss" scope>
.el-input {
  width: 180px;
}
.el-form-item__content {
  position: relative;
}
.star {
  position: absolute;
  left: -33px;
  color: red;
  top: 2px;
}
.m-r {
  margin: 0px 10px 0px 0px;
}
.leaver-set-box {
  background: white;
  width: calc(100% - 40px);
  height: 85vh;
  margin: 20px;
}
</style>