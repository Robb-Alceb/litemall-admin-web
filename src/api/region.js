import request from '@/utils/request'

export function listRegion() {
  return request({
    url: '/region/list',
    method: 'get'
  })
}

export function listCountryRegion(query) {
  return request({
    url: '/region/clist',
    method: 'get',
    params: query
  })
}


export function listSubRegion(query) {
  return request({
    url: '/region/slist',
    method: 'get',
    params: query
  })
}

export function getParentIds(id) {
  return request({
    url: '/region/parents/'+id,
    method: 'get'
  })
}
