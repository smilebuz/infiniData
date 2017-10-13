import type from '../mutation-type.js'
// import { Api } from '../../api/Api'

const actions = {
  setAnalysisList ({ commit }, params) {
    commit(type.SET_ANALYSIS_LIST, params)
    // return Promise.resolve(params)
  }
}

export default actions
