import request from '@/utils/request'
import Qs from 'qs'

/* 经营数据汇总
 * type 1全部， 2日， 3月
 * date 当前选定日期， 如果没有，系统默认选定当前，天或者是月，根据type决定
 */
export function summerys(query) {
  return request({
    url: '/pc/summerys',
    method: 'get',
    params: query
  })
}
/* 获取某一天的新增订单
 * day
 */
export function orderlistbyday(query) {
  return request({
    url: '/pc/orderlistbyday',
    method: 'get',
    params: query
  })
}
