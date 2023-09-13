import request from '@/utils/request'
import Qs from 'qs'

// 登录方法
export function login(query) {
  return request({
    // url: 'api-auth/oauth/crm/login',
    // method: 'post',
    // data: Qs.stringify(data, {
    //   arrayFormat: 'indices',
    //   allowDots: true
    // })
    url: '/pc/login',
    method: 'get',
    params: query
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    // url: 'api-crm-system/crm/users/current',
    // method: 'get'
    url: '/pc/getaudituserlist',
    method: 'get',
    params:{pn:1,rn:1}
  })
}
/* 修改资料
 *
 */
export function userUpdate(data) {
  return request({
    url: 'api-crm-system/crm/users/saveOrUpdateSysUser',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
/* 修改密码
 *
 */
export function resetPassword(data) {
  return request({
    url: 'api-crm-system/crm/users/app/resetPassword',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 退出登录
 *
 */
export function logout() {
  return request({
    url: 'pc/logout',
    method: 'get',
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

// 待办数
export function backlog(data) {
  return request({
    url: '/api-crm-system/crm/customer/backlog',
    method: 'post',
    data: Qs.stringify(data)
  })
}
