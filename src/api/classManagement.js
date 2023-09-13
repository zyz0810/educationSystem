import request from '@/utils/request'
import Qs from 'qs'

// 分类设置列表
export function selectProductSortPage(query) {
  return request({
    url: '/api-crm-system/web/selectProductSortPage',
    method: 'get',
    params: query
  })
}

// 获取所有一级商品等级名称
export function selectAllProductCategory (query) {
  return request({
    url: `/api-crm-system/web/selectAllProductCategory`,
    method: 'get',
    params: query
  })
}

// 保存or编辑
export function saveOrUpdate(data) {
  return request({
    url: '/api-crm-system/web/saveOrUpdate/productSort',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 获取详情
export function selectProductSortDetail(query) {
  return request({
    url: '/api-crm-system/web/selectProductSortDetail',
    method: 'get',
    params: query
  })
}
