import request from '@/utils/request'
import Qs from 'qs'


/* 价格策略列表
 * areaPriceList[0].areaIds
 * areaPriceList[0].customerTypeId
 * areaPriceList[0].id
 * areaPriceList[0].discount 折扣
 * customerPriceList[0].customerStoreId  客户id
 * customerPriceList[0].id  id
 * customerPriceList[0].productId 商品id
 * customerPriceList[0].type 是否指定参与,0:指定不参与，1：指定参与,可用值:0,1
 * endTime 结束时间
 * page
 * limit
 * name 名称
 * productIds productId
 * startTime 	开始时间
 * status 状态： 未开始，进行中，禁用
 */
export function productPriceList(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/list`,
    method: 'post',
    // params: query
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 添加价格策略
 * brandId 品牌id
 * categoryId 分类id
 * createBeginTime 创建时间:开始时间
 * createLastTime 创建时间:结束时间
 * goodsSn 商品编码
 * mnemonicCode 助记码
 * name 商品名称
 * status 状态:1上架、0下架、2售罄、3删除
 * page
 * limit
 */
export function productPriceAdd(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/add`,
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 编辑价格策略
 * brandId 品牌id
 * categoryId 分类id
 * createBeginTime 创建时间:开始时间
 * createLastTime 创建时间:结束时间
 * goodsSn 商品编码
 * mnemonicCode 助记码
 * name 商品名称
 * status 状态:1上架、0下架、2售罄、3删除
 * page
 * limit
 */
export function productPriceUpdate(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/updateStrategy`,
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}


/* 查看
 * id
 */
export function productPriceView(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/findById`,
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 启用、禁用
 * id
 * status 禁用0，启用 1
 */
export function productPriceStatus(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/updateStatus`,
    method: 'post',
    // params: Qs.stringify(query)
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}



/* 操作日志查看
 * productId
 */
export function productPriceLog(data) {
  return request({
    url: `api-crm-system/crm/productPriceStrategy/strategyLog`,
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}

/* 价格策略 => 商品列表
 * 商品编码：goodsSn
 * 商品名称：name
 * 生产厂家: manufactureName
 * sku编码：skuCode
 */
export function priceProductList(data) {
  return request({
    url: `api-crm-system/product/service/crm/getList`,
    method: 'post',
    data: Qs.stringify(data, {
      arrayFormat: 'indices',
      allowDots: true
    })
  })
}
