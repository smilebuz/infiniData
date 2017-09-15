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
    return new Promise((resolve, reject) => {
      Api.createFull.post(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
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
        taskId: task.taskId,
        workderId: []
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

  // 定时导入
  getIncImpList ({ commit }, params) {
    Api.incQuery.post(params).then(data => {
      commit(type.SET_INCIMP_LIST, data)
    })
  },
  editIncImpTask ({ commit }, params) {
    Api.editInc.post(params).then(data => {
      actions.getIncImpList({ commit })
    })
  },
  deleteIncImpTask ({ commit }, params) {
    Api.deleteInc.post(params).then(data => {
      actions.getIncImpList({ commit })
    })
  },
  startIncImpTask ({ commit }, params) {
    Api.startInc.post(params).then(data => {
      actions.getIncImpList({ commit })
    })
  },
  getIncImpDetail ({ commit, getters }, params) {
    Api.incDetail.post(params).then(data => {
      commit(type.SET_INCIMP_DETAIL_LIST, data)
      actions.pollingIncImpDetail({ commit, getters })
    })
  },
  pollingIncImpDetail ({ commit, getters }) {
    actions.stopIncImpDetailPolling({ commit })
    let pollingList = getters.incImpDetailPollingList
    let params = []
    pollingList.forEach((task) => {
      params.push(task.taskId) // 子任务id
    })
    polling('IncDetailProgress', params, (data) => {
      commit(type.SET_INCIMP_DETAIL_STATUS, {
        data: data
      })
      console.log('任务timer:', getters.incImpDetail.timer)
    }, getters.incImpDetail)
  },
  stopIncImpDetailPolling ({ commit }) {
    commit(type.CLEAR_INCIMP_DETAIL_TIMER)
  },

  // 数据源
  getSourceList ({ commit }, params) {
    Api.sourceQuery.post(params).then(data => {
      commit(type.SET_SOURCE_LIST, data)
    })
  },
  deleteSource ({ commit }, params) {
    Api.deleteSource.post(params).then(data => {
      actions.getSourceList({ commit })
    })
  },
  editSource ({ commit }, params) {
    return new Promise((resolve, reject) => {
      Api.editSource.post(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  testSourceConn ({ commit }, params) {
    return new Promise((resolve, reject) => {
      Api.testSource.post(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  createSource ({ commit }, params) {
    debugger
    return new Promise((resolve, reject) => {
      Api.createSource.post(params).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 通用
  getDataSource ({ commit }) {
    return new Promise((resolve, reject) => {
      Api.sourceGet.get().then(data => {
        commit(type.SET_DATA_SOURCE, data.dataSources)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getSourceTable ({ commit }, params) {
    Api.sourceTable.post(params).then(data => {
      commit(type.SET_SOURCE_TABLE, data)
    })
  },
  getFields ({ commit }, params) {}
}

export default actions
