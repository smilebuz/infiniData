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
        @click="operateUser(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe class="table" size="small"
        :loading="loadingTable"
        :columns="columns"
        :data="userList"
        @on-selection-change="selectUser"></Table>
      <Modal
        v-model="createModal.show"
        :title="createModal.title">
        <div class="modal__content">
          <Form class="model__form" ref="createUserForm"
            :model="createParams"
            :label-width="80"
            :rules="rulesValidate">
            <FormItem label="姓名" prop="name">
              <Input v-model="createParams.name"></Input>
            </FormItem>
            <FormItem label="密码" prop="pwd">
              <Input v-model="createParams.pwd"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="createParams.email"></Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
              <Input v-model="createParams.phone"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="submitCreateParams('createUserForm')">确定</Button>
          <Button @click="cancelCreate('createUserForm')">取消</Button>
        </div>
      </Modal>
      <Modal
        v-model="editModal.show"
        :title="editModal.title">
        <div class="modal__content">
          <Form class="model__form" ref="editUserForm"
            :model="editParams"
            :label-width="80"
            :rules="rulesValidate">
            <FormItem label="姓名" prop="name">
              <Input v-model="editParams.name"></Input>
            </FormItem>
            <FormItem label="密码" prop="pwd">
              <Input v-model="editParams.pwd"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="editParams.email"></Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
              <Input v-model="editParams.phone"></Input>
            </FormItem>
            <FormItem label="状态">
              <Select v-model="editParams.status">
                <Option :value="0">无效</Option>
                <Option :value="1">有效</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="submitEditParams('editUserForm')">确定</Button>
          <Button @click="cancelEdit('editUserForm')">取消</Button>
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
          bgColor: '#e87178',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建用户',
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
          width: 80
        },
        {
          title: '姓名',
          key: 'name',
          width: 140
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
          key: 'status',
          width: 80,
          render: (h, params) => {
            return h('div', {}, this.statusList[params.row.status])
          }
        },
        {
          title: '操作',
          key: '',
          width: 140,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                size: 'small',
                type: 'primary'
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
          }
        }
      ],
      loadingTable: true,
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
      statusList: {
        '': '全部',
        0: '无效',
        1: '有效'
      },
      rulesValidate: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' }
        ]
      }
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
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
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
          this.$Modal.confirm({
            title: '是否确认删除',
            content: '<p>确认删除用户?</p>',
            onOk: () => {
              this.deleteUser({userId: this.selectedUserIds}).then(data => {
                this.getUserList(this.searchParams)
              })
            },
            onCancel: () => {}
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

    submitCreateParams (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createUser(this.createParams).then(data => {
            this.createModal.show = false
            this.getUserList(this.searchParams).then(data => {
              for (var prop in this.createParams) {
                if (this.createParams.hasOwnProperty(prop)) {
                  this.createParams[prop] = ''
                }
              }
            })
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    cancelCreate (formName) {
      this.createModal.show = false
      this.$refs[formName].resetFields()
      /*
      for (var prop in this.createParams) {
        if (this.createParams.hasOwnProperty(prop)) {
          this.createParams[prop] = ''
        }
      }
      */
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
    submitEditParams (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editUser(this.editParams).then(data => {
            this.editModal.show = false
            this.getUserList(this.searchParams)
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    cancelEdit (formName) {
      this.editModal.show = false
      this.$refs[formName].resetFields()
      /*
      for (var prop in this.editParams) {
        if (this.editParams.hasOwnProperty(prop)) {
          this.editParams[prop] = ''
        }
      }
      */
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.loadingTable = true
        this.getUserList(newParams).then(data => {
          this.loadingTable = false
        })
      },
      deep: true
    }
  },
  mounted () {
    this.getUserList(this.searchParams).then(data => {
      this.loadingTable = false
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
