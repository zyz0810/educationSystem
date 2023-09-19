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
<!--      <span class="tip pointer"><i class="el-icon-bell f16 bold"></i></span>-->
      <el-dropdown class="avatar-container right-menu-item hover-effect"
                   trigger="click">
        <div class="avatar-wrapper">
          <el-avatar size="small" v-bind:src="imgURL"></el-avatar>
          <span class="login_name">{{name}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="my_account">
          <div class="flex my_info">
            <div class=""><el-avatar size="small" v-bind:src="imgURL" class="mr10"></el-avatar></div>
              <div class="flex_bd">
                <p>{{name}}</p>
                <p class="my_info_role">{{formatter(persona)}}</p>
              </div>
          </div>
          <router-link to="/roleManagement/team">
            <el-dropdown-item>账户设置</el-dropdown-item>
          </router-link>
          <router-link :to="{path: '/password', query: { type: 'update' }}">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided
                            @click.native="logout">
            <span>退出</span>
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
      "customer_store_ids",
      "persona"
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
    // this.getBacklog();
  },
  methods: {
    formatter(type){
      // super_manager 超级管理员, manager 管理员, supplier 供应商, custom_service 客服
      return type == 'super_manager' ? "超级管理员" : type == 'manager'? "管理员" : type == 'supplier'? "供应商" : type == 'custom_service'? "客服" : "";
    },
    ...mapActions(["set_route", "set_route_List", ]),
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
    },
    toggleSideBar () {
      this.$store.dispatch("app/toggleSideBar");
    },
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
    &.collapse{
      width: 54px;
      overflow: hidden;
    }
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
.avatar-container{
  font-size: 14px;
  color: #2B3F66;
  margin-right: 10px !important;
  .el-icon-arrow-down{
    font-size: 14px;
    color: #2B3F66;
  }
}
}
.login_name{
  font-size: 14px;
  color: #2B3F66;
}
.my_account{
  font-size: 14px;
  color:#2C4068;
  padding: 15px;

  .my_info{
    color:#2B3F66;
    margin: 0 0 10px 0;
    font-size: 14px;
    .my_info_role{
      font-size: 12px;
      color: #AFB7C7;
      margin-top: 8px;
    }
    p{
      margin: 0;
    }
  }
  .el-dropdown-menu__item{
    font-size: 14px;
    color:#2C4068;
    line-height: 2.6;
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
