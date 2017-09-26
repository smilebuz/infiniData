<template lang="html">
  <div class="offexpDetail">
    <div class="progressAll">
      <p>导出{{ detailInfo.dbName }}库的{{ detailInfo.tbName }}表的任务{{ detailInfo.taskId }}执行历史记录</p>
    </div>
    <div class="tbcontainer">
      <Table :columns="columns" :data="detailList" class="table"></Table>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page :total="pageInfo.totalCount" :current="pageInfo.currentPage" show-sizer show-elevator
        @on-change="changePageNum" @on-page-size-change="changePageSize"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        taskId: '',
        orderBy: '',
        sort: '',
        pageNum: 1,
        pageSize: 10
      },
      statusList: {
        1: '待运行',
        2: '运行中',
        3: '已完成',
        99: '失败'
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          fixed: 'left',
          width: 70
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 160
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true,
          width: 120
        },
        {
          title: '开始时间',
          key: 'startTime',
          sortable: true,
          width: 160
        },
        {
          title: '结束时间',
          key: 'endTime',
          sortable: true,
          width: 160
        },
        {
          title: '耗时',
          key: 'spendTime',
          width: 100
        },
        {
          title: '抽取速度',
          key: 'extractSpeed',
          width: 120,
          render: (h, params) => {
            return h('div', {}, parseInt(params.row.extractSpeed) + '条/s')
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          render: (h, params) => {
            return h('div', {}, this.statusList[params.row.status])
          }
        },
        {
          title: '备注',
          key: 'info',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      detailInfo: 'offExpDetailInfo',
      detailList: 'offExpDetailList',
      pageInfo: 'offExpDetailPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getDetailList: 'getOffExpDetailList',
      stopPolling: 'stopOffExpDetailPolling'
    }),
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getDetailList(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.searchParams.taskId = this.$route.params.taskId
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss">
  .progressAll {
    padding: 10px;
    text-align: left;
    font-size: 14px;
  }
  .progress {
    flex-basis: 80%;
  }
</style>
