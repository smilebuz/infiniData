import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    dashboard: {
      overview: {},
      taskList: [],
      pageInfo: {
        pageNum: -1,
        pageSize: -1,
        totalPage: -1,
        totalCount: -1
      }
    },
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
        progress: 0,
        pageInfo: {
          pageNum: -1,
          pageSize: -1,
          totalPage: -1,
          totalCount: -1
        }
      },
      createTask: {
        pageInfo: {
          pageNum: -1,
          pageSize: -1,
          totalPage: -1,
          totalCount: -1
        }
      }
    },
    incimport: {
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
        progress: 0,
        detailInfo: {
          dbName: '',
          tbName: '',
          taskId: ''
        },
        pageInfo: {
          pageNum: -1,
          pageSize: -1,
          totalPage: -1,
          totalCount: -1
        }
      }
    },
    offexport: {
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
        progress: 0,
        status: 0,
        detailInfo: {
          dbName: '',
          tbName: '',
          taskId: ''
        },
        pageInfo: {
          pageNum: -1,
          pageSize: -1,
          totalPage: -1,
          totalCount: -1
        }
      }
    },
    // 数据源
    source: {
      sourceList: [],
      pageInfo: {
        pageNum: -1,
        pageSize: -1,
        totalPage: -1,
        totalCount: -1
      }
    },
    // 通用
    dataSources: [],
    sourceTables: [],
    sourceTablePageInfo: {
      pageNum: -1,
      pageSize: -1,
      totalPage: -1,
      totalCount: -1
    }
  },
  actions,
  getters,
  mutations
}
