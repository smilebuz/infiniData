<template lang="html">
  <div class="systemConfig">
    <div class="form-inline">
      <Form ref="filterForm" inline
        :model="filterForm"
        :label-width="80">
        <FormItem prop="info" label="关键字" class="form__item">
          <Input type="text"
            v-model="filterForm.info"
          ></Input>
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
        @click="operateResource(operation.value)">
        {{ operation.text }}
      </div>
    </div>
    <div class="tbcontainer">
      <Table border stripe class="table" size="small"
        :loading="loadingTable"
        :columns="columns"
        :data="resourceList"
        @on-selection-change="selectResource"></Table>
      <Modal
        v-model="createModal.show"
        :title="createModal.title">
        <div class="modal__content">
          <Form class="model__form" ref="createConfigForm"
            :model="createParams"
            :rules="rulesValidate"
            :label-width="80">
            <FormItem label="配置名" prop="key">
              <Input v-model="createParams.key"></Input>
            </FormItem>
            <FormItem label="取值" prop="value">
              <Input v-model="createParams.value"></Input>
            </FormItem>
            <FormItem label="缺省值" prop="default_value">
              <Input v-model="createParams.default_value"></Input>
            </FormItem>
            <FormItem label="描述">
              <Input type="textarea"
                :rows="2"
                v-model="createParams.info"></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="submitCreateParams('createConfigForm')">确定</Button>
          <Button @click="cancelCreate('createConfigForm')">取消</Button>
        </div>
      </Modal>
      <Modal
        v-model="editModal.show"
        :title="editModal.title">
        <div class="modal__content">
          <Form class="model__form" ref="editConfigForm"
            :model="editParams"
            :rules="rulesValidate"
            :label-width="80">
            <FormItem label="配置名" prop="key">
              <Input v-model="editParams.key"></Input>
            </FormItem>
            <FormItem label="取值" prop="value">
              <Input v-model="editParams.value"></Input>
            </FormItem>
            <FormItem label="缺省值" prop="default_value">
              <Input v-model="editParams.default_value"></Input>
            </FormItem>
            <FormItem label="描述">
              <Input type="textarea"
                :rows="2"
                v-model="editParams.info">
              </Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="buttongroup">
          <Button type="primary" @click="submitEditParams('editConfigForm')">确定</Button>
          <Button @click="cancelEdit('editConfigForm')">取消</Button>
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
        pageNum: 1,
        pageSize: 10,
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        info: ''
      },
      operations: [
        {
          value: 'delete',
          text: '删除配置',
          bgColor: '#e87178',
          imgUrl: require('../../assets/images/icon/nored.png')
        },
        {
          value: 'create',
          text: '创建配置',
          bgColor: '#66b8ef',
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
          title: '序号',
          width: 80
        },
        {
          title: '配置名称',
          key: 'key',
          width: 150
        },
        {
          title: '设定值',
          key: 'value',
          width: 150
        },
        {
          title: '缺省值',
          key: 'default_value',
          width: 150
        },
        {
          title: '描述',
          key: 'info'
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          width: 140,
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
      selectedResourceIds: [],

      createModal: {
        title: '创建配置',
        show: false
      },
      createParams: {
        key: '',
        value: '',
        default_value: '',
        info: ''
      },

      editModal: {
        title: '编辑配置',
        show: false
      },
      editParams: {
        id: '',
        key: '',
        value: '',
        default_value: '',
        info: ''
      },

      rulesValidate: {
        key: [
          { required: true, message: '配置名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '取值不能为空', trigger: 'blur' }
        ],
        default_value: [
          { required: true, message: '默认值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      resourceList: 'resourceList',
      pageInfo: 'resourcePageInfo'
    })
  },
  methods: {
    ...mapActions({
      getResourceList: 'getResourceList',
      deleteResource: 'deleteResource',
      createResource: 'createResource',
      editResource: 'editResource'
    }),
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
      }
    },
    selectResource (selection) {
      this.selectedResourceIds.splice(0, this.selectedResourceIds.length)
      selection.forEach(resource => {
        this.selectedResourceIds.push(resource.id)
      })
    },
    operateResource (opType) {
      switch (opType) {
        case 'create':
          this.createModal.show = true
          break
        case 'delete':
          this.$Modal.confirm({
            title: '是否确认删除',
            content: '<p>确认删除配置?</p>',
            onOk: () => {
              this.deleteResource({id: this.selectedResourceIds}).then(data => {
                this.getResourceList(this.searchParams)
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
          this.createResource(this.createParams).then(data => {
            this.createModal.show = false
            this.getResourceList(this.searchParams).then(data => {
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
    },

    openEditModal (resource) {
      this.editModal.show = true
      this.editParams.id = resource.id
      this.editParams.key = resource.key
      this.editParams.value = resource.value
      this.editParams.default_value = resource.default_value
      this.editParams.info = resource.info
    },
    submitEditParams (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editResource(this.editParams).then(data => {
            this.editModal.show = false
            this.getResourceList(this.searchParams)
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    cancelEdit (formName) {
      this.editModal.show = false
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.loadingTable = true
        this.getResourceList(newParams).then(data => {
          this.loadingTable = false
        })
      },
      deep: true
    }
  },
  mounted () {
    this.getResourceList(this.searchParams).then(data => {
      this.loadingTable = false
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
