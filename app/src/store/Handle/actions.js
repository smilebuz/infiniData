import { Api } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getDBList ({ commit }, params) {
    return new Promise((resolve, reject) => {
      Api.handledbList.get(params).then(data => {
        commit(type.HANDLE_SET_DB_LIST, data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTBList ({ commit }, params) {
    return new Promise((resolve, reject) => {
      Api.handletbList.get(params).then(data => {
        commit(type.HANDLE_SET_TB_LIST, data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTBInfo ({ commit }, params) {
    Api.handletbInfo.get(params).then(data => {
      commit(type.HANDLE_SET_TB_INFO, data)
    })
  },
  runSql ({ commit }, params) {
    return new Promise((resolve, reject) => {
      Api.handlerunSql.post(params).then(data => {
        commit(type.HANDLE_RUN_SQL, data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default actions
