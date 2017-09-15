<template lang="html">
  <div class="createIncImp">
    <div class="form-inline">
      <Form ref="filterForm" :model="filterForm" :label-width="80" id="filterForm" inline>
        <FormItem prop="dataSource" label="数据源" class="form__item">
          <Select v-model="filterForm.dataSource" placeholder="请选择">
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
        <Table border stripe :columns="columns" :data="sourceTables" class="table" size="small"></Table>
      </div>
      <div class="setting">
        <Card>
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical v-model="setting.scheduleMode" class="radiogroup">
            <Radio label="手动"></Radio>
            <Radio label="定时">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 120px;"></DatePicker>
            </Radio>
            <Radio label="周期">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 120px;"></DatePicker>
            </Radio>
            <Radio label="失效"></Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
    <div class="btncontainer">
      <Button type="primary" class="button" @click="createTask">提交</Button>
      <router-link to="IncImport" tag="Button" class="button">取消</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        conn_id: -1,
        tables: '',
        pageSize: 10,
        pageNum: 1
      },
      filterForm: {
        dataSource: -1, // connId
        tbName: ''
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
          title: '主键字段',
          key: 'pk'
        },
        {
          title: '增量字段',
          key: '',
          render: (h, params) => {
            return this.buildSelects(h, params)
          }
        },
        {
          title: '增量条件',
          key: ''
        }
      ],
      sourceTables: [
        {
          dbName: 'Informix',
          count: 3000,
          pk: 'ID',
          table_name: 'export'
        },
        {
          dbName: 'Informix',
          count: 4000,
          pk: 'ID',
          table_name: 'export'
        }
      ],
      setting: {
        scheduleMode: 0,
        scheduleDate: '',
        scheduleState: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'user', 'dataSources'// , 'sourceTables'
    ])
  },
  methods: {
    ...mapActions([
      'getDataSource', 'getSourceTable'
    ]),
    changeSearchParams () {
      this.searchParams.conn_id = this.filterForm.dataSource
      this.searchParams.tables = this.filterForm.tbName
    },
    buildSelects (h, params) {
      return h('Select', {
        props: {
          size: 'small'
        }
      }, this.buildOptions(h, params.row))
    },
    buildOptions (h, table) {
      /*
      let params = {
        conn_id: this.searchParams.conn_id,
        tables: '' // 所有表
      }
      */
      let options = [
        h('Option', {
          props: {
            value: '1'
          }
        }, 'aaa'),
        h('Option', {
          props: {
            value: '2'
          }
        }, 'bbb')
      ]
      return options
    },
    createTask () {

    }
  },
  watch: {
    searchParams: {
      hander: function () {
        this.getSourceTable()
      },
      deep: true
    }
  },
  mounted () {
    this.getDataSource().then(data => {
      this.filterForm.conn_id = this.dataSources[0].connId
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
