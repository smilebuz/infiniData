import {type} from '../mutation-type'

export default {
  [type.SET_OFFLINE_LIST] (state, data) {
    state.offline.list = data
  },

  [type.SET_TASK_STATUS] (state, data) {

  }
}
