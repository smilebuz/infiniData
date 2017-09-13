import Vue from 'vue'
import Vuex from 'vuex'

import Integration from './Integration'
import User from './User'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Integration,
    User
  }
})
