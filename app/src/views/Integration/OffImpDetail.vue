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
      progressAll: 80,
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
          title: '抽取节点',
          key: 'IP',
          align: 'center'
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true,
          align: 'center'
        },
        {
          title: '起始行号',
          key: 'firstRow',
          sortable: true,
          align: 'center'
        },
        {
          title: '终止行号',
          key: 'lastRow',
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
          align: 'center',
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
          'firstRow': 1,
          'lastRow': 1000,
          'IP': '192.168.1.1',
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
          'firstRow': 1,
          'lastRow': 1000,
          'IP': '192.168.1.1',
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
    display: flex;
    justify-content: flex-start;
    padding: 10px;
  }
  .progress {
    flex-basis: 80%;
  }
</style>
