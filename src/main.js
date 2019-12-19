import Vue from 'vue'
import Print from 'vue-print-nb'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import cn from '@/lang/cn'
import en from '@/lang/en'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js' // 权限判断指令

import shop from '@/directive/shop/index.js' // 门店成员判断指令
import VCharts from 'v-charts'    //报表

import _ from 'lodash'    //lodash

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.directive('permission', permission)
Vue.directive('shop', shop)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VCharts)

Vue.use(Print)

Vue.use(VueI18n)

Vue.config.productionTip = false

Vue.prototype._ = _

const messages = {
  en: {
    ...en,
    ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
  },
  cn: {
    ...cn,
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  }
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: store.getters.language || 'en', // set locale
  messages, // set locale messages
})

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
