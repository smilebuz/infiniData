<template lang="html">
  <div class="offimport">
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
          text: '创建导入任务',
          imgUrl: require('../../assets/images/icon/new.png')
        }
      ],
      columns: [
        {
          type: 'selection',
          align: 'center'
        },
        {
          type: 'index',
          align: 'center',
          sortable: true
        },
        {
          title: '任务编号',
          key: 'taskId',
          sortable: true,
          align: 'center',
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
          align: 'center'
        },
        {
          title: 'IP',
          key: 'IP',
          align: 'center'
        },
        {
          title: '库名',
          key: 'dbName',
          sortable: true,
          align: 'center'
        },
        {
          title: '表名',
          key: 'tbName',
          sortable: true,
          align: 'center'
        },
        {
          title: '任务状态',
          key: 'status',
          align: 'center',
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
          align: 'center'
        },
        {
          title: '调度时间',
          key: 'scheduleDate',
          align: 'center',
          ellipsis: true
        },
        {
          title: '调度状态',
          key: 'scheduleState',
          align: 'center'
        },
        {
          title: '用户',
          key: 'user',
          align: 'center'
        },
        {
          title: '操作',
          key: '',
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
      ],
      pageInfo: {
        currentPage: 1,
        totalPage: 17,
        pageSize: 10
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
          this.$router.push('CreateOffImp')
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-inline {
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .form__item {
    margin-bottom: 0;
  }
  .opgroup {
    display: flex;
    height: 30px;
    line-height: 30px;
    background: #f9f9f9;
  }
  .opgroup__item {
    height: 100%;
    cursor: pointer;
  }
  .tbcontainer {
    padding: 15px 10px;
    background: #f0f0f0;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    border: 1px solid #e6e6e6;
    background: #fff;
  }
</style>
