import Pagination from './Pagination'
import MyDialog from './MyDialog'
import BrokenLine from './BrokenLine'
import Histogram from './Histogram'
import SureTips from './SureTips'
import Upload from './Upload'
import UploadOnly from './UploadOnly'
import Department from './Department'
import AddFollow from './AddFollow'
import Map from './Map'
import OrdersDetail from './OrdersDetail'
import ColumnChart from './ColumnChart'
import EmptyTable from './EmptyTable'

const commomComponents = {
  install: function (Vue) {
    Vue.component('pagination', Pagination)
    Vue.component('myDialog', MyDialog)
    Vue.component('brokenline', BrokenLine)
    Vue.component('histogram', Histogram)
    Vue.component('sureTips', SureTips)
    // Vue.component('upload', Upload)
    Vue.component('UploadOnly', UploadOnly)
    Vue.component('department', Department)
    Vue.component('addFollow', AddFollow)
    Vue.component('Map', Map)
    Vue.component('OrdersDetail', OrdersDetail)
    Vue.component('ColumnChart', ColumnChart)
    Vue.component('EmptyTable', EmptyTable)
  }
}
// 导出
export default commomComponents
