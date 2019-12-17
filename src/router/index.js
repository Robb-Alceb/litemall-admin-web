import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '系统首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/shop',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'shopManage',
    meta: {
      title: '门店管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/shop/list'),
        name: 'list',
        meta: {
          perms: ['GET /admin/shop/list'],
          title: '门店列表',
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/shop/edit'),
        name: 'editShop',
        meta: {
          perms: ['PUT /admin/shop/update', 'GET /admin/shop/detail'],
          title: '编辑门店',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'overview',
        component: () => import('@/views/shop/overview'),
        name: 'overviewShop',
        meta: {
          perms: ['GET /admin/shop/detail'],
          title: '门店信息',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'create',
        component: () => import('@/views/shop/create'),
        name: 'createShop',
        meta: {
          perms: ['GET /admin/shop/create'],
          title: '新增门店',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'members',
        component: () => import('@/views/sys/admin/admin'),
        name: 'members',
        meta: {
          perms: ['GET /admin/admin/list'],
          title: '门店成员',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'logs',
        component: () => import('@/views/shop/log'),
        name: 'shopLogs',
        meta: {
          perms: ['GET /admin/shopLog/list'],
          title: '门店操作日志',
          noCache: true
        }
      },

      {
        path: 'order/detail',
        component: () => import('@/views/shop/order/detail'),
        name: 'shopOrderDetail',
        meta: {
          perms: ['POST /admin/shopOrder/orderPass', 'POST /admin/shopOrder/orderNoPass', 'POST /admin/shopOrder/orderPay', 'POST /admin/shopOrder/deliverGoods', 'POST /admin/shopOrder/cancelDeliverGoods', 'POST /admin/shopOrder/takeDelivery'],
          title: '门店订单处理',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'order/create',
        component: () => import('@/views/shop/order/create'),
        name: 'shopOrderCreate',
        meta: {
          perms: ['POST /admin/shopOrder/orderApplying'],
          title: '进货申请',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'goodsManage',
    meta: {
      title: '商品管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /admin/goods/list'],
          title: '商品列表',
          noCache: true
        }
      },
      {
        path: 'category',
        component: () => import('@/views/goods/category'),
        name: 'category',
        meta: {
          perms: ['GET /admin/category/list'],
          title: '商品分类',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /admin/goods/create'],
          title: '商品添加',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'edit',
        component: () => import('@/views/goods/detail'),
        name: 'goodsEdit',
        meta: {
          perms: ['POST /admin/goods/update'],
          title: '商品编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'comment',
        component: () => import('@/views/goods/comment'),
        name: 'goodsComment',
        meta: {
          perms: ['GET /admin/comment/list'],
          title: '商品评论',
          noCache: true
        }
      },
      {
        path: 'logs',
        component: () => import('@/views/goods/logs'),
        name: 'goodsLogs',
        meta: {
          perms: ['GET /admin/goods/queryGoodsLogList'],
          title: '商品操作日志',
          noCache: true
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/goods/detail'),
        name: 'goodsDetail',
        meta: {
          perms: ['GET /admin/goods/detail'],
          title: '商品详情',
          noCache: true
        },
        hidden: true
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'orderList',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
          title: '订单列表',
          noCache: true
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/order/detail'),
        name: 'orderDetail',
        meta: {
          perms: ['GET /admin/order/read'],
          title: '订单详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'print',
        component: () => import('@/views/order/print'),
        name: 'orderPrint',
        meta: {
          perms: ['GET /admin/order/read'],
          title: '订单打印',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/repository',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'repository',
    meta: {
      title: '库存管理',
      icon: 'chart'
    },
    children: [
/*      {
        path: 'list',
        component: () => import('@/views/repository/list'),
        name: 'repositoryList',
        meta: {
          perms: ['GET /admin/repository/merchandiseRecordList'],
          title: '出库入库列表',
          noCache: true
        }
      },*/
      {
        path: 'list',
        component: () => import('@/views/shop/order/list'),
        name: 'shopOrderList',
        meta: {
          perms: ['GET /admin/shopOrder/list'],
          title: '出库入库列表',
          noCache: true
        }
      },
      {
        path: 'merchandise',
        component: () => import('@/views/repository/merchandise'),
        name: 'merchandise',
        meta: {
          perms: ['GET /admin/merchandise/list'],
          title: '货品列表',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/repository/create'),
        name: 'merchandiseCreate',
        meta: {
          perms: ['POST /admin/merchandise/create'],
          title: '新增货品',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'edit',
        component: () => import('@/views/repository/edit'),
        name: 'merchandiseCreate',
        meta: {
          perms: ['POST /admin/merchandise/update'],
          title: '货品详情',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '会员管理',
          noCache: true
        }
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /admin/address/list'],
          title: '收货地址',
          noCache: true
        }
      },
      {
        path: 'collect',
        component: () => import('@/views/user/collect'),
        name: 'collect',
        meta: {
          perms: ['GET /admin/collect/list'],
          title: '会员收藏',
          noCache: true
        }
      },
      {
        path: 'footprint',
        component: () => import('@/views/user/footprint'),
        name: 'footprint',
        meta: {
          perms: ['GET /admin/footprint/list'],
          title: '会员足迹',
          noCache: true
        }
      },
      {
        path: 'history',
        component: () => import('@/views/user/history'),
        name: 'history',
        meta: {
          perms: ['GET /admin/history/list'],
          title: '搜索历史',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/promotion',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'promotionManage',
    meta: {
      title: '活动管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'ad',
        component: () => import('@/views/promotion/ad'),
        name: 'ad',
        meta: {
          perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
          title: '广告管理',
          noCache: true
        }
      },
      {
        path: 'coupon',
        component: () => import('@/views/promotion/coupon'),
        name: 'coupon',
        meta: {
          perms: ['GET /admin/coupon/list', 'POST /admin/coupon/create', 'POST /admin/coupon/update', 'POST /admin/coupon/delete'],
          title: '优惠券管理',
          noCache: true
        }
      },
      /*{
        path: 'couponDetail',
        component: () => import('@/views/promotion/couponDetail'),
        name: 'couponDetail',
        meta: {
          perms: ['GET /admin/coupon/list', 'GET /admin/coupon/listuser'],
          title: '优惠券详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'topic',
        component: () => import('@/views/promotion/topic'),
        name: 'topic',
        meta: {
          perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
          title: '专题管理',
          noCache: true
        }
      },
      {
        path: 'topic-create',
        component: () => import('@/views/promotion/topicCreate'),
        name: 'topicCreate',
        meta: {
          perms: ['POST /admin/topic/create'],
          title: '专题创建',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'topic-edit',
        component: () => import('@/views/promotion/topicEdit'),
        name: 'topicEdit',
        meta: {
          perms: ['GET /admin/topic/read', 'POST /admin/topic/update'],
          title: '专题编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'groupon-rule',
        component: () => import('@/views/promotion/grouponRule'),
        name: 'grouponRule',
        meta: {
          perms: ['GET /admin/groupon/list', 'POST /admin/groupon/create', 'POST /admin/groupon/update', 'POST /admin/groupon/delete'],
          title: '团购规则',
          noCache: true
        }
      },
      {
        path: 'groupon-activity',
        component: () => import('@/views/promotion/grouponActivity'),
        name: 'grouponActivity',
        meta: {
          perms: ['GET /admin/groupon/listRecord'],
          title: '团购活动',
          noCache: true
        }
      }*/
    ]
  },

  {
    path: '/statistics',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statistics',
    meta: {
      title: '统计分析',
      icon: 'chart'
    },
    children: [
/*      {
        path: 'order',
        component: () => import('@/views/statistics/order'),
        name: 'orderStatistics',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '订单统计',
          noCache: true
        }
      },*/
      {
        path: 'goods',
        component: () => import('@/views/statistics/goods'),
        name: 'goodsStatistics',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '商品统计',
          noCache: true
        }
      },
      {
        path: 'user',
        component: () => import('@/views/statistics/user'),
        name: 'userStatistics',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '用户统计',
          noCache: true
        }
      },
      {
        path: 'sales',
        component: () => import('@/views/statistics/sales'),
        name: 'salesStatistics',
        meta: {
          perms: [],
          title: '销售统计',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'notice',
    meta: {
      title: '消息通知',
      icon: 'chart'
    },
    children: [
      {
        path: 'system',
        // component: () => import('@/views/notice/home'),
        name: 'system',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '系统消息',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'feedback',
    meta: {
      title: '用户反馈',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/feedback/list'),
        name: 'feedbackList',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '反馈列表',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统设置',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '管理员列表',
          noCache: true
        }
      },
      {
        path: 'admin/edit',
        component: () => import('@/views/sys/admin/edit'),
        name: 'adminEdit',
        meta: {
          perms: ['POST /admin/admin/update'],
          title: '编辑管理员',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'admin/create',
        component: () => import('@/views/sys/admin/create'),
        name: 'adminEdit',
        meta: {
          perms: ['POST /admin/admin/create'],
          title: '新增管理员',
          noCache: true
        },
        hidden: true

      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'log',
        meta: {
          perms: ['GET /admin/log/list'],
          title: '操作日志',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete'],
          title: '角色列表',
          noCache: true
        }
      },
      {
        path: 'role/edit',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: '角色权限',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'os',
        component: () => import('@/views/sys/os'),
        name: 'os',
        meta: {
          perms: ['GET /admin/storage/list', 'POST /admin/storage/create', 'POST /admin/storage/update', 'POST /admin/storage/delete'],
          title: '对象存储',
          noCache: true
        }
      }
    ]
  },
  /*
  {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'configManage',
    meta: {
      title: '配置管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'mall',
        component: () => import('@/views/config/mall'),
        name: 'configMall',
        meta: {
          perms: ['GET /admin/config/mall', 'POST /admin/config/mall'],
          title: '商场配置',
          noCache: true
        }
      },
      {
        path: 'express',
        component: () => import('@/views/config/express'),
        name: 'configExpress',
        meta: {
          perms: ['GET /admin/config/express', 'POST /admin/config/express'],
          title: '运费配置',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/config/order'),
        name: 'configOrder',
        meta: {
          perms: ['GET /admin/config/order', 'POST /admin/config/order'],
          title: '订单配置',
          noCache: true
        }
      },
      {
        path: 'wx',
        component: () => import('@/views/config/wx'),
        name: 'configWx',
        meta: {
          perms: ['GET /admin/config/wx', 'POST /admin/config/wx'],
          title: '小程序配置',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/stat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statManage',
    meta: {
      title: '统计报表',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/stat/user'),
        name: 'statUser',
        meta: {
          perms: ['GET /admin/stat/user'],
          title: '用户统计',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/stat/order'),
        name: 'statOrder',
        meta: {
          perms: ['GET /admin/stat/order'],
          title: '订单统计',
          noCache: true
        }
      },
      {
        path: 'goods',
        component: () => import('@/views/stat/goods'),
        name: 'statGoods',
        meta: {
          perms: ['GET /admin/stat/goods'],
          title: '商品统计',
          noCache: true
        }
      }
    ]
  },*/
  /* {
    path: 'external-link',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'externalLink',
    meta: {
      title: '外链',
      icon: 'link'
    },
    children: [
      {
        path: 'https://cloud.tencent.com/product/cos',
        meta: { title: '腾讯云存储', icon: 'link' }
      },
      {
        path: 'https://cloud.tencent.com/product/sms',
        meta: { title: '腾讯云短信', icon: 'link' }
      },
      {
        path: 'https://pay.weixin.qq.com/index.php/core/home/login',
        meta: { title: '微信支付', icon: 'link' }
      },
      {
        path: 'https://mpkf.weixin.qq.com/',
        meta: { title: '小程序客服', icon: 'link' }
      },
      {
        path: 'https://www.alibabacloud.com/zh/product/oss',
        meta: { title: '阿里云存储', icon: 'link' }
      },
      {
        path: 'https://www.qiniu.com/products/kodo',
        meta: { title: '七牛云存储', icon: 'link' }
      },
      {
        path: 'http://www.kdniao.com/api-track',
        meta: { title: '快递鸟', icon: 'link' }
      }
    ]
  },*/
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]
