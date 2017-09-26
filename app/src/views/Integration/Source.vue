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
            <Option value=""></Option>
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
      <Table border stripe :columns="columns" :data="sourceList" class="table" size="default" @on-selection-change="selectSource"></Table>
      <Modal v-model="editModal.show" :title="editModal.title">
        <div class="modal__content">
          <Form :model="editParams" :label-width="80" class="editParams">
            <FormItem label="连接名称">
              <Input v-model="editParams.connName"></Input>
            </FormItem>
            <FormItem label="主机IP">
              <Input v-model="editParams.host"></Input>
            </FormItem>
            <FormItem label="数据库名称">
              <Input v-model="editParams.dbName"></Input>
            </FormItem>
            <FormItem label="数据库类型">
              <Input v-model="editParams.dbType" disabled></Input>
            </FormItem>
            <FormItem label="端口号">
              <Input v-model="editParams.port"></Input>
            </FormItem>
            <FormItem label="用户名">
              <Input v-model="editParams.userName"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="editParams.password"></Input>
            </FormItem>
            <FormItem label="最大并发连接数">
              <Input v-model="editParams.maxConn"></Input>
            </FormItem>
            <FormItem label="编码设置">
              <Select v-model="editParams.encoding">
                <Option value="utf-8">UTF-8</Option>
                <Option value="gbk">GBK</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="testConn">测试连接</Button>
          <Button type="info" @click="saveEdit">保存</Button>
          <Button @click="cancelEdit">取消</Button>
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
          width: 60,
          fixed: 'left'
        },
        {
          type: 'index',
          title: '序号',
          width: 80,
          fixed: 'left'
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
          width: 150
        },
        {
          title: '数据库名',
          key: 'dbName',
          width: 110
        },
        {
          title: '端口',
          key: 'port',
          width: 100
        },
        {
          title: '用户名',
          key: 'userName',
          width: 110
        },
        {
          title: '密码',
          key: 'password',
          width: 140
        },
        {
          title: '连接类型',
          key: 'connType',
          width: 120
        },
        {
          title: '编码',
          key: 'encoding',
          width: 100
        },
        {
          title: '最大并发连接数',
          key: 'maxConn',
          width: 140
        },
        {
          title: '创建时间',
          key: 'createTime',
          ellipsis: true,
          width: 180
        },
        {
          title: '用户',
          key: 'user',
          width: 120
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          width: 140,
          fixed: 'right',
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
        password: ''
      },
      editModal: {
        show: false,
        title: '数据源编辑'
      },
      selectedSourceIds: []
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
        case 'delete':
          this.deleteSource({connIds: this.selectedSourceIds}).then(data => {
            this.getSourceList(this.searchParams).then(data = {})
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
    saveEdit () {
      // 编辑请求
      this.editSource(this.editParams).then(data => {
        this.editModal.show = false
        this.getSourceList(this.searchParams)
      })
    },
    cancelEdit () {
      this.editModal.show = false
    },
    testConn () {
      // 测试请求
      let connParams = {
        type: this.editParams.dbType,
        host: this.editParams.host,
        port: this.editParams.port,
        database_name: this.editParams.dbName,
        user_name: this.editParams.userName,
        password: this.editParams.password
      }
      this.testSourceConn(connParams).then(data => {
        alert(data.message)
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
    width: 100%;
    overflow: scroll;
  }
  .table {
    max-width: 100%;
  }
  .modal__content {
    display: flex;
  }
  .editParams {
    width: 70%;
    margin: 0 auto;
  }
</style>
