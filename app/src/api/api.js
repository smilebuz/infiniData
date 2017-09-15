import axios from 'axios'

const Apilist = {
  // test
  'test': '/api/users/login',

  // integration

  // offimport
  'fullQuery': '/api/task/full/query', // post
  'createFull': '/api/task/full/create', // post
  'startFull': '/api/task/full/start', // get
  'restartFull': '/api/task/full/restart', // get
  'stopFull': '/api/task/full/stop', // get
  'deleteFull': '/api/task/full/delete', // get
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
  'sourceQuery': '/datasource/query', // post
  'createSource': '/api/datasource/create', // post
  'editSource': '/api/datasource/edit', // post
  'deleteSource': '/api/datasource/delete', // get
  'testSource': '/api/schema/databaseConn_test', // get

  // handle
  'dbList': '/api/hive/platformdb/all', // get
  'tbList': '/api/hive/platformdb/tbs', // get
  'tbInfo': '/api/hive/platformdb/tbinfo', // get
  'runSql': '/api/dataprocess/runsql', // post

  // general
  'sourceGet': '/api/task/get/datasource', // post
  'sourceTable': '/api/schema/tableScan', // post
  'tableFields': '/api/schema/getAllFields', // post

  // polling
  'getFullProgress': '/api/task/full/progress', // post
  'getFullDetailProgress': '/api/task/full/progress/detail', // post
  'getIncDetailProgress': '/api/task/inc/progress' // post
}

export const Api = ((apilist) => {
  let list = {}
  for (let api in apilist) {
    list[api] = {
      get: (params) => {
        console.log(apilist[api])
        return axios.get(apilist[api], {params})
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
  return axios.get(Apilist[pollingUrl], {params})
    .then(data => {
      if (data.data.response === 1) {
        if (data.data.progress > 0 && data.data.progress < 100) {
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
