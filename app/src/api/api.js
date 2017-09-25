import axios from 'axios'

const Apilist = {
  // login
  'login': '/api/optionManage/user/login', // post

  // integration

  // offimport
  'fullQuery': '/api/task/full/query', // post
  'createFull': '/api/task/full/create', // post
  'startFull': '/api/task/full/start', // post
  'restartFull': '/api/task/full/restart', // get
  'stopFull': '/api/task/full/stop', // get
  'deleteFull': '/api/task/full/delete', // post
  'editFull': '/api/task/full/edit', // post
  'fullDetail': '/api/task/full/detail', // post

  // incimport
  'incQuery': '/api/task/inc/query', // post
  'createInc': '/api/task/inc/create', // post
  'startInc': '/api/task/inc/start', // get
  'deleteInc': '/api/task/inc/delete', // get
  'stopInc': '/api/task/inc/stop', // get
  'editInc': '/api/task/inc/edit', // post
  'incDetail': '/api/task/inc/detail', // post

  // offexport
  'exportQuery': '/api/task/export/query', // post
  'createExport': '/api/task/export/create', // post
  'startExport': '/api/task/export/start', // get
  'deleteExport': '/api/task/export/delete', // get
  'stopExport': '/api/task/export/stop', // get
  'editExport': '/api/task/export/edit', // post
  'exportDetail': '/api/task/export/detail', // post

  // datasource
  'sourceQuery': '/api/datasource/query', // post
  'createSource': '/api/datasource/create', // post
  'editSource': '/api/datasource/edit', // post
  'deleteSource': '/api/datasource/delete', // get
  'testSource': '/apiSchema/Export_schema/schema/databaseConn_test', // get

  // general
  'sourceGet': '/api/task/get/datasource', // post
  'sourceTable': '/apiSchema/Export_schema/schema/tableScan', // get
  'tableFields': '/api/schema/getAllFields', // post

  // polling
  'getFullProgress': '/api/task/full/progress', // post
  'getFullDetailProgress': '/api/task/full/detail/progress', // post
  'getIncStatus': '/api/task/inc/progress', // post
  'getIncDetailProgress': '/api/task/inc/detail/progress', // post
  'getExpStatus': '/api/task/export/progress', // post
  'getOffExpDetailProgress': '/api/task/export/detail/progress', // post

  // handle
  'handledbList': '/api/hive/platformdb/all', // get
  'handletbList': '/api/hive/platformdb/tbs', // get
  'handletbInfo': '/api/hive/platformdb/tbinfo', // get
  'handlerunSql': '/api/dataprocess/runsql', // post

  // manage
  'manageQuery': '/api/hive/platformdb/tbs', // post
  'manageAnalysis': '/api/manage/tb/analysis', // get

  // selecttest
  'selectTest': '/apiManage/select/test', // get

  // op
  'logQuery': '/api/optionManage/log/query', // post
  'userQuery': '/api/optionManage/user/query', // post
  'deleteUser': '/api/optionManage/user/delete', // post
  'createUser': '/api/optionManage/user/create', // post
  'editUser': '/api/optionManage/user/edit', // post
  'resourceQuery': '/api/optionManage/config/query', // post
  'deleteResource': '/api/optionManage/config/delete', // post
  'createResource': '/api/optionManage/config/create', // post
  'editResource': '/api/optionManage/config/edit' // post
}

export const Api = ((apilist) => {
  let list = {}
  for (let api in apilist) {
    list[api] = {
      get: (params) => {
        console.log(apilist[api])
        if (params) {
          return axios.get(apilist[api], {params: params})
            .then(data => {
              if (data.data.response === 1) {
                return Promise.resolve(data.data)
              } else {
                console.log('response is 0')
              }
            })
            .catch(error => {
              console.log('error happens', error)
            })
        } else {
          return axios.get(apilist[api])
            .then(data => {
              if (data.data.response === 1) {
                return Promise.resolve(data.data)
              } else {
                console.log('response is 0')
              }
            })
            .catch(error => {
              console.log('error happens', error)
            })
        }
      },
      post: (params) => {
        console.log(apilist[api])
        return axios.post(apilist[api], params)
          .then(data => {
            if (data.data.response === 1) {
              return Promise.resolve(data.data)
            } else {
              console.log('response is 0')
            }
          })
          .catch(error => {
            console.log('error happens', error)
          })
      }
    }
  }
  return list
})(Apilist)

export const polling = (pollingUrl, params, update, ref) => {
  return axios.post(Apilist[pollingUrl], params)
    .then(data => {
      if (data.data.response === 1) {
        if (!data.data.length) {
          let timer = setTimeout(() => {
            polling(pollingUrl, params, update, ref)
          }, 5000)
          if (ref) {
            ref.timer = timer
          }
        }
      } else {
        console.log('response is 0')
      }
      update && update(data.data)
    })
    .catch(error => {
      console.log('error happends', error)
    })
}
