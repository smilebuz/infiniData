import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

import Intergration from './Integration'
import User from './User'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'yangshuo'
  },
  actions,
  mutations,
  modules: {
    Intergration,
    User
  }
})
