import request from '@/utils/request'
import Qs from 'qs' 

// 考勤统计每月(所有人)
export function attendanceStatisticsAll(data) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceStatisticsAll',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 考勤统计(个人当月)
export function attendanceStatistics (data) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceStatistics',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
 

// 考勤月历-WEB
export function attendanceCalendar (data) {
  return request({
    url: '/api-crm-system//crm/attendance/attendanceCalendar',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}