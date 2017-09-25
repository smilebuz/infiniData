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
        <Table border stripe class="table" size="small"
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
          <RadioGroup vertical class="radiogroup"
            v-model="createParams.scheduleMode"
            @on-change="changeScheduleMode">
            <Radio :label="1" class="radiogroup__radio">手动</Radio>
            <div class="radiopicker">
              <Radio :label="2">
                <span>定时</span>
              </Radio>
              <DatePicker type="datetime" size="small" style="width: 200px;" transfer
                v-model="createParams.scheduleCorn"
                :options="scheduleOptions"
                :disabled="disableDatePicker"
              ></DatePicker>
            </div>
            <Radio :label="-1" class="radiogroup__radio">失效</Radio>
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
          type: 'selection',
          align: 'center',
          width: 80
        },
        {
          type: 'index',
          align: 'center',
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
      scheduleOptions: {
        disabledDate (date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      disableDatePicker: true,
      createParams: {
        connId: '',
        tbInfos: [],
        blocks: 0,
        user: '',
        priority: 1,
        scheduleMode: 1,
        scheduleCorn: '',
        scheduleState: '',
        selectAll: false,
        totalCount: 0
      },
      selectAllFlag: false
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
    changeScheduleMode (value) {
      if (value === 2) {
        this.disableDatePicker = false
      } else {
        this.disableDatePicker = true
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
      this.createParams.selectAll = this.selectAllFlag
      this.createParams.totalCount = this.pageInfo.totalCount
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
      // console.log(JSON.stringify(this.createParams.tbInfos))
      this.createTask(this.createParams).then(data => {
        this.$router.push('OffImport')
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
    background: #f0f0f0;
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
</style>