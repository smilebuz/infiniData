import { Api } from '../../api/Api'
import type from '../mutation-type'

export default {
  login ({ commit }, params) {
    return Api.login.post(params).then(data => {
      commit(type.SET_USER, data)
      return Promise.resolve(data)
    })
  },
  logout ({ commit }) {
    commit(type.DELETE_USER)
  }
}
