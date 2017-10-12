<template lang="html">
  <div class="systemResource">
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
        :columns="columns"
        :data="resourceList"
        @on-selection-change="selectResource"></Table>
      <Modal
        v-model="createModal.show"
        :title="createModal.title"
        @on-ok="submitCreateParams"
        @on-cancel="cancelCreate">
        <div class="modal__content">
          <Form :model="createParams" :label-width="80" class="model__form">
            <FormItem label="配置名">
              <Input v-model="createParams.key"></Input>
            </FormItem>
            <FormItem label="取值">
              <Input v-model="createParams.value"></Input>
            </FormItem>
            <FormItem label="缺省值">
              <Input v-model="createParams.default_value"></Input>
            </FormItem>
            <FormItem label="描述">
              <Input v-model="createParams.info"></Input>
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
            <FormItem label="配置名">
              <Input v-model="editParams.key"></Input>
            </FormItem>
            <FormItem label="取值">
              <Input v-model="editParams.value"></Input>
            </FormItem>
            <FormItem label="缺省值">
              <Input v-model="editParams.default_value"></Input>
            </FormItem>
            <FormItem label="描述">
              <Input v-model="editParams.info"></Input>
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
          width: 90
        },
        {
          title: '缺省值',
          key: 'default_value',
          width: 90
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

    submitCreateParams () {
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
    },
    cancelCreate () {
      this.createModal.show = false
      for (var prop in this.createParams) {
        if (this.createParams.hasOwnProperty(prop)) {
          this.createParams[prop] = ''
        }
      }
    },

    openEditModal (resource) {
      this.editModal.show = true
      this.editParams.id = resource.id
      this.editParams.key = resource.key
      this.editParams.value = resource.value
      this.editParams.default_value = resource.default_value
      this.editParams.info = resource.info
    },
    submitEditParams () {
      this.editResource(this.editParams).then(data => {
        this.editModal.show = false
        this.getResourceList(this.searchParams)
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
        this.getResourceList(newParams).then(data => {})
      },
      deep: true
    }
  },
  mounted () {
    this.getResourceList(this.searchParams).then(data => {})
  }
}
</script>

<style lang="scss" scoped>
</style>
