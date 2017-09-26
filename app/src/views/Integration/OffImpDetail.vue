<template lang="html">
  <div class="offimpDetail">
    <div class="progressAll">
      <span>执行详情</span>
      <Progress :percent="detailProgress" class="progress"></Progress>
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
          width: 60
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 160
        },
        {
          title: '抽取节点',
          key: 'IP',
          width: 160
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true,
          width: 120
        },
        {
          title: '起始行号',
          key: 'firstRow',
          sortable: true,
          width: 120
        },
        {
          title: '终止行号',
          key: 'lastRow',
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
          width: 200,
          render: (h, params) => {
            if (params.row.status === 2) {
              return h('div', [
                h('Progress', {
                  props: {
                    percent: params.row.progress
                  }
                })
              ])
            } else {
              return h('div', {}, this.statusList[params.row.status])
            }
          }
        },
        {
          title: '备注',
          key: 'info',
          ellipsis: true,
          width: 120
        }
      ],
      searchParams: {
        taskId: '',
        orderBy: '',
        sort: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters({
      detailList: 'offImpDetailList',
      detailProgress: 'offImpDetailProgress',
      pageInfo: 'offImpDetailPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getDetailList: 'getOffImpDetail',
      stopPolling: 'stopOffImpDetailPolling'
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
      handler: function (params) {
        this.getDetailList(params)
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
    display: flex;
    justify-content: flex-start;
    padding: 10px;
  }
  .progress {
    flex-basis: 80%;
  }
</style>
