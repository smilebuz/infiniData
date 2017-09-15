export default {
  // 离线导入
  offImpList (state) {
    return state.offimport.taskList
  },
  offImpPollingList (state) {
    return state.offimport.pollingList
  },
  offImpPageInfo (state) {
    return state.offimport.pageInfo
  },
  offImpDetailList (state) {
    return state.offimport.detail.detailList
  },
  offImpDetailPollingList (state) {
    return state.offimport.detail.pollingList
  },
  offImpDetailPageInfo (state) {
    return state.offimport.detail.pageInfo
  },
  createOffImpPageInfo (state) {
    return state.offimport.createTask.pageInfo
  },

  // 定时导入
  incImpList (state) {
    return state.incimport.taskList
  },
  incImpPageInfo (state) {
    return state.incimport.pageInfo
  },
  incImpDetail (state) {
    return state.incimport.detail
  },
  incImpDetailList (state) {
    return state.incimport.detail.taskList
  },
  incImpDetailPollingList (state) {
    return state.incimport.detail.pollingList
  },
  incImpDetailInfo (state) {
    return state.incimport.detail.detailInfo
  },
  incImpDetailPageInfo (state) {
    return state.incimport.detail.pageInfo
  },

  // 数据源
  sourceList (state) {
    return state.source.sourceList
  },
  sourcePageInfo (state) {
    return state.source.pageInfo
  },

  // 通用
  dataSources (state) {
    return state.dataSources
  },
  sourceTables (state) {
    return state.sourceTables
  }
}
