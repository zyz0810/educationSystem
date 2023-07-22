import request from '@/utils/request'
import Qs from 'qs'
 
// 考勤轨迹记录查看
export function attendanceSignTraceFindByDate(data) {
  return request({
    url: '/api-crm-system/crm/attendanceEmployeeTrace/attendanceSignTraceFindByDate',
    method: 'post',
    data: Qs.stringify(data)
  })
}
