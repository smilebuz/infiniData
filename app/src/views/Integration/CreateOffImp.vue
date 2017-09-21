<template lang="html">
  <div class="createOffImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="connId" label="数据源" class="form__item">
          <Select v-model="filterForm.connId" placeholder="请选择" style="width: 120px;">
            <Option v-for="(source, index) in dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tables" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tables"></Input>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="changeSearchParams">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opbuttons">
      <Button type="success" class="opbutton" icon="checkmark" size="small"
        @click="changeSelectAllinDBStatus(true)">
        全选
      </Button>
      <Button type="error" class="opbutton" icon="close" size="small"
        @click="changeSelectAllinDBStatus(false)">
        清空
      </Button>
    </div>
    <div class="main">
      <div class="createPanel">
        <Table border stripe :columns="columns" :data="tableList" class="table" size="small"></Table>
        <div class="pagination">
          <div>
            当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
          </div>
          <Page :total="pageInfo.totalCount" :current="pageInfo.currentPage" show-sizer show-elevator
          @on-change="changePageNum" @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
      <div class="setting">
        <Card>
          <p slot="title">分片设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <Input v-model="createParams.blocks" number></Input>
        </Card>
        <Card>
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical v-model="createParams.scheduleMode" class="radiogroup">
            <Radio :label="1">手动</Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 200px;" transfer
                v-model="createParams.scheduleCorn"
              ></DatePicker>
            </Radio>
            <Radio :label="-1">失效</Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
    <div class="btncontainer">
      <Button type="primary" class="button" @click="submitCreateParams">提交</Button>
      <router-link to="OffImport" tag="Button" class="button">取消</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFormatter } from '../../utils/dateFormatter'

export default {
  data () {
    return {
      searchParams: {
        connId: '',
        tables: '',
        pageSize: 10,
        pageNum: 1
      },
      filterForm: {
        connId: '',
        tables: ''
      },
      columns: [
        {
          // type: 'selection',
          align: 'center',
          width: 60,
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                size: 'small',
                value: this.selectAllinPageInfo.selectAll
              },
              on: {
                input: (checked) => {
                  this.selectAllinPageInfo.selectAll = checked
                  if (checked) {
                    this.selectAllinPage()
                  } else {
                    this.clearAllinPage()
                  }
                }
              }
            })
          },
          render: (h, params) => {
            let targetTable = this.tableList.find(el => {
              console.log(params.row.tbName)
              return params.row.tbName === el.tbName
            })
            return h('Checkbox', {
              props: {
                size: 'small',
                value: targetTable.select
              },
              on: {
                input: (checked) => {
                  targetTable.select = checked
                  this.selectTable(checked, params.row)
                }
              }
            })
          }
        },
        {
          type: 'index',
          title: '序号',
          width: 80
        },
        {
          title: '库名',
          key: 'dbName',
          render: (h, params) => {
            return h('div', {}, this.dataSources.find((el) => {
              return el.connId === this.searchParams.connId
            }).dbName)
          }
        },
        {
          title: '表名',
          key: 'tbName'
        },
        {
          title: '总记录数',
          key: 'totalRows',
          sortable: true
        },
        {
          title: '主键字段',
          key: 'priKey'
        }
      ],
      createParams: {
        connId: '',
        tbInfos: [],
        blocks: 0,
        user: '',
        priority: 1,
        scheduleMode: '',
        scheduleCorn: '',
        scheduleState: '',
        exceptTables: [],
        selectAll: false // 按钮全选
      },
      selectAllinPageInfo: {
        selectAll: false
      },
      selectAllinDBInfo: {
        // exceptTables: [],
        selectAll: false // 按钮全选
      },
      exceptTables: []
      /*
      tableList: [
        {
          dbName: 'informix',
          tbName: 'import',
          totalRows: 1000,
          select: false,
          priKey: 'age'
        },
        {
          dbName: 'informix',
          tbName: 'export',
          totalRows: 2000,
          select: false,
          priKey: 'name'
        }
      ]
      */
    }
  },
  computed: {
    ...mapGetters({
      dataSources: 'dataSources',
      tableList: 'sourceTables',
      pageInfo: 'sourceTablePageInfo',
      user: 'user'
    })
  },
  methods: {
    ...mapActions({
      getDataSource: 'getDataSource',
      getTableList: 'getSourceTable',
      createTask: 'createOffImpTask'
    }),
    changeSelectAllinDBStatus (checked) {
      this.selectAllinDBInfo.selectAll = checked
    },
    selectAllinPage () {
      this.createParams.tbInfos = []
      for (let table of this.tableList) {
        table.select = true // 没执行selectTable
        this.selectTable(table.select, table)
      }
    },
    clearAllinPage () {
      for (let table of this.tableList) {
        table.select = false
        this.selectTable(table.select, table)
      }
    },
    selectTable (ischecked, table) {
      if (this.selectAllinDBInfo.selectAll) {
        if (ischecked) {
          // 从exceptTables中去除
          let index = this.exceptTables.indexOf(table.tbName)
          this.exceptTables.splice(index, 1)
        } else {
          // 添加到exceptTables
          this.exceptTables.push(table.tbName)
        }
      } else {
        if (ischecked) {
          debugger
          this.createParams.tbInfos.push(table)
          // 判断是否已经选满
          let checkAllJudge = true
          for (let table of this.tableList) {
            let targetTable = this.createParams.tbInfos.find(el => {
              return el.tbName === table.tbName
            })
            if (!targetTable) {
              checkAllJudge = false
            }
          }
          if (checkAllJudge) {
            this.selectAllinPageInfo.selectAll = true
            // this.selectAllinPage()
          }
        } else {
          let targetTableIndex = -1
          this.createParams.tbInfos.forEach((el, index) => {
            if (el.tbName === table.tbName) {
              targetTableIndex = index
            }
          })
          if (targetTableIndex >= 0) {
            this.createParams.tbInfos.splice(targetTableIndex, 1)
          }
          this.selectAllinPageInfo.selectAll = false
          /*
          this.selectAllinPageInfo.selectAll = false
          this.createParams.tbInfos.forEach((infoTable, index) => {
            let targetTable = this.tableList.find(listTable => {
              return infoTable.tbName === listTable.tbName
            })
            this.selectTable(true, targetTable)
          })
          */
        }
      }
      console.log(this.createParams.tbInfos)
    },
    changeSearchParams () {
      // 清空tbInfos
      this.createParams.tbInfos = []
      for (let prop in this.filterForm) {
        if (this.filterForm.hasOwnProperty(prop)) {
          this.searchParams[prop] = this.filterForm[prop]
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
      this.createParams.selectAll = this.selectAllinDBInfo.selectAll
      this.createParams.exceptTables = this.exceptTables
      console.log('selectAll', this.createParams.selectAll)
      console.log('exceptTables', JSON.stringify(this.createParams.exceptTables))
      console.log('tbInfos', JSON.stringify(this.createParams.tbInfos))
      debugger
      switch (this.createParams.scheduleMode) {
        case 1:
          this.createParams.scheduleState = 0
          this.createParams.scheduleCorn = ''
          break
        case 2:
          this.createParams.scheduleState = 0
          this.createParams.scheduleCorn = dateFormatter(this.createParams.scheduleCorn)
          break
        case -1:
          this.createParams.scheduleState = 1 // 失效
          this.createParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.createTask(this.createParams).then(data => {
        this.$router.push('OffImport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getTableList(newParams).then(data => {
          // this.tableList = data.data // 测试用
          if (this.selectAllinDBInfo.selectAll) {
            this.selectAllinPage()
          } else {
            this.selectAllinPageInfo.selectAll = false
            let checkAllJudge = true
            if (this.createParams.tbInfos.length) {
              for (let table of this.createParams.tbInfos) {
                let targetTable = this.tableList.find(el => {
                  return el.tbName === table.tbName
                })
                debugger
                if (targetTable) {
                  targetTable.select = true
                } else {
                  checkAllJudge = false
                }
              }
            } else {
              checkAllJudge = false
            }
            if (checkAllJudge) {
              this.selectAllinPageInfo.selectAll = true
            }
          }
          this.createParams.connId = this.searchParams.connId
        })
      },
      deep: true
    },
    /*
    selectAllinPageInfo: {
      handler: function (newInfo) {
        if (newInfo.selectAll) {
          this.selectAllinPage()
        } else {
          this.clearAllinPage()
        }
      },
      deep: true
    },
    */
    selectAllinDBInfo: {
      handler: function (newInfo) {
        if (newInfo.selectAll) {
          this.exceptTables = []
          this.selectAllinPageInfo.selectAll = true
          // this.selectAllinPage()
        } else {
          this.exceptTables = []
          this.selectAllinPageInfo.selectAll = false
          // this.clearAllinPage()
        }
      },
      deep: true
    }
  },
  created () {
    this.getDataSource().then(data => {
      this.createParams.user = this.user.name
      this.filterForm.connId = this.dataSources[0].connId
      // 初始化createParams
      this.changeSearchParams()
    })
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 15px 10px;
    background: #f0f0f0;
    display: flex;
  }
  .setting {
    flex-grow: 1;
    text-align: left;
  }
  .btncontainer {
    padding: 30px;
    background: #f0f0f0;
  }
  .button {
    margin-right: 20px;
  }
</style>
