import request from '@/utils/request'
import Qs from 'qs'


/* 查询参数列表
 * dictType 字典类型
 */
export function listConfig(data) {
    return request({
        url: 'api-crm-system/crm/dict',
        method: 'POST',
        data: Qs.stringify(data)
    })
}


/* 保存字典数据
 * dictCode 字典编码
 * dictLabel 字典标签
 * dictSort 字典排序
 * status 状态（0正常 1停用）
 */
export function addConfig(data) {
    return request({
        url: 'api-crm-system/crm/dict/save',
        method: 'post',
        data: Qs.stringify(data)
    })
}


/* 保存字典数据
 * code
 * value
 */
export function saveBatch(data) {
    return request({
        url: 'api-crm-system/crm/dict/save/batch',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 考勤时间地点设置回显
export function searchAttendanceSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/searchAttendanceSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 考勤时间地点设置(新建/修改)
export function saveAttendanceSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/saveAttendanceSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 工作日设置(数据回显)
export function searchWorkDaysSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/searchWorkDaysSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 工作日设置
export function saveWorkDaysSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/saveWorkDaysSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 自定义工作时间列表
export function serchWordDatyDefined(data) {
    return request({
        url: '/api-crm-system/crm/attendance/serchWordDatyDefined',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 自定义工作时间设置新增
export function definedSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/definedSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 自定义工作时间编辑
export function updateDefinedSetting(data) {
    return request({
        url: '/api-crm-system/crm/attendance/updateDefinedSetting',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 自定义工作日删除(可批量删除)
export function deleteWordDatyDefined(data) {
    return request({
        url: '/api-crm-system/crm/attendance/deleteWordDatyDefined',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}


// 查询字段数据
export function fieldQuery(data) {
    return request({
        url: '/api-crm-system/crm/dict/fieldQuery',
        method: 'post',
        data: Qs.stringify(data, { arrayFormat: 'indices', allowDots: true })
    })
}

// 保存或修改字段数据
export function fieldSave(data) {
  return request({
    url: '/api-crm-system/crm/dict/fieldSave',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 删除启用是否必填
export function saveOrUpdateFieldDataValue(data) {
  return request({
    url: '/api-crm-system/crm/dict/saveOrUpdateFieldDataValue',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 查询字段值
export function getFieldDictValue(query) {
  return request({
    url: '/api-crm-system/crm/dict/getFieldDictValue',
    method: 'get',
    params: query 
  })
}


// 获取拜访设置
export function getVisitTaskSetting(query) {
  return request({
    url: '/api-crm-system/crm/visittasksetting/getVisitTaskSetting',
    method: 'get',
    params: query 
  })
}


// 新增or编辑拜访任务
export function visitTaskSetting(data) {
  return request({
    url: '/api-crm-system/crm/visittasksetting/saveOrUpdateVisitTaskSetting',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 考勤组列表
export function attendanceSectionSectionList(query) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceSection/sectionList',
    method: 'get',
    params: query 
  })
}

// 考勤组保存
export function attendanceSectionSave(data) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceSection/save',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 

// 考勤组根据id查询
export function findById(query) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceSection/findById',
    method: 'get',
    params: query
  })
} 

// 考勤组根据id删除
export function deleteById(data) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceSection/deleteById',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 


// 考勤组选中部门员工
export function selectSection(data) {
  return request({
    url: '/api-crm-system/crm/attendance/attendanceSection/selectSection',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
} 


// 部门人员树 
export function findDeptTreeWithUsers() {
  return request({
    url: '/api-crm-system/crm/dept/findDeptTreeWithUsers',
    method: 'get'
  })
}



// 保存轨迹每隔一个时间段上传一次
export function saveOrUpdateSetting(data) {
  return request({
    url: '/api-crm-system/crm/attendanceSetting/saveOrUpdateSetting',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}


// 查询保存轨迹每隔一个时间段上传一次
export function getSetting() {
  return request({
    url: '/api-crm-system/crm/attendanceSetting/getSetting',
    method: 'get'
  })
} 
