import request from '@/utils/request'
import Qs from 'qs'
// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
// 获取菜单列表（树）
export function findTreeList() {
  return request({
    url: '/api-crm-system/crm/menu/findTreeList',
    method: 'GET'
  })
}
// 新增、修改菜单
export function saveOrUpdateMenu(data) {
  return request({
    url: '/api-crm-system/crm/menu/saveOrUpdateMenu',
    method: 'POST',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
/* 删除菜单
 * menuId 	菜单id
 */
export function deleteMenu(data) {
  return request({
    url: '/api-crm-system/crm/menu/deleteMenu',
    method: 'POST',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
