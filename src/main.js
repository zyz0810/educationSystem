import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import './assets/iconfont/iconfont.css'

import directive from './directive/directive'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import commonComponents from '@/components/index'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import moment from 'moment'
Vue.prototype.$moment = moment
import countTo from 'vue-count-to'
Vue.component('CountTo', countTo)
import constant from './utils/const.js'
Vue.use(constant);

import aa from '@/assets/image/table_empty.png';
// import $imgUrl from '@/assets/image/table_empty.png';
Vue.prototype.$imgUrl = aa;
// import VueAMap from 'vue-amap'
// Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: '8a4791f6010f719bcf548c8907980d2c', // 康药麦麦高德key
//   plugin: [
//     'AMap.Autocomplete',
//     'AMap.PlaceSearch',
//     'AMap.Scale',
//     'AMap.OverView',
//     'AMap.ToolBar',
//     'AMap.MapType',
//     'AMap.PolyEditor',
//     'AMap.CircleEditor',
//     'AMap.Geolocation'
//   ],
//   // 默认高德 sdk 版本为 1.4.4
//   v: '1.4.4'
// })

import axios from 'axios'
//其他vue组件中就可以this.$axios调用使用
Vue.prototype.$axios = axios

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree
} from '@/utils/ruoyi'
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'
import Sortable from 'sortablejs'
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// Vue.use(Viewer)
Vue.use(Viewer, {defaultOptions: {zIndex: 9999}});
Viewer.setDefaults({
  Options: {'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

import MyMessageBox from '@/utils/toast.js'
Vue.prototype.$MyMessageBox = MyMessageBox;

Vue.prototype.msgSuccess = function(msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: 'success'
  })
}

Vue.prototype.msgError = function(msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: 'error'
  })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}
import { Message,MessageBox  } from 'element-ui'
Vue.prototype.$confirm= (text,title,option) => {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(text, title,option).then((res) => {
      resolve(true)
    }).catch((res) => {
      Message.info('已取消')
      reject(false)
    })
  }).catch(() => {
    // 可对错误进行处理
  })
}




// 全局组件挂载
Vue.component('RightToolbar', RightToolbar)

Vue.use(VueQuillEditor)
Vue.use(directive)
Vue.use(commonComponents)
Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  // size: Cookies.get("size") || "medium" // set element-ui default size medium / small / mini
  size: 'mini'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
