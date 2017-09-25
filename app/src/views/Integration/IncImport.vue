<template lang="html">
  <div class="incimport">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" inline>
        <FormItem prop="taskId" label="任务编号" class="form__item">
          <Input type="text" v-model="filterForm.taskId"></Input>
        </FormItem>
        <FormItem prop="dbName" label="库名" class="form__item">
          <Input type="text" v-model="filterForm.dbName"></Input>
        </FormItem>
        <FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tbName"></Input>
        </FormItem>
        <FormItem prop="scheduleState" label="调度状态" class="form__item">
          <Select v-model="filterForm.scheduleState" placeholder="请选择" style="width:100px;">
            <Option v-for="(value, key) in scheduleStateList" :key="key" :value="key">
              {{ value }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="changeSearchParams">筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opgroup">
      <div class="opgroup__item" v-for="operation in operations" :key="operation.value" :style="opStyle(operation.imgUrl)" @click="operateTask(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe :columns="columns" :data="taskList" class="table" size="default" @on-selection-change="selectTask"></Table>
      <Modal v-model="editModal.show" :title="editModal.title" @on-ok="submitEditParams" @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup vertical class="radiogroup"
            v-model="editParams.scheduleMode"
            @on-change="changeEditScheduleMode">
            <Radio :label="1" class="radiogroup__radio">手动</Radio>
            <div class="radiopicker">
              <Radio :label="2">定时</Radio>
              <DatePicker transfer type="datetime" size="small" style="width: 200px;"
                v-model="scheduleCornTiming"
                :options="scheduleOptions"
                :disabled="disableEditDatePicker"
              ></DatePicker>
            </div>
            <div class="radiopicker">
              <Radio :label="3">周期</Radio>
              <TimePicker size="small" style="width: 120px;" transfer
                v-model="scheduleCornPeriod"
                :disabled="disableEditTimePicker"
              ></TimePicker>
            </div>
            <Radio :label="-1" class="radiogroup__radio">失效</Radio>
          </RadioGroup>
        </div>
      </Modal>
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
import { dateFormatter, timeFormatter } from '../../utils/dateFormatter'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        taskId: '',
        dbType: '',
        dbName: '',
        tbName: '',
        scheduleState: '',
        pageNum: 1,
        pageSize: 10,
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        taskId: '',
        dbName: '',
        tbName: '',
        scheduleState: ''
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
          text: '创建定时任务',
          imgUrl: require('../../assets/images/icon/new.png')
        }
      ],
      columns: [
        {
          type: 'selection',
          fixed: 'left',
          width: 60
        },
        {
          type: 'index',
          title: '序号',
          fixed: 'left',
          width: 80
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
                    this.$router.push('/Integration/IncImpDetail/' + params.row.taskId)
                  }
                }
              }, params.row.taskId)
            ])
          }
        },
        {
          title: '数据库类型',
          key: 'dbType',
          width: 100
        },
        {
          title: 'IP',
          key: 'IP',
          width: 180,
          ellipsis: true
        },
        {
          title: '库名',
          key: 'dbName',
          width: 90,
          sortable: true
        },
        {
          title: '表名',
          key: 'tbName',
          width: 120,
          sortable: true
        },
        {
          title: '主键字段',
          key: 'priKey',
          width: 120
        },
        {
          title: '增量字段',
          key: 'incField',
          width: 120
        },
        {
          title: '增量条件',
          key: 'incCondition',
          width: 155
        },
        {
          title: '调度类型',
          key: 'scheduleMode',
          width: 120,
          render: (h, params) => {
            return h('div', this.scheduleModeList[params.row.scheduleMode])
          }
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 120
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          width: 120,
          render: (h, params) => {
            return h('div', this.scheduleStateList[params.row.scheduleState])
          }
        },
        {
          title: '用户',
          key: 'user',
          width: 120
        },
        {
          title: '操作',
          key: '',
          width: 140,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            switch (params.row.status) {
              case 1:
              case 4:
              case 5:
                if (params.row.scheduleMode === 1) {
                  // 判断是不是手动
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
                          let taskIds = [params.row.taskId]
                          this.startTask({taskIds: taskIds}).then(data => {
                            this.getTaskList(this.searchParams).then(data => {})
                          })
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
                          this.openEditModal(params.row)
                        }
                      }
                    }, '编辑')
                  ])
                } else {
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.openEditModal(params.row)
                        }
                      }
                    }, '编辑')
                  ])
                }
              case 2:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.stopTask({taskId: params.row.taskId}).then(data => {
                          this.getTaskList(this.searchParams).then(data => {})
                        })
                      }
                    }
                  }, '停止')
                ])
              /*
              case 3:
              case 4:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row)
                      }
                    }
                  }, '编辑')
                ])
              */
              case 99:
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
                        this.restartTask({taskId: params.row.taskId}).then(data => {
                          this.getTaskList(this.searchParams).then(data => {})
                        })
                      }
                    }
                  }, '重启'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row)
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
      selectedTaskIds: [],
      editModal: {
        show: false,
        title: '任务编辑'
      },
      disableEditDatePicker: true,
      disableEditTimePicker: true,
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      editParams: {
        taskId: '',
        scheduleMode: -1,
        scheduleState: -1,
        scheduleCorn: ''
      },
      scheduleCornPeriod: '',
      scheduleCornTiming: '',
      scheduleModeList: {
        '1': '手动',
        '2': '定时',
        '3': '周期'
      },
      scheduleStateList: {
        '0': '有效',
        '1': '无效'
      }
    }
  },
  computed: {
    ...mapGetters({
      taskList: 'incImpList',
      pageInfo: 'incImpPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getTaskList: 'getIncImpList',
      editTask: 'editIncImpTask',
      deleteTask: 'deleteIncImpTask',
      startTask: 'startIncImpTask',
      stopTask: 'stopIncImpTask',
      stopPolling: 'stopIncImpPolling'
    }),
    changeSearchParams () {
      for (let prop in this.filterForm) {
        if (this.filterForm.hasOwnProperty(prop)) {
          this.searchParams[prop] = this.filterForm[prop]
        }
      }
    },
    changeEditScheduleMode (value) {
      this.disableEditDatePicker = !(value === 2)
      this.disableEditTimePicker = !(value === 3)
    },
    selectTask (selection) {
      this.selectedTaskIds.splice(0, this.selectedTaskIds.length)
      for (let task of selection) {
        this.selectedTaskIds.push(task.taskId)
      }
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
          this.$router.push('CreateIncImp')
          break
        case 'delete':
          let isDeletable = true
          for (let taskId of this.selectedTaskIds) {
            let targetTask = this.taskList.find(task => {
              return task.taskId === taskId
            })
            if (targetTask.status === 2) {
              isDeletable = false
            }
          }
          if (isDeletable) {
            this.deleteTask({taskIds: this.selectedTaskIds}).then(data => {
              this.getTaskList(this.searchParams).then(data => {})
            })
          } else {
            alert('删除任务中含有正在运行的任务, 请重新选择')
          }
          break
        case 'run':
          let isRunnable = true
          // 判断有没有非手动运行
          for (let taskId of this.selectedTaskIds) {
            let targetTask = this.taskList.find(task => {
              return task.taskId === taskId
            })
            if (targetTask.scheduleMode !== 1) {
              isRunnable = false
            }
          }
          if (isRunnable) {
            this.startTask({taskIds: this.selectedTaskIds}).then(data => {
              this.getTaskList(this.searchParams).then(data => {})
            })
          } else {
            alert('选择任务中含有非手动运行任务, 请重新选择')
          }
          break
        default:
          break
      }
    },
    openEditModal (task) {
      this.editModal.show = true
      this.editParams.taskId = task.taskId
      if (task.scheduleState) {
        this.editParams.scheduleMode = -1
        this.disableEditDatePicker = true
        this.disableEditTimePicker = true
      } else {
        this.editParams.scheduleMode = task.scheduleMode
        this.disableEditDatePicker = !(task.scheduleMode === 2)
        this.disableEditTimePicker = !(task.scheduleMode === 3)
        if (task.scheduleMode === 2) {
          this.scheduleCornTiming = task.scheduleCorn
        }
        if (task.scheduleMode === 3) {
          this.scheduleCornPeriod = task.scheduleCorn
        }
      }
    },
    submitEditParams () {
      switch (this.editParams.scheduleMode) {
        case 1:
          this.editParams.scheduleState = 0
          this.editParams.scheduleCorn = ''
          break
        case 2:
          this.editParams.scheduleCorn = dateFormatter(this.scheduleCornTiming)
          this.editParams.scheduleState = 0
          break
        case 3:
          this.editParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          this.editParams.scheduleState = 0
          break
        case -1:
          this.editParams.scheduleState = 1
          this.editParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.editTask(this.editParams).then(data => {
        this.getTaskList(this.searchParams).then(data => {})
      })
    },
    cancelEdit () {},
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
        this.getTaskList(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.getTaskList(this.searchParams)
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss" scoped>
  .modal__content {
    display: flex;
  }
  .edit__label {
    padding-top: 7px;
    margin-right: 10px;
  }
</style>
