<template>
  <div :class="classObj"
       class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside" />
    <top-view />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}"
         class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
<!--        <navbar />-->
        <!--tab切换 菜单下面的-->
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import {
  AppMain,
  Navbar,
  Settings,
  Sidebar,
  TagsView,
  TopView
} from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState,mapGetters } from "vuex";

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    TopView,
    Settings,
    Sidebar,
    TagsView
  },
  // mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      "activeRouteList",
    ]),
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
        nav_two_none:this.activeRouteList.filter(item=>!item.hidden).length<1
      };
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  overflow: hidden;
  min-height: 100vh;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
