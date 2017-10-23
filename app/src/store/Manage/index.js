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
    },
    analysisResult: {
      tbInfo: {
        tbName: '',
        tbNameCN: '',
        projectName: '',
        principal: '',
        des: '',
        permissionState: '',
        storage: '',
        lifeCycle: '',
        partition: '',
        createTime: '',
        DDLChangeTime: '',
        DataChangeTime: ''
      },
      fieldInfo: {
        numberList: [],
        stringList: [],
        booleanList: []
      },
      partitionList: [],
      statistics: [],
      createSql: ''
    }
  },
  actions,
  getters,
  mutations
}
