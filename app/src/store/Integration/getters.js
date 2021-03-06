export default {
  // 仪表盘
  dashboardOverview (state) {
    return state.dashboard.overview
  },
  dashboardTaskList (state) {
    return state.dashboard.taskList
  },
  dashboardPageInfo (state) {
    return state.dashboard.pageInfo
  },

  // 离线导入
  offImpList (state) {
    return state.offimport.taskList
  },
  offImport (state) {
    return state.offimport
  },
  offImpPollingList (state) {
    return state.offimport.pollingList
  },
  offImpPageInfo (state) {
    return state.offimport.pageInfo
  },
  offImpDetail (state) {
    return state.offimport.detail
  },
  offImpDetailProgress (state) {
    return state.offimport.detail.progress
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

  // 定时导入
  incImpList (state) {
    return state.incimport.taskList
  },
  incImport (state) {
    return state.incimport
  },
  incImpPollingList (state) {
    return state.incimport.pollingList
  },
  incImpPageInfo (state) {
    return state.incimport.pageInfo
  },
  incImpDetail (state) {
    return state.incimport.detail
  },
  incImpDetailProgress (state) {
    return state.incimport.detail.progress
  },
  incImpDetailList (state) {
    return state.incimport.detail.detailList
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

  // 离线导出
  offExpList (state) {
    return state.offexport.taskList
  },
  offExport (state) {
    return state.offexport
  },
  offExpPollingList (state) {
    return state.offexport.pollingList
  },
  offExpPageInfo (state) {
    return state.offexport.pageInfo
  },
  offExpDetail (state) {
    return state.offexport.detail
  },
  offExpDetailStatus (state) {
    return state.offexport.detail.status
  },
  offExpDetailProgress (state) {
    return state.offexport.detail.progress
  },
  offExpDetailList (state) {
    return state.offexport.detail.detailList
  },
  offExpDetailPollingList (state) {
    return state.offexport.detail.pollingList
  },
  offExpDetailInfo (state) {
    return state.offexport.detail.detailInfo
  },
  offExpDetailPageInfo (state) {
    return state.offexport.detail.pageInfo
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
  },
  sourceTablePageInfo (state) {
    return state.sourceTablePageInfo
  }
}
