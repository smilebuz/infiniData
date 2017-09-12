import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    offimport: {
      taskList: [],
      pollingList: []
    }
  },
  actions,
  getters,
  mutations
}
