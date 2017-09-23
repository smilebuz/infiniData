<template>
  <div class="analysis">
    分析
    <!--p>表XXX的数据画像</p>
    <div class="tbcontainer">
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="analysisList"
        @on-selection-change="selectTask"
      ></Table>
    </div-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      columns: [],
      searchParams: {
        pdbId: '',
        tbId: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      analysisList: 'analysisList'
      // pageInfo: 'analysisPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getAnalysisList: 'getAnalysisList'
    })
  },
  mounted () {
    debugger
    this.searchParams.pdbId = this.$route.params.pdbId
    this.searchParams.tbId = this.$route.params.tbId
    this.getAnalysisList(this.searchParams).then(data => {})
  }
}
</script>

<style lang="scss" scoped>

</style>


