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
  dataSources (state) {
    return state.dataSources
  },
  loglist (state) {
    return state.Op.loglist
  }
}
