import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path(.*)',
            component: resolve => require(['@/views/redirect'], resolve)
        }]
    },
    {
        path: '/login',
        component: resolve => require(['@/views/login'], resolve),
        hidden: true
    },
    {
        path: '/404',
        component: resolve => require(['@/views/error/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: resolve => require(['@/views/error/401'], resolve),
        hidden: true
    },
    {
        path: '/datum',
        component: Layout,
        redirect: 'noRedirect',
        hidden: true,
        name: '查看资料',
        meta: {
            title: '查看资料',
            icon: 'chart'
        },
        children: [{
            path: 'datum',
            component: resolve => require(['@/views/datum/index'], resolve),
            name: 'datum',
            meta: {
                title: '查看资料',
                icon: 'iconfont icon-pencil'
            }
        }]
    },
    {
        path: '/password',
        component: Layout,
        redirect: 'noRedirect',
        hidden: true,
        name: '修改密码',
        meta: {
            title: '修改密码',
            icon: 'chart'
        },
        children: [{
            path: 'password',
            component: resolve => require(['@/views/password/index'], resolve),
            name: 'password',
            meta: {
                title: '修改密码'
            }
        }]
    },
  {
    path: '/root',
    component: resolve => require(['@/views/index'], resolve),
  },
  {
    path: '/',
    redirect: '/root',
  },
]

// 动态路由
export const asyncRoutes = [
  {
    // path: '',
    path: '/exam',
    component: Layout,
    // redirect: 'dashboard',
    redirect: 'noRedirect',
    name: '客户管理',
    // name: '资料审核',
    meta: {
      title: '客户管理',
      // title: '资料审核',
      icon: 'peoples',
      roles: [
        'admin',
        'panel',
        'customer',
        'customer:add',
        'customer:edit',
        'customer:del',
        'customer:transfer',
        'customer:enter:highsee',
        'customer:change:dealstatus',
        'customer:export',
        'customer:task:add',
        'customer:list',
        'customer:update:location',
        'customer:level:batch:update',
        'highsee',
        'highsee:distribution',
        'highsee:receive',
        'highsee:export',
        'highsee:list',
        // 'office',
        'office:point',
        'office:point:verify:yes',
        'office:point:verify:no',
        'office:point:update'
      ]
    },
    children: [
      {
        path: 'notice',
        component: resolve => require(['@/views/exam/notice/index'], resolve),
        name: 'notice',
        meta: {
          title: '公告审核',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      }, {
        path: 'user',
        component: resolve => require(['@/views/exam/user/index'], resolve),
        name: 'user',
        meta: {
          title: '个人信息审核',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },      {
        path: 'consultant',
        component: resolve => require(['@/views/customer/customerList/index'], resolve),
        name: 'consultant',
        meta: {
          title: '咨询师简介/定位审核',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },{
        path: 'openClass',
        component: resolve => require(['@/views/customer/customerList/index'], resolve),
        name: 'openClass',
        meta: {
          title: '公开课审核',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },{
        path: 'shareInfo',
        component: resolve => require(['@/views/customer/customerList/index'], resolve),
        name: 'shareInfo',
        meta: {
          title: '相关协议附录、清单隐私',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },{
        path: 'aboutUs',
        component: resolve => require(['@/views/customer/customerList/index'], resolve),
        name: 'aboutUs',
        meta: {
          title: '关于我们',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },

    ]
  },
  {
    // path: '',
    path: '/complaint',
    component: Layout,
    // redirect: 'dashboard',
    redirect: 'noRedirect',
    name: '投诉处理',
    // name: '资料审核',
    meta: {
      title: '投诉处理',
      // title: '资料审核',
      icon: 'peoples',
      roles: [
        'admin',
        'panel',
        'customer',
        'customer:add',
        'customer:edit',
        'customer:del',
        'customer:transfer',
        'customer:enter:highsee',
        'customer:change:dealstatus',
        'customer:export',
        'customer:task:add',
        'customer:list',
        'customer:update:location',
        'customer:level:batch:update',
        'highsee',
        'highsee:distribution',
        'highsee:receive',
        'highsee:export',
        'highsee:list',
        // 'office',
        'office:point',
        'office:point:verify:yes',
        'office:point:verify:no',
        'office:point:update'
      ]
    },
    children: [
      {
        path: 'report',
        component: resolve => require(['@/views/complaint/report/index'], resolve),
        name: 'report',
        meta: {
          title: '举报信息处理',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      }, {
        path: 'blackList',
        component: resolve => require(['@/views/complaint/blackList/index'], resolve),
        name: 'blackList',
        meta: {
          title: '黑名单库',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },{
        path: 'online',
        component: resolve => require(['@/views/customer/customerList/index'], resolve),
        name: 'online',
        meta: {
          title: '人工在线客服',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },

    ]
  },
  {
    // path: '',
    path: '/income',
    component: Layout,
    // redirect: 'dashboard',
    redirect: 'noRedirect',
    name: '收益发放',
    // name: '资料审核',
    meta: {
      title: '收益发放',
      // title: '资料审核',
      icon: 'peoples',
      roles: [
        'admin',
        'panel',
        'customer',
        'customer:add',
        'customer:edit',
        'customer:del',
        'customer:transfer',
        'customer:enter:highsee',
        'customer:change:dealstatus',
        'customer:export',
        'customer:task:add',
        'customer:list',
        'customer:update:location',
        'customer:level:batch:update',
        'highsee',
        'highsee:distribution',
        'highsee:receive',
        'highsee:export',
        'highsee:list',
        // 'office',
        'office:point',
        'office:point:verify:yes',
        'office:point:verify:no',
        'office:point:update'
      ]
    },
    children: [
      {
        path: 'settlementApply',
        component: resolve => require(['@/views/income/settlementApply/index'], resolve),
        name: 'settlementApply',
        meta: {
          title: '申请结算汇总',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: 'noRedirect',
    name: '供应商查询',
    meta: {
      title: '供应商查询',
      icon: 'order',
      roles: [
        'admin',
        'order:list',
        'order:export',
        'order:detail',
      ],
    },
    children: [{
      path: 'list',
      component: resolve => require(['@/views/supplier/index'], resolve),
      hidden: true,
      name: 'list',
      meta: {
        title: '供应商查询',
        icon: 'iconfont icon-ballot-check',
        hidden: true,
        roles: [
          'admin',
          'order:list',
          'order:export',
          'order:detail',
        ]
      },
    }]
  },

  {
    // path: '',
    path: '/businessData',
    component: Layout,
    // redirect: 'dashboard',
    redirect: 'noRedirect',
    name: '经营数据',
    // name: '资料审核',
    meta: {
      title: '经营数据',
      // title: '资料审核',
      icon: 'peoples',
      roles: [
        'admin',
        'panel',
        'customer',
        'customer:add',
        'customer:edit',
        'customer:del',
        'customer:transfer',
        'customer:enter:highsee',
        'customer:change:dealstatus',
        'customer:export',
        'customer:task:add',
        'customer:list',
        'customer:update:location',
        'customer:level:batch:update',
        'highsee',
        'highsee:distribution',
        'highsee:receive',
        'highsee:export',
        'highsee:list',
        // 'office',
        'office:point',
        'office:point:verify:yes',
        'office:point:verify:no',
        'office:point:update'
      ]
    },
    children: [
      {
        path: 'data',
        component: resolve => require(['@/views/businessData/data/index'], resolve),
        name: 'data',
        hidden: true,
        meta: {
          title: '经营数据',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },
    ]
  },

  {
    // path: '',
    path: '/information',
    component: Layout,
    // redirect: 'dashboard',
    redirect: 'noRedirect',
    name: '平台用户信息查询',
    // name: '资料审核',
    meta: {
      title: '平台用户信息查询',
      // title: '资料审核',
      icon: 'peoples',
      roles: [
        'admin',
        'panel',
        'customer',
        'customer:add',
        'customer:edit',
        'customer:del',
        'customer:transfer',
        'customer:enter:highsee',
        'customer:change:dealstatus',
        'customer:export',
        'customer:task:add',
        'customer:list',
        'customer:update:location',
        'customer:level:batch:update',
        'highsee',
        'highsee:distribution',
        'highsee:receive',
        'highsee:export',
        'highsee:list',
        // 'office',
        'office:point',
        'office:point:verify:yes',
        'office:point:verify:no',
        'office:point:update'
      ]
    },
    children: [
      {
        path: 'personal',
        component: resolve => require(['@/views/information/personal/index'], resolve),
        name: 'personal',
        meta: {
          title: '家长信息',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      }, {
        path: 'consultant',
        component: resolve => require(['@/views/information/consultant/index'], resolve),
        name: 'consultant',
        meta: {
          title: '咨询师简介/定位',
          noCache: true,
          icon: '',
          // affix: true,
          roles: [
            'admin',
            'customer',
            'customer:add',
            'customer:edit',
            'customer:del',
            'customer:transfer',
            'customer:enter:highsee',
            'customer:change:dealstatus',
            'customer:export',
            'customer:task:add',
            'customer:list',
            'customer:update:location',
            'customer:level:batch:update'
          ]
        }
      },
    ]
  },


  {
    path: '/roleManagement',
    component: Layout,
    redirect: 'noRedirect',
    name: '权限管理',
    meta: {
      title: '权限管理',
      icon: 'order',
      roles: [
        'admin',
        'business:set',
        'business:set:highsee:rule',
        'business:set:parm',
        'business:set:attendance',
        'business:set:dict',
        'performance:setting',
        'performance:setting:set',
        'performance:setting:edit',
        'performance:setting:del',
        'performance:setting:list',
        'performance:setting:journal',
        'examine-setting',
        'examine-setting:list',
        'examine-setting:view',
        'examine-setting:add',
        'examine-setting:edit',
        'examine-setting:copy',
        'examine-setting:journal',
        'customer-level',
        'customer-level:view',
        'customer-level:edit',
        'menu',
        'menu:list',
        'menu:add',
        'menu:eidt',
        'menu:del',
      ],
    },
    children: [
      {
        path: 'team',
        component: resolve =>
          require(['@/views/roleManagement/team/index'], resolve),
        name: 'service',
        meta: {
          title: '团队管理',
          icon: '',
          roles: [
            'admin',
            'business:set',
            'business:set:highsee:rule',
            'business:set:parm',
            'business:set:attendance',
            'business:set:dict'
          ]
        }
      }, {
        path: 'role',
        component: resolve =>
          require(['@/views/roleManagement/role/index'], resolve),
        name: 'customerLeaverSet',
        meta: {
          title: '权限管理',
          icon: '',
          roles: [
            'admin',
            'customer-level',
            'customer-level:view',
            'customer-level:edit',
          ]
        }
      },{
        path: 'inviteCustomers',
        component: resolve =>
          require(['@/views/roleManagement/inviteCustomers/index'], resolve),
        name: 'customerLeaverSet',
        meta: {
          title: '邀请客户',
          icon: '',
          roles: [
            'admin',
            'customer-level',
            'customer-level:view',
            'customer-level:edit',
          ]
        }
      },
    ]
  },

    ]
    // export default new Router({
    //   mode: 'hash', // 去掉url中的#
    //   scrollBehavior: () => ({
    //     y: 0
    //   }),
    //   routes: constantRoutes
    // })

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
