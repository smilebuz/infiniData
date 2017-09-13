import type from '../mutation-type'

export default {
  updateUser ({ commit }) {
    // Api.login
    let user = 'admin'
    commit(type.UPDATE_USER, user)
  }
}
