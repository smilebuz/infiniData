import type from '../mutation-type'

export default {
  [type.SET_OFFIMP_LIST] (state, data) {
    state.offimport.taskList = data
    state.offimport.pollingList = data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
  },
  [type.SET_OFFIMP_TASK_STATUS] (state, payload) {
    payload.task.progress = payload.data.progress
  },
  [type.CLEAR_OFFIMP_TIMER] (state, pollingList) {
    pollingList.forEach((task, i, arr) => {
      console.log('停止轮询', task.timer)
      clearTimeout(task.timer)
    })
  }
}
