<template lang="html">
  <div class="createIncImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="connId" label="数据源" class="form__item">
          <Select v-model="filterForm.connId" placeholder="请选择">
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
      <Button type="success" class="opbutton" icon="checkmark" size="small">
        全选
      </Button>
      <Button type="error" class="opbutton" icon="close" size="small">
        清空
      </Button>
    </div>
    <div class="main">
      <div class="createPanel">
        <Table border stripe :columns="columns" :data="tableList" class="table" size="small" @on-selection-change="selectTable"></Table>
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
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical v-model="createParams.scheduleMode" class="radiogroup">
            <Radio :label="1">手动</Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 200px;" v-model="scheduleCornTiming" transfer></DatePicker>
            </Radio>
            <Radio :label="3">
              <span>周期</span>
              <TimePicker size="small" style="width: 120px;" v-model="scheduleCornPeriod"></TimePicker>
            </Radio>
            <Radio :label="-1">无效</Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
    <div class="btncontainer">
      <Button type="primary" class="button" @click="submitCreateParams">提交</Button>
      <router-link to="IncImport" tag="Button" class="button">取消</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFormatter, timeFormatter } from '../../utils/dateFormatter'

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
          type: 'selection',
          aling: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 80
        },
        {
          title: '库名',
          key: 'dbName'
        },
        {
          title: '表名',
          key: 'tbName'
        },
        {
          title: '主键字段',
          key: 'priKey'
        },
        {
          title: '增量字段',
          key: '',
          render: (h, params) => {
            return this.buildIncFiledSelect(h, params)
          }
        },
        {
          title: '增量条件',
          key: '',
          width: 380,
          render: (h, params) => {
            return this.buildConditionSelect(h, params)
          }
        }
      ],
      tableList: [
        {
          totalRows: 3000,
          priKey: 'ID',
          tbName: 'export',
          fields: ['name', 'id']
        },
        {
          totalRows: 4000,
          priKey: 'ID',
          tbName: 'import',
          fields: ['age', 'sex']
        }
      ],
      tableParams: [],
      createParams: {
        connId: '',
        tbInfos: [],
        user: '',
        scheduleMode: '',
        scheduleCorn: '',
        scheduleState: ''
      },
      scheduleCornTiming: '',
      scheduleCornPeriod: ''
    }
  },
  computed: {
    ...mapGetters({
      dataSources: 'dataSources',
      // tableList: 'sourceTables',
      pageInfo: 'sourcePageInfo',
      user: 'user'
    })
  },
  methods: {
    ...mapActions({
      getDataSource: 'getDataSource',
      getTableList: 'getSourceTable',
      createTask: 'createIncImpTask'
    }),
    buildIncFiledSelect (h, params) {
      // let self = this
      return h('Select', {
        props: {
          size: 'small'
        },
        on: {
          input: (value) => {
            let targetTable = this.tableParams.find((el) => {
              return el.tbName === params.row.tbName
            })
            targetTable.incField = value
            // params.row.incField = value
            /*
            let targetTable = this.tableList.find((el) => {
              return el.tbName === params.row.tbName
            })
            targetTable.incField = value // 问题 每次改变tableList中的值 就会重新渲染表
            */
          }
        }
      }, this.buildIncFieldOption(h, params.row))
    },
    buildIncFieldOption (h, table) {
      let options = []
      // 真逻辑!!!
      let targetTableFields = this.tableList.find((el) => {
        return el.tbName === table.tbName
      }).fields
      targetTableFields.forEach(field => {
        let option = h('Option', {
          props: {
            value: field
          }
        }, field)
        options.push(option)
      })
      return options
    },
    buildConditionSelect (h, params) {
      return h('div', {}, [
        h('DatePicker', {
          props: {
            size: 'small',
            type: 'datetime',
            transer: true,
            placeholder: 'null'
          },
          style: {
            width: '160px'
          },
          on: {
            input: (value) => {
              if (value) {
                let targetTable = this.tableParams.find((el) => {
                  return el.tbName === params.row.tbName
                })
                targetTable.condition1 = dateFormatter(value)
              }
            }
          }
        }),
        h('span', {
          style: {
            marginLeft: '5px',
            marginRight: '5px'
          }
        }, '至'),
        h('DatePicker', {
          props: {
            size: 'small',
            type: 'datetime',
            transer: true,
            placeholder: 'null'
          },
          style: {
            width: '160px'
          },
          on: {
            input: (value) => {
              if (value) {
                let targetTable = this.tableParams.find((el) => {
                  return el.tbName === params.row.tbName
                })
                targetTable.condition2 = dateFormatter(value)
              }
            }
          }
        })
      ])
    },
    selectTable (selection) {
      this.createParams.tbInfos = [...selection]
    },
    changeSearchParams () {
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
      for (let table of this.createParams.tbInfos) {
        let targetTable = this.tableParams.find((el) => {
          return el.tbName === table.tbName
        })
        for (let prop in targetTable) {
          if (targetTable.hasOwnProperty(prop)) {
            table[prop] = targetTable[prop]
          }
        }
        /*
        table.incField = targetTable.incField
        table.condition1 = targetTable.condition1
        table.condition2 = targetTable.condition2
        */
      }
      switch (this.createParams.scheduleMode) {
        case 1:
          this.createParams.scheduleState = 0
          this.createParams.scheduleCorn = ''
          break
        case 2:
          this.createParams.scheduleState = 0
          this.createParams.scheduleCorn = dateFormatter(this.scheduleCornTiming)
          break
        case 3:
          this.createParams.scheduleState = 0
          this.createParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          break
        case -1:
          this.createParams.scheduleState = 1 // 失效
          this.createParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.createTask(this.createParams).then(data => {
        this.$router.push('IncImport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getTableList(newParams).then(data => {
          // 填充tableParams
          for (let table of this.tableList) {
            this.tableParams.push({tbName: table.tbName, incField: '', condition1: '', condition2: ''})
          }
        })
      },
      deep: true
    },
    createParams: {
      handler: function (newParams) {
        if (newParams.scheduleMode === 2) {
          alert(newParams.scheduleMode)
        }
      },
      deep: true
    }
  },
  mounted () {
    // 测试用 调试时取消
    for (let table of this.tableList) {
      this.tableParams.push({tbName: table.tbName, incField: '', condition1: '', condition2: ''})
    }
    // 保留
    this.getDataSource().then(data => {
      this.createParams.user = this.user.name
      this.filterForm.connId = data.dataSources[0].connId
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
