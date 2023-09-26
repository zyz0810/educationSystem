import request from '@/utils/request'
import Qs from 'qs'

/* 权限管理-全部人员
 * pn
 * rn
*/
export function userlist(query) {
  return request({
    url: '/perm/userlist',
    method: 'get',
    params: query
  })
}
/* 权限管理-添加用户
 * id 家长id
 * action pass通过，reject拒绝
 * reason 拒绝理由
*/
export function adduser(query) {
  return request({
    url: '/perm/adduser',
    method: 'get',
    params: query
  })
}
/* 权限管理-更新用户
 * id 家长id
 * action pass通过，reject拒绝
 * reason 拒绝理由
*/
export function updateuser(query) {
  return request({
    url: '/perm/updateuser',
    method: 'get',
    params: query
  })
}
  /* 权限管理-删除用户
   * id 家长id
   * action pass通过，reject拒绝
   * reason 拒绝理由
  */
  export function deleteuser(query) {
    return request({
      url: '/perm/deleteuser',
      method: 'get',
      params: query
    })
  }
/* 权限管理-权限管理 -- 获取角色权限
 * role
*/
export function getpermbyrole(query) {
  return request({
    url: '/perm/getpermbyrole',
    method: 'get',
    params: query
  })
}

/* 权限管理-权限管理 -设置各角色权限
 * role
*/
export function setroleperm(query) {
  return request({
    url: '/perm/setroleperm',
    method: 'get',
    params: query
  })
}
