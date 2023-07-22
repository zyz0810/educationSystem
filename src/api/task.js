import request from '@/utils/request'
import Qs from 'qs'

/* 任务列表
 * endTime
 * priority 优先级
 * startTime
 * taskName 任务名
 * taskStatus 任务状态
 */
export function taskList(data) {
  return request({
    url: 'api-crm-system/crm/customer/follow/task',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 任务详情
 * id 任务id
 */
export function taskDetail(data) {
  return request({
    url: 'api-crm-system/crm/customer/follow/task/detail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
/* 任务保存
 * businessType 业务类型 1 客户 2订单
 * claimType 查询类型,可用值:ALL,CHARGE,UNDERLING,TAKE_PART
 * deptId
 * endTime
 *  files[0].fileUrl 附件地址
 *  id
 *  ids
 * isDelete
 * params
 * participateIds 参与人id 逗号分隔
 * priority 优先级
 * relationIds 任务关联id
 * remark 描述
 * startTime
 * taskName 任务名称
 * taskStatus 任务状态 0 未开始 1 进行中 2已完成
 * taskType 任务类型 1普通 2跟进
 * userId 责任人id
 * userIds
 */
export function taskSave(data) {
  return request({
    url: 'api-crm-system/crm/customer/follow/task/save',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 任务删除
 * ids 任务id
 */
export function taskDel(data) {
  return request({
    url: 'api-crm-system/crm/customer/follow/task/delete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 确任务完成
 * ids 任务id
 */
export function taskComplete(data) {
  return request({
    url: 'api-crm-system/crm/customer/follow/task/complete',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
/* 客户列表（下拉框使用）
 */
export function usersList() {
  return request({
    url: 'api-crm-system/crm/users/getUsersByRole',
    method: 'get',
  })
}
