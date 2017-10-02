import type from '../mutation-type'

export default {
  // 仪表盘
  [type.SET_DASHBOARD_INFO] (state, data) {
    state.dashboard.taskList = data.data.taskList
    state.dashboard.overview = data.data.overview
    for (let prop in state.dashboard.pageInfo) {
      if (state.dashboard.pageInfo.hasOwnProperty(prop)) {
        state.dashboard.pageInfo[prop] = data[prop]
      }
    }
  },

  // 离线导入
  // 主页轮询
  [type.SET_OFFIMP_LIST] (state, data) {
    state.offimport.taskList = data.data
    state.offimport.taskList.forEach((task) => {
      if (task.status === 2 || task.status === 3 || task.scheduleMode === 2) {
        state.offimport.pollingList.push(task.taskId) // pollingList存的是taskId
      }
    })
    /*
    state.offimport.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    for (let prop in state.offimport.pageInfo) {
      if (state.offimport.pageInfo.hasOwnProperty(prop)) {
        state.offimport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFIMP_TASK_STATUS] (state, data) {
    if (data.data.length) {
      for (let task of data.data) {
        let targetTaskId = state.offimport.pollingList.find((el) => {
          return el === task.taskId
        })
        let targetTask = state.offimport.taskList.find((el) => {
          return el.taskId === targetTaskId
        })
        targetTask.progress = task.progress
        targetTask.status = task.status
      }
    }
  },
  [type.CLEAR_OFFIMP_TIMER] (state) {
    if (state.offimport.timer) {
      console.log('停止轮询', state.offimport.timer)
      clearTimeout(state.offimport.timer)
    }
  },
  [type.START_OFFIMP_TASK] (state, data) {
    for (let taskId of data.taskIds) {
      state.offimport.pollingList.push(taskId)
    }
  },
  [type.RESTART_OFFIMP_TASK] (state, data) {
    if (state.offimport.pollingList.indexOf(data.taskId) < 0) {
      state.offimport.pollingList.push(data.taskId)
    }
  },
  [type.STOP_OFFIMP_TASK] (state, data) {
    let targetIndex = state.offimport.pollingList.indexOf(data.taskId)
    if (targetIndex >= 0) {
      state.offimport.pollingList.splice(targetIndex, 1)
    }
  },
  // 详情轮询
  [type.SET_OFFIMP_DETAIL_LIST] (state, data) {
    state.offimport.detail.detailList = data.data
    state.offimport.detail.pollingList = data.data
    /*
    state.offimport.detail.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    for (let prop in state.offimport.detail.pageInfo) {
      if (state.offimport.detail.pageInfo.hasOwnProperty(prop)) {
        state.offimport.detail.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFIMP_DETAIL_TASK_STATUS] (state, data) {
    state.offimport.detail.progress = data.data.progress // 父任务进程
    if (data.data.data.length) {
      for (let worker of data.data.data) {
        let targetWorker = state.offimport.detail.pollingList.find((el) => {
          return el.workerId === worker.workerId
        })
        targetWorker.startTime = worker.startTime
        targetWorker.endTime = worker.endTime
        targetWorker.spendTime = worker.spendTime
        targetWorker.progress = worker.progress
        targetWorker.status = worker.status
        targetWorker.extractSpeed = worker.extractSpeed
      }
    }
  },
  [type.CLEAR_OFFIMP_DETAIL_TIMER] (state) {
    if (state.offimport.detail.timer) {
      console.log('停止轮询', state.offimport.detail.timer)
      clearTimeout(state.offimport.detail.timer)
    }
  },

  // 定时导入
  // 主页轮询
  [type.SET_INCIMP_LIST] (state, data) {
    state.incimport.taskList = data.data
    state.incimport.taskList.forEach((task) => {
      if (task.status === 2 || task.status === 3 || task.scheduleMode === 2 || task.scheduleMode === 3) {
        state.incimport.pollingList.push(task.taskId) // pollingList存的是taskId
      }
    })
    for (let prop in state.incimport.pageInfo) {
      if (state.incimport.pageInfo.hasOwnProperty(prop)) {
        state.incimport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_INCIMP_TASK_STATUS] (state, data) {
    if (data.data.length) {
      for (let task of data.data) {
        let targetTaskId = state.incimport.pollingList.find((el) => {
          return el === task.taskId
        })
        let targetTask = state.incimport.taskList.find((el) => {
          return el.taskId === targetTaskId
        })
        targetTask.status = task.status
      }
    }
  },
  [type.CLEAR_INCIMP_TIMER] (state) {
    if (state.incimport.timer) {
      console.log('停止轮询', state.incimport.timer)
      clearTimeout(state.incimport.timer)
    }
  },
  // 详情轮询
  [type.SET_INCIMP_DETAIL_LIST] (state, data) {
    state.incimport.detail.detailList = data.data
    state.incimport.detail.pollingList = data.data
    for (let prop in state.incimport.detail.detailInfo) {
      if (state.incimport.detail.detailInfo.hasOwnProperty(prop)) {
        state.incimport.detail.detailInfo[prop] = data[prop]
      }
    }
    for (let prop in state.incimport.detail.pageInfo) {
      if (state.incimport.detail.pageInfo.hasOwnProperty(prop)) {
        state.incimport.detail.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_INCIMP_DETAIL_STATUS] (state, data) {
    if (data.data.data.length) {
      for (let worker of data.data.data) {
        let targetWorker = state.incimport.detail.pollingList.find((el) => {
          return el.workerId === worker.workerId
        })
        targetWorker.startTime = worker.startTime
        targetWorker.endTime = worker.endTime
        targetWorker.spendTime = worker.spendTime
        targetWorker.status = worker.status
        targetWorker.progress = worker.progress
      }
    }
  },
  [type.CLEAR_INCIMP_DETAIL_TIMER] (state) {
    if (state.incimport.detail.timer) {
      clearTimeout(state.incimport.detail.timer)
    }
  },

  // 离线导出
  // 主页轮询
  [type.SET_OFFEXP_LIST] (state, data) {
    state.offexport.taskList = data.data
    state.offexport.taskList.forEach((task) => {
      if (task.status === 2 || task.status === 3 || task.scheduleMode === 2 || task.scheduleMode === 3) {
        state.offexport.pollingList.push(task.taskId) // pollingList存的是taskId
      }
    })
    for (let prop in state.offexport.pageInfo) {
      if (state.offexport.pageInfo.hasOwnProperty(prop)) {
        state.offexport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFEXP_TASK_STATUS] (state, data) {
    if (data.data.length) {
      for (let task of data.data) {
        let targetTaskId = state.offexport.pollingList.find((el) => {
          return el === task.taskId
        })
        let targetTask = state.offexport.taskList.find((el) => {
          return el.taskId === targetTaskId
        })
        targetTask.targetPath = task.targetPath
        targetTask.status = task.status
      }
    }
  },
  [type.CLEAR_OFFEXP_TIMER] (state) {
    if (state.offexport.timer) {
      console.log('停止轮询', state.offexport.timer)
      clearTimeout(state.offexport.timer)
    }
  },
  // 详情轮询
  [type.SET_OFFEXP_DETAIL_LIST] (state, data) {
    state.offexport.detail.detailList = data.data
    state.offexport.detail.pollingList = data.data
    for (let prop in state.offexport.detail.detailInfo) {
      if (state.offexport.detail.detailInfo.hasOwnProperty(prop)) {
        state.offexport.detail.detailInfo[prop] = data[prop]
      }
    }
    for (let prop in state.offexport.detail.pageInfo) {
      if (state.offexport.detail.pageInfo.hasOwnProperty(prop)) {
        state.offexport.detail.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFEXP_DETAIL_STATUS] (state, data) {
    if (data.data.data.length) {
      for (let worker of data.data.data) {
        let targetWorker = state.offexport.detail.pollingList.find((el) => {
          return el.workerId === worker.workerId
        })
        targetWorker.startTime = worker.startTime
        targetWorker.endTime = worker.endTime
        targetWorker.spendTime = worker.spendTime
        targetWorker.status = worker.status
        targetWorker.progress = worker.progress
        targetWorker.extractSpeed = worker.extractSpeed
      }
    }
  },
  [type.CLEAR_OFFEXP_DETAIL_TIMER] (state) {
    if (state.offexport.detail.timer) {
      clearTimeout(state.offexport.detail.timer)
    }
  },

  // 数据源
  [type.SET_SOURCE_LIST] (state, data) {
    state.source.sourceList = data.data
    for (let prop in state.source.pageInfo) {
      if (state.source.pageInfo.hasOwnProperty(prop)) {
        state.source.pageInfo[prop] = data[prop]
      }
    }
  },

  // 通用
  [type.SET_DATA_SOURCE] (state, dataSources) {
    state.dataSources = dataSources
  },
  [type.SET_SOURCE_TABLE] (state, data) {
    state.sourceTables = data.data
    for (let prop in state.sourceTablePageInfo) {
      if (state.sourceTablePageInfo.hasOwnProperty(prop)) {
        state.sourceTablePageInfo[prop] = data[prop]
      }
    }
  }
}
