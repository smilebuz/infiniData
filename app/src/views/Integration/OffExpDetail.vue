<template lang="html">
  <div class="offexpDetail">
    <div class="progressAll">
      <p>导出{{ detailInfo.dbName }}库的{{ detailInfo.tbName }}表的任务{{ detailInfo.taskId }}执行历史记录</p>
    </div>
    <div class="tbcontainer">
      <Table :columns="columns" :data="detailList"></Table>
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
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 60
        },
        {
          title: '调度时间',
          key: 'scheduleDate',
          ellipsis: true
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true
        },
        {
          title: '开始时间',
          key: 'startTime',
          sortable: true,
          ellipsis: true
        },
        {
          title: '结束时间',
          key: 'endTime',
          sortable: true,
          ellipsis: true
        },
        {
          title: '耗时',
          key: 'spendTime'
        },
        {
          title: '抽取速度',
          key: 'extractSpeed'
        },
        {
          title: '调度状态',
          key: 'status',
          width: 150,
          render: (h, params) => {
            if (params.row.status === 2) {
              return h('div', [
                h('Progress', {
                  props: {
                    percent: parseFloat((params.row.progress * 100).toFixed(2))
                  }
                })
              ])
            } else {
              return h('div', [
                h('span', {}, params.row.status)
              ])
            }
          }
        },
        {
          title: '备注',
          key: 'info',
          ellipsis: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      detailInfo: 'offExpDetailInfo',
      detailList: 'offExpDetailList',
      pageInfo: 'offExpDetailPageInfo',
      stopPolling: 'stopOffExpDetailPolling'
    })
  },
  methods: {
    ...mapActions({
      getDetailList: 'getOffExpDetailList'
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
