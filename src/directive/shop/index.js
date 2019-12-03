import shop from './shop'

const install = function(Vue) {
  Vue.directive('shop', shop)
}

if (window.Vue) {
  window['shop'] = shop
  Vue.use(install); // eslint-disable-line
}

shop.install = install
export default shop
