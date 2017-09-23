import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    user: {
      userName: '',
      password: ''
    }
  },
  actions,
  getters,
  mutations
}
