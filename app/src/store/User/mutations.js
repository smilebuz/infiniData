import type from '../mutation-type'

export default {
  [type.UPDATE_USER] (state, user) {
    state.user = user
  },
  [type.DELETE_USER] (state) {
    state.user = {}
  }
}
