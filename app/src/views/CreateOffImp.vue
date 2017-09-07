<template lang="html">
  <div class="">
    <div class="form">
      <Form ref="searchForm" :model="searchForm" :label-width="labelWidth" id="searchForm" inline>
        <FormItem prop="dataSource" label="任务状态" class="form-item">
          <Select v-model="searchForm.dataSource" placeholder="请选择">
            <Option v-for="(source, index) in searchForm.dataSources" :key="source.connId" :value="source.connId">
              {{ source.dbName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="tbName" label="表名" class="form-item">
          <Input type="text" v-model="searchForm.tbName"></Input>
        </FormItem>
        <FormItem class="form-item">
          <Button type="primary" @click="">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="operation-group">
      <Button type="success" class="operation-item" icon="checkmark" size="small">
        全选
      </Button>
      <Button type="error" class="operation-item" icon="close" size="small">
        清空
      </Button>
    </div>
    <div class="setting-container">
      <div class="table-container">
        <Table border stripe :columns="columns" :data="sourceList" class="table" size="small"></Table>
        <div class="pagination">
          <div class="page-info">
            当前第几页 共几页
          </div>
          <Page :total='100'></Page>
        </div>
      </div>
      <div class="settings">
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
          <RadioGroup vertical v-model="setting.scheduleMode" class="radio-group">
            <Radio label="手动"></Radio>
            <Radio label="定时">
              <span>定时</span>
              <DatePicker type="datetime" size="small" style="width: 120px;"></DatePicker>
            </Radio>
            <Radio label="失效"></Radio>
          </RadioGroup>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
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
          aling: 'center',
          width: 60
        },
        {
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '库名',
          key: 'dbName',
          width: 230
        },
        {
          title: '表名',
          key: 'table_name',
          width: 230
        },
        {
          title: '总记录数',
          key: 'count',
          sortable: true,
          width: 230
        },
        {
          title: '主键字段',
          key: 'pk',
          width: 230
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #searchForm {
    .form-item {
      float: left;
    }
  }
  .operation-group {
    width: 100%;
    overflow: auto;
    padding-top: 1em;
    padding-bottom: 1em;
    background: #f9f9f9;
    .operation-item {
      float: left;
      margin-left: 1em;
      margin-right: .5em;
    }
  }
  .setting-container {
    padding-top: 1em;
    background: #f0f0f0;
    display: flex;
    .table-container {
      .table {
        margin-left: .5em;
        margin-right: .5em;
      }
    }
    .settings {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: .5em;
      .radio-group {
        text-align: left;
      }
    }
  },
  .pagination {
    display: flex;
    justify-content: space-between;
    padding-top: 1em;
    padding-left: .5em;
    padding-right: .5em;
  }
</style>
