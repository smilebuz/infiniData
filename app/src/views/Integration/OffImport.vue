<template lang="html">
  <div class="offimport">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" inline>
        <FormItem prop="taskId" label="任务编号" class="form__item">
          <Input type="text" v-model="filterForm.taskId"></Input>
        </FormItem>
        <FormItem prop="dbName" label="库名" class="form__item">
          <Input type="text" v-model="filterForm.dbName"></Input>
        </FormItem>
        <FormItem prop="tableName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tableName"></Input>
        </FormItem>
        <FormItem prop="taskStatus" label="任务状态" class="form__item">
          <Select v-model="filterForm.taskStatus" placeholder="请选择">
            <Option value=1>运行中</Option>
            <Option value=2>已完成</Option>
            <Option value=3>已失败</Option>
            <Option value=4>待运行</Option>
          </Select>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="">筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opgroup">
      <div class="opgroup__item" v-for="operation in operations" :key="operation.value" :style="opStyle(operation.imgUrl)" @click="operateTask(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe :columns="columns" :data="taskList" class="table" size="default"></Table>
      <Modal v-model="editModal.show" :title="editModal.title" @on-ok="editTask" @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup v-model="editForm.scheduleMode" vertical>
            <Radio label="手动">
              <span>手动</span>
            </Radio>
            <Radio label="定时">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 120px;"></DatePicker>
            </Radio>
            <Radio label="失效">
              <span>失效</span>
            </Radio>
          </RadioGroup>
        </div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.currentPage }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page :total="pageInfo.totalCount" :current="pageInfo.currentPage" show-sizer show-elevator on-change="goSearch(params)"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { Api, polling } from '../../api/Api'

export default {
  data () {
    return {
      filterForm: {
        taskId: '',
        dbName: '',
        tableName: '',
        taskStatus: ''
      },
      operations: [
        {
          value: 'run',
          text: '立即运行',
          imgUrl: require('../../assets/images/icon/run.png')
        },
        {
          value: 'delete',
          text: '删除任务',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建导入任务',
          imgUrl: require('../../assets/images/icon/new.png')
        }
      ],
      columns: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          title: '序号',
          sortable: true
        },
        {
          title: '任务编号',
          key: 'taskId',
          sortable: true,
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // alert(params.row.taskId)
                    this.$router.push('OffImpDetail')
                  }
                }
              }, params.row.taskId)
            ])
          }
        },
        {
          title: '数据库类型',
          key: 'dbType',
          width: 110
        },
        {
          title: 'IP',
          key: 'IP',
          ellipsis: true
        },
        {
          title: '库名',
          key: 'dbName',
          sortable: true
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          ellipsis: true
        },
        {
          title: '任务状态',
          key: 'status',
          width: 150,
          render: (h, params) => {
            if (params.row.progress > 0 && params.row.progress < 100) {
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
          title: '调度类型',
          key: 'scheduleMode',
          width: 90
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 90,
          ellipsis: true
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          width: 90
        },
        {
          title: '用户',
          key: 'user'
        },
        {
          title: '操作',
          key: '',
          width: 140,
          render: (h, params) => {
            switch (params.row.status) {
              case 1:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        console.log(params)
                      }
                    }
                  }, '编辑')
                ])
              case 2:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        console.log(params.row.status)
                      }
                    }
                  }, '启动'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row.taskId)
                      }
                    }
                  }, '编辑')
                ])
              case 3:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        console.log(params.row.status)
                      }
                    }
                  }, '停止'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row.taskId)
                      }
                    }
                  }, '编辑')
                ])
              default:
                break
            }
          }
        }
      ],
      taskList: [],
      statusList: {
        '0': '不运行',
        '1': '待运行',
        '4': '已完成',
        '99': '已失败'
      },
      scheduleModeList: {
        '1': '手动',
        '2': '定时',
        '3': '周期'
      },
      scheduleStateList: {
        '0': '已失效',
        '1': '生效中'
      },
      pageInfo: {
        currentPage: 0,
        totalPage: 0,
        pageSize: 0,
        totalCount: 0
      },
      editModal: {
        show: false,
        title: '任务编辑'
      },
      editForm: {
        scheduleMode: ''
      }
    }
  },
  computed: {
    pollingList () {
      return this.taskList.filter((task, i, arr) => {
        return task.progress > 0 && task.progress < 100
      })
    }
  },
  methods: {
    search () {
      let params = {}
      Api.fullQuery.post(params).then(data => {
        this.taskList = [...data.data]
        this.pageInfo.currentPage = data.pageNum
        this.pageInfo.totalPage = data.totalPage
        this.pageInfo.pageSize = data.pageSize
        this.pageInfo.totalCount = data.totalCount
        this.pollingListStatus()
      })
    },
    opStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center',
        paddingLeft: '20px',
        marginLeft: '20px'
      }
    },
    operateTask (opType) {
      switch (opType) {
        case 'create':
          this.$router.push('CreateOffImp')
          break
        default:
          break
      }
    },
    openEditModal (taskId) {
      this.editModal.show = true
      this.editForm.taskId = taskId
    },
    editTask () {},
    cancelEdit () {},
    goSearch (params) {
      debugger
    },
    pollingListStatus () {
      this.stopPolling()
      if (!this.taskList.length) {
        return null
      }
      let list = this.taskList.filter((el, i, arr) => {
        return el.progress > 0 && el.progress < 100
      })
      list.forEach((task, i, arr) => {
        let params = {
          taskId: task.taskId
        }
        polling(params, (data) => {
          task.progress = data.progress
          console.log('任务id:', task.taskId, '任务timer:', task.timer)
        }, task)
      })
    },
    stopPolling () {
      this.pollingList.forEach((task, i, arr) => {
        console.log('停止轮询', task.timer)
        clearTimeout(task.timer)
      })
    }
  },
  mounted () {
    this.search()
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss" scoped>
  .opgroup {
    height: 30px;
    line-height: 30px;
  }
  .modal__content {
    display: flex;
  }
  .edit__label {
    padding-top: 7px;
    margin-right: 15px;
  }
  .select {
    max-width: 120px;
  }
</style>
