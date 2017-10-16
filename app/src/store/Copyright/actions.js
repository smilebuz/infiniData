import { Api } from '../../api/Api'
import type from '../mutation-type'

const actions = {
  getCompanyName ({ commit }) {
    return Api.copyright.get().then(data => {
      commit(type.SET_COMPANY_NAME, data)
      return Promise.resolve(data)
    })
  }
}

export default actions
