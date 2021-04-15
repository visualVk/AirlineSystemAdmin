import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  {
    path: '/user-manage',
    name: 'userManage',
    meta: {
      icon: 'md-menu',
      title: '用户管理管理'
    },
    component: Main,
    children: [
      {
        path: 'user_state_manage',
        name: 'user_state_manage',
        meta: {
          icon: 'md-funnel',
          title: '用户账号'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      }
      // {
      //   path: 'level_2_2',
      //   name: 'level_2_2',
      //   meta: {
      //     access: ['amdin_user'],
      //     icon: 'md-funnel',
      //     showAlways: true,
      //     title: '二级-2'
      //   },
      //   component: parentView,
      //   children: [
      //     {
      //       path: 'level_2_2_1',
      //       name: 'level_2_2_1',
      //       meta: {
      //         icon: 'md-funnel',
      //         title: '三级'
      //       },
      //       component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
      //     }
      //   ]
      // },
      // {
      //   path: 'level_2_3',
      //   name: 'level_2_3',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '二级-3'
      //   },
      //   component: () => import('@/view/multilevel/level-2-3.vue')
      // }
    ]
  },
  {
    path: '/airline_manage',
    name: 'airline_manage',
    meta: {
      icon: 'md-menu',
      title: '飞机管理'
    },
    component: Main,
    children: [
      {
        path: 'airline_info_manage',
        name: 'airline_info_manage',
        meta: {
          icon: 'md-funnel',
          title: '飞机信息管理'
        },
        component: () => import('@/view/airline-manage/airlineinfo-manage-table.vue')
      },
      {
        path: 'airline_seat_manage',
        name: 'airline_seat_manage',
        meta: {
          icon: 'md-funnel',
          title: '航班信息管理'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      },
      {
        path: 'airline_ticket_manage',
        name: 'airline_ticket_manage',
        meta: {
          icon: 'md-funnel',
          title: '机票管理'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      },
      {
        path: 'ticket_type_manage',
        name: 'ticket_type_manage',
        meta: {
          icon: 'md-funnel',
          title: '机票类型管理'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      },
    ]
  },
  {
    path: '/question_manage',
    name: 'question_manage',
    meta: {
      icon: 'md-menu',
      title: '问题管理'
    },
    component: Main,
    children: [
      {
        path: 'question_info_manage',
        name: 'question_info_manage',
        meta: {
          icon: 'md-funnel',
          title: '问题信息管理'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      },
    ]
  },
  {
    path: '/coupon_manage',
    name: 'coupon_manage',
    meta: {
      icon: 'md-menu',
      title: '优惠券管理'
    },
    component: Main,
    children: [
      {
        path: 'coupon_info_manage',
        name: 'coupon_info_manage',
        meta: {
          icon: 'md-funnel',
          title: '优惠券信息管理'
        },
        component: () => import('@/view/user-manage/user-manage-table.vue')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
