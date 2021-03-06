import request from '@/utils/request'

export function listCoupon(query) {
  return request({
    url: '/coupon/list',
    method: 'get',
    params: query
  })
}

export function createCoupon(data) {
  return request({
    url: '/coupon/create',
    method: 'post',
    data
  })
}

export function readCoupon(id) {
  return request({
    url: '/coupon/read',
    method: 'get',
    params: { id }
  })
}

export function updateCoupon(data) {
  return request({
    url: '/coupon/update',
    method: 'post',
    data
  })
}

export function deleteCoupon(data) {
  return request({
    url: '/coupon/delete',
    method: 'post',
    data
  })
}

export function listCouponUser(query) {
  return request({
    url: '/coupon/listuser',
    method: 'get',
    params: query
  })
}

export function listCouponGoods(query) {
  return request({
    url: '/coupon/goodsList',
    method: 'get',
    params: query
  })
}

export function couponStatistics(id) {
  return request({
    url: '/coupon/statistics',
    method: 'get',
    params: {id}
  })
}

export function listCouponCategory(query) {
  return request({
    url: '/coupon/categoryList',
    method: 'get',
    params: query
  })
}
