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
    // actions.stopPolling({ commit, getters })
    let list = getters.offImpPollingList
    /*
    let taskList = getters.offImpList
    if (!taskList.length) {
      return null
    }
    let list = taskList.filter((task, i, arr) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    list.forEach((task) => {
      let params = {
        taskId: task.taskId
      }
      polling('getFullProgress', params, (data) => {
        commit(type.SET_OFFIMP_TASK_STATUS, {
          task: task,
          data: data
        })
        console.log('任务id:', task.taskId, '任务timer:', task.timer)
      }, task)
    })
  },
  stopPolling ({ commit }) {
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
  editOffImpTask ({ commit, getters }, params) {
    Api.editFull.post(params).then(data => {
      actions.getOffImpDetail({ commit, getters })
    })
  },
  createOffImpTask (params) {
    Api.createFull.post(params).then(data => {
    })
  },
  getOffImpDetail ({ commit, getters }, params) {
    actions.stopImpDetailPolling({ commit, getters })
    Api.fullDetail.post(params).then(data => {
      commit(type.SET_OFFIMP_DETAIL_LIST, data)
      actions.pollingDetailListStatus({ commit, getters })
    })
  },
  pollingDetailListStatus ({ commit, getters }) {
    actions.stopImpDetailPolling({ commit })
    let list = getters.offImpDetailPollingList
    list.forEach((task) => {
      let params = {
        taskId: task.taskId
      }
      polling('getFullDetailProgress', params, (data) => {
        commit(type.SET_OFFIMP_DETAIL_TASK_STATUS, {
          task: task,
          data: data
        })
        console.log('任务id:', task.taskId, '任务timer:', task.timer)
      }, task)
    })
  },
  stopImpDetailPolling ({ commit }) {
    commit(type.CLEAR_OFFIMP_DETAIL_TIMER)
  },
  getDataSource ({ commit }) {
    Api.sourceGet.get().then(data => {
      commit(type.GET_DATA_SOURCE, data.dataSources)
    })
  }
}

export default actions
