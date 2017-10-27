<template lang="html">
  <div class="offimpDetail">
    <div class="progressAll">
      <span>执行详情</span>
      <Progress :percent="detailProgress" class="progress"></Progress>
    </div>
    <div class="tbcontainer">
      <Table class="table" stripe border
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
          @on-page-size-change="changePageSize"
        ></Page>
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
          width: 70
        },
        {
          title: '表名',
          key: 'tbName',
          width: 80
        },
        {
          title: '抽取节点',
          key: 'IP',
          width: 110
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true,
          width: 110
        },
        {
          title: '起始行号',
          key: 'firstRow',
          sortable: true,
          width: 110
        },
        {
          title: '终止行号',
          key: 'lastRow',
          sortable: true,
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
          width: 110,
          render: (h, params) => {
            if (params.row.endTime !== 'None') {
              return h('div', {}, params.row.endTime)
            } else {
              return h('div', {}, '')
            }
          }
        },
        {
          title: '耗时',
          key: 'spendTime',
          width: 70
        },
        {
          title: '抽取速度',
          key: 'extractSpeed',
          width: 110,
          render: (h, params) => {
            if (params.row.extractSpeed) {
              return h('div', {}, parseInt(params.row.extractSpeed) + '条/s')
            } else {
              return h('div', {}, '')
            }
          }
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
      searchParams: {
        taskId: '',
        orderBy: '',
        sort: '',
        pageNum: 1,
        pageSize: 10
      },
      infoModal: {
        show: false,
        title: '备注',
        content: ''
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
    padding-left: 10px;
    flex-basis: 80%;
  }
</style>
