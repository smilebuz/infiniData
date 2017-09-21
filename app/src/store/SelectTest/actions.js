import { Api } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getTestPersonList ({ commit }, params) {
    return Api.selectTest.get(params).then(data => {
      commit(type.SELECT_TEST, data)
      return Promise.resolve(data)
    })
  }
}

export default actions
