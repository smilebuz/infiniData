<template lang="html">
  <div class="dashboard">
    <div class="overview">
      <div class="overview__box" v-for="(value, key) of overview"
        :key="key"
        :style="overviewStyle(value.imgUrl)">
        <p class="overview__box-title">{{ value.count }}{{ value.name }}</p>
        <p class="overview__box-detail">离线导入数：{{ value.full }}</p>
        <p class="overview__box-detail">定时导入数：{{ value.inc }}</p>
        <p class="overview__box-detail">离线导出数：{{ value.export }}</p>
      </div>
    </div>
    <div class="taskPanel">
      <Tabs type="card" class="tabs"
        @on-click="changeTaskType">
        <TabPane class="tabpane"
          v-for="(value, key) in tasks"
          :label="value.name"
          :name="value.type"
          :key="key">
          <Table stripe border class="table"
            :columns="columns"
            :data="taskList"
          ></Table>
          <div class="pagination">
            <div>
              当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
            </div>
            <Page show-sizer show-elevator
              :total="pageInfo.totalCount"
              :current="pageInfo.pageNum"
              :page-size="pageInfo.pageSize"
              @on-change="changePageNum"
              @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        taskType: 'full',
        pageNum: 1,
        pageSize: 10
      },
      overviewInfo: {
        total: {
          name: '总任务数',
          imgUrl: require('../../assets/images/icon/overview-total.png')
        },
        running: {
          name: '运行中任务数',
          imgUrl: require('../../assets/images/icon/overview-running.png')
        },
        success: {
          name: '成功任务数',
          imgUrl: require('../../assets/images/icon/overview-success.png')
        },
        fail: {
          name: '失败任务数',
          imgUrl: require('../../assets/images/icon/overview-fail.png')
        }
      },
      overview: {
        total: {
          name: '总任务数',
          count: 895346,
          full: 78000,
          export: 4556,
          inc: 4543,
          imgUrl: require('../../assets/images/icon/overview-total.png')
        },
        running: {
          name: '运行中任务数',
          count: 45376,
          full: 8000,
          export: 4556,
          inc: 4543,
          imgUrl: require('../../assets/images/icon/overview-running.png')
        },
        success: {
          name: '成功任务数',
          count: 45376,
          full: 8000,
          export: 4556,
          inc: 4543,
          imgUrl: require('../../assets/images/icon/overview-success.png')
        },
        fail: {
          name: '失败任务数',
          count: 45376,
          full: 8000,
          export: 4556,
          inc: 4543,
          imgUrl: require('../../assets/images/icon/overview-fail.png')
        }
      },
      tasks: {
        offImport: {
          name: '离线导入',
          type: 'full'
        },
        incImport: {
          name: '定时导入',
          type: 'inc'
        },
        offExport: {
          name: '离线导出',
          type: 'export'
        }
      },
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '任务号',
          key: 'taskId',
          width: 120
        },
        {
          title: '库名',
          key: 'dbName',
          width: 120
        },
        {
          title: '表名',
          key: 'tbName',
          width: 120
        },
        {
          title: '状态',
          key: 'progress',
          render: (h, params) => {
            return h('div', [
              h('Progress', {
                props: {
                  percent: params.row.progress
                }
              })
            ])
          }
        }
      ],
      timer: ''
    }
  },
  computed: {
    ...mapGetters({
      overviewGet: 'dashboardOverview',
      taskList: 'dashboardTaskList',
      pageInfo: 'dashboardPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getTaskList: 'getDashboardTaskList'
      // stopPolling: 'stopDashboardPolling'
    }),
    overviewStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat 20px 10px #fff'
      }
    },
    changeTaskType (taskType) {
      this.searchParams.taskType = taskType
      this.searchParams.pageNum = 1
    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    },
    stopPolling () {
      console.log('停止轮询', this.timer)
      clearInterval(this.timer)
    },
    polling (params) {
      this.getTaskList(params).then(data => {
        console.log('polling', this.timer)
        for (let prop in this.overviewGet) {
          if (this.overviewGet.hasOwnProperty(prop)) {
            for (let prop2 in this.overviewGet[prop]) {
              if (this.overviewGet[prop].hasOwnProperty(prop2)) {
                this.overview[prop][prop2] = this.overviewGet[prop][prop2]
              }
            }
          }
        }
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.stopPolling()
        this.polling(newParams)
        this.timer = setInterval(() => {
          this.polling(newParams)
        }, 5000)
      },
      deep: true
    }
  },
  created () {
    this.polling(this.searchParams)
    this.timer = setInterval(() => {
      this.polling(this.searchParams)
    }, 5000)
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    background: #f0f0f0;
  }
  .overview {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    padding-right: 0;
  }
  .overview__box {
    flex: 1;
    padding-left: 90px;
    padding-right: 70px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-right: 10px;
    text-align: left;
  }
  .overview__box-title {
    font-size: 16px;
  }
  .taskPanel {
    width: calc(100% - 20px);
    margin-left: 10px;
  }
</style>
