<template lang="html">
  <div class="usermanage">
    <div class="form-inline">
      <Form ref="filterForm" inline
        :model="filterForm"
        :label-width="80">
        <FormItem prop="info" label="关键字" class="form__item">
          <Input type="text"
            v-model="filterForm.info"
          ></Input>
        </FormItem>
        <FormItem prop="status" label="用户状态" class="form__item">
          <Select placeholder="请选择" style="width: 120px;"
            v-model="filterForm.status">
            <Option v-for="(status, index) in statusList" :value="status" :key="status">
              {{ status }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="form__item form__item-button">
          <Button type="primary" size="small"
            @click="changeSearchParams"
          >筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opgroup">
      <div class="opgroup__item"
        v-for="operation in operations"
        :key="operation.value"
        :style="opStyle(operation.imgUrl)"
        @click="operateUser(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe class="table" size="small"
        :columns="columns"
        :data="userList"
        @on-selection-change="selectUser"></Table>
      <Modal
        v-model="createModal.show"
        :title="createModal.title"
        @on-ok="submitCreateParams"
        @on-cancel="cancelCreate">
        <div class="modal__content">
          <Form :model="createParams" :label-width="80" class="model__form">
            <FormItem label="姓名">
              <Input v-model="createParams.name"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="createParams.pwd"></Input>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="createParams.email"></Input>
            </FormItem>
            <FormItem label="电话">
              <Input v-model="createParams.phone"></Input>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        v-model="editModal.show"
        :title="editModal.title"
        @on-ok="submitEditParams"
        @on-cancel="cancelEdit">
        <div class="modal__content">
          <Form :model="editParams" :label-width="80" class="model__form">
            <FormItem label="姓名">
              <Input v-model="editParams.name"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input v-model="editParams.pwd"></Input>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="editParams.email"></Input>
            </FormItem>
            <FormItem label="电话">
              <Input v-model="editParams.phone"></Input>
            </FormItem>
            <FormItem label="状态">
              <Select v-model="editParams.status">
                <option value="0">0</option>
                <option value="1">1</option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.currentPage"
          :page-size="pageInfo.pageSize"
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
        ></Page>
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
        info: '',
        status: '',
        pageNum: 1,
        pageSize: 10,
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        info: '',
        status: ''
      },
      operations: [
        {
          value: 'delete',
          text: '删除用户',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建用户',
          imgUrl: require('../../assets/images/icon/new.png')
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60
        },
        {
          type: 'index',
          width: 80
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '操作',
          key: '',
          render: (h, params) => {
            return h('Button', {
              props: {
                size: 'small',
                type: 'primary'
              },
              on: {
                click: () => {
                  this.openEditModal(params.row)
                }
              }
            }, '编辑')
          }
        }
      ],
      selectedUserIds: [],
      createModal: {
        title: '创建用户',
        show: false
      },
      createParams: {
        name: '',
        pwd: '',
        email: '',
        phone: ''
      },
      editModal: {
        title: '编辑用户',
        show: false
      },
      editParams: {
        id: '',
        name: '',
        pwd: '',
        email: '',
        phone: '',
        status: ''
      },
      statusList: ['冻结', '正常']
    }
  },
  computed: {
    ...mapGetters({
      'userList': 'userList',
      'pageInfo': 'userPageInfo'
    })
  },
  methods: {
    ...mapActions({
      'getUserList': 'getUserList',
      'deleteUser': 'deleteUser',
      'createUser': 'createUser',
      'editUser': 'editUser'
    }),
    opStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center',
        paddingLeft: '20px',
        marginLeft: '20px'
      }
    },
    selectUser (selection) {
      this.selectedUserIds.splice(0, this.selectedUserIds.length)
      selection.forEach(user => {
        this.selectedUserIds.push(user.id)
      })
    },
    operateUser (opType) {
      switch (opType) {
        case 'create':
          this.createModal.show = true
          break
        case 'delete':
          this.deleteUser({userId: this.selectedUserIds}).then(data => {
            this.getUserList(this.searchParams)
          })
          break
        default:
          break
      }
    },
    changeSearchParams () {
      for (let key in this.filterForm) {
        if (this.filterForm.hasOwnProperty(key)) {
          this.searchParams[key] = this.filterForm[key]
        }
      }
    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    },

    submitCreateParams () {
      this.createUser(this.createParams).then(data => {
        this.createModal.show = false
        this.getUserList(this.searchParams)
      })
    },
    cancelCreate () {
      this.createModal.show = false
      for (var prop in this.createParams) {
        if (this.createParams.hasOwnProperty(prop)) {
          this.createParams[prop] = ''
        }
      }
    },

    openEditModal (user) {
      this.editParams.id = user.id
      this.editParams.name = user.name
      this.editParams.pwd = user.pwd
      this.editParams.email = user.email
      this.editParams.phone = user.phone
      this.editParams.status = user.status
      this.editModal.show = true
    },
    submitEditParams () {
      this.editUser(this.editParams).then(data => {
        this.editModal.show = false
        this.getUserList(this.searchParams)
      })
    },
    cancelEdit () {
      this.editModal.show = false
      for (var prop in this.editParams) {
        if (this.editParams.hasOwnProperty(prop)) {
          this.editParams[prop] = ''
        }
      }
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getUserList(newParams).then(data => {})
      },
      deep: true
    }
  },
  mounted () {
    this.getUserList(this.searchParams).then(data => {})
  }
}
</script>

<style lang="scss" scoped>
</style>
