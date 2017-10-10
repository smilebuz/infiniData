import { Api } from '../../api/Api'
import type from '../mutation-type'

export default {
  login ({ commit }, params) {
    return Api.login.post(params).then(data => {
      if (data.response === 1) {
        commit(type.SET_USER, data)
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(data.msg))
      }
    })
  },
  logout ({ commit }, params) {
    return Api.logout.post(params).then(data => {
      commit(type.LOGOUT)
      return Promise.resolve(data)
    })
  }
}
