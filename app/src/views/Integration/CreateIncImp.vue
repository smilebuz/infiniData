<template lang="html">
  <div class="createIncImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="connId" label="数据源" class="form__item">
          <Select v-model="filterForm.connId" placeholder="请选择" style="width:120px;">
            <Option v-for="(source, index) in dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tables" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tables"></Input>
        </FormItem>
        <FormItem class="form__item form__item-button">
          <Button type="primary" @click="changeSearchParams">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="main">
      <div class="createPanel">
        <Table class="table" size="small" border stripe
          :columns="columns"
          :data="tableList"
          @on-selection-change="selectTable"
        ></Table>
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
      <div class="setting">
        <Card>
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical class="radiogroup"
            v-model="createParams.scheduleMode"
            @on-change="changeScheduleMode">
            <Radio :label="1" class="radiogroup__radio">手动</Radio>
            <div class="radiopicker">
              <Radio :label="2">定时</Radio>
              <DatePicker transfer type="datetime" size="small" style="width: 200px;"
                v-model="scheduleCornTiming"
                :options="scheduleOptions"
                :disabled="disableSettingDatePicker"
              ></DatePicker>
            </div>
            <div class="radiopicker">
              <Radio :label="3">周期</Radio>
              <TimePicker transfer size="small" style="width: 120px;"
                v-model="scheduleCornPeriod"
                :disabled="disableSettingTimePicker"
              ></TimePicker>
            </div>
            <Radio :label="-1" class="radiogroup__radio">无效</Radio>
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
import { dateFormatter, dateFormatter2, timeFormatter } from '../../utils/dateFormatter'

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
          align: 'center',
          width: 60,
          fixed: 'left'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          fixed: 'left'
        },
        {
          title: '库名',
          key: 'dbName',
          width: 120,
          render: (h, params) => {
            return h('div', {}, this.dataSources.find((el) => {
              return el.connId === this.searchParams.connId
            }).dbName)
          }
        },
        {
          title: '表名',
          width: 120,
          key: 'tbName'
        },
        {
          title: '主键字段',
          width: 140,
          key: 'priKey'
        },
        {
          title: '增量字段',
          key: '',
          width: 180,
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
      tableParams: [],
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      disableSettingDatePicker: true,
      disableSettingTimePicker: true,
      disableTableDatePicker: false,
      createParams: {
        connId: '',
        tbInfos: [],
        user: '',
        scheduleMode: 1,
        scheduleCorn: '',
        scheduleState: '',
        selectAll: false
      },
      selectAllFlag: false,
      scheduleCornTiming: '',
      scheduleCornPeriod: '',
      selectValue: ''
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
      createTask: 'createIncImpTask'
    }),
    buildIncFiledSelect (h, params) {
      let targetTable = this.tableParams.find((el) => {
        return el.tbName === params.row.tbName
      })
      return h('Select', {
        props: {
          size: 'small',
          value: targetTable.incField
        },
        on: {
          input: (value) => {
            targetTable.incField = value
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
      let targetTable = this.tableParams.find((el) => {
        return el.tbName === params.row.tbName
      })
      return h('div', {}, [
        h('DatePicker', {
          props: {
            size: 'small',
            transfer: true,
            placeholder: 'null',
            disabled: this.disableTableDatePicker,
            value: targetTable.condition1
          },
          style: {
            width: '160px'
          },
          on: {
            input: (value) => {
              if (value) {
                targetTable.condition1 = dateFormatter2(value)
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
            transfer: true,
            placeholder: 'null',
            disabled: this.disableTableDatePicker,
            value: targetTable.condition2
          },
          style: {
            width: '160px'
          },
          on: {
            input: (value) => {
              if (value) {
                targetTable.condition2 = dateFormatter2(value)
              }
            }
          }
        })
      ])
    },
    changeScheduleMode (value) {
      switch (value) {
        case 2:
          this.disableSettingDatePicker = false
          this.disableSettingTimePicker = true
          break
        case 3:
          this.disableSettingDatePicker = true
          this.disableSettingTimePicker = false
          break
        default:
          this.disableSettingDatePicker = true
          this.disableSettingTimePicker = true
          break
      }
    },
    selectAllinDB (selected) {
      // this.createParams.tbInfos = []
      this.selectAllFlag = selected
      this.tableList.forEach(table => {
        table._checked = selected
        table._disabled = selected
      })
    },
    selectTable (selection) {
      selection.forEach(table => {
        let targetTable = this.createParams.tbInfos.find(el => {
          return el.tbName === table.tbName
        })
        if (!targetTable) {
          this.createParams.tbInfos.push(table)
        }
      })

      let unSelection = []
      this.tableList.forEach(table => {
        let targetTable = selection.find(el => {
          return el.tbName === table.tbName
        })
        if (!targetTable) {
          unSelection.push(table)
        }
      })

      unSelection.forEach(table => {
        this.createParams.tbInfos = this.createParams.tbInfos.filter(el => {
          return el.tbName !== table.tbName
        })
      })
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
      }
      this.createParams.selectAll = this.selectAllFlag
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
      console.log(JSON.stringify(this.createParams.tbInfos))
      this.createTask(this.createParams).then(data => {
        this.$router.push('IncImport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getTableList(newParams).then(data => {
          this.createParams.connId = this.searchParams.connId
          this.selectAllinDB(this.selectAllFlag)
          this.tableList.forEach(table => {
            let targetTable = this.createParams.tbInfos.find(el => {
              return el.tbName === table.tbName
            })
            if (targetTable) {
              table._checked = true
              this.tableParams.push(
                {
                  tbName: table.tbName,
                  incField: table.incField,
                  condition1: table.condition1,
                  condition2: table.contidition2
                }
              )
            } else {
              this.tableParams.push({tbName: table.tbName, incField: '', condition1: '', condition2: ''})
            }
          })
        })
      },
      deep: true
    },
    createParams: {
      handler: function (newParams) {
        if (newParams.scheduleMode === 3) {
          this.disableTableDatePicker = true
        } else {
          this.disableTableDatePicker = false
        }
      },
      deep: true
    }
  },
  created () {
    this.getDataSource().then(data => {
      this.createParams.user = this.user.userName
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
