<template lang="html">
  <div class="createOffImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="dataSource" label="数据源" class="form__item">
          <Select v-model="filterForm.dataSource" placeholder="请选择" style="width: 120px;">
            <Option v-for="(source, index) in dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="filterForm.tbName"></Input>
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
        <Table border stripe :columns="columns" :data="sourceTables" class="table" size="small" @on-selection-change="selectTable"></Table>
        <!--div class="pagination">
          <div>
            当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
          </div>
          <Page :total="pageInfo.totalCount" :current="pageInfo.currentPage" show-sizer show-elevator
          @on-change="changePageNum" @on-page-size-change="changePageSize"></Page>
        </div-->
      </div>
      <div class="setting">
        <Card>
          <p slot="title">分片设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <Input v-model="setting.blocks" number></Input>
        </Card>
        <Card>
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical v-model="setting.scheduleMode" class="radiogroup">
            <Radio :label="1">手动</Radio>
            <Radio :label="2">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 200px;" :transfer="true"></DatePicker>
            </Radio>
            <Radio :label="-1">失效</Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
    <div class="btncontainer">
      <Button type="primary" class="button" @click="createTask">提交</Button>
      <router-link to="OffImport" tag="Button" class="button">取消</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      filterForm: {
        dataSource: '',
        tbName: ''
      },
      searchParams: {
        dataSource: '',
        tbName: '',
        pageSize: 10,
        pageNum: 1
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
          key: 'table_name'
        },
        {
          title: '总记录数',
          key: 'count',
          sortable: true
        },
        {
          title: '主键字段',
          key: 'pk'
        }
      ],
      selectTables: [],
      setting: {
        blocks: 0,
        scheduleMode: 0,
        scheduleCorn: '',
        scheduleState: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'user', 'dataSources', 'sourceTables'
    ])
  },
  methods: {
    ...mapActions([
      'getDataSource', 'getSourceTable', 'createOffImpTask'
    ]),
    search () {
      this.getSourceTable(this.searchParams)
    },
    selectTable (selection) {
      this.selectTables = [...selection]
    },
    changeSearchParams () {
      this.searchParams.dataSource = this.filterForm.dataSource
      this.searchParams.tbName = this.filterForm.tbName
    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    },
    createTask () {
      if (this.setting.scheduleMode === -1) {
        this.setting.scheduleState = 1
      }
      let params = {
        connId: -1,
        tbInfos: this.selectTables,
        user: this.user.name,
        blocks: this.setting.blocks,
        priority: -1,
        scheduleMode: this.setting.scheduleMode,
        scheduleCorn: this.setting.scheduleCorn,
        scheduleState: this.setting.scheduleState
      }
      this.createOffImpTask(params).then(data => {
        this.$router.push('OffImport')
      })
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.search()
      },
      deep: true
    }
  },
  mounted () {
    this.getDataSource().then(data => {
      this.filterForm.dataSource = this.dataSources[0]
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
