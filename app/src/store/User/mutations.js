import type from '../mutation-type'

export default {
  [type.SET_USER] (state, data) {
    state.user = data.user
  }
}
