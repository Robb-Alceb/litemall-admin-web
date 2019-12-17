import request from '@/utils/request'

export function listFeedback(query) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params: query
  })

}


export function replyFeedback(data) {
  return request({
    url: '/feedback/reply',
    method: 'post',
    data
  })

}


export function ignoreFeedback(data) {
  return request({
    url: '/feedback/ignore',
    method: 'post',
    data
  })

}
