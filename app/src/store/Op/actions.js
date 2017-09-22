import { Api } from '../../api/Api'
import type from '../mutation-type.js'

const actions = {
  getLogList ({ commit }, params) {
    return Api.logQuery.post(params).then(data => {
      commit(type.SET_LOG_LIST, data)
      return Promise.resolve(data)
    })
  }
}

export default actions
