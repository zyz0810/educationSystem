import request from '@/utils/request'
import Qs from 'qs'

// 服务商开户
export function providerRegister(data) {
  return request({
    url: 'api-crm-system/crm/provider/register',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 服务商详情
export function providerDetail(data) {
  return request({
    url: 'api-crm-system/crm/provider/providerDetail',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 获取线上扫码支付参数
// providerId
// depositPaymentType  0
export function getDepositOnlinePay(data) {
  return request({
    url: 'api-crm-system/crm/provider/getDepositOnlinePayParameters',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 获取银行转账支付参数
 */
export function getDepositOfflinePay() {
  return request({
    url: 'api-crm-system/crm/provider/getDepositOfflinePayParameters',
    method: 'get',
  })
}

// 提交线下支付凭证
export function submitOfflinePay(data) {
  return request({
    url: 'api-crm-system/crm/provider/submitOfflinePayProof',
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

// 提交线下支付凭证
// providerId
export function submitInstalmentsPay(query) {
  return request({
    url: '/api-crm-system/crm/provider/submitInstalmentsPay',
    method: 'get',
    params: query
  })
}
