<template lang="html">
  <div class="createOffImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="pdbId" label="平台数据源" class="form__item">
          <Select v-model="filterForm.pdbId" placeholder="请选择" style="width:120px;">
            <Option v-for="(pdb, index) in pdbList" :key="pdb.pdbId" :value="pdb.pdbId">
              {{ pdb.pdbName }}
            </Option>
          </Select>
        </FormItem>
        <!--FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tables"></Input>
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
        @click="selectAllinDB(operation.selectAll)">
        {{ operation.text }}
      </div>
    </div>
    <div class="main">
      <div class="createPanel">
        <Table border stripe class="table" size="small"
          :columns="columns"
          :data="pdbTBList"
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
            @on-page-size-change="changePageSize"
          ></Page>
        </div>
      </div>
      <div class="setting">
        <Card>
          <p slot="title">导出目标</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical class="radiogroup"
            v-model="createParams.type"
            @on-change="changeType">
            <Radio :label="1">CSV</Radio>
            <!--div class="setting__group">
              <span class="setting__group-label">编码</span>
              <Select class="setting__group-select" size="small"
                :disabled="disableEncodingSelect">
              </Select>
            </div>
            <div class="setting__group">
              <span class="setting__group-label">分隔符</span>
              <Select class="setting__group-select" size="small"
                :disabled="disableSeperatorSelect">
              </Select>
            </div-->
            <Radio :label="2">数据库</Radio>
            <div class="setting__group">
              <span class="setting__group-label">数据源</span>
              <Select class="setting__group-select" size="small"
                :disabled="disableSourceSelect"
                @on-change="changeExportDB">
                <Option v-for="(source, index) in dataSources"
                  :key="source.connId"
                  :value="source.connId">
                  {{ source.dbName }}
                </Option>
              </Select>
            </div>
          </RadioGroup>
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
                <DatePicker class="radiopicker__datecontainer-picker" type="date" size="small" style="width: 120px;" transfer
                  v-model="scheduleCornTiming.date"
                  :options="scheduleOptions"
                  :disabled="disableDatePicker"
                ></DatePicker>
                <TimePicker class="radiopicker__datecontainer-picker" transfer type="time" size="small" style="width: 120px;"
                  v-model="scheduleCornTiming.time"
                  :disabled="disableDatePicker"
                  :steps="[0, 5]"
                  format="HH:mm"
                ></TimePicker>
              </div>
            </div>
            <div class="radiopicker radiopicker-vertical">
              <Radio :label="3">周期</Radio>
              <TimePicker size="small" style="width: 120px;" transfer
                v-model="scheduleCornPeriod"
                :disabled="disableTimePicker"
                :steps="[0, 5]"
                format="HH:mm"
              ></TimePicker>
            </div>
            <Radio :label="0" class="radiogroup__radio">失效</Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
    <div class="btncontainer">
      <Button type="primary" class="button" @click="submitCreateParams">提交</Button>
      <router-link to="OffExport" tag="Button" class="button">取消</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { dateFormatter2, timeFormatter } from '../../utils/dateFormatter'

export default {
  data () {
    return {
      searchParams: {
        pdbId: ''
      },
      filterForm: {
        pdbId: '',
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
      columns: [
        {
          type: 'selection',
          aling: 'center',
          width: 60
        },
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '平台库名',
          key: 'dbName',
          width: 90,
          render: (h, params) => {
            return h('div', {}, this.pdbList.find((el) => {
              return el.pdbId === this.searchParams.pdbId
            }).pdbName)
          }
        },
        {
          title: '表名',
          key: 'tbName',
          width: 90
        },
        {
          title: '总记录数',
          key: 'totalRows',
          width: 90,
          sortable: true
        }
      ],
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      disableEncodingSelect: true,
      disableSeperatorSelect: true,
      disableSourceSelect: true,
      disableDatePicker: true,
      disableTimePicker: true,
      createParams: {
        type: 1,
        pdbName: '',
        pdbId: '',
        connId: '',
        user: '',
        tbInfos: [],
        scheduleMode: 1,
        scheduleCorn: '',
        selectAll: false,
        totalCount: 0
      },
      selectAllFlag: false,
      scheduleCornTiming: {
        date: '',
        time: ''
      },
      scheduleCornPeriod: '',
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: -1,
        totalPage: -1
      }
    }
  },
  computed: {
    ...mapGetters({
      dataSources: 'dataSources',
      tableList: 'sourceTables',
      // pageInfo: 'sourceTablePageInfo',
      user: 'user',
      pdbList: 'dbList',
      tbList: 'tbList'
      // pdbTBList: 'tbList'
    }),
    // 分页
    pdbTBList: function () {
      if (this.pageInfo.pageNum * this.pageInfo.pageSize >= this.pageInfo.totalCount) {
        // 当前页为最后一页
        return this.tbList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize
        })
      } else {
        // 当前页不是最后一页
        return this.tbList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize &&
            (index + 1) <= this.pageInfo.pageNum * this.pageInfo.pageSize
        })
      }
    }
  },
  methods: {
    ...mapActions({
      getDataSource: 'getDataSource',
      getTableList: 'getSourceTable',
      createTask: 'createOffExpTask',
      getPDBList: 'getDBList',
      getPDBTBList: 'getTBList'
    }),
    opStyle (op) {
      return {
        background: 'url(' + op.imgUrl + ') no-repeat 5px center ' + op.bgColor,
        paddingLeft: '25px',
        paddingRight: '5px',
        marginLeft: '20px'
      }
    },
    changeType (value) {
      if (value === 1) {
        this.disableEncodingSelect = false
        this.disableSeperatorSelect = false
        this.disableSourceSelect = true
      } else {
        this.disableEncodingSelect = true
        this.disableSeperatorSelect = true
        this.disableSourceSelect = false
      }
    },
    changeExportDB (value) {
      this.createParams.connId = value
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

    selectAllinDB (selected) {
      this.selectAllFlag = selected
      this.tbList.forEach(table => {
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
      for (let table of this.tbList) {
        let targetTable = selection.find(el => {
          return el.tbName === table.tbName
        })
        if (!targetTable) {
          unSelection.push(table)
        }
      }

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
      this.pageInfo.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.pageInfo.pageSize = pageSize
    },
    submitCreateParams () {
      this.createParams.selectAll = this.selectAllFlag
      // this.createParams.totalCount = this.pageInfo.totalCount
      switch (this.createParams.scheduleMode) {
        case 1:
          this.createParams.scheduleCorn = ''
          break
        case 2:
          this.createParams.scheduleCorn = dateFormatter2(this.scheduleCornTiming.date) + ' ' + timeFormatter(this.scheduleCornTiming.time)
          break
        case 3:
          this.createParams.scheduleCorn = timeFormatter(this.scheduleCornPeriod)
          break
        case 0:
          // 失效
          this.createParams.scheduleCorn = ''
          break
        default:
          break
      }
      this.createTask(this.createParams).then(data => {
        this.$router.push('OffExport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getPDBTBList(newParams).then(data => {
          /*
          this.createParams.connId = this.searchParams.connId
          this.createParams.dbName = this.dataSources.find(el => {
            return this.createParams.connId === el.connId
          }).dbName
          */
          this.pageInfo.totalCount = this.tbList.length
          this.pageInfo.totalPage = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize)

          this.createParams.pdbId = this.searchParams.pdbId
          this.createParams.pdbName = this.pdbList.find(el => {
            return this.createParams.pdbId === el.pdbId
          }).pdbName
          /*
          this.selectAllinDB(this.selectAllFlag)
          this.pdbTBList.forEach(table => {
            this.pdbTBList.forEach(table => {
              let targetTable = this.createParams.tbInfos.find(el => {
                return el.tbName === table.tbName
              })
              if (targetTable) {
                table._checked = true
              }
            })
          })
          */
        })
      },
      deep: true
    },
    pageInfo: {
      handler: function (newInfo) {
        this.selectAllinDB(this.selectAllFlag)
        this.pdbTBList.forEach(table => {
          this.pdbTBList.forEach(table => {
            let targetTable = this.createParams.tbInfos.find(el => {
              return el.tbName === table.tbName
            })
            if (targetTable) {
              table._checked = true
            }
          })
        })
      },
      deep: true
    }
  },
  mounted () {
    this.getPDBList().then(data => {
      this.filterForm.pdbId = this.pdbList[0].pdbId
      this.changeSearchParams()
    })
    this.getDataSource().then(data => {
      this.createParams.user = this.user.userName
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
  .radiogroup {
    width: 100%;
  }
  .setting__group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
  }
  .setting__group-label {
    margin-left: 20px;
    min-width: 50px;
  }
  .setting__group-select {
    max-width: 180px;
  }
  .btncontainer {
    padding: 30px;
    background: #f0f0f0;
  }
  .button {
    margin-right: 20px;
  }
</style>