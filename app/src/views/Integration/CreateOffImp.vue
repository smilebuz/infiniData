<template lang="html">
  <div class="createOffImp">
    <div class="form-inline">
      <Form ref="searchForm" :model="searchForm" :label-width="labelWidth" id="searchForm" inline>
        <FormItem prop="dataSource" label="数据源" class="form__item">
          <Select v-model="searchForm.dataSource" placeholder="请选择">
            <Option v-for="(source, index) in searchForm.dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tbName" label="表名" class="form__item">
          <Input type="text" v-model="searchForm.tbName"></Input>
        </FormItem>
        <FormItem class="form__item">
          <Button type="primary" @click="">查询</Button>
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
        <Table border stripe :columns="columns" :data="sourceList" class="table" size="small"></Table>
        <div class="pagination">
          <div>
            当前第{{ pageInfo.currentPage }}页 共{{ pageInfo.totalPage }}页
          </div>
          <Page :total='100'></Page>
        </div>
      </div>
      <div class="setting">
        <Card>
          <p slot="title">分片设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <Input v-model="setting.blocks"></Input>
        </Card>
        <Card>
          <p slot="title">调度设置</p>
          <p slot="extra">
            <Icon type="gear-b"></Icon>
          </p>
          <RadioGroup vertical v-model="setting.scheduleMode" class="radiogroup">
            <Radio label="手动"></Radio>
            <Radio label="定时">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 200px;" :transfer="true"></DatePicker>
            </Radio>
            <Radio label="失效"></Radio>
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
import { Api } from '../../api/Api'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      searchForm: {
        dataSource: '',
        dataSources: [
          {
            'dbName': '社保库',
            'connId': '1234'
          },
          {
            'dbName': '人保库',
            'connId': '2345'
          }
        ],
        tbName: ''
      },
      labelWidth: 80,
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
      sourceList: [
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
        blocks: 0,
        scheduleMode: 0,
        scheduleDate: '',
        scheduleState: ''
      },
      pageInfo: {
        currentPage: 1,
        totalPage: 17,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    createTask () {
      alert(this.user.name)
      let params = {}
      Api.createFull.post(params).then(data => {
        this.$router.push('OffImport')
      })
    }
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
