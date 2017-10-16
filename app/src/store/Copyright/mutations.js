import type from '../mutation-type'

export default {
  [type.SET_COMPANY_NAME] (state, data) {
    state.companyName = data.companyName
  }
}
