import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    offimport: {
      taskList: [],
      pollingList: [],
      detailList: [],
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
