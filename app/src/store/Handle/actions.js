import { Api } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getDBList ({ commit }, params) {
    debugger
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
    debugger
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
    debugger
    Api.handletbInfo.get(params).then(data => {
      commit(type.HANDLE_SET_TB_INFO, data)
    })
  }
}

export default actions
