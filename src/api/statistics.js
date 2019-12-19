import request from '@/utils/request'

export function goodsStatistics(query) {
  return request({
    url: '/order/goodsStatistics',
    method: 'get',
    params: query
  })
}

export function goodsSalesStatistics(query) {
  return request({
    url: '/order/goodsSalesStatistics',
    method: 'get',
    params: query
  })
}




export function queryUserStatistics(query) {
  return request({
    url: '/user/queryUserStatistics',
    method: 'get',
    params: query
  })
}


export function queryAddUserStatistics(query) {
  return request({
    url: '/user/queryAddUserStatistics',
    method: 'get',
    params: query
  })
}
