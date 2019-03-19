export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: [ '0', '1', '2', '3' ],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: '个人中心',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/notice',
            name: '消息通知',
            component: './Account/Notice/Notice',
          },
          {
            path: '/account/user-info',
            name: '个人信息',
            component: './Account/UserInfo',
          },
          {
            path: '/account/user-pwd',
            name: '修改密码',
            component: './Account/UserPwd',
          },         
        ],
      },
      {
        name: '实验室用品',
        icon: 'table',
        path: '/supplies',
        routes: [
          {
            path: '/supplies/chemicals',
            name: '化学药品',
            component: './Supplies/Chemicals/Chemicals',
          },
          {
            path: '/supplies/instrument',
            name: '仪器设备',
            component: './Supplies/Instrument/Instrument',
          },
        ]
      },
      {
        name: '用品预约',
        icon: 'form',
        path: '/order',
        routes: [
          {
            path: '/order/form',
            name: '物品申请',
            hideChildrenInMenu: true,
            component: './Order/OrderForm',
            routes: [
              {
                path: '/order/form',
                redirect: '/order/form/time',
              },
              {
                path: '/order/form/time',
                name: '使用时间',
                component: './Order/OrderForm/Step1',
              },
              {
                path: '/order/form/chemicals',
                name: '药品申请',
                component: './Order/OrderForm/Step2',
              },
              {
                path: '/order/form/instrument',
                name: '仪器申请',
                component: './Order/OrderForm/Step3',
              },
              {
                path: '/order/form/result',
                name: '提交结果',
                component: './Order/OrderForm/Step4',
              },
            ],
          },
          {
            path: '/order/selflist',
            name: '个人申请',
            component: './Order/OrderList/SelfList/SelfList',
          },
          {
            path: '/order/orderlist',
            name: '申请列表',
            component: './Order/OrderList/OrderList/OrderList',
          },
        ]
      },
      {
        path: '/purchase',
        icon: 'profile',
        name: '库存管理',
        routes: [
          {
            path: '/purchase/chemicals',
            name: '药品管理',
            routes: [
              {
                path: '/purchase/chemicals/apply',
                name: '库存补充',
                component: './Purchase/CP/CPApply/CPApply',
              },
              {
                path: '/purchase/chemicals/list',
                name: '采购记录',
                component: './Purchase/CP/CPList/CPList',
              },
            ],
          },
          {
            path: '/purchase/instrument',
            name: '仪器管理',
            routes: [
              {
                path: '/purchase/instrument/apply',
                name: '库存补充',
                component: './Purchase/IP/IPApply/IPApply',
              },
              {
                path: '/purchase/instrument/list',
                name: '采购记录',
                component: './Purchase/IP/IPList/IPList',
              },
            ],
          },
        ],
      },
      {
        name: '管理',
        icon: 'audit',
        path: '/manage',
        routes: [
          {
            path: '/manage/users',
            name: '用户管理',
            component: './UserManage/UserManage',
          },
        ]
      },
      {
        name: '公告',
        icon: 'audit',
        path: '/inform',
        routes: [
          {
            path: '/inform/all',
            name: '公告列表',
            component: './Inform/Inform',
          },
          {
            path: '/inform/latest',
            name: '首页',
            component: './Inform/IndexInform',
          },
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
