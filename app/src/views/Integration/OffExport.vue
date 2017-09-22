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
        <FormItem prop="tbeName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tbName"></Input>
        </FormItem>
        <FormItem prop="status" label="任务状态" class="form__item">
          <Select v-model="filterForm.status" placeholder="请选择" style="width: 80px;">
            <Option v-for="(value, key) in statusList" :key="key" :value="key">
              {{ value }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="form__item form__item-button">
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
          <span class="edit__label">导出目标</span>
          <RadioGroup v-model="editParams.type" vertical>
            <Radio :label="1" class="radio-custom">
              <span class="radio__label">CSV</span>
              <span class="radiogroup__item-label">编码</span>
              <Select class="select"></Select>
              <span class="radiogroup__item-label">分隔符</span>
              <Select class="select"></Select>
            </Radio>
            <Radio :label="2" class="radio-custom">
              <span class="radio__label">数据库</span>
              <span class="radiogroup__item-label">数据源</span>
              <Select class="select"></Select>
            </Radio>
          </RadioGroup>
        </div>
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup v-model="editParams.scheduleMode" vertical>
            <Radio :label="1">
              <span>手动</span>
            </Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 150px;" v-model="scheduleCornTiming" transfer></DatePicker>
            </Radio>
            <Radio :label="3">
              <span>周期</span>
              <TimePicker size="small" style="width: 150px;" v-model="scheduleCornPeriod" transfer></TimePicker>
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
        orderBy: '',
        sort: ''
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
          text: '创建导出任务',
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
          width: 100
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          ellipsis: true,
          width: 150
        },
        {
          title: '类型',
          key: 'type',
          width: 120,
          render: (h, params) => {
            return h('div', this.typeList[params.row.type])
          }
        },
        {
          title: '目标位置',
          key: 'targetPath',
          width: 120,
          ellipsis: true
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
          width: 120,
          ellipsis: true
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
          width: 150
        },
        {
          title: '操作',
          key: '',
          width: 140,
          fixed: 'right',
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
      editParams: {
        taskId: '',
        type: '',
        scheduleMode: 0,
        scheduleCorn: '',
        scheduleState: -1
      },
      scheduleCornTiming: '',
      scheduleCornPeriod: '',
      selectedTaskIds: [],
      scheduleStateList: {
        '0': '有效',
        '1': '失效'
      },
      scheduleModeList: {
        '1': '手动',
        '2': '定时',
        '3': '周期'
      },
      statusList: {
        '0': '不运行',
        '1': '待运行',
        '2': '运行中',
        '3': '成功',
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
      stopTask: 'stopOffExpTask'
    }),
    opStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center',
        paddingLeft: '20px',
        marginLeft: '20px'
      }
    },
    renderOperationButtons (h, params) {
      switch (params.row.status) {
        case 1:
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
            }, '下载'),
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
    },
    operateTask (opType) {
      switch (opType) {
        case 'create':
          this.$router.push('CreateOffExp')
          break
        case 'delete':
          this.deleteTask({taskIds: this.selectedTaskIds})
          break
        default:
          break
      }
    },
    openEditModal (task) {
      this.editModal.show = true
      this.editParams.taskId = task.taskId
      this.editParams.type = task.type
      if (task.scheduleState) {
        // 失效
        this.editParams.scheduleMode = -1
      } else {
        this.editParams.scheduleMode = task.scheduleMode
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
          this.editParams.scheduleState = 0
          this.editParams.scheduleCorn = ''
          break
        case 2:
          this.editParams.scheduleState = 0
          this.editParams.scheduleCorn = dateFormatter(this.scheduleCornTiming)
          break
        case 3:
          this.editParams.scheduleState = 0
          this.editParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          break
        case -1:
          this.editParams.scheduleState = 1
          this.editParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.editTask(this.editParams)
    },
    cancelEdit () {
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
        this.getTaskList(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.getTaskList(this.searchParams)
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
  .radio-custom {
    margin-bottom: 10px;
  }
  .radiogroup__item-label {
    min-width: 40px;
  }
  .select {
    max-width: 120px;
  }
</style>
