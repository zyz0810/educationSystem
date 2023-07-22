import request from '@/utils/request'
import Qs from 'qs'
import axios from "axios";

// 注册并开户 or 编辑
export function updateEnabled(data) {
  return request({
    url: '/api-crm-system/crm/customer',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询客户类型的资质材料
export function selectByCategoryId(data) {
  return request({
    url: '/api-crm-system/crm/customerStoreCategory/selectByCategoryId',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询认领客户 即客户列表
export function customerList(data) {
  return request({
    url: '/api-crm-system/crm/customer/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户列表中客户类型接口
export function usable(data) {
  return request({
    url: '/api-user/customerStoreCategory/usable',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 删除客户
export function deleteCustomer(data) {
  return request({
    url: '/api-crm-system/crm/customer/delete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 放入公海
export function highSeas(data) {
  return request({
    url: '/api-crm-system/crm/customer/highSeas',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 确认客户成交

export function bargain(data) {
  return request({
    url: '/api-crm-system/crm/customer/bargain',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 新建任务
export function taskSave(data) {
  return request({
    url: '/api-crm-system/crm/customer/follow/task/save',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户转移
export function transfer(data) {
  return request({
    url: '/api-crm-system/crm/customer/transfer',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 公海客户转移
export function highSeasTransfer(data) {
  return request({
    url: '/api-crm-system/crm/customer/highSeas/transfer',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 添加客户跟进记录
export function followSave(data) {
  return request({
    url: '/api-crm-system/crm/customer/follow/save',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询公海客户
export function highSeasList(data) {
  return request({
    url: '/api-crm-system/crm/customer/highSeas/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 领取公海客户
export function claimCustomer(data) {
  return request({
    url: '/api-crm-system/crm/customer/highSeas/claim',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 导出公海客户
export function exportCustomer(params) {
  return request
    .post('/api-crm-system/crm/customer/highSeas/export', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), {
      responseType: "blob"
    })
}

// 导出认领客户
export function exportCustomers(params) {
  return request
    .post('/api-crm-system/crm/customer/export', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), {
      responseType: "blob"
    })
}
// 认领导出
export function exportClaim(params) {
  return request
    .post('/api-crm-system/crm/customer/export', Qs.stringify(params, {
      arrayFormat: "indices",
      allowDots: true
    }), {
      responseType: "blob"
    })
}

// 客户详情
export function getCustomerDetail(data) {
  return request({
    url: '/api-crm-system/crm/customer/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户跟进记录
export function getCustomerFollow(data) {
  return request({
    url: '/api-crm-system/crm/customer/follow',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 客户详情
export function detail(data) {
  return request({
    url: '/api-crm-system/crm/customer/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}


// 删除客户跟进记录
export function followDelete(data) {
  return request({
    url: '/api-crm-system/crm/customer/follow/delete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 门店修改申请
export function applyCommit(data) {
  return request({
    url: '/api-crm-system/customerStore/crm/apply/commit',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 商品管理
export function customerProductPageList(data) {
  return request({
    url: '/api-crm-system/crm/web/stock/customerProductPageList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// web客户信息盘点列表
export function selectCustomerCheck(data) {
  return request({
    url: '/api-crm-system/crm/web/stock/selectCustomerCheck',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// web客户信息盘点详情
export function selectCheckItemPage(data) {
  return request({
    url: '/api-crm-system/crm/web/stock/selectCheckItemPage',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 修改定位
export function lonAndLatEdit(data) {
  return request({
    url: '/api-crm-system/crm/customer/lonAndLat/edit',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 批量修改等级确定接口
// export function importInfo(data) {
//   return request({
//     url: '/api-crm-system//crm/customer/import/info',
//     method: 'post',
//     data: Qs.stringify(data, {
//       arrayFormat: 'indices',
//       allowDots: true
//     })
//   })
// }


/* 批量修改等级确定接口
 */
export function importInfo(file, type = "license") {
  const data = new FormData()
  data.append('file', file)
  data.append('type', type)
  return request({
    url: `/api-crm-system/crm/customer/import/info`,
    method: 'POST',
    data: data
  }).then(res => {
    return res ? res.data : {}
  })
}

// 根据skuId查询客户门店半年单商品的增长比例
export function selectProductAnalysisBySkuId(data) {
  return request({
    url: '/api-crm-order/crm/productAnalysis/selectProductAnalysisBySkuId',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询门店下商品进货数量和占比
export function selectProductAnalysisList(data) {
  return request({
    url: '/api-crm-order/crm/productAnalysis/selectProductAnalysisList',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}