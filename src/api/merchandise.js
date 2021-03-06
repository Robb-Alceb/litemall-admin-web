import request from '@/utils/request'

export function listMerchandise(query) {
  return request({
    url: '/merchandise/list',
    method: 'get',
    params: query
  })
}

export function deleteMerchandise(id) {
  return request({
    url: '/merchandise/delete',
    method: 'delete',
    params: { id }
  })
}

export function editMerchandise(data) {
  return request({
    url: '/merchandise/update',
    method: 'put',
    data
  })
}

export function createMerchandise(data) {
  return request({
    url: '/merchandise/create',
    method: 'post',
    data
  })
}

export function readMerchandise(id) {
  return request({
    url: '/merchandise/read',
    method: 'get',
    params: { id }
  })
}

export function getMerchandiseRecordList(query) {
  return request({
    url: '/merchandise/merchandiseRecordList',
    method: 'get',
    params: query
  })
}


export function allMerchandise() {
  return request({
    url: '/merchandise/all',
    method: 'get'
  })
}

export function merchandiseAddNumber(data) {
  return request({
    url: '/merchandise/addNumber',
    method: 'put',
    data
  })
}


