import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}

export function publishGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/goods/catAndBrand',
    method: 'get'
  })
}

export function getGoodsLogs(query) {
  return request({
    url: '/goods/queryGoodsLogList',
    method: 'get',
    params: query
  })
}


export function approveGoods(data) {
  return request({
    url: '/goods/approve',
    method: 'post',
    data
  })
}

export function rejectGoods(data) {
  return request({
    url: '/goods/reject',
    method: 'post',
    data
  })
}

export function pushGoods(data) {
  return request({
    url: '/goods/push',
    method: 'put',
    data
  })
}

export function newProductGoods(data) {
  return request({
    url: '/goods/newProduce',
    method: 'put',
    data
  })
}

export function recommendGoods(data) {
  return request({
    url: '/goods/recommend',
    method: 'put',
    data
  })
}

export function updatePriceGoods(data) {
  return request({
    url: '/goods/updatePrice',
    method: 'put',
    data
  })
}

export function updateSpecPriceGoods(data) {
  return request({
    url: '/goods/updateSpecPrice',
    method: 'put',
    data
  })
}

export function getAllPriceGoods(query) {
  return request({
    url: '/goods/allPrice',
    method: 'get',
    params: query
  })
}


export function updateStoreGoods(data) {
  return request({
    url: '/goods/updateStore',
    method: 'put',
    data
  })
}

export function updateGoodsDiscountPrice(data) {
  return request({
    url: '/goods/updateDiscountPrice',
    method: 'put',
    data
  })
}

export function batchCreate(data) {
  return request({
    url: '/goods/batch',
    method: 'post',
    data
  })
}

export function readGoodsProduct(params) {
  return request({
    url: '/goods/readGoodsProduct',
    method: 'get',
    params: params
  })
}

export function updateGoodsProduct(data) {
  return request({
    url: '/goods/updateGoodsProduct',
    method: 'put',
    data
  })
}

export function addGoodsProduct(data) {
  return request({
    url: '/goods/addGoodsProduct',
    method: 'post',
    data
  })
}

export function goodsOps() {
  return request({
    url: '/goods/goodsOps',
    method: 'get',
  })
}
