import request from '@/utils/request'
import Qs from 'qs'

/* 获取发放收益列表
 * start 开始时间
 * end 结束时间
 * status 当前的状态
 */
export function getProfits(query) {
  return request({
    url: '/pc/profits',
    method: 'get',
    params: query
  })
}

/* 更新收益申请的状态
 * apply_id 申请发放的id 数组
 * status 更新到目的态
 * reason 结算失败 tag+ content
 */
export function updateapply(query) {
  return request({
    url: '/pc/updateapply',
    method: 'get',
    params: query
  })
}
/* 导出收益记录
 * ids 收益记录的ids
 */
export function exportprofits(query) {
  return request({
    url: '/pc/exportprofits',
    method: 'get',
    params: query,
    // data: Qs.stringify(query, {
    //   arrayFormat: "indices",
    //   allowDots: true
    // })
    // params: Qs.stringify(query, { arrayFormat: "repeat" }),
    // params: Qs.stringify(query, { indices: false }),
    paramsSerializer: function (params) {
      return Qs.stringify(params, { indices: false })
    },
    responseType: "blob"
  })
}
// export function exportprofits(params) {
//   return request
//     .get('/pc/exportprofits', Qs.stringify(params, {
//       indices: false
//     }), {
//       responseType: "blob"
//     })
// }
