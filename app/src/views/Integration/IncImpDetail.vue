<template lang="html">
  <div class="incimpDetail">
    <div class="progressAll">
      <p>{{ detailInfo.dbName }}库的{{ detailInfo.tbName }}表的定时任务{{ detailInfo.taskId }}执行历史记录</p>
    </div>
    <div class="tbcontainer">
      <Table :columns="columns" :data="detailList"></Table>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.currentPage }}页 共{{ pageInfo.totalPage }}页
        </div>
        <Page :total='100'></Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detailInfo: {
        dbName: 'ocr',
        tbName: 'tb_ocrtask',
        taskId: '1234'
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
          title: '增量字段',
          key: 'incField'
        },
        {
          title: '增量条件',
          key: 'incCondition'
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
          sortable: true
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
      ],
      detailList: [
        {
          'incField': 'UpdateTime',
          'scheduleDate': '2017-09-01 12:00:00',
          'progress': 0.99,
          'startTime': '2017-09-01 12:00:00',
          'totalRows': 10000,
          'endTime': '',
          'extractSpeed': '50000',
          'incCondition': '>=2017.08.25<=2017.08.27',
          'spendTime': '',
          'status': 1,
          'info': ''
        }
      ],
      pageInfo: {
        currentPage: 1,
        totalPage: 17,
        pageSize: 10
      }
    }
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
