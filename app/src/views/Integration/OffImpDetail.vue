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
          当前第几页 共几页
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
          title: '序号'
        },
        {
          title: '调度时间',
          key: 'scheduleDate'
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
          sortable: true
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
          key: 'info'
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
      ]
    }
  }
}
</script>

<style lang="scss">
  .progressAll {
    display: flex;
    justify-content: center;
  }
  .progress {
    flex-basis: 80%;
  }
  .tbcontainer {
    padding: 15px 10px;
    background: #f0f0f0;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    border: 1px solid #e6e6e6;
    background: #fff;
  }
</style>
