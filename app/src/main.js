// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.use(Vuex)
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
