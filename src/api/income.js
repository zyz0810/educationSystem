import request from '@/utils/request'
import Qs from 'qs'

/* 获取发放收益列表
 * start 开始时间
 * end 结束时间
 * status 当前的状态
 */
export function getProfits(query) {
  return request({
    url: '/getProfits',
    method: 'get',
    params: query
  })
}

/* 更新收益申请的状态
 * apply_id 申请发放的id 数组
 * status 更新到目的态
 */
export function update_apply() {
  return request({
    url: '/update_apply',
    method: 'get',
  })
}
