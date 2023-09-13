import request from '@/utils/request'
import Qs from 'qs'

/* 家长信息审核列表
 * pn
 * rn
*/
export function getaudituserlist(query) {
  return request({
    url: 'pc/getaudituserlist',
    method: 'get',
    params: query
  })
}
/* 家长信息审核
 * id 家长id
 * action pass通过，reject拒绝
 * reason 拒绝理由
*/
export function audituserinfo(query) {
  return request({
    url: 'pc/audituserinfo',
    method: 'get',
    params: query
  })
}
