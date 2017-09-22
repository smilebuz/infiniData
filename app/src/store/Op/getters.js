export default {
  logList (state) {
    return state.log.list
  },
  logPageInfo (state) {
    return state.log.pageInfo
  },

  userList (state) {
    return state.usermanage.userList
  },
  userPageInfo (state) {
    return state.usermanage.pageInfo
  },

  resourceList (state) {
    return state.resource.resourceList
  },
  resourcePageInfo (state) {
    return state.resource.pageInfo
  }
}
