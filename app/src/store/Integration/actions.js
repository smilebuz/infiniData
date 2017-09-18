import { Api, polling } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getOffImpList ({ commit, getters }, params) {
    actions.stopOffImpPolling({ commit, getters })
    Api.fullQuery.post(params).then(data => {
      commit(type.SET_OFFIMP_LIST, data)
      actions.pollingOffImp({ commit, getters })
    })
  },
  pollingOffImp ({ commit, getters }) {
    // actions.stopPolling({ commit, getters })
    let pollinglist = getters.offImpPollingList
    /*
    let taskList = getters.offImpList
    if (!taskList.length) {
      return null
    }
    let list = taskList.filter((task, i, arr) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    /*
    let taskIds = []
    for (let task of pollinglist) {
      taskIds.push(task.taskId)
    }
    polling('getFullProgress', {taskId: taskIds}, (data) => {
      commit(type.SET_OFFIMP_TASK_STATUS, {
        data: data
      })
      console.log('任务timer:', getters.offimport.timer)
    }, getters.offimport)
    */
    pollinglist.forEach((task) => {
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
  stopOffImpPolling ({ commit }) {
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
  createOffImpTask ({ commit }, params) {
    return Api.createFull.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  getOffImpDetail ({ commit, getters }, params) {
    actions.stopOffImpDetailPolling({ commit, getters })
    Api.fullDetail.post(params).then(data => {
      commit(type.SET_OFFIMP_DETAIL_LIST, data)
      actions.pollingOffImpDetail({ commit, getters }, data.taskId)
    })
  },
  pollingOffImpDetail ({ commit, getters }, taskId) {
    actions.stopOffImpDetailPolling({ commit })
    let pollinglist = getters.offImpDetailPollingList
    let params = {
      taskId: taskId,
      workerIds: []
    }
    for (let worker of pollinglist) {
      params.workerIds.push(worker.workerId) // 子任务id
    }
    polling('getFullDetailProgress', params, (data) => {
      commit(type.SET_OFFIMP_DETAIL_TASK_STATUS, {
        data: data
      })
      console.log('任务timer:', getters.offImpDetail.timer)
    }, getters.offImpDetail)
  },
  stopOffImpDetailPolling ({ commit }) {
    commit(type.CLEAR_OFFIMP_DETAIL_TIMER)
  },

  // 定时导入
  getIncImpList ({ commit }, params) {
    Api.incQuery.post(params).then(data => {
      commit(type.SET_INCIMP_LIST, data)
    })
  },
  createIncImpTask ({ commit }, params) {
    debugger
    return Api.createInc.post(params).then(data => {
      return Promise.resolve(data)
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
  stopIncImpTask ({ commit }, params) {
    Api.stopInc.get(params).then(data => {
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
    let workerIds = []
    pollingList.forEach((worker) => {
      workerIds.push(worker.workerId) // 子任务id
    })
    polling('IncDetailProgress', workerIds, (data) => {
      commit(type.SET_INCIMP_DETAIL_STATUS, {
        data: data
      })
      console.log('任务timer:', getters.incImpDetail.timer)
    }, getters.incImpDetail)
  },
  stopIncImpDetailPolling ({ commit }) {
    commit(type.CLEAR_INCIMP_DETAIL_TIMER)
  },

  // 离线导出
  getOffExpList ({ commit }, params) {
    Api.exportQuery.post(params).then(data => {
      commit(type.SET_OFFEXP_LIST, data)
    })
  },
  createOffExpTask ({ commit }, params) {
    return Api.createExport.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  deleteOffExpTask ({ commit }, params) {
    Api.deleteExport.post(params).then(data => {
      actions.getOffExpList({ commit })
    })
  },
  startOffExpTask ({ commit }, params) {
    Api.startExport.post(params).then(data => {
      actions.getOffExpList({ commit })
    })
  },
  stopOffExpTask ({ commit }, params) {
    Api.stopExport.get(params).then(data => {
      actions.getOffExpList({ commit })
    })
  },
  editOffExpTask ({ commit }, params) {
    Api.editExport.post(params).then(data => {
      actions.getOffExpList({ commit })
    })
  },
  getOffExpDetailList ({ commit, getters }, params) {
    Api.exportDetail.post(params).then(data => {
      commit(type.SET_OFFEXP_DETAIL_LIST, params)
      actions.pollingOffExpDetail({ commit, getters })
    })
  },
  pollingOffExpDetail ({ commit, getters }, params) {
    actions.stopOffExpDetailPolling({ commit, getters })
    let pollingList = getters.offExpDetailPollingList
    let workerIds = []
    for (let worker of pollingList) {
      workerIds.push(worker.workerId)
    }
    polling('getOffExpDetailProgress', workerIds, (data) => {
      commit(type.SET_OFFEXP_DETAIL_STATUS, {
        data: data
      })
      console.log('任务timer:', getters.incImpDetail.timer)
    }, getters.offExpDetail)
  },
  stopOffExpDetailPolling ({ commit }) {
    commit(type.CLEAR_OffEXP_DETAIL_TIMER)
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
    return Api.editSource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  testSourceConn ({ commit }, params) {
    return Api.testSource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  createSource ({ commit }, params) {
    return Api.createSource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },

  // 通用
  getDataSource ({ commit }) {
    return Api.sourceGet.get().then(data => {
      commit(type.SET_DATA_SOURCE, data.dataSources)
      return Promise.resolve(data)
    })
  },
  getSourceTable ({ commit }, params) {
    return Api.sourceTable.post(params).then(data => {
      commit(type.SET_SOURCE_TABLE, data)
      return Promise.resolve(data)
    })
  },
  getFields ({ commit }, params) {}
}

export default actions
