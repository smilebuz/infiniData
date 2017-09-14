import type from '../mutation-type'

export default {
  [type.SET_OFFIMP_LIST] (state, data) {
    state.offimport.taskList = data.data
    state.offimport.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    state.offimport.pageInfo.pageNum = data.pageNum
    state.offimport.pageInfo.totalPage = data.totalPage
    state.offimport.pageInfo.pageSize = data.pageSize
    state.offimport.pageInfo.totalCount = data.totalCount
  },
  [type.SET_OFFIMP_TASK_STATUS] (state, payload) {
    payload.task.progress = payload.data.progress
  },
  [type.CLEAR_OFFIMP_TIMER] (state) {
    let pollingList = state.offimport.pollingList
    if (pollingList) {
      pollingList.forEach((task, i, arr) => {
        console.log('停止轮询', task.timer)
        clearTimeout(task.timer)
      })
    }
  },
  [type.SET_OFFIMP_DETAIL_LIST] (state, data) {
    state.offimport.detail.detailList = data.data
    state.offimport.detail.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    state.offimport.detail.pageInfo.pageNum = data.pageNum
    state.offimport.detail.pageInfo.totalPage = data.totalPage
    state.offimport.detail.pageInfo.pageSize = data.pageSize
    state.offimport.detail.pageInfo.totalCount = data.totalCount
  },
  [type.SET_OFFIMP_DETAIL_TASK_STATUS] (state, payload) {
    payload.task.progress = payload.data.progress
  },
  [type.CLEAR_OFFIMP_DETAIL_TIMER] (state) {
    let pollingList = state.offimport.detail.pollingList
    if (pollingList) {
      pollingList.forEach((task, i, arr) => {
        console.log('停止轮询', task.timer)
        clearTimeout(task.timer)
      })
    }
  },
  [type.GET_DATA_SOURCE] (state, dataSources) {
    state.dataSources = dataSources
  }
}
