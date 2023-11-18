import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Message, Confirm } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let requestUrl ='https://xcx.xgzjj365.com/'  //测试环境
// let requestUrl ='http://23.60.185.194:9200/'  //UAT环境
// let requestUrl ='http://123.60.145.79:9200/'  //dev环境

switch (process.env.VUE_APP_MODE) {
 case 'development':
  requestUrl ='https://xcx.xgzjj365.com/' //dev环境
  break;
 case 'production':
 requestUrl ='https://xcx.xgzjj365.com/'
 break;
 case 'staging':
 requestUrl ='https://xcx.xgzjj365.com/'
 break;
 case 'test':
 requestUrl ='https://xcx.xgzjj365.com/'
 break;

 default:
   requestUrl ='https://xcx.xgzjj365.com/'  //测试环境
  // requestUrl ='http://23.60.185.194:9200/'   //UAT环境
  // requestUrl ='http://123.60.145.79:9200/' //dev环境
  break;
}
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, //本地环境启动
  // withCredentials: false, // send cookies when cross-domain requests
  // timeout: 10000 // request timeout
  // withCredentials: true // 允许携带cookie
})
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.withCredentials=true;
// axios.defaults.headers[withCredentials]=true;
// request interceptor
service.interceptors.request.use(
  config => {
    config.baseURL = requestUrl  //发布测试、线上环境

    // config.headers['client_id'] = 'crmWebApp'
    // config.headers['client_secret'] = 'crmWebApp'
    // config.withCredentials = true;
    // if (store.getters.crm_token) {
    //   // config.headers.Cookie = 'pc_login_token=' + store.getters.crm_token
    //   // config.params['pc_login_token'] = 'pc_login_token=' + store.getters.crm_token
    // }
    return config
  },

  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.errno === 0 || !res.errno) {
      return res
    }
    if (res.errno === 3007) {
      // to re-login
      // MessageBox.confirm('您已注销，您可以取消以停留在此页，或重新登录', '确认注销', {
      //   confirmButtonText: '重新登录',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
      // })
    } else if (res.errno === 2) {
      Message({
        message: '登录密码错误',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (res.errno === 3) {
      Message({
        message: '您没此权限',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (res.errno === 4) {
      Message({
        message: '该数据不存在',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (res.errno === 5) {
      Message({
        message: '该数据已存在',
        type: 'error',
        duration: 3 * 1000
      })
    } else if (res.errno === 6) {
      // MessageBox.confirm('该数据有关联数据，不能删除', '提示', {
      //   confirmButtonText: '确定',
      //   showCancelButton:false,
      //   type: 'warning'
      // });
      Message({
        message: '该数据有关联数据，不能删除',
        type: 'error',
        duration: 3 * 1000
      })
      return res
    } else if (res.errno === 1002) {
      Message({
        message: '该用户没有此权限',
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      Message({
        message: res.errmsg || '获取数据失败',
        type: 'error',
        duration: 3 * 1000
      })
    }
  },
  error => {
    Message({
      message: error.response.data.errmsg,
      type: 'warning',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
