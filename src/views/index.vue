<template>
  <div></div>
</template>

<script>
import store from './../store'
import { mapGetters, mapActions } from "vuex";
export default {
  // permission_routes
  created () {
    // console.log('获取当前的对对对')

    if (this.$route.path == '/' || store.getters.permission_routes.some(r => r.path == this.$route.path)) {
      console.log('路由a：',store.getters.permission_routes)
      console.log('路由b：',store.getters.permission_routes[0].children[0].path)
      // console.log(store.getters.permission_routes)
      let firstUrl = store.getters.permission_routes[8].path + '/' + store.getters.permission_routes[8].children[0].path;
      // let firstUrl = store.getters.permission_routes[0].path + '/' + store.getters.permission_routes[0].children[0].path;
      // console.log('firstUrl' + firstUrl)
      this.$router.push({ path: firstUrl });
    }
  },
};
</script>


