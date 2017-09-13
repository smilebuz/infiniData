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
          <Select v-model="filterForm.status" placeholder="请选择">
            <Option value=1>运行中</Option>
            <Option value=2>已完成</Option>
            <Option value=3>已失败</Option>
            <Option value=4>待运行</Option>
          </Select>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="filterTask">筛选</Button>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
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
                        let taskIds = [params.row.taskId]
                        this.startTask(taskIds)
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
                        let params = {
                          taskId: params.row.taskId
                        }
                        this.stopOffImpTask(params)
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
      selectTasks: [],
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
      searchParams: {
        taskId: '',
        dbName: '',
        tbName: '',
        status: '',
        currentPage: '',
        pageSize: ''
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
    ...mapGetters({
      taskList: 'offImpList',
      pollingList: 'offImpPollingList'
    })
  },
  methods: {
    ...mapActions([
      'getOffImpList', 'pollingListStatus', 'stopPolling', 'startOffImpTask', 'deleteOffImpTask', 'restartOffImpTask', 'stopOffImpTask'
    ]),
    search () {
      this.getOffImpList(this.searchParams)
    },
    opStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center',
        paddingLeft: '20px',
        marginLeft: '20px'
      }
    },
    filterTask () {
      for (let key in this.filterForm) {
        if (this.filterForm.hasOwnProperty(key)) {
          this.searchParams[key] = this.filterForm[key]
        }
      }
    },
    selectTask (selection) {
      for (let task of selection) {
        this.selectTasks.push(task.taskId)
      }
    },
    operateTask (opType) {
      switch (opType) {
        case 'create':
          this.$router.push('CreateOffImp')
          break
        case 'delete':
          this.deleteOffImpTask({taskIds: this.selectTasks})
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
    startTask (taskIds) {
      let params = {
        taskIds: taskIds
      }
      this.startOffImpTask(params)
    }
  },
  watch: {
    searchParams: {
      handler: function (params) {
        this.search()
      },
      deep: true
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
