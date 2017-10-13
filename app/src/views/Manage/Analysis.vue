<template>
  <div class="analysis">
    <h3 class="analysis__title">表{{ tbName }}的数据画像</h3>
    <div class="tbcontainer">
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="analysisList"
        @on-selection-change=""
      ></Table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        pdbName: '',
        tbName: ''
      },
      tbName: '',
      columns: [
        {
          type: 'index',
          width: 80
        },
        {
          title: '名称',
          key: 'name',
          width: 80
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: '最小值',
          key: 'min',
          width: 80
        },
        {
          title: '最大值',
          key: 'max',
          width: 80
        },
        {
          title: '操作',
          key: '',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                size: 'small',
                type: 'primary'
              },
              'class': {
                table__button: true
              },
              on: {
                click: () => {
                  alert(params.row.topten)
                }
              }
            }, '查看top10')
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      analysisList: 'analysisList'
      // pageInfo: 'analysisPageInfo'
    })
  },
  /*
  methods: {
    ...mapActions({
      getAnalysisList: 'getAnalysisList'
    })
  },
  */
  mounted () {
    this.searchParams.pdbName = this.$route.params.pdbName
    this.searchParams.tbName = this.$route.params.tbName
    this.tbName = this.$route.params.tbName
    // this.getAnalysisList(this.searchParams).then(data => {})
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



