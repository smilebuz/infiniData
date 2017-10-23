import type from '../mutation-type.js'

export default {
  [type.SET_ANALYSIS_LIST] (state, data) {
    state.analysis.analysisList = data
    /*
    for (var prop in state.analysis.pageInfo) {
      if (state.analysis.pageInfo.hasOwnProperty(prop)) {
        state.analysis.pageInfo[prop] = data[prop]
      }
    }
    */
  },
  [type.SET_ANALYSIS_RESULT] (state, data) {
    state.analysisResult.filedInfo = data.data.fieldInfo
    state.analysisResult.partitionList = data.data.partitionList
    state.analysisResult.statistis = data.data.statistics
    state.analysisResult.createSql = data.data.createSql
  }
}
