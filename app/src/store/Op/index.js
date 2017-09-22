import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

export default {
  state: {
    log: {
      logList: [],
      pageInfo: {
        pageSize: -1,
        pageNum: -1,
        totalCount: -1,
        totalSize: -1
      }
    }
  },
  actions,
  getters,
  mutations
}
