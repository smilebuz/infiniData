<template lang="html">
  <div class="offexpDetail">
    <div class="progressAll">
      <p>导出{{ detailInfo.dbName }}库的{{ detailInfo.tbName }}表的任务{{ detailInfo.taskId }}执行历史记录</p>
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
          align: 'center'
        },
        {
          title: '调度时间',
          key: 'scheduleDate',
          align: 'center'
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true,
          align: 'center'
        },
        {
          title: '开始时间',
          key: 'startTime',
          sortable: true,
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'endTime',
          sortable: true,
          align: 'center'
        },
        {
          title: '耗时',
          key: 'spendTime',
          align: 'center'
        },
        {
          title: '抽取速度',
          key: 'extractSpeed',
          align: 'center'
        },
        {
          title: '调度状态',
          key: 'status',
          width: 150,
          align: 'center',
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
          align: 'center'
        }
      ],
      detailList: [
        {
          'scheduleDate': '2017-09-01 12:00:00',
          'progress': 0.99,
          'startTime': '2017-09-01 12:00:00',
          'totalRows': 10000,
          'endTime': '',
          'extractSpeed': '50000',
          'spendTime': '',
          'status': 1,
          'info': ''
        },
        {
          'scheduleDate': '2017-09-01 12:00:00',
          'progress': 0.85,
          'startTime': '2017-09-01 12:00:00',
          'totalRows': 10000,
          'endTime': '',
          'extractSpeed': '50000',
          'spendTime': '',
          'status': 2,
          'info': '失败原因'
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
