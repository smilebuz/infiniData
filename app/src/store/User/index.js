import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    user: {
      userName: ''
    },
    loginFlag: false
  },
  actions,
  getters,
  mutations
}
