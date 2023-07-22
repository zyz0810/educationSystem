import request from '@/utils/request'
import Qs from 'qs'

// 我的业绩、下属业绩
export function queryOwnPerformance(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryOwnPerformance',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 部门业绩
export function queryWebDeptPerformance(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryWebDeptPerformance',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 我的业绩、下属业绩Echarts
export function queryWebOwnPerformanceEcharts(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryWebOwnPerformanceEcharts',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 部门Echarts
export function queryWebDeptPerformanceEcharts(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryWebDeptPerformanceEcharts',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询部门树
export function findDeptTree() {
  return request({
    url: '/api-crm-system/crm/dept/findDeptTree',
    method: 'get'
  })
}

// 用户查询列表
export function getUsers(query) {
  return request({
    url: '/api-crm-system/crm/users/getUsers',
    method: 'get',
    params: query
  })
}

// 我的业绩，下属业绩详情
export function queryWebDetailByClerk(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryWebDetailByClerk',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 部门业绩详情
export function queryWebDetailByDept(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryWebDetailByDept',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 首页数据查询
export function queryMainPageData(data) {
  return request({
    url: 'api-crm-order/web/crm/order/queryMainPageData',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询下属列表
export function getChildUsers(data) {
  return request({
    url: 'api-crm-system/crm/users/getChildUsers',
    method: 'get'
  })
}

// 总的提成统计列表接口
export function profitListByPage(data) {
  return request({
    url: '/api-crm-system/productAdvertisement/crm/profitListByPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 推广收益明细列表
export function advertisementIncomeDetails(data) {
  return request({
    url: '/api-crm-system/productAdvertisement/crm/advertisementIncomeDetails',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 推广收益订单查询列表
export function querySpreadOrderList(data) {
  return request({
    url: '/api-crm-order/crm/querySpreadOrderList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 商品订单详情 参数(订单id)
export function orderDetail(data) {
  return request({
    url: '/api-crm-order/crm/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 收款记录
export function collectionRecord(data) {
  return request({
    url: '/api-crm-order/crm/record',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 发货记录
export function shippingRecord(data) {
  return request({
    url: '/api-crm-order/crm/shipping/record',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户签收记录
export function signRecord(data) {
  return request({
    url: '/api-crm-order/crm/sign/order',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}