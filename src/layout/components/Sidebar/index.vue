<template>
  <div :class="{'has-logo':showLogo,'nav_two_none':activeRouteList.filter(item=>!item.hidden).length<1}">
    <el-scrollbar wrap-class="scrollbar-wrapper nav_one">
      <router-bar class="top_bar_container" />
    </el-scrollbar>
    <el-scrollbar :wrap-class="['scrollbar-wrapper','nav_two',activeRouteList.filter(item=>!item.hidden).length<1?'nav_two_none':'']">
      <el-menu :default-active="activeSidebarMenu"
               :collapse="isCollapse"
               :background-color="variables.menuBg"
               :text-color="variables.menuText"
               :unique-opened="true"
               :active-text-color="variables.siderText"
               :collapse-transition="false"
               mode="vertical">
        <sidebar-item v-for="(route, index) in activeRouteList"
                      :key="route.path  + index"
                      :item="route"
                      :base-path="route.path" />
      </el-menu>
    </el-scrollbar>

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";


import { dict } from "@/api/common";
import RouterBar from "./../TopBar/RouterBar";
export default {
  components: { SidebarItem,RouterBar },
  data () {
    return {
      typeOptions: {
        operation: "add"
      },
      option: "",
      title: "",
    };
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters([
      "activeRouteList",
      "sidebar",
      "activeSidebarMenu",
      "activeMenu"
    ]),
    variables () {
      return variables;
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse () {
      return !this.sidebar.opened;
    }
  },
  watch: {
    $route (to, from) {
      this.findActiveMenu()
    }
  },
  mounted () {
    this.findActiveMenu();
  },
  methods: {
    ...mapActions(["set_sidebar_menu"]),
    findActiveMenu () {
      const route = this.$route;
      const { meta, path } = route;
      const data = this.activeRouteList.find(item => path.includes(item.path));
      this.set_sidebar_menu(path);
    },
  }
};
</script>

<style lang="scss">
  .nav_two_none{
    .nav_two{
      display: none;
    }
  }
.operation {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 20px;
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
  height: 40px;
}
  .nav_one{
    width: 147px;
    border-right: none !important;
    .el-menu-item{
      font-size: 12px;
      font-weight: normal;
      padding-left: 8px !important;
      &:hover{
        background-color: #283249 !important;
      }
    }
    .svg-icon{
      margin-right: 5px !important;
    }
    .el-menu-item.is-active{
      background: #283249!important;
      svg{
        color: #409EFF !important;
      }
    }
  }
  .nav_two{
    width: 167px;
    background: #fff;
    .el-menu-item{
      font-size: 12px;
      padding-left: 10px !important;
    }
    .el-menu-item.is-active{
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
    &.nav_two_none{
      /*display: none;*/
    }
  }
</style>
