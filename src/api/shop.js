import request from '@/utils/request'

export function listShop(query) {
  return request({
    url: '/shop/list',
    method: 'get',
    params: query
  })
}

export function deleteShop(id) {
  return request({
    url: '/shop/delete',
    method: 'delete',
    params: { id }
  })
}

export function detailShop(id) {
  return request({
    url: '/shop/detail',
    method: 'get',
    params: { id }
  })
}

export function editShop(data) {
  return request({
    url: '/shop/update',
    method: 'put',
    data
  })
}

export function createShop(data) {
  return request({
    url: '/shop/create',
    method: 'post',
    data
  })
}

export function getLogs(query) {
  return request({
    url: '/shopLog/list',
    method: 'get',
    params: query
  })
}

export function getShopOrderList(query) {
  return request({
    url: '/shopOrder/list',
    method: 'get',
    params: query
  })
}

export function shopOrderApplying(data) {
  return request({
    url: '/shopOrder/orderApplying',
    method: 'post',
    data
  })
}

export function shopOrderPass(data) {
  return request({
    url: '/shopOrder/orderPass',
    method: 'post',
    data
  })
}

export function shopOrderNoPass(data) {
  return request({
    url: '/shopOrder/orderNoPass',
    method: 'post',
    data
  })
}

export function shopOrderPay(data) {
  return request({
    url: '/shopOrder/orderPay',
    method: 'post',
    data
  })
}

export function shopDeliverGoods(data) {
  return request({
    url: '/shopOrder/deliverGoods',
    method: 'post',
    data
  })
}

export function shopCancelDeliverGoods(data) {
  return request({
    url: '/shopOrder/cancelDeliverGoods',
    method: 'post',
    data
  })
}

export function shopTakeDelivery(data) {
  return request({
    url: '/shopOrder/takeDelivery',
    method: 'post',
    data
  })
}

export function shopOrderDetail(id) {
  return request({
    url: '/shopOrder/read',
    method: 'get',
    params: { id }
  })
}
