<template>
<!--  <div class="sidebar-logo-container" :class="{'collapse':collapse}">-->
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
         <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">{{ title }}</span>
<!--        <img v-if="logo2" :src="logo2" class="sidebar-logo" />-->
<!--        <span class="sidebar-title">{{ title2 }}</span>-->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
         <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">{{ title }}</span>
<!--        <img v-if="logo2" :src="logo2" class="sidebar-logo" />-->
<!--        <span class="sidebar-title">{{ title2 }}</span>-->
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from "@/assets/logo/logo.png";
import logoImg2 from "@/assets/logo/logo2.png";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title2: "康药麦麦",
      title: "鑫规泽教育",
      logo: logoImg,
      logo2: logoImg2
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #38486B;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      /*font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";*/
      font-style: normal;
      line-height: 28px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
