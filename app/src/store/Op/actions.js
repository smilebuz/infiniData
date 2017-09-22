import { Api } from '../../api/Api'
import type from '../mutation-type.js'

const actions = {
  getLogList ({ commit }, params) {
    return Api.logQuery.post(params).then(data => {
      commit(type.SET_LOG_LIST, data)
      return Promise.resolve(data)
    })
  },

  getUserList ({ commit }, params) {
    return Api.userQuery.post(params).then(data => {
      commit(type.SET_USER_LIST, data)
      return Promise.resolve(data)
    })
  },
  deleteUser ({ commit }, params) {
    return Api.deleteUser.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  createUser ({ commit }, params) {
    return Api.createUser.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  editUser ({ commit }, params) {
    return Api.editUser.post(params).then(data => {
      return Promise.resolve(data)
    })
  },

  getResourceList ({ commit }, params) {
    return Api.userQuery.post(params).then(data => {
      commit(type.SET_RESOURCE_LIST, data)
      return Promise.resolve(data)
    })
  },
  deleteResource ({ commit }, params) {
    return Api.deleteResource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  createResource ({ commit }, params) {
    return Api.createResource.post(params).then(data => {
      return Promise.resolve(data)
    })
  },
  editResource ({ commit }, params) {
    return Api.editResource.post(params).then(data => {
      return Promise.resolve(data)
    })
  }
}

export default actions
