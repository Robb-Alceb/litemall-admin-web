import request from '@/utils/request'


export function listMessage(query) {
  return request({
    url: '/message/queryMessageList',
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

export function deleteMessage(id) {
  return request({
    url: '/message/create',
    method: 'delete',
    params: {id}
  })
}
