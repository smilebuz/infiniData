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
          <span class="edit__label">导出目标</span>
          <RadioGroup v-model="editForm.exportTarget" vertical>
            <Radio label="CSV" class="radio-custom">
              <span class="radio__label">CSV</span>
              <span class="radiogroup__item-label">编码</span>
              <Select class="select"></Select>
              <span class="radiogroup__item-label">分隔符</span>
              <Select class="select"></Select>
            </Radio>
            <Radio label="数据库" class="radio-custom">
              <span class="radio__label">数据库</span>
              <span class="radiogroup__item-label">数据源</span>
              <Select class="select"></Select>
            </Radio>
          </RadioGroup>
        </div>
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
                    this.$router.push('OffExpDetail')
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
          width: 80,
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
          title: '类型',
          key: 'type'
        },
        {
          title: '目标位置',
          key: 'targetPath',
          width: 70,
          ellipsis: true
        },
        {
          title: '调度类型',
          key: 'scheduleMode',
          width: 70
        },
        {
          title: '调度时间',
          key: 'scheduleCorn',
          width: 70,
          ellipsis: true
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          width: 70
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
                        this.openEditModal(params.row.taskId)
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
                        this.openEditModal(params.row.taskId)
                      }
                    }
                  }, '编辑')
                ])
            }
          }
        }
      ],
      taskList: [
        {
          'taskId': 123,
          'connId': 1234,
          'dbType': 'Informix',
          'dbName': 'ocr',
          'tbName': 'tb_ocrtask',
          'type': 1,
          'targetPath': 'HDFS://infinidata/export/xxx.csv.zip',
          'status': 2,
          'scheduleMode': 0,
          'scheduleCorn': '',
          'scheduleState': 1,
          'user': 'admin'
        },
        {
          'taskId': 456,
          'connId': 1234,
          'dbType': 'Informix',
          'dbName': 'ocr',
          'tbName': 'tb_task',
          'type': 2,
          'targetPath': 'informix:prpclain@192.168.1.1',
          'status': 2,
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
        scheduleMode: '',
        exportTarget: ''
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
          this.$router.push('CreateOffExp')
          break
        default:
          break
      }
    },
    openEditModal (taskId) {
      this.editModal.show = true
      this.editForm.taskId = taskId
    },
    editTask () {
    },
    cancelEdit () {
    }
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
