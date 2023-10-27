<template>
  <div></div>
</template>

<script>
import store from './../store'
export default {
  // permission_routes
  created () {
    if (this.$route.path == '/' || store.getters.permission_routes.some(r => r.path == this.$route.path)) {
      // console.log(store.getters.permission_routes)
      let firstUrl = store.getters.permission_routes[7].path + '/' + store.getters.permission_routes[7].children[0].path;
      // let firstUrl = store.getters.permission_routes[0].path + '/' + store.getters.permission_routes[0].children[0].path;
      this.$router.push({ path: firstUrl });
    }
  },
};
</script>


