<template>
      <ul class="role">
<!--        <li @click="queryList('')" :class="[roleCurrent == ''?'active':'','pointer']">全部</li>-->
        <li v-for="(item,index) in roleList" :key="index" @click="queryList(item.id)" :class="[roleCurrent == item.id?'active':'','pointer']">{{item.name}}</li>
      </ul>
</template>

<script>

export default {
  props:{
    roleList:{
      required: true,
      type:Array,
      default:[]
    },
    roleCurrent:{
      required: false,
      type:[String,Number],
      default:''
    },
  },
  data () {
    return {
      // roleCurrent:'',
    };
  },
  // computed: {
  //   roleArr: {
  //     get () {
  //       return this.roleList;
  //     },
  //   },
  //
  // },
  methods: {
    queryList(role){
      // this.roleCurrent = role;
      this.$emit('queryList',role);
    },
}
};
</script>

<style lang="scss" scoped>
  .role{
    border-radius: 4px;
    background: #fff;
    padding: 10px 10px 10px 0;
    line-height: 3.2;
    /*border-right: 5px solid #f0f2f5;*/
    width:150px;
    height: 100%;
    margin-right: 5px;
    flex-shrink: 0;
    font-size: 14px;
    li{
      padding-left: 15px;
      &.active{
        background: #E6F5FF !important;
        position: relative;
        /*border-left: 5px solid #1880FF;*/
        &::before{
          border-left: 3px solid #1880FF;
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          color: #1880FF;
          /*-webkit-transform-origin: 0 0;*/
          /*transform-origin: 0 0;*/
          /*-webkit-transform: scaleY(0.5);*/
          /*transform: scaleY(0.5);*/
          z-index: 2;
        }
      }
    }

  }
</style>
