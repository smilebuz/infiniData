import { Api, polling } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  // 仪表盘
  getDashboardTaskList ({ commit, getters }, params) {
    actions.stopDashboardPolling({ commit })
    return Api.dashboardQuery.post(params).then(data => {
      commit(type.SET_DASHBOARD_INFO, data)
      // 轮询
      return Promise.resolve(data)
    })
  },
  pollingDashboard ({ commit, getters }, params) {
  },
  stopDashboardPolling ({ commit }) {

  },

  // 离线导入
  getOffImpList ({ commit, getters }, params) {
    actions.stopOffImpPolling({ commit })
    return Api.fullQuery.post(params).then(data => {
      commit(type.SET_OFFIMP_LIST, data)
      actions.pollingOffImp({ commit, getters })
      return Promise.resolve(data)
    })
  },
  pollingOffImp ({ commit, getters }) {
    // actions.stopPolling({ commit, getters })
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
    for (let task of pollinglist) {
      taskIds.push(task.taskId)
    }
    */
    let pollinglist = getters.offImpPollingList
    let taskIds = [...pollinglist]
    polling('getFullProgress', {taskIds: taskIds}, (data) => {
      commit(type.SET_OFFIMP_TASK_STATUS, {
        data: data.data
      })
      console.log('任务timer:', getters.offImport.timer)
    }, getters.offImport)
  },
  stopOffImpPolling ({ commit }) {
    commit(type.CLEAR_OFFIMP_TIMER)
  },
  startOffImpTask ({ commit, getters }, params) {
    return Api.startFull.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  deleteOffImpTask ({ commit, getters }, params) {
    return Api.deleteFull.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  restartOffImpTask ({ commit, getters }, params) {
    return Api.restartFull.get(params).then(data => {
      return Promise.resolve(data)
    })
  },
  stopOffImpTask ({ commit, getters }, params) {
    return Api.stopFull.get(params).then(data => {
      /*
      actions.stopOffImpPolling({ commit })
      commit(type.STOP_OFFIMP_TASK, params)
      actions.pollingOffImp({ commit, getters })
      */
      return Promise.resolve(data)
    })
  },
  editOffImpTask ({ commit, getters }, params) {
    return Api.editFull.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  createOffImpTask ({ commit }, params) {
    return Api.createFull.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  getOffImpDetail ({ commit, getters }, params) {
    actions.stopOffImpDetailPolling({ commit })
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
    // debugger
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
  getIncImpList ({ commit, getters }, params) {
    actions.stopIncImpPolling({ commit })
    return Api.incQuery.post(params).then(data => {
      commit(type.SET_INCIMP_LIST, data)
      actions.pollingIncImp({ commit, getters })
      return Promise.resolve(data)
    })
  },
  pollingIncImp ({ commit, getters }) {
    let pollinglist = getters.incImpPollingList
    let taskIds = [...pollinglist]
    polling('getIncStatus', {taskIds: taskIds}, (data) => {
      console.log(taskIds)
      commit(type.SET_INCIMP_TASK_STATUS, {
        data: data.data
      })
      console.log('任务timer:', getters.incImport.timer)
    }, getters.incImport)
  },
  stopIncImpPolling ({ commit }) {
    commit(type.CLEAR_INCIMP_TIMER)
  },
  createIncImpTask ({ commit }, params) {
    return Api.createInc.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  editIncImpTask ({ commit }, params) {
    return Api.editInc.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  deleteIncImpTask ({ commit }, params) {
    return Api.deleteInc.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  startIncImpTask ({ commit }, params) {
    return Api.startInc.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  stopIncImpTask ({ commit }, params) {
    return Api.stopInc.get(params).then(data => {
      return Promise.resolve(data)
    })
  },
  getIncImpDetail ({ commit, getters }, params) {
    Api.incDetail.post(params).then(data => {
      commit(type.SET_INCIMP_DETAIL_LIST, data)
      actions.pollingIncImpDetail({ commit, getters }, data.taskId)
    })
  },
  pollingIncImpDetail ({ commit, getters }, taskId) {
    actions.stopIncImpDetailPolling({ commit })
    let pollingList = getters.incImpDetailPollingList
    let workerIds = []
    pollingList.forEach((worker) => {
      workerIds.push(worker.workerId) // 子任务id
    })
    let params = {
      taskId: taskId,
      workerIds: workerIds
    }
    polling('getIncDetailProgress', params, (data) => {
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
  getOffExpList ({ commit, getters }, params) {
    return Api.exportQuery.post(params).then(data => {
      commit(type.SET_OFFEXP_LIST, data)
      actions.pollingOffExp({ commit, getters })
      return Promise.resolve(data)
    })
  },
  pollingOffExp ({ commit, getters }) {
    let pollinglist = getters.offExpPollingList
    let taskIds = [...pollinglist]
    // debugger
    polling('getExpStatus', {taskIds: taskIds}, (data) => {
      console.log(taskIds)
      commit(type.SET_OFFEXP_TASK_STATUS, {
        data: data.data
      })
      console.log('任务timer:', getters.offExport.timer)
    }, getters.offExport)
  },
  stopOffExpPolling ({ commit }) {
    commit(type.CLEAR_OFFEXP_TIMER)
  },
  createOffExpTask ({ commit }, params) {
    return Api.createExport.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  deleteOffExpTask ({ commit }, params) {
    return Api.deleteExport.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  startOffExpTask ({ commit }, params) {
    return Api.startExport.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  stopOffExpTask ({ commit }, params) {
    return Api.stopExport.get(params).then(data => {
      return Promise.resolve(data)
    })
  },
  editOffExpTask ({ commit }, params) {
    return Api.editExport.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  getOffExpDetailList ({ commit, getters }, params) {
    Api.exportDetail.post(params.params).then(data => {
      commit(type.SET_OFFEXP_DETAIL_LIST, data)
      actions.pollingOffExpDetail({ commit, getters }, data.taskId, params.exportType)
    })
  },
  pollingOffExpDetail ({ commit, getters }, taskId, exportType) {
    actions.stopOffExpDetailPolling({ commit })
    let pollingList = getters.offExpDetailPollingList
    let workerIds = []
    pollingList.forEach((worker) => {
      workerIds.push(worker.workerId) // 子任务id
    })
    let params = {
      workerIds: workerIds,
      taskId: taskId
    }
    polling('getOffExpDetailProgress', params, (data) => {
      commit(type.SET_OFFEXP_DETAIL_STATUS, {
        data: data,
        exportType: exportType
      })
      console.log('任务timer:', getters.offExpDetail.timer)
    }, getters.offExpDetail)
  },
  stopOffExpDetailPolling ({ commit }) {
    commit(type.CLEAR_OFFEXP_DETAIL_TIMER)
  },

  // 数据源
  getSourceList ({ commit }, params) {
    Api.sourceQuery.post(params).then(data => {
      commit(type.SET_SOURCE_LIST, data)
    })
  },
  deleteSource ({ commit }, params) {
    return Api.deleteSource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  editSource ({ commit }, params) {
    return Api.editSource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  testSourceConn ({ commit }, params) {
    return Api.testSource.get(params).then(data => {
      if (data.response === 1) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(data.data))
      }
    })
  },
  createSource ({ commit }, params) {
    return Api.createSource.post(params).then(data => {
      if (data.response === 1) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(data.msg))
      }
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
    return Api.sourceTable.get(params).then(data => {
      commit(type.SET_SOURCE_TABLE, data)
      return Promise.resolve(data)
    })
  },
  getFields ({ commit }, params) {}
}

export default actions
