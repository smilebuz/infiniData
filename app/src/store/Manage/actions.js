import type from '../mutation-type.js'
import { Api } from '../../api/Api'

const actions = {
  getAnalysisList ({ commit }, params) {
    return Api.manageAnalysis.get(params).then(data => {
      commit(type.SET_ANALYSIS_LIST, data)
      return Promise.resolve(data)
    })
  }
}

export default actions