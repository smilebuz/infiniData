<template lang="html">
  <div class="createOffImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="connId" label="数据源" class="form__item">
          <Select v-model="filterForm.connId" placeholder="请选择">
            <Option v-for="(source, index) in dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tables"></Input>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="changeSearchParams">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="opbuttons">
      <Button type="success" class="opbutton" icon="checkmark" size="small"
        @click="selectAllinDB(true)">
        全选
      </Button>
      <Button type="error" class="opbutton" icon="close" size="small"
        @click="selectAllinDB(false)">
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
          <p slot="title">导出目标</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical class="radiogroup" v-model="createParams.type">
            <Radio :label="1">CSV</Radio>
            <div class="setting__group">
              <span class="setting__group-label">编码</span>
              <Select class="setting__group-select">
              </Select>
            </div>
            <div class="setting__group">
              <span class="setting__group-label">分隔符</span>
              <Select class="setting__group-select">
              </Select>
            </div>
            <Radio :label="2">数据库</Radio>
            <div class="setting__group">
              <span class="setting__group-label">数据源</span>
              <Select class="setting__group-select">
              </Select>
            </div>
          </RadioGroup>
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
              <DatePicker type="datetime" size="small" style="width: 200px;" transfer v-model="scheduleCornTiming"></DatePicker>
            </Radio>
            <Radio :label="3">
              <span>周期</span>
              <TimePicker size="small" style="width: 120px;" transfer v-model="scheduleCornPeriod"></TimePicker>
            </Radio>
            <Radio :label="-1">失效</Radio>
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
          align: 'center',
          title: '序号'
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
          title: '总记录数',
          key: 'count',
          sortable: true
        },
        {
          title: '存储类型',
          key: ''
        },
        {
          title: '描述',
          key: ''
        }
      ],
      createParams: {
        type: '',
        connId: '',
        user: '',
        tbInfos: [],
        scheduleMode: 0,
        scheduleState: '',
        scheduleCorn: '',
        selectAll: false
      },
      selectAllFlag: false,
      scheduleCornTiming: '',
      scheduleCornPeriod: ''
    }
  },
  computed: {
    ...mapGetters({
      dataSources: 'dataSources',
      tableList: 'sourceTables',
      pageInfo: 'sourcePageInfo',
      user: 'user'
    })
  },
  methods: {
    ...mapActions({
      getDataSource: 'getDataSource',
      getTableList: 'getSourceTable',
      createTask: 'createOffExpTask'
    }),
    selectAllinDB (selected) {
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
      for (let table of this.tableList) {
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
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    },
    submitCreateParams () {
      this.createParams.selectAll = this.selectAllFlag
      switch (this.createParams.scheduleMode) {
        case 1:
          this.createParams.scheduleState = 0
          this.editParams.scheduleCorn = ''
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
        this.$router.push('OffExport')
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
            if (this.selectedTbNames.indexOf(table.tbName) >= 0) {
              table._checked = true
            }
          })
        })
      },
      deep: true
    }
  },
  mounted () {
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
  .radiogroup {
    width: 100%;
  }
  .setting__group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .setting__group-label {
    margin-left: 20px;
    min-width: 30px;
  }
  .setting__group-select {
    // max-width: 120px;
  }
  .btncontainer {
    padding: 30px;
    background: #f0f0f0;
  }
  .button {
    margin-right: 20px;
  }
</style>
