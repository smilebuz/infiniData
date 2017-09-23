import type from '../mutation-type.js'

export default {
  [type.SET_LOG_LIST] (state, data) {
    state.log.logList = data.data
    for (let prop in state.log.pageInfo) {
      if (state.log.pageInfo.hasOwnProperty(prop)) {
        state.log.pageInfo[prop] = data[prop]
      }
    }
  },

  [type.SET_USER_LIST] (state, data) {
    state.usermanage.userList = data.data
    for (let prop in state.usermanage.pageInfo) {
      if (state.usermanage.pageInfo.hasOwnProperty(prop)) {
        state.usermanage.pageInfo[prop] = data[prop]
      }
    }
  },

  [type.SET_RESOURCE_LIST] (state, data) {
    debugger
    state.resource.resourceList = data.data
    for (let prop in state.resource.pageInfo) {
      if (state.resource.pageInfo.hasOwnProperty(prop)) {
        state.resource.pageInfo[prop] = data[prop]
      }
    }
  }
}
