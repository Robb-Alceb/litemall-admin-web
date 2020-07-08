import request from '@/utils/request'

export function materialList(query) {
  return request({
    url: '/erp/material/list',
    method: 'get',
    params: query
  })
}


export function materialApply(adminOrderId) {
  return request({
    url: '/erp/depot/purchase',
    method: 'get',
    params: {adminOrderId}
  })
}


export function billnumber() {
  return request({
    url: '/erp/depot/billnumber',
    method: 'get',
  })
}
