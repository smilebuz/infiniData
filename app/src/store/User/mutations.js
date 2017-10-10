import type from '../mutation-type'

export default {
  [type.SET_USER] (state, data) {
    state.user.userName = data.userName
    state.loginFlag = true
  },
  [type.LOGOUT] (state, data) {}
}
