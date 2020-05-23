import request from '@/utils/request'

export function listI18n(query) {
  return request({
    url: '/i18n/list',
    method: 'get',
    params: query
  })
}

export function updateI18n(data) {
  return request({
    url: '/i18n/update',
    method: 'put',
    data
  })
}

export function createI18n(data) {
  return request({
    url: '/i18n/create',
    method: 'post',
    data
  })
}

export function deleteI18nByKey(key) {
  return request({
    url: '/i18n/delete',
    method: 'delete',
    params: {key}
  })
}
