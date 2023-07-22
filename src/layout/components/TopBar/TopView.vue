<template>
  <div class="navbar">
    <logo v-if="showLogo"
          :collapse="isCollapse"
          class="logo" />
<!--    <hamburger id="hamburger-container"-->
<!--               :is-active="sidebar.opened"-->
<!--               class="hamburger-container"-->
<!--               @toggleClick="toggleSideBar" />-->

<!--    <router-bar class="top_bar_container" />-->
    <div class="right-menu">
      <span class="tip pointer"><i class="el-icon-bell f16 bold"></i></span>
      <el-dropdown class="avatar-container right-menu-item hover-effect"
                   trigger="click">
        <div class="avatar-wrapper">
          <!--src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"-->
          <el-avatar size="small"
                     v-bind:src="imgURL"></el-avatar>

        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/datum/datum">
            <el-dropdown-item>查看资料</el-dropdown-item>
          </router-link>
          <router-link to="/password/password">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided
                            @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Logo from "../Sidebar/Logo";
import RouterBar from "./RouterBar";
import Hamburger from "@/components/Hamburger";

export default {
  data () {
    return {
      imgURL: require('../../../assets/image/head Portrait.png'),
    };
  },
  computed: {
    ...mapGetters([
      "avatar",
      "device",
      "sidebar",
      "permission_routes",
      "name",
      "agent_number",
      "ineffective_count",
      "will_effective_count",
      "provider_status",
      "provider_type",
      "customer_store_ids"
    ]),
    setting: {
      get () {
        return this.$store.state.settings.showSettings;
      },
      set (val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse () {
      return !this.sidebar.opened;
    }
  },
  components: {
    Logo,
    RouterBar,
    Hamburger
  },
  mounted () {
    this.getBacklog();
  },
  methods: {
    ...mapActions(["set_route", "set_route_List", "getBacklog"]),
    async logout () {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          // location.href = "/index";
          this.$router.push(`/login?redirect=/dashboard`);
        });
      });
    },
    handleChange (val,) {
      if (val == 'customerStoreIds') {
        this.$router.push({ path: '/customer', query: { customerStoreIds: 'ids' } });
      } else {
        this.$router.push({ path: '/customer', query: { certificateStatus: val, } });
      }
      this.set_route("");
      const arr = this.permission_routes.find(item => item.path == "");
      this.set_route_List(arr.children || []);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 129px 5px 10px rgba(0, 21, 41, 0.08);
  /*box-shadow: 0 10px 4px red;*/
  position: relative;
  display: flex;
  z-index: 3;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .logo {
    width: 130px;
  }
  .right-menu {
    flex: 1;
    display: flex;
   justify-content: right;
    align-items: center;
    text-align: right;
    height: 50px;
    line-height: 50px;
    box-shadow: 10px 10px 5px red;

    &:focus {
      outline: none;
    }
    .el-icon-arrow-down {
      color: #ffffff;
    }
    .avatar-wrapper {
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 12px;
        margin-left: 10px;
      }
      .el-icon-arrow-down:before {
        margin-left: 10px;
        font-weight: bold;
      }
    }
    .tip{
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
    }
    .right-menu-item {
      /*display: inline-block;*/
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      display: flex;
      justify-content: center;


      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        /*&:hover {*/
        /*  background: rgba(0, 0, 0, 0.08);*/
        /*}*/
      }
    }
  }
}

.dropdown_item {
  min-width: 120px;
  display: flex;
  justify-content: space-between;
}
.el-dropdown-link {
  font-family: 微软雅黑;
  font-weight: 400;
  color: #ffffff;
  font-style: normal;
  font-size: 14px;
  text-align: center;
  line-height: normal;
}
.top_bar_container {
  width: 600px;
}
</style>
