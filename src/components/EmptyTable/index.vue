<template>
  <div class="empty_box">
    <img :src="imgEmpty" class="img_empty">
    <p class="txt_empty">暂无数据</p>
  </div>
</template>

<script>
  import imgEmpty from '@/assets/image/table_empty.png';
export default {
  name: "EmptyTable",
  props: {

  },
  data () {
    return {
      imgEmpty:imgEmpty

    };
  },
  computed: {


  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.empty_box{
  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center;*/
  padding: 50px 0;
  .img_empty{
    width: 50px;
  }
  .txt_empty{
    margin: 0;
    line-height: 1.5;
  }
}

</style>
