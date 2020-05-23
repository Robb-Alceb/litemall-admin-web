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
        meta: { title: 'System_home_page', icon: 'dashboard', noCache: true }
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
      title: 'Store_management',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/shop/list'),
        name: 'list',
        meta: {
          perms: ['GET /admin/shop/list'],
          title: 'Store_management',
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/shop/edit'),
        name: 'editShop',
        meta: {
          perms: ['PUT /admin/shop/update', 'GET /admin/shop/detail'],
          title: 'Edit_stores',
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
          title: 'Store_details',
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
          title: 'Add_store',
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
          title: 'Store_partners',
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
          title: 'Store_operation_journals',
          noCache: true
        }
      },

      {
        path: 'order/detail',
        component: () => import('@/views/shop/order/detail'),
        name: 'shopOrderDetail',
        meta: {
          perms: ['POST /admin/shopOrder/orderPass', 'POST /admin/shopOrder/orderNoPass', 'POST /admin/shopOrder/orderPay', 'POST /admin/shopOrder/deliverGoods', 'POST /admin/shopOrder/cancelDeliverGoods', 'POST /admin/shopOrder/takeDelivery'],
          title: 'Store_ticket_processing',
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
          title: 'Purchasing_request',
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
      title: 'Merchandise_management',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /admin/goods/list'],
          title: 'Goods_list',
          noCache: true
        }
      },
      {
        path: 'category',
        component: () => import('@/views/goods/category'),
        name: 'category',
        meta: {
          perms: ['GET /admin/category/list'],
          title: 'Merchandise_category',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /admin/goods/create'],
          title: 'Add_Goods',
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
          title: 'Edit_merchandies',
          noCache: true
        },
        hidden: true
      },
/*      {
        path: 'comment',
        component: () => import('@/views/goods/comment'),
        name: 'goodsComment',
        meta: {
          perms: ['GET /admin/comment/list'],
          title: '商品评论',
          noCache: true
        }
      },*/
      {
        path: 'logs',
        component: () => import('@/views/goods/logs'),
        name: 'goodsLogs',
        meta: {
          perms: ['GET /admin/goods/queryGoodsLogList'],
          title: 'Merchandise_operation_journals',
          noCache: true
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/goods/detail'),
        name: 'goodsDetail',
        meta: {
          perms: ['GET /admin/goods/detail'],
          title: 'Merchandise_details',
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
      title: 'Tickets_management',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'orderList',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
          title: 'Tickets_list',
          noCache: true
        },
      },
      {
        path: 'detail',
        component: () => import('@/views/order/detail'),
        name: 'orderDetail',
        meta: {
          perms: ['GET /admin/order/read'],
          title: 'Order_details',
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
          title: 'Print_order',
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
      title: 'Stock_management',
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
          title: 'Incoming_and_outgoing_list',
          noCache: true
        }
      },
      {
        path: 'merchandise',
        component: () => import('@/views/repository/merchandise'),
        name: 'merchandise',
        meta: {
          perms: ['GET /admin/merchandise/list'],
          title: 'Merchandise_list',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/repository/create'),
        name: 'merchandiseCreate',
        meta: {
          perms: ['POST /admin/merchandise/create'],
          title: 'Add_Products',
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
          title: 'Product_details',
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
      title: 'User_management',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin/user/list'],
          title: 'Member_management',
          noCache: true
        }
      },
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /admin/address/list'],
          title: 'Receiving_Address',
          noCache: true
        }
      },
      {
        path: 'bill',
        component: () => import('@/views/user/bill'),
        name: 'userBill',
        meta: {
          perms: ['GET /admin/user/rechargeConsumptionList'],
          title: '账户明细',
          noCache: true
        }
      },
      {
        path: 'collect',
        component: () => import('@/views/user/collect'),
        name: 'collect',
        meta: {
          perms: ['GET /admin/collect/list'],
          title: 'Members_collection',
          noCache: true
        }
      },
      {
        path: 'footprint',
        component: () => import('@/views/user/footprint'),
        name: 'footprint',
        meta: {
          perms: ['GET /admin/footprint/list'],
          title: 'Member_tracking',
          noCache: true
        }
      },
      {
        path: 'history',
        component: () => import('@/views/user/history'),
        name: 'history',
        meta: {
          perms: ['GET /admin/history/list'],
          title: 'Search_history',
          noCache: true
        }
      },
      {
        path: 'overview',
        component: () => import('@/views/user/overview'),
        name: 'userOverview',
        meta: {
          perms: ['GET /admin/user/read'],
          title: '用户信息',
          noCache: true
        },
        hidden: true
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
      title: 'Activity_management',
      icon: 'chart'
    },
    children: [
      {
        path: 'ad',
        component: () => import('@/views/promotion/ad'),
        name: 'ad',
        meta: {
          perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
          title: 'Advertisememtn_management',
          noCache: true
        }
      },
      {
        path: 'coupon',
        component: () => import('@/views/promotion/coupon'),
        name: 'coupon',
        meta: {
          perms: ['GET /admin/coupon/list', 'POST /admin/coupon/create', 'POST /admin/coupon/update', 'POST /admin/coupon/delete'],
          title: 'Coupon_management',
          noCache: true
        },
      },
      {
        path: 'couponDetail',
        component: () => import('@/views/promotion/couponDetail'),
        name: 'couponDetail',
        meta: {
          perms: ['GET /admin/coupon/list', 'GET /admin/coupon/listuser'],
          title: 'couponDetail',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'giftcard',
        component: () => import('@/views/gift/list'),
        name: 'giftcard',
        meta: {
          perms: ['GET /admin/giftcard/list', 'POST /admin/giftcard/create', 'PUT /admin/giftcard/update', 'DELETE /admin/giftcard/delete'],
          title: '礼物卡管理',
          noCache: true
        },
      },
      {
        path: 'giftcard/create',
        component: () => import('@/views/gift/create'),
        name: 'giftcardCreate',
        meta: {
          perms: ['POST /admin/giftcard/create'],
          title: '礼物卡添加',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'giftcard/edit',
        component: () => import('@/views/gift/edit'),
        name: 'giftcardEdit',
        meta: {
          perms: ['PUT /admin/giftcard/update'],
          title: '礼物卡编辑',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'giftcard/detail',
        component: () => import('@/views/gift/detail'),
        name: 'giftcardDetail',
        meta: {
          perms: ['PUT /admin/giftcard/update'],
          title: '礼物卡详情',
          noCache: true
        },
        hidden: true
      },
      /*{
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
      title: 'Data_analysis',
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
          title: 'Merchandise_data',
          noCache: true
        }
      },
      {
        path: 'user',
        component: () => import('@/views/statistics/user'),
        name: 'userStatistics',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: 'User_data',
          noCache: true
        }
      },
      {
        path: 'sales',
        component: () => import('@/views/statistics/sales'),
        name: 'salesStatistics',
        meta: {
          perms: [],
          title: 'Sales_data',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'notice',
    meta: {
      title: 'Notifications',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/message/list'),
        name: 'messageList',
        meta: {
          perms: ['GET /admin/message/list'],
          title: 'Notification_list',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/message/create'),
        name: 'messageCreate',
        meta: {
          perms: ['POST /admin/message/create'],
          title: 'Publish_notification',
          noCache: true
        },
        hidden: true
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
      title: 'User_feedback',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/feedback/list'),
        name: 'feedbackList',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: 'Feedback_list',
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
      title: 'System_settings',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: 'Controller_list',
          noCache: true
        }
      },
      {
        path: 'admin/edit',
        component: () => import('@/views/sys/admin/edit'),
        name: 'adminEdit',
        meta: {
          perms: ['POST /admin/admin/update'],
          title: 'Edit_controllers',
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
          title: 'Add_controllers',
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
          title: 'Operating_Journals',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete'],
          title: 'Roles_list',
          noCache: true
        }
      },
      {
        path: 'role/edit',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: 'Roles_access',
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
          title: 'Target_save',
          noCache: true
        }
      }
    ]
  },

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
/*      {
        path: 'mall',
        component: () => import('@/views/config/mall'),
        name: 'configMall',
        meta: {
          perms: ['GET /admin/config/mall', 'POST /admin/config/mall'],
          title: '商场配置',
          noCache: true
        }
      },*/
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
        path: 'amount',
        component: () => import('@/views/config/amount'),
        name: 'configAmount',
        meta: {
          perms: ['GET /admin/config/amount', 'POST /admin/config/amount'],
          title: '统计金额配置',
          noCache: true
        }
      },
      {
        path: 'settlement',
        component: () => import('@/views/config/settlement'),
        name: 'configSettlement',
        meta: {
          perms: ['GET /admin/config/settlement', 'POST /admin/config/settlement'],
          title: '结算面额配置',
          noCache: true
        }
      },
      {
        path: 'other',
        component: () => import('@/views/config/other'),
        name: 'configOther',
        meta: {
          perms: ['GET /admin/config/other', 'POST /admin/config/other'],
          title: '其他配置',
          noCache: true
        }
      },
      {
        path: 'tax',
        component: () => import('@/views/config/tax'),
        name: 'configTax',
        meta: {
          perms: ['GET /admin/tax/list', 'POST /admin/tax/create', , 'PUT /admin/tax/update'],
          title: '税费配置',
          noCache: true
        }
      },
      {
        path: 'i18n',
        component: () => import('@/views/config/i18n'),
        name: 'configI18n',
        meta: {
          perms: ['GET /admin/i18n/list', 'POST /admin/i18n/create', , 'PUT /admin/i18n/update'],
          title: '国际化配置',
          noCache: true
        }
      }
      /*{
        path: 'wx',
        component: () => import('@/views/config/wx'),
        name: 'configWx',
        meta: {
          perms: ['GET /admin/config/wx', 'POST /admin/config/wx'],
          title: '小程序配置',
          noCache: true
        }
      }*/
    ]
  },
  /*
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
        meta: { title: 'Change_password', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]
