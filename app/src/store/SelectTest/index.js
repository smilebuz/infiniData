import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    testPersonList: [],
    testPageInfo: {
      pageSize: -1,
      pageNum: -1,
      totalCount: -1,
      totalPage: -1
    }
  },
  actions,
  getters,
  mutations
}
