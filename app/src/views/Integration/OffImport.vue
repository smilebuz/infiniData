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
            <Option v-for="(value, key) in statusList" :value="key" :key="key">
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
      <Table border stripe class="table" size="default"
        :columns="columns"
        :data="taskList"
        @on-selection-change="selectTask"
      ></Table>
      <Modal v-model="editModal.show" :title="editModal.title" @on-ok="submitEditParams" @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">分片设置</span>
          <Input v-model="editParams.blocks" size="small" class="modal__input" number></Input>
        </div>
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup v-model="editParams.scheduleMode" vertical>
            <Radio :label="1">
              <span>手动</span>
            </Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" style="width: 200px;" :transfer="true" v-model="editParams.scheduleCorn"></DatePicker>
            </Radio>
            <Radio :label="-1">
              <span>失效</span>
            </Radio>
          </RadioGroup>
        </div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.currentPage"
          :page-size="pageInfo.pageSize"
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFormatter } from '../../utils/dateFormatter'

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
          width: 110
        },
        {
          title: 'IP',
          key: 'IP',
          width: 140
        },
        {
          title: '库名',
          key: 'dbName',
          sortable: true,
          width: 120
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          ellipsis: true,
          width: 120
        },
        {
          title: '任务状态',
          key: 'status',
          width: 200,
          render: (h, params) => {
            if (params.row.progress > 0 && params.row.progress < 100) {
              return h('div', [
                h('Progress', {
                  props: {
                    percent: params.row.progress
                  }
                })
              ])
            } else {
              return h('div', this.statusList[params.row.status])
            }
          }
        },
        {
          title: '调度类型',
          key: 'scheduleMode',
          width: 150,
          render: (h, params) => {
            return h('div', this.scheduleModeList[params.row.scheduleMode])
          }
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 180,
          ellipsis: true
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          width: 150,
          render: (h, params) => {
            return h('div', this.scheduleStateList[params.row.scheduleState])
          }
        },
        {
          title: '用户',
          key: 'user',
          width: 150
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
                      on: {
                        click: () => {
                          let taskIds = [params.row.taskId]
                          this.startTask({taskIds: taskIds})
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
                          this.getTaskList(this.searchParams)
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
                    on: {
                      click: () => {
                        this.openEditModal(params.row)
                      }
                    }
                  }, '编辑')
                ])
              case 4:
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
                        this.openEditModal(params.row)
                      }
                    }
                  }, '编辑')
                ])
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
                    on: {
                      click: () => {
                        let taskIds = [params.row.taskId]
                        this.startTask({taskIds: taskIds})
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
                        this.restartTask({taskId: params.row.taskId})
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
      editParams: {
        taskId: -1,
        blocks: '',
        scheduleMode: '',
        scheduleCorn: '',
        scheduleState: -2
      },
      statusList: {
        0: '不运行',
        1: '待运行',
        2: '抽取数据',
        3: '生成parquet',
        4: '已完成',
        5: '已停止',
        99: '已失败'
      },
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
    opStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center',
        paddingLeft: '20px',
        marginLeft: '20px'
      }
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
          this.deleteTask({taskIds: this.selectedTaskIds}).then(data => {
            this.getTaskList(this.searchParams)
          })
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
              this.getTaskList(this.searchParams)
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
      this.editParams.blocks = task.blocks
      if (task.scheduleState) {
        // 失效
        this.editParams.scheduleMode = -1
      } else {
        this.editParams.scheduleMode = task.scheduleMode
        if (task.scheduleMode === 2) {
          this.editParams.scheduleCorn = task.scheduleCorn
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
          this.editParams.scheduleState = 0
          this.editParams.scheduleCorn = dateFormatter(this.editParams.scheduleCorn)
          break
        case -1:
          this.editParams.scheduleState = 1
          this.editParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.editTask(this.editParams).then(data => {
        this.getTaskList(this.searchParams)
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
        this.getTaskList(newParams).then(data => {
          this.taskList.forEach(task => {
            if (this.selectedTaskIds.indexOf(task.taskId) >= 0) {
              task._checked = true
            }
          })
        })
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
  .opgroup {
    height: 30px;
    line-height: 30px;
  }
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
