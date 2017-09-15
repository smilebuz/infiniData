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
          <Select v-model="filterForm.scheduleState" placeholder="请选择" style="width:120px;">
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
      <Table border stripe :columns="columns" :data="taskList" class="table" size="default"></Table>
      <Modal v-model="editModal.show" :title="editModal.title" @on-ok="saveEdit" @on-cancel="cancelEdit">
        <div class="modal__content">
          <span class="edit__label">调度设置</span>
          <RadioGroup v-model="editForm.scheduleMode" vertical>
            <Radio :label="1">
              <span>手动</span>
            </Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 200px;"
              v-model="editForm.scheduleCornTiming" transfer></DatePicker>
            </Radio>
            <Radio :label="3">
              <span>周期</span>
              <TimePicker size="small" style="width: 120px;" v-model="editForm.scheduleCornPeriod" transfer></TimePicker>
            </Radio>
            <Radio :label="-1">
              <span>失效</span>
            </Radio>
          </RadioGroup>
        </div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.currentPage }}页 共{{ pageInfo.totalPage }}页
        </div>
        <Page :total='100'></Page>
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
        orderBy: '',
        sort: ''
      },
      filterForm: {
        taskId: '',
        dbName: '',
        tbName: '',
        scheduleState: ''
      },
      scheduleStateList: {
        '0': '有效',
        '1': '无效'
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
          type: 'selection'
        },
        {
          type: 'index',
          title: '序号'
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
                    this.$router.push('IncImpDetail')
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
          width: 90,
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
          width: 90,
          sortable: true,
          ellipsis: true
        },
        {
          title: '主键字段',
          key: 'priKey'
        },
        {
          title: '增量字段',
          key: 'incField'
        },
        {
          title: '增量条件',
          key: 'incCondition',
          ellipsis: true
        },
        {
          title: '调度类型',
          key: 'scheduleMode'
        },
        {
          title: '调度时间',
          key: 'scheduleCorn'
        },
        {
          title: '调度状态',
          key: 'scheduleState'
        },
        {
          title: '用户',
          key: 'user'
        },
        {
          title: '操作',
          key: '',
          width: 140,
          align: 'center',
          render: (h, params) => {
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
        }
      ],
      pageInfo: {
        currentPage: 1,
        totalPage: 17,
        pageSize: 10
      },
      editModal: {
        show: false,
        title: '任务编辑'
      },
      editForm: {
        scheduleMode: -1,
        scheduleState: -1,
        scheduleCornTiming: '',
        scheduleCornPeriod: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      taskList: 'incImpList'
    })
  },
  methods: {
    ...mapActions({
      getTaskList: 'getIncImpList',
      editTask: 'editIncImpTask'
    }),
    changeSearchParams () {
      for (let prop in this.filterForm) {
        if (this.filterForm.hasOwnProperty(prop)) {
          this.searchParams[prop] = this.filterForm[prop]
        }
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
        default:
          break
      }
    },
    openEditModal (task) {
      this.editModal.show = true
      this.editForm.taskId = task.taskId
    },
    resetEditModal () {

    },
    saveEdit () {
      let editParams = {
        taskId: this.editForm.taskId.toString(),
        scheduleMode: this.editForm.scheduleMode,
        scheduleState: 0,
        scheduleCorn: ''
      }
      switch (editParams.scheduleMode) {
        case 1:
          editParams.scheduleState = 0
          break
        case 2:
          editParams.scheduleCorn = dateFormatter(this.editForm.scheduleCornTiming)
          editParams.scheduleState = 0
          break
        case 3:
          editParams.scheduleCorn = timeFormatter(this.editForm.scheduleCornPeriod)
          editParams.scheduleState = 0
          break
        case -1:
          editParams.scheduleState = 1
          break
        default:
          break
      }
      debugger
      this.editTask(editParams)
    },
    cancelEdit () {}
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
  .modal__content {
    display: flex;
  }
  .edit__label {
    padding-top: 7px;
    margin-right: 10px;
  }
</style>
