import { Api, polling } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getOffImpList ({ commit, getters }, params) {
    actions.stopPolling({ commit, getters })
    Api.fullQuery.post(params).then(data => {
      commit(type.SET_OFFIMP_LIST, data)
      actions.pollingListStatus({ commit, getters })
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
        console.log('任务id:', task.taskId, '任务timer:', task.timer)
      }, task)
    })
  },
  stopPolling ({ commit }) {
    // let pollingList = getters.offImpPollingList
    commit(type.CLEAR_OFFIMP_TIMER)
  },
  startOffImpTask ({ commit, getters }, params) {
    Api.startFull.post(params).then(data => {
      actions.getOffImpList({ commit, getters })
    })
  },
  deleteOffImpTask ({ commit, getters }, params) {
    Api.deleteFull.post(params).then(data => {
      actions.getOffImpList({ commit, getters })
    })
  },
  restartOffImpTask ({ commit, getters }, params) {
    Api.restartFull.get(params).then(data => {
      actions.getOffImpList({ commit, getters })
    })
  },
  stopOffImpTask ({ commit, getters }, params) {
    Api.stopFull.get(params).then(data => {
      actions.getOffImpList({ commit, getters })
    })
  },
  getOffImpDetail ({ commit, getters }, params) {
    Api.fullDetail.post(params).then(data => {
      commit(type.SET_OFFIMP_DETAIL_LIST, data)
    })
  },
  editOffImpTask ({ commit, getters }, params) {
    Api.editFull.post(params).then(data => {
      actions.getOffImpDetail({ commit, getters })
    })
  }
}

export default actions
