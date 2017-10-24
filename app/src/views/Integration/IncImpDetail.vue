<template lang="html">
  <div class="incimpDetail">
    <div class="progressAll">
      <span>执行详情</span>
      <Progress :percent="detailProgress" class="progress"></Progress>
    </div>
    <div class="tbcontainer">
      <Table class="table" border stripe
        :columns="columns"
        :data="detailList"></Table>
      <Modal
        v-model="infoModal.show"
        :title="infoModal.title">
        <p>{{ infoModal.content }}</p>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.currentPage"
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"></Page>
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
        2: '抽取数据',
        3: '已完成',
        99: '已失败'
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '表名',
          key: 'tbName',
          width: 80
        },
        {
          title: '增量字段',
          key: 'incField',
          width: 90
        },
        {
          title: '增量条件',
          key: 'incCondition',
          width: 110
        },
        {
          title: '开始时间',
          key: 'startTime',
          sortable: true,
          width: 110
        },
        {
          title: '结束时间',
          key: 'endTime',
          sortable: true,
          width: 110
        },
        {
          title: '耗时',
          key: 'spendTime',
          width: 80
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          render: (h, params) => {
            if (params.row.status === 2) {
              return h('div', {}, params.row.progress + '%')
            } else {
              return h('div', {}, this.statusList[params.row.status])
            }
          }
        },
        {
          title: '备注',
          key: 'info',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (params.row.info) {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                'class': {
                  table__button: true
                },
                on: {
                  click: () => {
                    this.infoModal.show = true
                    this.infoModal.content = params.row.info
                  }
                }
              }, '查看')
            } else {
              return h('div', {}, '')
            }
          }
        }
      ],
      infoModal: {
        show: false,
        title: '备注',
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      detailList: 'incImpDetailList',
      detailProgress: 'incImpDetailProgress',
      pageInfo: 'incImpDetailPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getDetailList: 'getIncImpDetail',
      stopPolling: 'stopIncImpDetailPolling'
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
    display: flex;
    justify-content: flex-start;
    padding: 10px;
  }
  .progress {
    padding-left: 10px;
    flex-basis: 80%;
  }
</style>
