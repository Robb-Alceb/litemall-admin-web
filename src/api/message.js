import request from '@/utils/request'

export function listMessage(query) {
  return request({
    url: '/message/list',
    method: 'get',
    params: query
  })
}

export function createMessage(data) {
  return request({
    url: '/message/create',
    method: 'post',
    data
  })
}


