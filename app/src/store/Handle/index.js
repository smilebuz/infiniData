import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    dbList: [],
    tbList: [],
    tbInfo: {
      fieldList: [],
      partitionList: []
    }
  },
  actions,
  getters,
  mutations
}
