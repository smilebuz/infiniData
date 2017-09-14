import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    offimport: {
      taskList: [],
      pollingList: [],
      pageInfo: {
        pageNum: -1,
        pageSize: -1,
        totalPage: -1,
        totalCount: -1
      },
      detail: {
        detailList: [],
        pollingList: [],
        pageInfo: {
          pageNum: -1,
          pageSize: -1,
          totalPage: -1,
          totalCount: -1
        }
      }
    },
    incimport: {},
    offexport: {},
    source: {},
    dataSources: []
  },
  actions,
  getters,
  mutations
}
