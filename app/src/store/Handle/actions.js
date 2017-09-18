import { Api } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getDBList ({ commit }, params) {
    return Api.handledbList.get(params).then(data => {
      commit(type.HANDLE_SET_DB_LIST, data)
      return Promise.resolve(data)
    })
  },
  getTBList ({ commit }, params) {
    return Api.handletbList.get(params).then(data => {
      commit(type.HANDLE_SET_TB_LIST, data)
      return Promise.resolve(data)
    })
  },
  getTBInfo ({ commit }, params) {
    Api.handletbInfo.get(params).then(data => {
      commit(type.HANDLE_SET_TB_INFO, data)
    })
  },
  runSql ({ commit }, params) {
    return Api.handlerunSql.post(params).then(data => {
      commit(type.HANDLE_RUN_SQL, data)
      return Promise.resolve(data)
    })
  }
}

export default actions
