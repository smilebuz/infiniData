import { Api } from '../../api/Api'
import { type } from '../mutation-type'

const actions = {
  getOffLineList ({ commit }, params) {
    Api.fullQuery.post(params).then(data => {
      type.commit(type.SET_OFFLINE_LIST)
      actions.pollingListStatus()
    })
  },

  pollingListStatus () {

  }
}

export default actions
