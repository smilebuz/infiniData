import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

export default {
  state: {
    analysis: {
      analysisList: [],
      pageInfo: {
        pageNum: -1,
        pageSize: -1,
        totalPage: -1,
        totalCount: -1
      }
    }
  },
  actions,
  getters,
  mutations
}
