import type from '../mutation-type'

export default {
  [type.HANDLE_SET_DB_LIST] (state, data) {
    state.dbList = [...data.platformDbs]
  },
  [type.HANDLE_SET_TB_LIST] (state, data) {
    state.tbList = [...data.data]
  },
  [type.HANDLE_SET_TB_INFO] (state, data) {
    state.tbInfo.fieldList = [...data.fields]
    state.tbInfo.partitionList = [...data.partitions]
  },
  [type.HANDLE_RUN_SQL] (state, data) {
    state.logs = data.log
  }
}
