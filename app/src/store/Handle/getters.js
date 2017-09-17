export default {
  dbList (state) {
    return state.dbList
  },
  tbList (state) {
    return state.tbList
  },
  tbInfo (state) {
    return state.tbInfo
  },
  fieldList (state) {
    return state.tbInfo.fieldList
  },
  partitionList (state) {
    return state.tbInfo.partitionList
  },
  runSqlInfo (state) {
    return state.runSqlInfo
  }
}
