import type from '../mutation-type.js'

export default {
  [type.SET_ANALYSIS_LIST] (state, data) {
    state.analysisList = data.data
    for (var prop in state.analysis.pageInfo) {
      if (state.analysis.pageInfo.hasOwnProperty(prop)) {
        state.analysis.pageInfo[prop] = data[prop]
      }
    }
  }
}