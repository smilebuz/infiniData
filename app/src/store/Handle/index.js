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
    runSqlInfo: {
      time_consum: '',
      count: '',
      columns: [],
      infoList: [],
      log: '',
      port: ''
    }
  },
  actions,
  getters,
  mutations
}
