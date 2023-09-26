import request from '@/utils/request'
import Qs from 'qs'

/* 上传图片
 * file
*/
export function uploadfile (file) {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: `/pc/uploadfile`,
    method: 'POST',
    data: data
  }).then(res => {
    return res ? res.data : {}
  })
}
