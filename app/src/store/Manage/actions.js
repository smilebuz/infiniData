import type from '../mutation-type.js'
import { Api } from '../../api/Api'

const actions = {
  // setAnalysisList ({ commit }, params) {
  //   commit(type.SET_ANALYSIS_LIST, params)
  // },
  analysis ({ commit }, params) {
    return Api.manageAnalysis.post(params).then(data => {
      // commit(type.ANALYSIS, data)
      return Promise.resolve(data)
    })
  },
  getAnalysisList ({ commit }, params) {
    return Api.analysisResult.post(params).then(data => {
      commit(type.SET_ANALYSIS_RESULT, data)
      return Promise.resolve(data)
    })
  }
}

export default actions
