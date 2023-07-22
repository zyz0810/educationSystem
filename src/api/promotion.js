import request from '@/utils/request'
import Qs from 'qs'

/* 推广商品列表
 * endTime
 * priority 优先级
 * startTime
 * taskName 任务名
 * taskStatus 任务状态
 */
export function promotionList(data) {
  return request({
    url: 'api-crm-system/productAdvertisement/crm/product/list',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
