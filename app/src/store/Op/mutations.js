import type from '../mutation-type.js'

export default {
  [type.SET_LOG_LIST] (state, data) {
    state.log.logList = data.data
    for (let prop in state.log.pageInfo) {
      if (state.log.hasOwnProperty(prop)) {
        state.log.pageInfo[prop] = data[prop]
      }
    }
  }
}
