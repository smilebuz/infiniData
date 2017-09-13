import type from '../mutation-type'

export default {
  updateUser ({ commit }) {
    // Api.login
    let user = {
      name: 'admin',
      position: 'UI设计师'
    }
    commit(type.UPDATE_USER, user)
  },
  logout ({ commit }) {
    commit(type.DELETE_USER)
  }
}
