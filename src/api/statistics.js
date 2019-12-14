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
