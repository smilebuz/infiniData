export default {
  // 离线导入
  offImpList (state) {
    return state.offimport.taskList
  },
  offImpPollingList (state) {
    return state.offimport.pollingList
  }
}
