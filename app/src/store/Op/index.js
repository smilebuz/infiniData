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
        totalPage: -1
      }
    },
    usermanage: {
      userList: [],
      pageInfo: {
        pageSize: -1,
        pageNum: -1,
        totalCount: -1,
        totalPage: -1
      }
    },
    resource: {
      resourceList: [],
      pageInfo: {
        pageSize: -1,
        pageNum: -1,
        totalCount: -1,
        totalPage: -1
      }
    }
  },
  actions,
  getters,
  mutations
}
