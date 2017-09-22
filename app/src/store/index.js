import Vue from 'vue'
import Vuex from 'vuex'

import Integration from './Integration'
import Handle from './Handle'
import User from './User'
import Op from './Op'

import SelectTest from './SelectTest'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Integration,
    Handle,
    User,
    Op,

    SelectTest
  }
})
