import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/common.css'

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import { parseTime, resetForm, addDateRange, selectDictLabel, handleTree } from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // global filters

import { getBracketStr } from '@/utils/auth'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// 禁用mock
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.use(permission)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 全局方法挂载
// Vue.prototype.getDicts = getDicts
// Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
// Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$getBracketStr = getBracketStr

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.$isNull = function(value) {
  if (value === '' || value === null || value === undefined || value.length === 0) {
    return true
  } else {
    return false
  }
}
