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
    },
    logs: [],
    runSqlInfo: {
      time_consum: '',
      count: ''
    }
  },
  actions,
  getters,
  mutations
}