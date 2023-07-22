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

    // path: '/statistics',
    path: '',
    component: Layout,
    // redirect: 'noRedirect',
    redirect: 'dashboard',
    name: '统计分析',
    meta: {
      title: '统计分析',
      icon: 'chart',
      roles: [
        'admin',
        'sales:review',
        'sales:review:view',
        'sales:review:list',
        'extension:review',
        'extension:review:list',
        'extension:review:view',
        'service:review',
        'service:review:list',
        'service:review:view',
        'extension:profit:review',
        'extension:profit:review:list',
        'extension:profit:review:view',
        'service:profit:review',
        'service:profit:review:view',
        'service:profit:review:list',
        'performance:point',
        'performance:point:list',
        'performance:point:view',
      ]
    },
    children: [
      {
      // path: 'statistics',
        path: 'dashboard',
      component: resolve => require(['@/views/statistics/index'], resolve),
      // name: 'statistics',
        name: '销售业绩统计',
      meta: {
        title: '销售业绩统计',
        noCache: true,
        icon: 'iconfont icon-chart-bar',
        affix: true,
        roles: [
          'admin',
          'sales:review',
          'sales:review:view',
          'sales:review:list',
        ]
      }
    },
      {
        path: 'goodsStatistics',
        component: resolve =>
          require(['@/views/statistics/goodsStatistics/index'], resolve),
        name: 'goodsStatistics',
        meta: {
          title: '推广业绩统计',
          icon: 'iconfont icon-chart-bar',
          roles: [
            'admin',
            'extension:review',
            'extension:review:list',
            'extension:review:view',
          ]
        }
      },
      {
        path: 'serviceStatistics',
        component: resolve =>
          require(['@/views/statistics/serviceStatistics/index'], resolve),
        name: 'serviceStatistics',
        meta: {
          title: '服务业绩统计',
          icon: 'iconfont icon-chart-bar',
          roles: [
            'admin',
            'service:review',
            'service:review:list',
            'service:review:view',
          ]
        }
      },
      {
        path: 'extensionProfit',
        component: resolve =>
          require(['@/views/statistics/extensionProfit/index'], resolve),
        name: 'extensionProfit',
        meta: {
          title: '推广收益统计',
          icon: 'iconfont icon-chart-line',
          roles: [
            'admin',
            'extension:profit:review',
            'extension:profit:review:list',
            'extension:profit:review:view',
          ]
        }
      },
      {
        path: 'serviceProfit',
        component: resolve =>
          require(['@/views/statistics/serviceProfit/index'], resolve),
        name: 'serviceProfit',
        meta: {
          title: '服务收益统计',
          icon: 'iconfont icon-chart-line',
          roles: [
            'admin',
            'service:profit:review',
            'service:profit:review:view',
            'service:profit:review:list',
          ]
        }
      },
      {
        path: 'performanceCompletion',
        component: resolve =>
          require(['@/views/statistics/performanceCompletion/index'], resolve),
        name: 'performanceCompletion',
        meta: {
          title: '业绩目标完成度',
          icon: 'iconfont icon-wanchengdutongji',
          roles: [
            'admin',
            'performance:point',
            'performance:point:list',
            'performance:point:view',
          ]
        }
      },
      {
        path: 'workCompletion',
        component: resolve =>
          require(['@/views/statistics/workCompletion/index'], resolve),
        name: 'workCompletion',
        meta: {
          title: '任务指标完成度',
          icon: 'iconfont icon-wanchengdutongji',
          roles: [
            'admin',
            'tesk:indicators',
          ]
        }
      },
    ]
  },
  {
            // path: '',
    path: '/customer',
            component: Layout,
            // redirect: 'dashboard',
    redirect: 'noRedirect',
            name: '客户管理',
            meta: {
                title: '客户管理',
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
              // {
              //       path: 'dashboard',
              //       component: resolve => require(['@/views/customer/dashboard/index'], resolve),
              //       name: '仪表盘',
              //       meta: {
              //           title: '仪表盘',
              //           noCache: true,
              //           icon: 'iconfont icon-tachometer-alt-fast',
              //           affix: true,
              //           roles: [
              //             'admin',
              //             'panel',
              //           ]
              //       }
              //   },
                // {
                //   path: 'clue',
                //   component: resolve => require(['@/views/customer/clue/index'], resolve),
                //   name: 'clue',
                //   meta: {
                //       title: '线索',
                //       noCache: true,
                //       icon: 'iconfont icon-xiansuo',
                //       affix: true,
                //       roles: [
                //           'admin',
                //           'clue',
                //           'clue:customer',
                //           'clue:list',
                //           'clue:view',
                //       ]
                //   }
                // },
                {
                    path: 'customer',
                    component: resolve => require(['@/views/customer/customerList/index'], resolve),
                    name: 'customer',
                    meta: {
                        title: '客户列表',
                        noCache: true,
                        icon: 'iconfont icon-user-tie',
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
                {
                    path: 'seas',
                    component: resolve => require(['@/views/customer/seas/index'], resolve),
                    name: '公海客户',
                    meta: {
                        title: '公海客户',
                        noCache: true,
                        icon: 'iconfont icon-user-ninja',
                        // affix: true,
                        roles: [
                          'admin',
                          'highsee',
                          'highsee:distribution',
                          'highsee:receive',
                          'highsee:export',
                          'highsee:list'
                        ]
                    }
                },
                {
                  path: 'coordinateReview',
                  component: resolve => require(['@/views/work/coordinateReview/view'], resolve),
                  name: 'coordinateReview',
                  meta: {
                      title: '坐标审核',
                      icon: 'iconfont icon-zuobiao1',
                      roles: [
                        'admin',
                        // 'office',
                        'office:point',
                        'office:point:verify:yes',
                        'office:point:verify:no',
                        'office:point:update'
                      ]
                  }
                },
            ]
        },
        // {
            // path: '/work',
            // component: Layout,
            // redirect: 'noRedirect',
            // name: '办公',
            // meta: {
            //     title: '办公',
            //     icon: 'work',
            //   roles: [
            //     'admin', 'task', 'task:add', 'task:edit', 'task:del','task:update:status','task:list',
            //     'attendance:review', 'visit:task', 'visit:task:add', 'visit:task:edit', 'visit:task:del','visit:task:cancel','visit:task:unfinished','visit:task:finished','visit:task:list','sign:in',
            //     'sign:in:list','sign:in:export','performance:employee', 'performance:employee:list','tracing:view', 'office', 'office:point', 'office:point:verify:yes', 'office:point:verify:no','office:point:update',

            //   ]
            // },
            // children: [
              // {
              //       path: 'task',
              //       component: resolve => require(['@/views/work/index'], resolve),
              //       name: 'task',
              //       meta: {
              //           title: '普通任务',
              //           icon: 'iconfont icon-renwu3',
              //           roles: ['admin', 'task', 'task:add', 'task:edit', 'task:del','task:update:status','task:list']
              //       }
              // },
              // {
              //       path: 'visitTask',
              //       component: resolve => require(['@/views/work/visitTask/index'], resolve),
              //       name: 'visitTask',
              //       meta: {
              //           title: '拜访任务',
              //           icon: 'iconfont icon-renwu2',
              //           roles: ['admin', 'visit:task', 'visit:task:add', 'visit:task:edit', 'visit:task:del','visit:task:cancel','visit:task:unfinished','visit:task:finished','visit:task:list']
              //       }
              // },
                // {
                //     path: 'fieldCheck',
                //     component: resolve =>
                //         require(['@/views/work/fieldCheck/index'], resolve),
                //     name: 'fieldCheck',
                //     meta: {
                //         title: '移动签到',
                //         icon: 'iconfont icon-yiqiandao',
                //         roles: [
                //             'admin',
                //             'sign:in',
                //             'sign:in:list',
                //             'sign:in:export'
                //         ]
                //     }
                // },
                // {
                //     path: 'attendanceStatistics',
                //     component: resolve =>require(['@/views/work/attendanceStatistics/index'], resolve),
                //     name: 'attendanceStatistics',
                //     meta: {
                //         title: '考勤统计',
                //         icon: 'iconfont icon-richangkaoqintongji1',
                //         roles: [
                //             'admin',
                //             'attendance:review',
                //         ]
                //     }
                // },
                // {
                //   path: 'staffCalendar',
                //   component: resolve =>require(['@/views/work/attendanceStatistics/staffCalendar'], resolve),
                //   name: 'staffCalendar',
                //   hidden: true,
                //   meta: {
                //       title: '员工日历',
                //       activeMenu: "/work/attendanceStatistics",
                //       icon: 'iconfont icon-kaoqin',
                //   }
                // },
                // {
                //   path: 'trackView',
                //   component: resolve =>require(['@/views/work/trackView/index'], resolve),
                //   name: 'trackView',
                //   meta: {
                //       title: '查看轨迹',
                //       icon: 'iconfont icon-chakan1',
                //       roles: [
                //           'admin',
                //           'tracing:view',
                //       ]
                //   }
                // },
        //         {
        //           path: 'staffPerformance',
        //           component: resolve =>
        //               require(['@/views/work/staffPerformance/index'], resolve),
        //           name: 'staffPerformance',
        //           meta: {
        //               title: '员工业绩',
        //               icon: 'iconfont icon-yeji1',
        //               roles: [
        //                   'admin',
        //                   'performance:employee',
        //                 'performance:employee:list'
        //               ]
        //           }
        //         },
        //     ]
        // },
        {
          path: '/business',
          component: Layout,
          redirect: 'noRedirect',
          name: '商品管理',
          meta: {
            title: '商品管理',
            icon: 'business',
            roles: [
              'admin',
              'product:extension',
              'product:service',
              'product:service:edit',
              'product:service:submit',
              'product:service:revoke',
              'product:service:list',
              'price:strategy',
              'price:strategy:add',
              'price:strategy:edit',
              'price:strategy:view',
              'price:strategy:disable',
              'price:strategy:list',
            ]
          },
          children: [
            {
              path: 'promotion',
              component: resolve =>
                require(['@/views/business/promotion/index'], resolve),
              name: 'promotion',
              meta: {
                title: '商品推广',
                icon: 'iconfont icon-shangpintuiguang',
                roles: [
                  'admin',
                  'product:extension',
                ]
              }
            },
            {
              path: 'goodsService',
              component: resolve =>
                require(['@/views/business/goodsService/index'], resolve),
              name: 'goodsService',
              meta: {
                title: '商品服务',
                icon: 'iconfont icon-shangpinfuwuguanli',
                roles: [
                  'admin',
                  'product:service',
                  'product:service:edit',
                  'product:service:submit',
                  'product:service:revoke',
                  'product:service:list',
                ]
              }
            },
            {
              path: 'goodsPrice',
              component: resolve =>
                require(['@/views/business/goodsPrice/index'], resolve),
              name: 'goodsPrice',
              meta: {
                title: '价格策略',
                icon: 'iconfont icon-jiagecelve',
                roles: [
                  'admin',
                  'price:strategy',
                  'price:strategy:add',
                  'price:strategy:edit',
                  'price:strategy:view',
                  'price:strategy:disable',
                  'price:strategy:list',
                ]
              }
            },
            // {
            //   path: 'settlementAccount',
            //   component: resolve =>
            //     require(['@/views/business/settlementAccount/index'], resolve),
            //   name: 'settlementAccount',
            //   meta: {
            //     title: '结算单',
            //     icon: 'iconfont icon-jiesuandanchaxun',
            //     roles: [
            //       'admin',
            //       'settlement',
            //       'settlement:apply',
            //       'settlement:list',
            //       'settlement:view',
            //       'settlement:export',
            //       'service:settle:exportselect'
            //     ]
            //   }
            // }
          ]
        },
        {
            path: '/order',
            component: Layout,
            redirect: 'noRedirect',
            name: '订单查询',
            meta: {
                title: '订单查询',
                icon: 'order',
                roles: [
                  'admin',
                  'order:list',
                  'order:export',
                  'order:detail',
                ],
            },
            children: [{
                path: 'order',
                component: resolve => require(['@/views/order/index'], resolve),
                name: 'order',
                meta: {
                    title: '全部订单',
                    icon: 'iconfont icon-ballot-check',
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
          path: '/workTarget',
          component: Layout,
          redirect: 'noRedirect',
          name: '任务目标',
          meta: {
              title: '任务目标',
              icon: 'order',
              roles: [
                'admin',
                'task-content',
                'task-content:list',
                'task-content:enable',
                'task-content:add',
                'task-content:edit',
                'task-content:del',
                'task-type',
                'task-type:list',
                'task-type:enable',
                'task-type:add',
                'task-type:edit',
                'task-type:enable',
                'task-type:del',
                'task-notes',
                'task-notes:list',
                'task-notes:view',
                'tast-notes:export',
              ],
            },
            children: [
              {
                path: 'taskContent',
                component: resolve => require(['@/views/workTarget/taskContent'], resolve),
                name: 'taskContent',
                meta: {
                  title: '任务内容',
                  icon: 'iconfont icon-ballot-check',
                  roles: [
                    'admin',
                    'task-content',
                    'task-content:list',
                    'task-content:enable',
                    'task-content:add',
                    'task-content:edit',
                    'task-content:del',
                  ]
                  },
              },
              {
                path: 'taskType',
                component: resolve => require(['@/views/workTarget/taskType'], resolve),
                name: 'taskType',
                meta: {
                      title: '任务类型',
                      icon: 'iconfont icon-ballot-check',
                      roles: [
                        'admin',
                        'task-type',
                        'task-type:list',
                        'task-type:enable',
                        'task-type:add',
                        'task-type:edit',
                        'task-type:enable',
                        'task-type:del',
                      ]
                  },
              },
              {
                path: 'fieldCheck',
                component: resolve =>
                    require(['@/views/work/fieldCheck/index'], resolve),
                name: 'fieldCheck',
                meta: {
                    title: '任务记录',
                    icon: 'iconfont icon-yiqiandao',
                    roles: [
                        'admin',
                        'task-notes',
                        'task-notes:list',
                        'task-notes:view',
                        'tast-notes:export',
                    ]
                }
              },
              {
                path: 'temporaryTasks',
                component: resolve =>
                    require(['@/views/workTarget/temporaryTasks/index'], resolve),
                name: 'temporaryTasks',
                meta: {
                    title: '临时任务',
                    icon: 'iconfont icon-yiqiandao',
                    roles: [
                        'admin',
                        'task-notes',
                        'task-notes:list',
                        'task-notes:view',
                        'tast-notes:export',
                    ]
                }
              },
          ]
        },
        {
            path: '/assessmentManagement',
            component: Layout,
            redirect: 'noRedirect',
            name: '考核管理',
            meta: {
                title: '考核管理',
                icon: 'order',
                roles: [
                  'admin',
                  'examine-finish',
                  'examine-finish:list',
                  'examine-finish:view',
                  'task-finish',
                  'settlement',
                  'settlement:apply',
                  'settlement:list',
                  'settlement:view',
                  'settlement:export',
                  'service:settle:exportselect'
                ],
            },
            children: [
              {
                path: 'assessmentIndex',
                component: resolve => require(['@/views/assessmentManagement/assessmentIndex/index'], resolve),
                name: 'assessmentIndex',
                meta: {
                    title: '考核指标完成度',
                    icon: 'iconfont icon-ballot-check',
                    roles: [
                      'admin',
                      'examine-finish',
                      'examine-finish:list',
                      'examine-finish:view',
                    ]
                },
              },
              {
                path: 'missionObjectives',
                component: resolve => require(['@/views/assessmentManagement/missionObjectives/index'], resolve),
                name: 'missionObjectives',
                meta: {
                    title: '任务目标完成度',
                    icon: 'iconfont icon-ballot-check',
                    roles: [
                      'admin',
                      'task-finish',
                    ]
                },
              },
              {
                path: 'settlementAccount',
                component: resolve =>
                  require(['@/views/business/settlementAccount/index'], resolve),
                name: 'settlementAccount',
                meta: {
                  title: '服务收益',
                  icon: 'iconfont icon-jiesuandanchaxun',
                  roles: [
                    'admin',
                    'settlement',
                    'settlement:apply',
                    'settlement:list',
                    'settlement:view',
                    'settlement:export',
                    'service:settle:exportselect'
                  ]
                }
              }
            ]
        },
        {
          path: '/system',
          component: Layout,
          redirect: 'noRedirect',
          name: '组织管理',
          meta: {
              title: '组织管理',
              icon: 'system',
              roles: [
                'admin',
                'provider:auth',
                'department',
                'department:add',
                'department:edit',
                'department:del',
                'department:list',
                'sysuser',
                'sysuser:add',
                'sysuser:edit',
                'sysuser:del',
                'sysuser:enable',
                'sysuser:reset:password',
                'sysuser:update:dept',
                'sysuser:update:role',
                'sysuser:list',
                'sysuser:extension:status',
                'role',
                'role:add',
                'role:edit',
                'role:del',
                'role:user:add',
                'role:set',
                'role:list',
              ]
          },
          children: [
              //   {
              //   path: 'business',
              //   component: (resolve) => require(['@/views/system/business/index'], resolve),
              //   name: 'business',
              //   meta: {
              //     title: '企业设置',
              //     icon: 'iconfont icon-university',
              //     roles: ['admin',"enterprise:set","enterprise:set:view","enterprise:set:edit"]
              //   }
              // },
            {
              path: 'authentication',
              component: resolve =>
                require(['@/views/system/provider/authentication/index'], resolve),
              name: 'authority',
              meta: {
                title: '服务商认证',
                icon: 'iconfont icon-renzheng2',
                roles: [
                  'admin',
                  'provider:auth',
                ]
              }
            },
              {
                  path: 'structure',
                  component: resolve =>
                      require(['@/views/system/structure/index'], resolve),
                  name: 'structure',
                  meta: {
                      title: '组织架构',
                      icon: 'iconfont icon-sitemap',
                      roles: [
                          'admin',
                          'department',
                          'department:add',
                          'department:edit',
                          'department:del',
                          'department:list',
                      ]
                  }
              },
              {
                  path: 'staff',
                  component: resolve => require(['@/views/system/staff/index'], resolve),
                  name: 'staff',
                  meta: {
                      title: '员工管理',
                      icon: 'iconfont icon-user-cog',
                      roles: [
                          'admin',
                          'sysuser',
                          'sysuser:add',
                          'sysuser:edit',
                          'sysuser:del',
                          'sysuser:enable',
                          'sysuser:reset:password',
                          'sysuser:update:dept',
                          'sysuser:update:role',
                          'sysuser:list',
                          'sysuser:extension:status'
                      ]
                  }
              },
              {
                  path: 'authority',
                  component: resolve =>
                      require(['@/views/system/authority/index'], resolve),
                  name: 'authority',
                  meta: {
                      title: '职位权限',
                      icon: 'iconfont icon-user-shield',
                      roles: [
                          'admin',
                          'role',
                          'role:add',
                          'role:edit',
                          'role:del',
                          'role:user:add',
                          'role:set',
                          'role:list',
                      ]
                  }
              },
              // {
              //   path: 'classManagement',
              //   component: resolve =>
              //       require(['@/views/system/classManagement/index'], resolve),
              //   name: 'classManagement',
              //   meta: {
              //       title: '分类管理',
              //       icon: 'iconfont icon-fenleiguanli',
              //       roles: [
              //         'admin',
              //         'manage:classify',
              //         'manage:classify:view',
              //         'manage:classify:add',
              //         'manage:classify:edit',
              //       ]
              //   }
              // },


          ]
        },
        {
          path: '/service',
          component: Layout,
          redirect: 'noRedirect',
          name: '系统设置',
          meta: {
              title: '系统设置',
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
              path: 'service',
              component: resolve =>
                  require(['@/views/system/service/index'], resolve),
              name: 'service',
              meta: {
                  title: '业务设置',
                  icon: 'iconfont icon-edit',
                  roles: [
                    'admin',
                    'business:set',
                    'business:set:highsee:rule',
                    'business:set:parm',
                    'business:set:attendance',
                    'business:set:dict'
                  ]
              }
            },
            {
              path: 'customerLeaverSet',
              component: resolve =>
                  require(['@/views/system/customerLeaverSet/index'], resolve),
              name: 'customerLeaverSet',
              meta: {
                  title: '客户等级设置',
                  icon: 'iconfont icon-kaoheguanli-xuanzhong',
                  roles: [
                    'admin',
                    'customer-level',
                    'customer-level:view',
                    'customer-level:edit',
                  ]
              }
            },
            {
              path: 'performanceSetting',
              component: resolve =>
                  require(['@/views/system/performanceSetting/index'], resolve),
              name: 'performanceSetting',
              meta: {
                  title: '业绩目标设置',
                  icon: 'iconfont icon-yejimubiaoshezhi_huaban',
                  roles: [
                    'admin',
                    'performance:setting',
                    'performance:setting:set',
                    'performance:setting:edit',
                    'performance:setting:del',
                    'performance:setting:list',
                    'performance:setting:journal',
                  ]
              }
            },
            {
              path: 'appraisalIndicatorSetting',
              component: resolve =>
                  require(['@/views/system/appraisalIndicatorSetting/index'], resolve),
              name: 'appraisalIndicatorSetting',
              meta: {
                  title: '考核指标设置',
                  icon: 'iconfont icon-kaoheguanli-xuanzhong',
                  roles: [
                    'admin',
                    'examine-setting',
                    'examine-setting:list',
                    'examine-setting:view',
                    'examine-setting:add',
                    'examine-setting:edit',
                    'examine-setting:copy',
                    'examine-setting:journal',
                  ]
              }
            },

            {
              path: 'menuManagement',
              component: resolve =>
                  require(['@/views/system/menuManagement/index'], resolve),
              name: 'menuManagement',
              meta: {
                  title: '菜单管理',
                  icon: 'iconfont icon-kaoheguanli-xuanzhong',
                  roles: [
                    'admin',
                    'menu',
                    'menu:list',
                    'menu:add',
                    'menu:eidt',
                    'menu:del',
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
