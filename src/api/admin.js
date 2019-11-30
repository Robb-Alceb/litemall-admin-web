import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data
  })
}

export function readAdmin(id) {
  return request({
    url: '/admin/read',
    method: 'get',
    params: { id }
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/admin/delete',
    method: 'post',
    data
  })
}

export function getShopkeeper(shopId) {
  return request({
    url: '/admin/shop/shopkeeper',
    method: 'get',
    params: { shopId }
  })
}

export function getShopManager(shopId) {
  return request({
    url: '/admin/shop/manager',
    method: 'get',
    params: { shopId }
  })
}

export function getShopMembers(shopId) {
  return request({
    url: '/admin/shop/members',
    method: 'get',
    params: { shopId }
  })
}

export function allAdmin() {
  return request({
    url: '/admin/all',
    method: 'get'
  })
}

export function infoAdmin() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}
