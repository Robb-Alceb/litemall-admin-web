
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    const shop = store.getters && store.getters.shop
    if (value != undefined) {
      if(value){
        if (!shop || !shop.id) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }else{
        if (shop) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }

    } else {
      throw new Error(`need value! Like v-shop="true"`)
    }
  }
}
