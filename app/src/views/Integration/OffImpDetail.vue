<template lang="html">
  <div class="offimpDetail">
    <div class="progressAll">
      <span>执行详情</span>
      <Progress :percent="progressAll" class="progress"></Progress>
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
      progressAll: 80,
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 60
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          ellipsis: true
        },
        {
          title: '抽取节点',
          key: 'IP'
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true
        },
        {
          title: '起始行号',
          key: 'firstRow',
          sortable: true
        },
        {
          title: '终止行号',
          key: 'lastRow',
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
                    percent: params.row.progress
                  }
                })
              ])
            }
          }
        },
        {
          title: '备注',
          key: 'info',
          ellipsis: true
        }
      ],
      searchParams: {
        taskId: this.$route.params.taskId,
        orderBy: '',
        sort: '',
        pageNum: -1,
        pageSize: -1
      }
    }
  },
  computed: {
    ...mapGetters({
      detailList: 'offImpDetailList',
      pageInfo: 'offImpDetailPageInfo'
    })
  },
  methods: {
    ...mapActions([
      'getOffImpDetail', 'stopImpDetailPolling'
    ]),
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
        this.getOffImpDetail(params)
      },
      deep: true
    }
  },
  mounted () {
    this.getOffImpDetail(this.searchParams)
  },
  beforeDestroy () {
    this.stopImpDetailPolling()
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
