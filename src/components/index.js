import Pagination from './Pagination'
import MyDialog from './MyDialog'
import MiddleDialog from './MiddleDialog'
// import BrokenLine from './BrokenLine'
// import Histogram from './Histogram'
// import SureTips from './SureTips'
// import Upload from './Upload'
// import UploadOnly from './UploadOnly'
// import Map from './Map'
// import ColumnChart from './ColumnChart'
import EmptyTable from './EmptyTable'
import TopViewTwo from './TopViewTwo'

const commomComponents = {
  install: function (Vue) {
    Vue.component('pagination', Pagination)
    Vue.component('myDialog', MyDialog)
    Vue.component('MiddleDialog', MiddleDialog)
    // Vue.component('brokenline', BrokenLine)
    // Vue.component('histogram', Histogram)
    // Vue.component('sureTips', SureTips)
    // Vue.component('upload', Upload)
    // Vue.component('UploadOnly', UploadOnly)
    // Vue.component('Map', Map)
    // Vue.component('ColumnChart', ColumnChart)
    Vue.component('EmptyTable', EmptyTable)
    Vue.component('TopViewTwo', TopViewTwo)
  }
}
// 导出
export default commomComponents
