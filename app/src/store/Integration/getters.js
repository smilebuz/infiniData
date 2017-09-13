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
    return state.offimport.detailList
  }
}
