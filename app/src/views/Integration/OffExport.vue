<template lang="html">
  <div class="offexport">
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
            <Option v-for="(value, key) in statusList" :key="key" :value="key">
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
      <Table border stripe :columns="columns" :data="taskList" class="table" size="default" @on-selection-change="selectTask"></Table>
      <Modal v-model="editModal.show" :title="editModal.title" @on-ok="submitEditParams" @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">导出目标</span>
          <RadioGroup vertical class="radiogroup"
            v-model="editParams.type"
            @on-change="changeEditType">
            <div class="radioselect">
              <Radio :label="1" class="radioselect__type">CSV</Radio>
              <span class="radiogroup__item-label">编码</span>
              <Select class="select" style="width:300px;" size="small"
                :disabled="disableEditCSVSelect">
              </Select>
              <span class="radiogroup__item-label" size="small">分隔符</span>
              <Select class="select"
                :disabled="disableEditCSVSelect"
              ></Select>
            </div>
            <div class="radioselect">
              <Radio :label="2" class="radioselect__type">数据库</Radio>
              <span class="radiogroup__item-label">数据源</span>
              <Select class="select" size="small"
                :disabled="disableEditDBSelect"
              ></Select>
            </div>
          </RadioGroup>
        </div>
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup vertical class="radiogroup"
            v-model="editParams.scheduleMode"
            @on-change="changeEditScheduleMode">
            <Radio :label="1" class="radiogroup__radio">手动</Radio>
            <div class="radiopicker">
              <Radio :label="2">定时</Radio>
              <DatePicker transfer type="datetime" size="small" style="width: 150px;"
                v-model="scheduleCornTiming"
                :options="scheduleOptions"
                :disabled="disableEditDatePicker"
              ></DatePicker>
            </div>
            <div class="radiopicker">
              <Radio :label="3">周期</Radio>
              <TimePicker transfer size="small" style="width: 150px;"
                v-model="scheduleCornPeriod"
                :disabled="disableEditTimePicker"
              ></TimePicker>
            </div>
            <Radio :label="0" class="radiogroup__radio">失效</Radio>
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
import { mapActions, mapGetters } from 'vuex'
import { dateFormatter, timeFormatter } from '../../utils/dateFormatter'

export default {
  data () {
    return {
      searchParams: {
        taskId: '',
        dbType: '',
        dbName: '',
        tbName: '',
        status: '',
        pageNum: 1,
        pageSize: 10,
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
          text: '创建导出任务',
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
          width: 110,
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
                    this.$router.push('/Integration/OffExpDetail/' + params.row.taskId)
                  }
                }
              }, params.row.taskId)
            ])
          }
        },
        {
          title: '平台库名',
          key: 'dbName',
          width: 80
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          width: 80
        },
        {
          title: '类型',
          key: 'type',
          width: 100,
          render: (h, params) => {
            return h('div', this.typeList[params.row.type])
          }
        },
        {
          title: '目标位置',
          key: 'targetPath',
          width: 180
        },
        {
          title: '任务状态',
          key: 'status',
          width: 90,
          render: (h, params) => {
            return h('div', this.statusList[params.row.status])
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
            return this.renderOperationButtons(h, params)
          }
        }
      ],
      editModal: {
        show: false,
        title: '任务编辑'
      },
      disableEditCSVSelect: true,
      disableEditDBSelect: true,
      disableEditDatePicker: true,
      disableEditTimePicker: true,
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      editParams: {
        taskId: '',
        type: '',
        scheduleMode: 0,
        scheduleCorn: ''
      },
      scheduleCornTiming: '',
      scheduleCornPeriod: '',
      selectedTaskIds: [],
      scheduleModeList: {
        '0': '失效',
        '1': '手动',
        '2': '定时',
        '3': '周期'
      },
      statusList: {
        '1': '待运行',
        '2': '运行中',
        '3': '已完成',
        '5': '已停止',
        '99': '失败'
      },
      typeList: {
        '1': 'CSV',
        '2': '数据库'
      }
    }
  },
  computed: {
    ...mapGetters({
      taskList: 'offExpList',
      pageInfo: 'offExpPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getTaskList: 'getOffExpList',
      deleteTask: 'deleteOffExpTask',
      editTask: 'editOffExpTask',
      startTask: 'startOffExpTask',
      stopTask: 'stopOffExpTask',
      stopPolling: 'stopOffExpPolling'
    }),
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
      }
    },
    renderOperationButtons (h, params) {
      switch (params.row.status) {
        case 1:
        case 5:
          if (params.row.scheduleMode === 1) {
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
                style: {
                  marginRight: '5px'
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
                  this.openEditModal(params.row)
                }
              }
            }, '编辑')
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
                    this.getTaskList(this.searchParams).then(data => {})
                  })
                }
              }
            }, '停止')
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
              'class': {
                table__button: true
              },
              on: {
                click: () => {
                  this.openEditModal(params.row)
                }
              }
            }, '编辑'),
            /*
            h('a', {
              domProps: {
                href: 'http://' + params.row.downloadUrl
              },
              style: {
                marginRight: '5px'
              }
            }, '下载')
            */
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
                  window.location.href = 'http://' + params.row.downloadUrl
                }
              }
            }, '下载')
          ])
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
    },
    operateTask (opType) {
      switch (opType) {
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
        case 'create':
          this.$router.push('CreateOffExp')
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
            this.$Message.warning({
              content: '删除任务中含有正在运行的任务, 请重新选择',
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
      this.editParams.type = task.type
      this.editParams.scheduleMode = task.scheduleMode
      this.disableEditCSVSelect = !(task.type === 1)
      this.disableEditDBSelect = !(task.type === 2)
      if (task.scheduleMode === 0) {
        // 失效
        this.disableEditDatePicker = true
        this.disableEditTimePicker = true
      } else {
        this.disableEditDatePicker = !(task.scheduleMode === 2)
        this.disableEditTimePicker = !(task.scheduleMode === 3)
        switch (task.scheduleMode) {
          case 2:
            this.scheduleCornTiming = task.scheduleCorn
            break
          case 3:
            this.scheduleCornPeriod = task.scheduleCorn
            break
          default:
            break
        }
      }
    },
    submitEditParams () {
      switch (this.editParams.scheduleMode) {
        case 1:
          this.editParams.scheduleCorn = ''
          break
        case 2:
          this.editParams.scheduleCorn = dateFormatter(this.scheduleCornTiming)
          break
        case 3:
          this.editParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          break
        case 0:
          this.editParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.editTask(this.editParams).then(data => {
        this.getTaskList(this.searchParams).then(data => {})
      })
    },
    cancelEdit () {
    },
    changeEditType (value) {
      this.disableEditCSVSelect = !(value === 1)
      this.disableEditDBSelect = !(value === 2)
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
    changeSearchParams () {
      for (let prop in this.filterForm) {
        if (this.filterForm.hasOwnProperty(prop)) {
          this.searchParams[prop] = this.filterForm[prop]
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
  mounted () {
    this.getTaskList(this.searchParams).then(data => {})
  },
  beforeDestroy () {
    this.stopPolling()
  }
}
</script>

<style lang="scss" scoped>
  .edit__label {
    padding-top: 7px;
    margin-right: 10px;
  }
  .modal__content {
    display: flex;
  }
  .radiogroup__item-label {
    min-width: 40px;
  }
  .select {
    max-width: 120px;
  }
</style>
