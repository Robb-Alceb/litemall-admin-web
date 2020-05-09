import request from '@/utils/request'

export function listGiftCard(query) {
  return request({
    url: '/giftcard/list',
    method: 'get',
    params: query
  })

}

export function detailGiftCard(id) {
  return request({
    url: '/giftcard/detail',
    method: 'get',
    params: {id}
  })

}

export function updateGiftCard(data) {
  return request({
    url: '/giftcard/update',
    method: 'put',
    data
  })

}

export function deleteGiftCard(id) {
  return request({
    url: '/giftcard/delete',
    method: 'delete',
    params: {id}
  })

}

export function createGiftCard(data) {
  return request({
    url: '/giftcard/create',
    method: 'post',
    data
  })

}



export function getUserListByGiftId(query) {
  return request({
    url: '/giftcarduser/list',
    method: 'get',
    params: query
  })

}


export function bindEntity(data) {
  return request({
    url: '/giftcarduser/bind',
    method: 'post',
    data
  })

}


export function unBindEntity(id) {
  return request({
    url: '/giftcarduser/unbind',
    method: 'put',
    params: {id}
  })

}
