<template>
  <div>
    <h2 v-if="status == 0" class="wait_exam m100"><i class="el-icon-circle-check exam_icon green01"></i>资料已提交，等待平台审核！</h2>
    <div v-if="status == 1" class="m100">
      <h2 class="wait_exam"><i class="el-icon-circle-close exam_icon red01"></i>资料审核不通过</h2>
      <p class="red01">原因：{{remarks}}</p>
      <el-button class="filter-item mt_20" type="primary" @click="handleUpdata">去修改</el-button>
    </div>
    <h2 v-if="status == 3" class="wait_exam m100"><i class="el-icon-circle-check exam_icon green01"></i>缴费信息已提交，等待平台审核！</h2>
    <div v-if="status == 4" class="m100">
      <h2 class="wait_exam"><i class="el-icon-circle-close exam_icon red01"></i>缴费审核不通过</h2>
      <p class="red01">原因：{{remarks}}</p>
      <el-button class="filter-item mt_20" type="primary" @click="handleMoney">重新付款</el-button>
    </div>
    <h2 v-if="status == 5" class="wait_exam m100"><i class="el-icon-circle-check exam_icon green01"></i>认证已通过！</h2>
  </div>
</template>

<script>
  export default {
    props: {
      status: {
        required: true,
        type: [Number, String],
        default: ""
      },
      remarks: {
        required: false,
        type: String,
        default: ""
      },
    },
    data() {
      return {

      };
    },
    methods: {
      handleUpdata(){
        this.$emit("changeActive", 0, null);
      },
      handleMoney(){
        this.$emit("changeActive", 2, 2);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .m100{
    margin: 100px 0;
  }
  .wait_exam{
    display: flex;
    align-item: center;
    line-height: 60px;
    .exam_icon{
      font-size: 60px;
      margin-right: 10px;
    }
  }
</style>
