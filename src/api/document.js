import request from '@/utils/request'
import Qs from 'qs'

export function getDocumentList(data) {
  return request({
    url: '/pc/documentlist',
    method: 'get',
    params: data
  })
}



export function getDocumentDetail(data) {
    return request({
      url: '/pc/documentdetail',
      method: 'get',
      params: data
    })
  }




  export function addDocumentDetail(data) {
    let modifiedData = data || {};
    // 确保modifiedData是对象后添加operator键值对
    modifiedData.operator = "add";
    return request({
      url: '/pc/documentaddupdate',
      method: 'post',
      data: Qs.stringify(modifiedData)
    })
  }


  export function editDocumentDetail(data) {
    let modifiedData = data || {};
    modifiedData.operator = "update";
    return request({
      url: '/pc/documentaddupdate',
      method: 'post',
      data: Qs.stringify(modifiedData)
    })
  }


  export function delDocumentDetail(data) {
    return request({
      url: '/pc/documentdel',
      method: 'get',
      params: data
    })
  }


