<template>
  <div :class="{'has-logo':showLogo}">
    <el-scrollbar wrap-class="scrollbar-wrapper nav_one">
      <router-bar class="top_bar_container" />
    </el-scrollbar>
    <el-scrollbar wrap-class="scrollbar-wrapper nav_two">
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
    <!--新建客户 -->
    <addCustomer :showDialog.sync="showAddCustomerDialog"
                 :typeOptions="typeOptions"
                 :option="option"
                 :title="title"
                 ref="child"
                 :levelOptions="levelOptions"
                 :sourceOptions="sourceOptions" />
    <addTask :showDialog.sync="showAddDialog"
             :typeOptions="typeOptions" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import addTask from "@/views/customer/seas/detail/addTask";
import addCustomer from "@/views/customer/customerList/add";
import { dict } from "@/api/common";
import RouterBar from "./../TopBar/RouterBar";
export default {
  components: { SidebarItem, addTask, addCustomer,RouterBar },
  data () {
    return {
      typeOptions: {
        operation: "add"
      },
      showAddDialog: false,
      showAddCustomerDialog: false,
      option: "",
      title: "",
      sourceOptions: [],
      levelOptions: []
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
    this.getSource();
    this.getLevel();
    this.getVisit();
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
    // 客户跟进类型
    getVisit () {
      let data = {
        dictType: "customer_follow"
      };
      dict(data)
        .then(res => {
          this.visitOptions = res.data[0].dataList;
        })
        .catch(err => console.log(err));
    },
    // 客户来源
    getSource () {
      let data = {
        dictType: "customer_source"
      };
      dict(data)
        .then(res => {
          this.sourceOptions = res.data[0].dataList;
        })
        .catch(err => console.log(err));
    },
    // 客户级别
    getLevel () {
      let data = {
        dictType: "customer_level"
      };
      dict(data)
        .then(res => {
          this.levelOptions = res.data[0].dataList;
          this.$emit("levelValue", this.levelOptions);
        })
        .catch(err => console.log(err));
    },
    addCustomer (val, id) {
      this.option = val;
      this.showAddCustomerDialog = true;
      if (val == "edit") {
        this.$refs.child.parentMsg(id);
      }
    }
  }
};
</script>

<style lang="scss" scope>
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
        width: 0px;
        color: #1880FF;
        /*-webkit-transform-origin: 0 0;*/
        /*transform-origin: 0 0;*/
        /*-webkit-transform: scaleY(0.5);*/
        /*transform: scaleY(0.5);*/
        z-index: 2;
      }
    }
  }
</style>
