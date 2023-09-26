import request from '@/utils/request'
import Qs from 'qs'

/* 邀请码信息
 * pn
 * rn
*/
export function invitecode(query) {
  return request({
    url: '/perm/invitecode',
    method: 'get',
    params: query
  })
}
