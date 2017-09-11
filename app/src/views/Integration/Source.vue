<template lang="html">
  <div class="source">
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
      <Modal v-model="editModal.show" :title="editModal.title">
        <div class="modal__content">
          <Form :model="configForm" :label-width="80" class="configform">
            <FormItem label="连接名称">
              <Input v-model="configForm.connName"></Input>
            </FormItem>
            <FormItem label="主机IP">
              <Input v-model="configForm.host"></Input>
            </FormItem>
            <FormItem label="数据库名称">
              <Input v-model="configForm.dbName"></Input>
            </FormItem>
            <FormItem label="端口号">
              <Input v-model="configForm.port"></Input>
            </FormItem>
            <FormItem label="用户名">
              <Input v-model="configForm.userName"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="configForm.password"></Input>
            </FormItem>
            <FormItem label="编码设置">
              <Select v-model="configForm.encoding">
                <Option value="utf8">UTF-8</Option>
                <Option value="gbk">GBK</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="testConn">测试连接</Button>
          <Button type="info" @click="editSource">保存</Button>
          <Button @click="cancelEdit">取消</Button>
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
          value: 'create',
          text: '创建新数据源',
          imgUrl: require('../../assets/images/icon/new.png')
        },
        {
          value: 'delete',
          text: '删除数据源',
          imgUrl: require('../../assets/images/icon/nored.png')
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
          title: '序号',
          sortable: true
        },
        {
          title: '连接名称',
          key: 'connName',
          align: 'center'
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
          title: '数据库名',
          key: 'dbName',
          sortable: true,
          align: 'center'
        },
        {
          title: '端口',
          key: '',
          align: 'center'
        },
        {
          title: '用户名',
          key: 'userName',
          align: 'center'
        },
        {
          title: '密码',
          key: 'password',
          align: 'center'
        },
        {
          title: '连接类型',
          key: 'connType',
          align: 'center'
        },
        {
          title: '编码',
          key: 'encoding',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
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
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editModal.show = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      taskList: [
        {
          'password': '123456',
          'connType': 'JDBC',
          'createTime': '2018-02-02 12:00:00',
          'connState': 0,
          'connName': '用户库',
          'IP': '192.168.1.11',
          'dbName': 'ocr',
          'connId': 123,
          'dbType': 'Informix',
          'userName': 'root',
          'encoding': 'UTF-8',
          'user': 'admin'
        }
      ],
      pageInfo: {
        currentPage: 1,
        totalPage: 17,
        pageSize: 10
      },
      configForm: {
        connName: '',
        encoding: '',
        host: '',
        port: '',
        dbName: '',
        userName: '',
        password: ''
      },
      editModal: {
        show: false,
        title: '数据源编辑'
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
          this.$router.push('CreateSource')
          break
        default:
          break
      }
    },
    openEditModal (taskId) {
      this.editModal.show = true
    },
    editSource () {
      // 编辑请求
      this.$router.push('Source')
    },
    cancelEdit () {
      this.$router.push('Source')
    },
    testConn () {
      // 测试请求
      this.modals.connModal = true
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
  .table {
    width: 100%;
  }
  .modal__content {
    display: flex;
  }
  .configform {
    width: 80%;
    margin: 0 auto;
    overflow: auto;
  }
</style>
