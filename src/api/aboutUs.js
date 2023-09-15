import request from '@/utils/request'
import Qs from 'qs'

/* 获取关于我们
 * pn
 * rn
*/
export function getaboutus(query) {
  return request({
    url: '/pc/getaboutus',
    method: 'get',
    params: query
  })
}
/* 设置关于我们
 * logo
 * content
*/
export function setaboutus(query) {
  return request({
    url: '/pc/setaboutus',
    method: 'get',
    params: query
  })
}
/* 获取协议
*/
export function getprotocol(query) {
  return request({
    url: '/pc/getprotocol',
    method: 'get',
    params: query
  })
}
/* 设置协议
 * title 协议标题
 * content 协议内容
*/
export function setprotocol(query) {
  return request({
    url: '/pc/setprotocol',
    method: 'get',
    params: query
  })
}
