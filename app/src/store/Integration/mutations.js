import type from '../mutation-type'

export default {
  // 离线导入
  [type.SET_OFFIMP_LIST] (state, data) {
    state.offimport.taskList = data.data
    state.offimport.taskList.forEach((task) => {
      if (task.progress > 0 && task.progress < 100) {
        state.offimport.pollingList.push(task.taskId) // pollingList存的是taskId
      }
    })
    /*
    state.offimport.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    for (var prop in state.offimport.pageInfo) {
      if (state.offimport.pageInfo.hasOwnProperty(prop)) {
        state.offimport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFIMP_TASK_STATUS] (state, data) {
    // debugger
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
    // debugger
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

  [type.SET_OFFIMP_DETAIL_LIST] (state, data) {
    state.offimport.detail.detailList = data.data
    state.offimport.detail.pollingList = data.data
    /*
    state.offimport.detail.pollingList = data.data.filter((task) => {
      return task.progress > 0 && task.progress < 100
    })
    */
    for (var prop in state.offimport.detail.pageInfo) {
      if (state.offimport.detail.pageInfo.hasOwnProperty(prop)) {
        state.offimport.detail.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFIMP_DETAIL_TASK_STATUS] (state, data) {
    state.offimport.detail.progress = data.data.progress // 父任务进程
    // debugger
    if (data.data.data.length) {
      for (let worker of data.data.data) {
        let targetWorker = state.offimport.detail.pollingList.find((el) => {
          return el.workerId === worker.workerId
        })
        targetWorker.progress = worker.progress
        targetWorker.extractSpeed = parseInt(worker.extractSpeed) + '条/s'
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
  [type.SET_INCIMP_LIST] (state, data) {
    state.incimport.taskList = data.data
    for (let prop in state.incimport.pageInfo) {
      if (state.incimport.pageInfo.hasOwnProperty(prop)) {
        state.incimport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_INCIMP_DETAIL_LIST] (state, data) {
    state.incimport.detail.taskList = data.data
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
        targetWorker.progress = worker.progress
        targetWorker.extractSpeed = parseInt(worker.extractSpeed) + '条/s'
      }
    }
  },
  [type.CLEAR_INCIMP_DETAIL_TIMER] (state) {
    if (state.incimport.detail.timer) {
      clearTimeout(state.incimport.detail.timer)
    }
  },

  // 离线导出
  [type.SET_OFFEXP_LIST] (state, data) {
    state.offexport.taskList = data.data
    for (let prop in state.offexport.pageInfo) {
      if (state.offexport.pageInfo.hasOwnProperty(prop)) {
        state.offexport.pageInfo[prop] = data[prop]
      }
    }
  },
  [type.SET_OFFEXP_DETAIL_LIST] (state, data) {
    state.offexport.detail.detailList = data.data
    state.incimport.detail.detailList = data.data
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
        let targetWorker = state.export.detail.pollingList.find((el) => {
          return el.workerId === worker.workerId
        })
        targetWorker.progress = worker.progress
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
