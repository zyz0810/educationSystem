import request from '@/utils/request'
import Qs from 'qs'

/* 获取区域List
 * firstName ?firstName=安徽省 就是查安徽省的
 /* 获取区域树
 * code 区域code
 * name 区域名称
 * PROVINCE(1, "省"),
 * CITY(2, "市"),
 * DISTRICT(3, "区"),
 * STREET(4, "街道");
 */
// 三级联动
  export function findAreaTree (query) {
    if (!query) {
      query = Object.assign({}, {
        level: "DISTRICT"
      })
    }
    return request({
      url: `api-user/area/v3/findAreaTree`,
      method: 'get',
      params: query
    })
  }
// export function findAreaTree (query) {
//   if (!query) {
//     query = Object.assign({}, {
//       level: "DISTRICT"
//     })
//   }
//   return request({
//     url: `api-user/area/findAreaTree`,
//     method: 'get',
//     params: query
//   })
// }

export function findAreaTreeS (query) {
  if (!query) {
    query = Object.assign({}, {
      level: "STREET"
    })
  }
  return request({
    url: `api-user/area/findAreaTree`,
    method: 'get',
    params: query
  })
}

/* 获取区域叶子
 * code 区域code
 * name 区域名称
 * id 地区id
 */
export function findAreaChilds (query) {
  return request({
    url: `api-user/area/findAreaChilds`,
    method: 'get',
    params: query
  })
}
