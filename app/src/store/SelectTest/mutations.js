import type from '../mutation-type'

export default {
  [type.SELECT_TEST] (state, data) {
    state.testPersonList = data.data
    for (let person of state.testPersonList) {
      person._checked = false
    }
    for (var prop in state.testPageInfo) {
      if (state.testPageInfo.hasOwnProperty(prop)) {
        state.testPageInfo[prop] = data[prop]
      }
    }
  }
}
