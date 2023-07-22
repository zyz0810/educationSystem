import request from '@/utils/request'
import Qs from 'qs'

// 外勤签到列表
export function signList(data) {
    return request({
        url: '/api-crm-system/crm/outsideSign/signList',
        method: 'post',
        data: Qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
    })
}

// 根据id查询
export function findById(data) {
    return request({
        url: '/api-crm-system/crm/outsideSign/findById',
        method: 'post',
        data: Qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
    })
}

// 根据id查询轨迹
export function findTrailById(data) {
    return request({
        url: '/api-crm-system/crm/outsideSign/findTrailById',
        method: 'post',
        data: Qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
    })
}

// 同意补录接口
export function signSupplementHandle(data) {
  return request({
      url: '/api-crm-system/crm/app/outsideSign/signSupplementHandle',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 文件导出
export function signListExport(params) {
  return request.post(
    '/api-crm-system/crm/outsideSign/signList/export',
    Qs.stringify(params, {
      arrayFormat: 'indices',
      allowDots: true
    }),
    {
      responseType: 'blob'
    }
  )
}

// 任务记录列表
export function recondList(data) {
  return request({
      url: '/api-crm-system/crm/web/v2/visit/task/recond/list',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}

// 任务记录明细
export function recondDetail(data) {
  return request({
      url: '/api-crm-system/crm/web/v2/visit/task/recond/detail',
      method: 'post',
      data: Qs.stringify(data, {
          arrayFormat: 'indices',
          allowDots: true
      })
  })
}


//导出任务记录 
export function recondExport(params) {
  return request.post(
    '/api-crm-system/crm/web/v2/visit/task/recond/export',
    Qs.stringify(params, {
      arrayFormat: 'indices',
      allowDots: true
    }),
    {
      responseType: 'blob'
    }
  )
}