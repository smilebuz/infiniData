<template>
  <div class="analysis">
    <h3 class="analysis__title">表XXX的数据画像</h3>
    <div class="tbcontainer">
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="analysisList"
        @on-selection-change="selectTask"
      ></Table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: 80
        },
        {
          title: '字段名',
          key: 'field'
        },
        {
          title: '类型',
          key: ''
        },
        {
          title: '空占比值',
          key: ''
        },
        {
          title: '长度',
          key: ''
        },
        {
          title: '大小',
          key: ''
        }
      ],
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
  .analysis {
    flex-direction: column
  }
  .analysis__title {
    padding: 10px;
    text-align: left;
  }
</style>



