import request from '@/utils/request'
import Qs from 'qs'

/* 黑名单列表
 * pn
 * rn
*/
export function getblacklist(query) {
  return request({
    url: '/pc/getblacklist',
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
    url: '/pc/addblacklist',
    method: 'get',
    params: query
  })
}
/* 移除黑名单
 * black_user_id 移除的用户id
*/
export function removebacklist(query) {
  return request({
    url: '/pc/removeblacklist',
    method: 'get',
    params: query
  })
}
