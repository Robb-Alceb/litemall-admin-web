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
    params: {id}
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

