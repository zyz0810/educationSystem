import request from '@/utils/request'
import Qs from 'qs'

// 用户查询列表
export function getUsers(query) {
    return request({
        url: '/api-crm-system/crm/users/getUsers',
        method: 'get',
        params: query
    })
}

// 用户查询列表加过滤直属上级
export function getUsersSuperior(query) {
  return request({
      url: '/api-crm-system/crm/users/getUsersSuperior',
      method: 'get',
      params: query
  })
}

// 新增、修改系统用户
export function saveSysUser(data) {
    return request({
        url: '/api-crm-system/crm/users/saveOrUpdateSysUser',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 查询部门树
export function findDeptTree() {
    return request({
        url: '/api-crm-system/crm/dept/findDeptTree',
        method: 'get'
    })
}

// 新增、修改职务
export function saveOrUpdateSysRole(data) {
    return request({
        url: '/api-crm-system/crm/role/saveOrUpdateSysRole',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 修改部门
export function updateDept(data) {
    return request({
        url: '/api-crm-system/crm/users/updateDept',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 查询职务列表
export function getRoles(query) {
    return request({
        url: '/api-crm-system/crm/role/getRoles',
        method: 'get',
        params: query
    })
}

// 修改职务
export function updateRoles(data) {
    return request({
        url: '/api-crm-system/crm/users/updateRoles',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 修改用户状态启用禁用
export function updateEnabled(data) {
    return request({
        url: '/api-crm-system/crm/users/updateEnabled',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

//重置用户密码 
export function resetPassword(data) {
    return request({
        url: '/api-crm-system/crm/users/users/resetPassword',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 批量删除用户
export function deleteSysUser(data) {
    return request({
        url: '/api-crm-system/crm/users/deleteSysUser',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

//根据用户id获取用户信息
export function getCrmUserById(query) {
    return request({
        url: '/api-crm-system/crm/users/getCrmUserById',
        method: 'get',
        params: query
    })
}

//数据权限下所有职务(new)
export function getRolesByRole(query) {
    return request({
        url: '/api-crm-system/crm/role/getRolesByRole',
        method: 'get',
        params: query
    })
}

//推广状态开启关闭
export function advertisementStatusOpenOrClose(data) {
    return request({
        url: '/api-crm-system/crm/users/advertisementStatusOpenOrClose',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}