<template lang="html">
  <div class="incimport">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="labelWidth" inline>
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
            <Radio label="周期">
              <span>周期</span>
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
          当前第{{ pageInfo.currentPage }}页 共{{ pageInfo.totalPage }}页
        </div>
        <Page :total='100'></Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filterForm: {
        taskId: '',
        dbName: '',
        tableName: '',
        taskStatus: ''
      },
      labelWidth: 80,
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
                    this.openEditModal(params.row.taskId)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      taskList: [
        {
          'taskId': 123,
          'dbType': 'Informix',
          'IP': '192.168.1.11',
          'dbName': 'ocr',
          'tbName': 'tb_ocrtask',
          'priKey': 'uuid',
          'incField': 'age',
          'incCondition': '2017-09-01 12:00:00,2017-10-01 12:00:00',
          'scheduleMode': 0,
          'scheduleCorn': '',
          'scheduleState': 1,
          'user': 'admin'
        },
        {
          'taskId': 456,
          'dbType': 'Informix',
          'IP': '192.168.1.21',
          'dbName': 'ocr',
          'tbName': 'tb_task',
          'priKey': 'uuid',
          'incField': 'age',
          'incCondition': '2017-09-01 12:00:00,2017-10-01 12:00:00',
          'scheduleMode': 1,
          'scheduleCorn': '2017-09-01 12:00:00',
          'scheduleState': 1,
          'user': 'admin'
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
        scheduleMode: ''
      }
    }
  },
  methods: {
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
    openEditModal (taskId) {
      this.editModal.show = true
      this.editForm.taskId = taskId
    },
    editTask () {},
    cancelEdit () {}
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
