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
        <FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tbName"></Input>
        </FormItem>
        <FormItem prop="status" label="任务状态" class="form__item">
          <Select v-model="filterForm.status" placeholder="请选择" style="width: 120px;">
            <Option value="">全部</Option>
            <Option v-for="(value, key) in statusList" :value="key" :key="key">
              {{ value }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="form__item form__item-button">
          <Button type="primary" class="filter__button"
            @click="changeSearchParams"
          >筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opgroup">
      <div class="opgroup__item"
        v-for="operation in operations"
        :key="operation.value"
        :style="opStyle(operation)"
        @click="operateTask(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="taskList"
        @on-selection-change="selectTask"
      ></Table>
      <Modal
        v-model="editModal.show"
        :title="editModal.title"
        @on-ok="submitEditParams"
        @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">单线程抽取记录数</span>
          <Input v-model="editParams.blocks" size="small" class="modal__input" number>
            <span slot="append">万</span>
          </Input>
        </div>
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup vertical class="radiogroup"
            v-model="editParams.scheduleMode"
            @on-change="changeEditScheduleMode">
            <Radio :label="1" class="radiogroup__radio">手动</Radio>
            <div class="radiopicker radiopicker-vertical">
              <Radio :label="2">定时</Radio>
              <DatePicker class="radiopicker__datepicker" type="date" style="width: 120px;" size="small" transfer
                v-model="scheduleCornTiming.date"
                :options="scheduleOptions"
                :disabled="disableEditDatePicker"
              ></DatePicker>
              <TimePicker type="time" style="width:120px;" size="small" transfer
                v-model="scheduleCornTiming.time"
                :steps="[0, 5]"
                format="HH:mm"
                :disabled="disableEditDatePicker">
              </TimePicker>
            </div>
            <div class="radiopicker radiopicker-vertical">
              <Radio :label="3">周期</Radio>
              <TimePicker size="small" type="time" style="width: 120px;" transfer
                v-model="scheduleCornPeriod"
                :disabled="disableEditTimePicker"
                :steps="[0, 5]"
                format="HH:mm"
              ></TimePicker>
            </div>
            <!--Radio :label="0" class="radiogroup__radio">失效</Radio-->
          </RadioGroup>
        </div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          placement="top"
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFormatter2, timeFormatter } from '../../utils/dateFormatter'

export default {
  data () {
    return {
      searchParams: {
        taskId: '',
        dbType: '',
        dbName: '',
        tbName: '',
        status: '',
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        taskId: '',
        dbName: '',
        tbName: '',
        status: ''
      },
      operations: [
        {
          value: 'run',
          text: '立即运行',
          bgColor: '#80c58c',
          imgUrl: require('../../assets/images/icon/run.png')
        },
        {
          value: 'delete',
          text: '删除任务',
          bgColor: '#e87178',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建导入任务',
          bgColor: '#66b8ef',
          imgUrl: require('../../assets/images/icon/new.png')
        }
      ],
      columns: [
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '任务编号',
          key: 'taskId',
          sortable: true,
          width: 90,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  textDecoration: 'underline',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$router.push('/Integration/OffImpDetail/' + params.row.taskId)
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
          width: 110
        },
        {
          title: '库名',
          key: 'dbName',
          sortable: true,
          width: 80
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          width: 100
        },
        {
          title: '任务状态',
          key: 'status',
          width: 90,
          render: (h, params) => {
            if (params.row.status === 2) {
              return h('div', {}, params.row.progress + '%')
            } else {
              return h('div', this.statusList[params.row.status])
            }
          }
        },
        {
          title: '调度类型',
          key: 'scheduleMode',
          width: 90,
          render: (h, params) => {
            return h('div', this.scheduleModeList[params.row.scheduleMode])
          }
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 150
        },
        {
          title: '用户',
          key: 'user',
          width: 90
        },
        {
          title: '操作',
          key: '',
          width: 140,
          align: 'center',
          render: (h, params) => {
            switch (params.row.status) {
              case 1:
              case 6:
              case 7:
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
                      'class': {
                        table__button: true
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
                      'class': {
                        table__button: true
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
                      'class': {
                        table__button: true
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
                    'class': {
                      table__button: true
                    },
                    on: {
                      click: () => {
                        this.stopTask({taskId: params.row.taskId}).then(data => {
                          this.getTaskList(this.searchParams).then(data = {})
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
              case 3:
              case 5:
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    'class': {
                      table__button: true
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
                    'class': {
                      table__button: true
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row)
                      }
                    }
                  }, '编辑')
                ])
              default:
                return h('div', {})
            }
          }
        }
      ],
      selectedTaskIds: [],
      editModal: {
        show: false,
        title: '任务编辑'
      },
      editParams: {
        taskId: -1,
        blocks: '',
        scheduleMode: '',
        scheduleCorn: ''
      },
      scheduleCornTiming: {
        date: '',
        time: ''
      },
      scheduleCornPeriod: '',
      disableEditDatePicker: true,
      disableEditTimePicker: true,
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      /*
      statusList: {
        0: '不运行',
        1: '待运行',
        2: '抽取数据',
        3: '生成parquet',
        4: '已完成',
        5: '已停止',
        99: '已失败'
      },
      */
      statusList: {
        1: '待运行',
        2: '抽取中',
        3: '抽取失败',
        4: '入库中',
        5: '入库失败',
        6: '已完成',
        7: '已暂停'
      },
      scheduleModeList: {
        '0': '失效',
        '1': '手动',
        '2': '定时'
      }
    }
  },
  computed: {
    ...mapGetters({
      taskList: 'offImpList',
      pageInfo: 'offImpPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getTaskList: 'getOffImpList',
      startTask: 'startOffImpTask',
      stopTask: 'stopOffImpTask',
      restartTask: 'restartOffImpTask',
      deleteTask: 'deleteOffImpTask',
      editTask: 'editOffImpTask',
      stopPolling: 'stopOffImpPolling'
    }),
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
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
    operateTask (opType) {
      switch (opType) {
        case 'create':
          this.$router.push('CreateOffImp')
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
            this.$Modal.confirm({
              title: '是否确认删除',
              content: '<p>确认删除任务?</p>',
              onOk: () => {
                this.deleteTask({taskIds: this.selectedTaskIds}).then(data => {
                  this.getTaskList(this.searchParams).then(data => {})
                })
              },
              onCancel: () => {}
            })
          } else {
            this.$Message.warning({
              content: '删除任务中含有正在运行的任务, 请重新选择',
              duration: 1.5,
              top: 50
            })
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
            this.$Message.warning({
              content: '选择任务中含有非手动运行任务, 请重新选择',
              duration: 1.5,
              top: 50
            })
          }
          break
        default:
          break
      }
    },
    openEditModal (task) {
      this.editModal.show = true
      this.editParams.taskId = task.taskId
      this.editParams.blocks = task.blocks / 10000
      this.editParams.scheduleMode = task.scheduleMode
      if (task.scheduleMode === 0) {
        // 失效
        this.disableEditDatePicker = true
        this.disableEditTimePicker = true
      } else {
        this.disableEditDatePicker = !(task.scheduleMode === 2)
        this.disableEditTimePicker = !(task.scheduleMode === 3)
        if (task.scheduleMode === 2) {
          // this.editParams.scheduleCorn = task.scheduleCorn
          this.scheduleCorn.date = task.scheduleCorn.split(' ')[0]
          this.scheduleCorn.time = task.scheduleCorn.split(' ')[1]
        }
        if (task.scheduleMode === 3) {
          this.scheduleCornPeriod = task.scheduleCorn
        }
      }
    },
    submitEditParams () {
      switch (this.editParams.scheduleMode) {
        case 2:
          let date = dateFormatter2(new Date(this.scheduleCornTiming.date))
          let time = timeFormatter(this.scheduleCornTiming.time)
          this.editParams.scheduleCorn = date + ' ' + time
          break
        case 3:
          this.editParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          break
        default:
          this.editParams.scheduleCorn = ''
          break
      }
      this.editParams.blocks *= 10000
      this.editTask(this.editParams).then(data => {
        this.getTaskList(this.searchParams).then(data => {})
      })
    },
    cancelEdit () {},
    changeSearchParams () {
      for (let key in this.filterForm) {
        if (this.filterForm.hasOwnProperty(key)) {
          this.searchParams[key] = this.filterForm[key]
        }
      }
    },
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
        this.getTaskList(newParams).then(data => {})
      },
      deep: true
    }
  },
  created () {
    this.getTaskList(this.searchParams).then(data => {})
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss" scoped>
  .modal__content {
    display: flex;
    margin-bottom: 10px;
  }
  .modal__input {
    margin-top: 3px;
    width: 30%;
  }
  .edit__label {
    padding-top: 7px;
    margin-right: 15px;
  }
</style>
