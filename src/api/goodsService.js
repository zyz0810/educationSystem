import request from '@/utils/request'
import Qs from 'qs'


// 外勤签到列表
export function listByPage(data) {
  return request({
      url: '/api-crm-system/product/service/crm/listByPage',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}


//  商品服务-(addCPS新增 updateCPS编辑 submitCheckCPS提交审核 cancelCPS撤销审核)
export function modify(data) {
  return request({
      url: '/api-crm-system/product/service/crm/modify',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 根据Id查询商品服务
export function getProductServeById(data) {
  return request({
      url: '/api-crm-system/product/service/crm/getProductServeById',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 审核失败原因
export function operatorProductServiceSearchLog(data) {
  return request({
      url: '/api-crm-system/product/service/crm/operatorProductServiceSearchLog',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

