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
        <FormItem class="form__item form__item-button">
          <Button type="primary" class="filter__button"
            @click="changeSearchParams"
          >筛选</Button>
        </FormItem>
      </Form>
    </div>
    <!--div class="opgroup">
      <div class="opgroup__item"
        v-for="operation in operations"
        :key="operation.value"
        :style="opStyle(operation)"
        @click="selectAllinDB(operation.selectAll)">
        {{ operation.text }}
      </div>
    </div-->
    <div class="main">
      <div class="createPanel">
        <Table :loading="loadingTable" border stripe class="table" size="small"
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
            :current="pageInfo.pageNum"
            :page-size="pageInfo.pageSize"
            @on-change="changePageNum"
            @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
      <div class="setting">
        <Card>
          <p slot="title">抽取负载</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <div class="inputgroup">
            <span class="inputgroup__label">单线程抽取记录数</span>
            <Input v-model="createParams.blocks" class="inputgroup__input" size="small" number>
              <span slot="append">万</span>
            </Input>
          </div>
        </Card>
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
              <div class="radiopicker__datecontainer">
                <DatePicker class="radiopicker__datecontainer-picker" placeholder="年-月-日" type="date" size="small" style="width: 120px;" transfer
                  v-model="scheduleCornTiming.date"
                  :options="scheduleOptions"
                  :disabled="disableDatePicker"
                ></DatePicker>
                <TimePicker type="time" size="small" style="width: 120px;" placeholder="时:分" transfer
                  v-model="scheduleCornTiming.time"
                  :disabled="disableDatePicker"
                  format="HH:mm"
                  :steps="[1, 5]">
                </TimePicker>
              </div>
            </div>
            <div class="radiopicker radiopicker-vertical">
              <Radio :label="3">每天</Radio>
              <TimePicker transfer type="time" placeholder="时:分" size="small" style="width: 120px;"
                v-model="scheduleCornPeriod"
                :disabled="disableTimePicker"
                :steps="[0, 5]"
                format="HH:mm"
              ></TimePicker>
            </div>
            <!--Radio :label="0" class="radiogroup__radio">失效</Radio-->
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
import { dateFormatter2, timeFormatter } from '../../utils/dateFormatter'

export default {
  data () {
    return {
      searchParams: {
        connId: '',
        tables: '',
        pageSize: 10,
        pageNum: 1,
        type: 'full'
      },
      filterForm: {
        connId: '',
        tables: ''
      },
      operations: [
        {
          value: 'selectall',
          selectAll: true,
          text: '全选',
          bgColor: '#80c58c',
          imgUrl: require('../../assets/images/icon/yes.png')
        },
        {
          value: 'clear',
          selectAll: false,
          text: '清空',
          bgColor: '#e87178',
          imgUrl: require('../../assets/images/icon/no.png')
        }
      ],
      loadingTable: true,
      columns: [
        {
          type: 'selection',
          align: 'center',
          width: 40
        },
        {
          type: 'index',
          title: '序号',
          width: 40
        },
        {
          title: '库名',
          key: 'dbName',
          width: 90,
          render: (h, params) => {
            return h('div', {}, this.dataSources.find((el) => {
              return el.connId === this.searchParams.connId
            }).dbName)
          }
        },
        {
          title: '表名',
          key: 'tbName',
          width: 90
        },
        {
          title: '主键字段',
          key: 'priKey',
          width: 120,
          render: (h, params) => {
            if (params.row.priKey.length > 0) {
              return this.buildPriKeySelect(h, params)
            } else {
              return h('div', {}, '无主键')
            }
          }
        },
        {
          title: '分桶字段',
          key: '',
          width: 120,
          render: (h, params) => {
            return this.buildBucketSelect(h, params)
          }
        },
        {
          title: '分桶数量',
          key: '',
          width: 80,
          render: (h, params) => {
            return this.buildBucketNumInput(h, params)
          }
        }
      ],
      tableParams: [],
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      disableDatePicker: true,
      disableTimePicker: true,
      createParams: {
        connId: '',
        tbInfos: [],
        blocks: 1000,
        user: '',
        priority: 1,
        scheduleMode: 1,
        scheduleCorn: '',
        selectAll: false,
        totalCount: 0
      },
      scheduleCornTiming: {
        date: '',
        time: ''
      },
      scheduleCornPeriod: '',
      // selectAllFlag: false
      selectAllFlag: 0
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
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
      }
    },
    changeScheduleMode (value) {
      switch (value) {
        case 2:
          this.disableDatePicker = false
          this.disableTimePicker = true
          break
        case 3:
          this.disableDatePicker = true
          this.disableTimePicker = false
          break
        default:
          this.disableDatePicker = true
          this.disableTimePicker = true
          break
      }
    },

    buildPriKeySelect (h, params) {
      let targetTable = this.tableParams.find((el) => {
        return el.tbName === params.row.tbName
      })
      return h('Select', {
        props: {
          size: 'small',
          transfer: true,
          multiple: true,
          value: targetTable.priKey
        },
        on: {
          input: (value) => {
            targetTable.prikey = value
          }
        }
      }, this.buildPriKeyOption(h, params.row))
    },
    buildPriKeyOption (h, table) {
      let options = []
      let targetTablePriKey = this.tableList.find((el) => {
        return el.tbName === table.tbName
      }).priKey
      targetTablePriKey.forEach(prikey => {
        let option = h('Option', {
          props: {
            value: prikey
          }
        }, prikey)
        options.push(option)
      })
      return options
    },
    buildBucketSelect (h, params) {
      let targetTable = this.tableParams.find((el) => {
        return el.tbName === params.row.tbName
      })
      return h('Select', {
        props: {
          size: 'small',
          transfer: true,
          value: targetTable.bucketField
        },
        on: {
          input: (value) => {
            targetTable.bucketField = value
          }
        }
      }, this.buildBucketOption(h, params.row))
    },
    buildBucketOption (h, table) {
      let options = []
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
    buildBucketNumInput (h, params) {
      let targetTable = this.tableParams.find((el) => {
        return el.tbName === params.row.tbName
      })
      return h('div', [
        h('InputNumber', {
          props: {
            size: 'small',
            transfer: true,
            min: 1,
            value: targetTable.bucketNum
          },
          style: {
            width: '60px'
          },
          on: {
            input: (value) => {
              if (value) {
                targetTable.bucketNum = value
              }
            }
          }
        }, ''),
        h('span', {
          style: {
            paddingLeft: '5px'
          }
        }, '个')
      ])
    },

    selectAllinDB (selected) {
      // this.selectAllFlag = selected
      this.tableList.forEach(table => {
        table._checked = selected
        table._disabled = selected
      })
      if (selected) {
        this.selectAllFlag = 1
      } else {
        this.selectAllFlag = 2
        this.createParams.tbInfos = []
        this.loadingTable = true
        this.getTableList(this.searchParams).then(data => {
          this.loadingTable = false
          this.createParams.connId = this.searchParams.connId
        })
      }
    },
    selectTable (selection) {
      this.selectAllFlag = 0
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

      this.createParams.selectAll = this.selectAllFlag === 1
      this.createParams.totalCount = this.pageInfo.totalCount
      this.createParams.blocks *= 10000
      this.createParams.tbInfos.forEach(info => {
        info.priKey = info.priKey.join(',')
      })
      switch (this.createParams.scheduleMode) {
        case 2:
          if (!this.scheduleCornTiming.date || !this.scheduleCornTiming.time) {
            // 未选择时间
            this.$Message.warning({
              content: '请选择调度的时间',
              top: 50,
              duration: 1.5
            })
            return
          } else {
            this.createParams.scheduleCorn = dateFormatter2(this.scheduleCornTiming.date) + ' ' + timeFormatter(this.scheduleCornTiming.time)
          }
          break
        case 3:
          if (!this.scheduleCornPeriod) {
            // 未选择时间
            this.$Message.warning({
              content: '请选择调度的时间',
              top: 50,
              duration: 1.5
            })
            return
          } else {
            this.createParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          }
          break
        default:
          this.createParams.scheduleCorn = ''
          break
      }
      if (!this.createParams.selectAll && !this.createParams.tbInfos.length) {
        // 未选择表
        this.$Message.warning({
          content: '尚未选择表',
          top: 50,
          duration: 1.5
        })
        return
      }
      this.createTask(this.createParams).then(data => {
        this.$router.push('OffImport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.loadingTable = true
        this.getTableList(newParams).then(data => {
          this.loadingTable = false
          this.createParams.connId = this.searchParams.connId
          if (this.selectAllFlag !== 0) {
            this.selectAllinDB(this.selectAllFlag === 1)
          }
          this.tableList.forEach(table => {
            let targetTable = this.createParams.tbInfos.find(el => {
              return el.tbName === table.tbName
            })
            if (targetTable) {
              table._checked = true
              this.tableParams.push({
                tbName: table.tbName,
                priKey: table.priKey,
                bucketField: table.bucketField,
                bucketNum: table.bucketNum
              })
            } else {
              this.tableParams.push({tbName: table.tbName, priKey: [], bucketField: '', bucketNum: 1})
            }
          })
        })
      },
      deep: true
    }
  },
  created () {
    this.getDataSource().then(data => {
      this.createParams.user = this.user.userName
      this.filterForm.connId = this.dataSources[0].connId
      this.changeSearchParams()
    })
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 15px 10px;
    // background: #f0f0f0;
    background: #f9f9f9;
    display: flex;
  }
  .setting {
    text-align: left;
  }
  .btncontainer {
    padding: 30px;
    background: #f0f0f0;
  }
  .button {
    margin-right: 20px;
  }
  .inputgroup {
    display: flex;
    align-items: center;
    font-size: 12px;
    .inputgroup__label {
      padding-right: 5px;
    }
    .inputgroup__input {
      width: 40%;
    }
  }
</style>