import request from '@/utils/request'
import Qs from 'qs'

/* 公告列表
 * pn
 * rn
*/
export function noticelist(query) {
  return request({
    url: 'pc/noticelist',
    method: 'get',
    params: query
  })
}
/* 发布公告
 * notice_type 公告类型
 * imgs 图片数组
 * notice_content 公告内容
 * cover banner封面图片
 * cmd 链接cmd跳转
*/
export function publishnotice(query) {
  return request({
    url: 'pc/publishnotice',
    method: 'get',
    params: query
  })
}
/* 编辑公告
 * id
 * notice_type 公告类型
 * imgs 图片数组
 * notice_content 公告内容
 * cover banner封面图片
 * cmd 链接cmd跳转
*/
export function editnotice(query) {
  return request({
    url: 'pc/editnotice',
    method: 'get',
    params: query
  })
}
/* 删除公告
 * id
*/
export function removenotice(query) {
  return request({
    url: 'pc/removenotice',
    method: 'get',
    params: query
  })
}
