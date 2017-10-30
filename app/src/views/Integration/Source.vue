<template lang="html">
  <div class="source">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" inline>
        <FormItem prop="connName" label="连接名称" class="form__item">
          <Input type="text" v-model="filterForm.connName"></Input>
        </FormItem>
        <FormItem prop="dbName" label="库名" class="form__item">
          <Input type="text" v-model="filterForm.dbName"></Input>
        </FormItem>
        <FormItem prop="dbType" label="数据库类型" class="form__item">
          <Select v-model="filterForm.dbType" placeholder="请选择" style="width:120px;">
            <Option value="">全部</Option>
            <Option v-for="(item, index) in dbList" :key="item.type" :value="item.type">
              {{ item.type }}
            </Option>
          </Select>
        </FormItem>
        <!--FormItem prop="connState" label="数据源状态" class="form__item">
          <Select v-model="filterForm.connState" placeholder="请选择" style="width:100px;">
            <Option v-for="(value, key) in connStateList" :key="key" :value="key">
              {{ value }}
            </Option>
          </Select>
        </FormItem-->
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
      <Table border stripe :columns="columns" :data="sourceList" class="table" size="default" @on-selection-change="selectSource"></Table>
      <Modal v-model="editModal.show" :title="editModal.title">
        <div class="modal__content">
          <Form class="editParams" ref="editSourceForm"
            :model="editParams"
            :label-width="110"
            :rules="rulesValidate">
            <FormItem label="连接名称" prop="connName">
              <Input v-model="editParams.connName"></Input>
            </FormItem>
            <FormItem label="数据库名称" prop="dbName">
              <Input v-model="editParams.dbName"></Input>
            </FormItem>
            <FormItem label="数据库类型">
              <Input v-model="editParams.dbType" disabled></Input>
            </FormItem>
            <FormItem label="实例名称" prop="instanceName">
              <Input v-model="editParams.instanceName"></Input>
            </FormItem>
            <FormItem label="主机IP" prop="host">
              <Input v-model="editParams.host"></Input>
            </FormItem>
            <FormItem label="端口号" prop="port">
              <Input v-model="editParams.port"></Input>
            </FormItem>
            <FormItem label="用户名">
              <Input v-model="editParams.userName"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="editParams.password"></Input>
            </FormItem>
            <FormItem label="最大并发连接数" prop="maxConn">
              <Input v-model="editParams.maxConn"></Input>
            </FormItem>
            <FormItem label="编码设置">
              <Select v-model="editParams.encoding">
                <Option value="utf8">UTF-8</Option>
                <Option value="gbk">GBK</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="testConn('editSourceForm')">测试连接</Button>
          <Button type="info" @click="saveEdit('editSourceForm')">保存</Button>
          <Button @click="cancelEdit('editSourceForm')">取消</Button>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    const validateMaxConn = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('最大连接数不能为空'))
      } else {
        if (isNaN(parseInt(value))) {
          callback(new Error('请输入数字值'))
        } else {
          if (parseInt(value) < 1) {
            callback(new Error('最大连接数最小为1'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      searchParams: {
        connName: '',
        dbType: '',
        dbName: '',
        connState: 0,
        pageNum: 1,
        pageSize: 10,
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        connName: '',
        dbType: '',
        dbName: '',
        connState: ''
      },
      connStateList: {
        '0': '生效',
        '1': '失效'
      },
      dbList: [
        {
          type: 'informix'
        },
        {
          type: 'db2'
        },
        {
          type: 'mysql'
        }
      ],
      operations: [
        {
          value: 'delete',
          text: '删除数据源',
          bgColor: '#e87178',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建新数据源',
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
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '连接名称',
          key: 'connName',
          width: 100
        },
        {
          title: '数据库类型',
          key: 'dbType',
          width: 100
        },
        {
          title: 'IP',
          key: 'IP',
          width: 130
        },
        {
          title: '端口',
          key: 'port',
          width: 80
        },
        {
          title: '实例名称',
          key: 'instanceName',
          width: 90
        },
        {
          title: '数据库名',
          key: 'dbName',
          width: 90
        },
        {
          title: '编码',
          key: 'encoding',
          width: 80
        },
        {
          title: '最大并发连接数',
          key: 'maxConn',
          width: 140
        },
        {
          title: '创建时间',
          key: 'createTime',
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
          align: 'center',
          width: 140,
          render: (h, params) => {
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
                    this.openEditModal(params.row)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      editParams: {
        connId: '',
        connName: '',
        encoding: '',
        host: '',
        port: '',
        maxConn: '',
        dbName: '',
        dbType: '',
        userName: '',
        password: '',
        instanceName: ''
      },
      editModal: {
        show: false,
        title: '数据源编辑'
      },
      selectedSourceIds: [],
      rulesValidate: {
        connName: [
          { required: true, message: '连接名不能为空', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '主机IP不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '端口号不能为空', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '数据库名称不能为空', trigger: 'blur' }
        ],
        /*
        instanceName: [
          { required: true, message: '实例名称不能为空', trigger: 'blur' }
        ],
        */
        maxConn: [
          { validator: validateMaxConn, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      sourceList: 'sourceList',
      pageInfo: 'sourcePageInfo'
    })
  },
  methods: {
    ...mapActions({
      getSourceList: 'getSourceList',
      deleteSource: 'deleteSource',
      editSource: 'editSource',
      testSourceConn: 'testSourceConn'
    }),
    changeSearchParams () {
      for (let prop in this.filterForm) {
        if (this.filterForm.hasOwnProperty(prop)) {
          this.searchParams[prop] = this.filterForm[prop]
        }
      }
    },
    selectSource (selection) {
      this.selectedSourceIds.splice(0, this.selectedSourceIds.length)
      for (let source of selection) {
        this.selectedSourceIds.push(source.connId)
      }
    },
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
      }
    },
    operateTask (opType) {
      switch (opType) {
        case 'create':
          this.$router.push('CreateSource')
          break
        case 'delete':
          this.$Modal.confirm({
            title: '是否确认删除',
            content: '<p>确认删除数据源?</p>',
            onOk: () => {
              this.deleteSource({connIds: this.selectedSourceIds}).then(data => {
                this.getSourceList(this.searchParams).then(data = {})
              })
            },
            onCancel: () => {}
          })
          break
        default:
          break
      }
    },
    openEditModal (source) {
      this.editModal.show = true
      this.editParams.host = source.IP
      for (let prop in this.editParams) {
        if (this.editParams.hasOwnProperty(prop) && prop !== 'host') {
          this.editParams[prop] = source[prop]
        }
      }
    },
    saveEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 编辑请求
          this.editSource(this.editParams).then(data => {
            this.editModal.show = false
            this.getSourceList(this.searchParams)
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    cancelEdit (formName) {
      this.editModal.show = false
      this.$refs[formName].resetFields()
    },
    testConn (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 测试请求
          let connParams = {
            type: this.editParams.dbType,
            host: this.editParams.host,
            port: this.editParams.port,
            instance_name: this.editParams.instanceName,
            database_name: this.editParams.dbName,
            user_name: this.editParams.userName,
            password: this.editParams.password
          }
          this.testSourceConn(connParams).then(data => {
            this.$Message.success({
              content: '连接测试成功',
              duration: 1.5,
              top: 50
            })
          }).catch(error => {
            this.$Message.warning({
              content: error.message,
              top: 50,
              duration: 1.5
            })
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
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
        this.getSourceList(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.getSourceList(this.searchParams)
    this.tableWidth = window.screen.availWidth - 170
  }
}
</script>

<style lang="scss">
  .modal__content {
    display: flex;
  }
  .editParams {
    width: 70%;
    margin: 0 auto;
  }
  .ivu-modal-content {
    overflow: hidden!important;
  }
  .ivu-modal-footer {
    overflow: hidden!important;
  }
</style>
