import request from '@/utils/request'
import Qs from 'qs'  

// 客户等级月销售额指标-保存
export function saveConfig(data) {
  return request({
    url: '/api-crm-system/crm/customerLevelAmount/saveConfig',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}  

// 客户等级月销售额指标-获取销售指标配置
export function getConfig (query) {
  return request({
    url: `/api-crm-system/crm/customerLevelAmount/getConfig`,
    method: 'get',
    params: query
  })
}

