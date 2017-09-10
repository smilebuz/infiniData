<template lang="html">
  <div class="dashboard">
    <div class="overview">
      <div class="overview__box" v-for="(value, key) of overview" :key="key" :style="overviewStyle(value.imgUrl)">
        <p class="overview__box-title">{{ value.count }}{{ value.name }}</p>
        <p class="overview__box-detail">离线导入数：{{ value.offImpCount }}</p>
        <p class="overview__box-detail">定时导入数：{{ value.incImpCount }}</p>
        <p class="overview__box-detail">离线导出数：{{ value.offExpCount }}</p>
      </div>
    </div>
    <div class="taskPanel">
      <Tabs type="card" class="tabs">
        <TabPane :label="value.name" v-for="(value, key) in tasks" :key="key" class="tabpane">
          <div class="tbcontainer">
            <Table :columns="value.columns" :data="value.taskList" stripe border class="table"></Table>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      overview: {
        totalTask: {
          name: '总任务数',
          count: 895346,
          offImpCount: 78000,
          offExpCount: 4556,
          incImpCount: 4543,
          imgUrl: require('../../assets/images/icon/overview-total.png')
        },
        runningTask: {
          name: '运行中任务数',
          count: 45376,
          offImpCount: 8000,
          offExpCount: 4556,
          incImpCount: 4543,
          imgUrl: require('../../assets/images/icon/overview-running.png')
        },
        successTask: {
          name: '成功任务数',
          count: 45376,
          offImpCount: 8000,
          offExpCount: 4556,
          incImpCount: 4543,
          imgUrl: require('../../assets/images/icon/overview-success.png')
        },
        failTask: {
          name: '失败任务数',
          count: 45376,
          offImpCount: 8000,
          offExpCount: 4556,
          incImpCount: 4543,
          imgUrl: require('../../assets/images/icon/overview-fail.png')
        }
      },
      tasks: {
        offImport: {
          name: '离线导入',
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
                      percent: parseFloat((params.row.progress * 100).toFixed(2))
                    }
                  })
                ])
              }
            }
          ],
          taskList: [
            {
              taskId: 87463,
              dbName: 'Oracle',
              tbName: 'ocr_task',
              progress: 0.85
            }
          ]
        },
        incImport: {
          name: '定时导入',
          columns: [],
          taskList: []
        },
        offExport: {
          name: '离线导出',
          columns: [],
          taskList: []
        }
      }
    }
  },
  methods: {
    overviewStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat 20px 10px #fff'
      }
    }
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
  }
  .overview__box {
    padding-left: 90px;
    padding-right: 70px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .overview__box-title {
    font-size: 16px;
  }
  .overview__box-detail {
    text-align: left;
  }
  .taskPanel {
    width: calc(100% - 20px);
    margin-left: 10px;
  }
</style>
