import request from '@/utils/request'

export function listTaxes(query) {
  return request({
    url: '/tax/list',
    method: 'get',
    params: query
  })
}


export function createTax(data) {
  return request({
    url: '/tax/create',
    method: 'post',
    data
  })
}

export function deleteTax(id) {
  return request({
    url: '/tax/delete',
    method: 'delete',
    params: {id}
  })
}

export function updateTax(data) {
  return request({
    url: '/tax/update',
    method: 'put',
    data
  })
}

export function enableTax(data) {
  return request({
    url: '/tax/enable',
    method: 'put',
    data
  })
}
