import request from '@/utils/request'
import Qs from 'qs'

/* 运营商收入查询
 * invite_code 运营商授权码
 * month 查询的月份
 * pn
 * rn
*/
export function suppliers(query) {
  return request({
    url: '/pc/suppliers',
    method: 'get',
    params: query
  })
}
/* 添加黑名单
 * black_user_id 被拉黑的用户id
 * reason 被拉黑的原因
*/
export function addblacklist(query) {
  return request({
    url: 'pc/addblacklist',
    method: 'get',
    params: query
  })
}
/* 移除黑名单
 * black_user_id 移除的用户id
*/
export function removebacklist(query) {
  return request({
    url: 'userinfo/removebacklist',
    method: 'get',
    params: query
  })
}
