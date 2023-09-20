import request from '@/utils/request'
import Qs from 'qs'

/* 投诉列表
 * pn 页码
 * rn 每页
*/
export function complaintlists(query) {
  return request({
    url: 'pc/complaintlists',
    method: 'get',
    params: query
  })
}
/* 更新投诉状态
 * id 投诉记录id
 * status 1/2/3
*/
export function complaintstatus(query) {
  return request({
    url: 'pc/complaintstatus',
    method: 'get',
    params: query
  })
}
