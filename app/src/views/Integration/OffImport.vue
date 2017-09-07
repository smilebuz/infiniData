<template lang="html">
  <div>
    <div class="form">
      <Form ref="filterForm" :model="filterForm" :label-width="labelWidth" id="filterForm" inline>
        <FormItem prop="taskId" label="任务编号" class="form-item">
          <Input type="text" v-model="filterForm.taskId"></Input>
        </FormItem>
        <FormItem prop="dbName" label="库名" class="form-item">
          <Input type="text" v-model="filterForm.dbName"></Input>
        </FormItem>
        <FormItem prop="tableName" label="表名" class="form-item">
          <Input type="text" v-model="filterForm.tableName"></Input>
        </FormItem>
        <FormItem prop="taskStatus" label="任务状态" class="form-item">
          <Select v-model="filterForm.taskStatus" placeholder="请选择">
            <Option value=1>运行中</Option>
            <Option value=2>已完成</Option>
            <Option value=3>已失败</Option>
            <Option value=4>待运行</Option>
          </Select>
        </FormItem>
        <FormItem class="form-item">
          <Button type="primary" @click="">筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="operation-group">
      <div class="operation-item" id="run-task">
        <span class="operation-directive">立即运行</span>
      </div>
      <div class="operation-item" id="delete-task">
        <span class="operation-directive">删除任务</span>
      </div>
      <router-link to="/Integration/CreateOffImp" tag="div" class="operation-item" id="create-task">
        <span class="operation-directive">创建导入任务</span>
      </router-link>
    </div>
    <div class="table-container">
      <Table border stripe :columns="columns" :data="taskList" class="table" size="default"></Table>
    </div>
    <div class="pagination">
      <div class="page-info">
        当前第几页 共几页
      </div>
      <Page :total='100'></Page>
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          width: 65,
          align: 'center',
          sortable: true
        },
        {
          title: '任务编号',
          key: 'taskId',
          sortable: true,
          align: 'center',
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
                    alert(params.row.taskId)
                  }
                }
              }, params.row.taskId)
            ])
          }
        },
        {
          title: '数据库类型',
          key: 'dbType',
          align: 'center',
          width: 110
        },
        {
          title: 'IP',
          key: 'IP',
          align: 'center',
          width: 110
        },
        {
          title: '库名',
          key: 'dbName',
          sortable: true,
          align: 'center',
          width: 80
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          align: 'center',
          width: 100
        },
        {
          title: '任务状态',
          key: 'status',
          align: 'center',
          width: 150,
          render: (h, params) => {
            if (params.row.progress) {
              return h('div', [
                h('Progress', {
                  props: {
                    percent: parseFloat((params.row.progress * 100).toFixed(2))
                  },
                  style: {
                  }
                })
              ])
            }
          }
        },
        {
          title: '调度类型',
          key: 'scheduleMode',
          align: 'center',
          width: 85
        },
        {
          title: '调度时间',
          key: 'scheduleDate',
          align: 'center',
          width: 85,
          ellipsis: true
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          align: 'center',
          width: 85
        },
        {
          title: '用户',
          key: 'user',
          align: 'center',
          width: 85
        },
        {
          title: '操作',
          key: '',
          width: 150,
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
                        console.log(params)
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
                        console.log(params)
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
      taskList: [
        {
          'scheduleState': 1,
          'tbName': 'tb_ocrtask',
          'blocks': 2,
          'IP': '192.168.1.11',
          'dbName': 'ocr',
          'scheduleMode': 0,
          'scheduleDate': '2016-09-09 10:08:32',
          'dbType': 'Informix',
          'progress': null,
          'user': 'admin',
          'taskId': 123,
          'status': 1
        },
        {
          'scheduleState': 1,
          'tbName': 'tb_ocrtask',
          'blocks': 2,
          'IP': '192.168.1.11',
          'dbName': 'ocr',
          'scheduleMode': 0,
          'scheduleDate': '2016-09-09 10:08:32',
          'dbType': 'Informix',
          'progress': 0.56,
          'user': 'admin',
          'taskId': 124,
          'status': 2
        },
        {
          'scheduleState': 1,
          'tbName': 'tb_ocrtask',
          'blocks': 2,
          'IP': '192.168.1.11',
          'dbName': 'ocr',
          'scheduleMode': 0,
          'scheduleDate': '2016-09-09 10:08:32',
          'dbType': 'Informix',
          'progress': 0.85,
          'user': 'admin',
          'taskId': 125,
          'status': 3
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  #filterForm {
    .form-item {
      float: left;
    }
  }
  .operation-group {
    width: 100%;
    overflow: auto;
    padding-top: 1em;
    padding-bottom: 1em;
    background: #f9f9f9;
    .operation-item {
      float: left;
      margin-left: 1em;
      margin-right: .5em;
      cursor: pointer;
      .operation-directive {
        margin-left: 20px;
      }
    }
    #run-task {
      background: url('../../assets/images/icon/run.png') no-repeat left center;
    }
    #delete-task {
      background: url('../../assets/images/icon/nored.png') no-repeat left center;
    }
    #create-task {
      background: url('../../assets/images/icon/new.png') no-repeat left center;
    }
  }
  .table-container {
    padding-top: 1em;
    background: #f0f0f0;
    .table {
      margin-left: .5em;
      margin-right: .5em;
    }
  },
  .pagination {
    display: flex;
    justify-content: space-between;
    padding-top: 1em;
    padding-left: .5em;
    padding-right: .5em;
  }
</style>
