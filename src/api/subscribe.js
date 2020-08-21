import request from '@/utils/request'

export function listSubscribe(query) {
  return request({
    url: '/subscribe/list',
    method: 'get',
    params: query
  })
}

export function createSubscribe(data) {
  return request({
    url: '/subscribe/create',
    method: 'post',
    data
  })
}
export function readSubscribe(id) {
  return request({
    url: '/subscribe/read',
    method: 'get',
    params: {id}
  })
}
export function deleteSubscribe(id) {
  return request({
    url: '/subscribe/delete',
    method: 'delete',
    params: {id}
  })
}
export function updateSubscribe(data) {
  return request({
    url: '/subscribe/update',
    method: 'put',
    data
  })
}

export function subscribeusers(query) {
  return request({
    url: '/subscribe/users',
    method: 'get',
    params: query
  })
}
