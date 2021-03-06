import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function listAddress(query) {
  return request({
    url: '/address/list',
    method: 'get',
    params: query
  })
}

export function listCollect(query) {
  return request({
    url: '/collect/list',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params: query
  })
}

export function listFootprint(query) {
  return request({
    url: '/footprint/list',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/history/list',
    method: 'get',
    params: query
  })
}


export function userOption(query) {
  return request({
    url: '/user/option',
    method: 'get',
    params: query
  })
}


export function userBill(query) {
  return request({
    url: '/user/rechargeConsumptionList',
    method: 'get',
    params: query
  })
}

export function userInfo(userId) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {userId}
  })
}


export function couponCount(userId) {
  return request({
    url: '/user/queryUserCoupon',
    method: 'get',
    params: {userId}
  })
}


export function billStatistics(userId) {
  return request({
    url: '/user/statistics',
    method: 'get',
    params: {userId}
  })
}

export function resetUserPwd(data) {
  return request({
    url: '/user/resetpwd',
    method: 'put',
    params: data
  })
}

export function updateIntegral(data) {
  return request({
    url: '/user/integral',
    method: 'put',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}
