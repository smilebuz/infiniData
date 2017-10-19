<template>
  <div class="analysis">
    <h3 class="analysis__title">表{{ tbName }}的数据画像</h3>
    <div class="tbcontainer">
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="tableList"
      ></Table>
      <Modal
        v-model="modal.show"
        :title="modal.title"
        @on-ok="hideModal"
        @on-cancel="hideModal">
        <div id="chart" class="chartContainer"></div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
        ></Page>
      </div>
    </div>
    <myFooter></myFooter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import myFooter from '@/components/Footer'

const echarts = require('echarts')
let chart

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
          title: '序号',
          width: 70
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
          title: '字段空值',
          key: 'null_val',
          width: 90
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
                  console.log(JSON.stringify(params.row.topten))
                  for (let data of params.row.topten) {
                    this.chartOption.xAxis.data.push(data.name)
                    this.chartOption.series[0].data.push(data.value)
                  }
                  this.modal.show = true
                  chart = echarts.init(document.getElementById('chart'))
                  chart.setOption(this.chartOption)
                }
              }
            }, '查看top10')
          }
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: -1,
        totalPage: -1
      },
      modal: {
        show: false,
        title: 'top10'
      },
      chartOption: {
        color: ['#66b8ef'],
        title: { text: 'Top10' },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '出现次数',
          type: 'bar',
          data: []
        }]
      }
    }
  },
  computed: {
    ...mapGetters({
      analysisList: 'analysisList'
      // pageInfo: 'analysisPageInfo'
    }),
    tableList () {
      if (this.pageInfo.pageNum * this.pageInfo.pageSize >= this.pageInfo.totalCount) {
        // 当前页为最后一页
        return this.analysisList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize
        })
      } else {
        // 当前页不是最后一页
        return this.analysisList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize &&
            (index + 1) <= this.pageInfo.pageNum * this.pageInfo.pageSize
        })
      }
    }
  },
  methods: {
    /*
    ...mapActions({
      getAnalysisList: 'getAnalysisList'
    })
    */
    hideModal () {
      this.chartOption.xAxis.data = []
      this.chartOption.series[0].data = []
      chart.dispose()
      this.modal.show = false
    },
    changePageNum (pageNum) {
      this.pageInfo.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.pageInfo.pageSize = pageSize
    }
  },
  mounted () {
    this.searchParams.pdbName = this.$route.params.pdbName
    this.searchParams.tbName = this.$route.params.tbName
    this.tbName = this.$route.params.tbName
    // this.getAnalysisList(this.searchParams).then(data => {})
    this.pageInfo.totalCount = this.analysisList.length
    this.pageInfo.totalPage = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize)
  },
  components: {
    myFooter
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
  .chartContainer {
    margin: 0 auto;
    width: 500px;
    height: 300px;
  }
</style>



