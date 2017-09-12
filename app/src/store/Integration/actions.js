import { Api, polling } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getOffImpList ({ commit, getters }, params) {
    Api.fullQuery.post(params).then(data => {
      commit(type.SET_OFFIMP_LIST, data.data)
      actions.pollingListStatus({ commit, getters })
      /*
      this.pageInfo.currentPage = data.pageNum
      this.pageInfo.totalPage = data.totalPage
      this.pageInfo.pageSize = data.pageSize
      this.pageInfo.totalCount = data.totalCount
      this.pollingListStatus()
      */
    })
  },
  pollingListStatus ({ commit, getters }) {
    actions.stopPolling({ commit, getters })
    let taskList = getters.offImpList
    if (!taskList.length) {
      return null
    }
    let list = taskList.filter((task, i, arr) => {
      return task.progress > 0 && task.progress < 100
    })
    list.forEach((task) => {
      let params = {
        taskId: task.taskId
      }
      polling(params, (data) => {
        commit(type.SET_OFFIMP_TASK_STATUS, {
          task: task,
          data: data
        })
        // console.log('任务id:', task.taskId, '任务timer:', task.timer)
      }, task)
    })
  },
  stopPolling ({ commit, getters }) {
    let pollingList = getters.offImpPollingList
    commit(type.CLEAR_OFFIMP_TIMER, pollingList)
  }
}

export default actions
