import request from '@/utils/request'
import Qs from 'qs'

/* 咨询师信息审核列表
 * pn
 * rn
*/
export function getauditconsultlist(query) {
  return request({
    url: 'pc/getauditconsultlist',
    method: 'get',
    params: query
  })
}
/* 咨询师信息审核
 * id 家长id
 * action pass通过，reject拒绝
 * reason 拒绝理由
*/
export function getauditconsultlist1(query) {
  return request({
    url: 'pc/getauditconsultlist',
    method: 'get',
    params: query
  })
}
