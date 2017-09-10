<template lang="html">
  <div class="handle">
    <div class="side">
      <div class="dbSelect">
        <Select style="width: 140px;" size="small">
          <Option v-for="(db, index) in dbs" :key="db.id" :value="db.pdbName">
            {{ db.pdbName }}
          </Option>
        </Select>
        <Button type="text" shape="circle" icon="refresh"></Button>
      </div>
      <Tree :data="tables" class="tree"></Tree>
      <div class="radios">
        <div class="radio-div" v-for="(value, key) in radios" :key="key" :style="radioChecked(value.checked)" @click="checkTBInfo(key)">
          {{ value.label }}
        </div>
      </div>
      <div class="tbInfo" v-show="radios.fields.checked">
        <div class="tbInfo__title">
          <div class="tbInfoText">名称</div>
          <div class="tbInfoText">类型</div>
        </div>
        <div v-for="(field, index) in fields" :key="field.fieldName" class="tbInfo__content">
          <div class="tbInfoText">
            {{ field.fieldName }}
          </div>
          <div class="tbInfoText">
            {{ field.fieldType }}
          </div>
        </div>
      </div>
      <div class="tbInfo" v-show="radios.partitions.checked">
        <div class="tbInfo__title">
          <div class="tbInfoText">名称</div>
          <div class="tbInfoText">个数</div>
        </div>
        <div v-for="(partition, index) in partitions" :key="partition.partitionName" class="tbInfo__content">
          <div class="tbInfoText">
            {{ partition.partitionName }}
          </div>
          <div class="tbInfoText">
            {{ partition.partitionNum }}
          </div>
        </div>
      </div>
    </div>
    <div class="sqlpad">
      <div class="handlegroup">
        <div class="handlegroup__item" v-for="(item, index) in operations" :key="item.name" :style="operationStyle(item.imgUrl)" @click="operate(item.action)">
          <!-- img :src="item.imgUrl" :alt="item.name" -->
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="sqlpad__mainPad">
        <Tabs type="card">
          <TabPane v-for="(tab, index) in sqlTabs" :key="tab.name" :label="tab.name">
            <!--textarea :rows="sqlEditor.rows" v-model="tab.content" placeholder="请输入" class="sqlEditor" :id="tab.id"></textarea-->
            <!--Input type="textarea" :rows="sqlEditor.rows" v-model="sqlEditor.content" placeholder="请输入..."></Input-->
            <div :id="tab.id" class="sqlEditor" v-model='tab.content'></div>
            <Button @click="showSql(tab.content)">测试brace</Button>
          </TabPane>
        </Tabs>
        <Tabs type="card">
          <TabPane label="数据" class="tabpane">
            <Table border stripe :columns="dataColumns" :data="dataList"></Table>
          </TabPane>
          <TabPane label="日志">
            <div class="logpad">
              <p v-for="(log, index) in logs" class="logpad__log">
                {{ log.content }}
              </p>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import updateCompletions from '../utils/updateCompletions.js'

let ace = require('brace')
require('brace/mode/sql')
require('brace/theme/chrome')
require('brace/ext/language_tools.js') // 自动补全
ace.acequire('ace/ext/language_tools')

export default {
  data () {
    return {
      dbs: [
        {
          'pdbId': 1,
          'pdbName': 'ocr'
        },
        {
          'pdbId': 2,
          'pdbName': 'ocr'
        },
        {
          'pdbId': 3,
          'pdbName': 'ocr'
        }
      ],
      tables: [
        {
          expand: true,
          title: 'ocr',
          children: [
            {
              title: 'user_list'
            },
            {
              title: 'user_list'
            }
          ]
        }
      ],
      radios: {
        fields: {
          label: '字段',
          checked: true
        },
        partitions: {
          label: '分区',
          checked: false
        }
      },
      fields: [
        {
          fieldName: 'Id',
          fieldType: 'int'
        },
        {
          fieldName: 'name',
          fieldType: 'STRING'
        },
        {
          fieldName: 'age',
          fieldType: 'int'
        }
      ],
      partitions: [
        {
          partitionName: 'name',
          partitionNum: 2
        },
        {
          partitionName: 'age',
          partitionNum: 3
        }
      ],
      operations: [
        {
          name: '运行',
          action: 'run',
          imgUrl: require('../assets/images/icon/run.png')
        },
        {
          name: '停止',
          action: 'stop',
          imgUrl: require('../assets/images/icon/stop.png')
        },
        {
          name: '新建',
          action: 'new',
          imgUrl: require('../assets/images/icon/new.png')
        },
        {
          name: '保存',
          action: 'save',
          imgUrl: require('../assets/images/icon/save.png')
        },
        {
          name: '导出',
          action: 'export',
          imgUrl: require('../assets/images/icon/export.png')
        }
      ],
      sqlTabs: [
        {
          id: 'sql-build',
          name: '建表SQL',
          content: ''
        },
        {
          id: 'sql-bi',
          name: 'BI SQL',
          content: ''
        },
        {
          id: 'sql-inc',
          name: '增量SQL',
          content: ''
        }
      ],
      sqlEditor: {
        rows: 5
      },
      schemaInfo: {
        fuzzy: {
          tbl_user: [
            {
              column_name: 'user_id',
              data_type: 'int',
              table_name: 'tbl_user',
              table_schema: 'fuzzy',
              table_type: 'Tables',
              is_nullable: 'no'
            }
          ],
          tbl_log: [
            {
              column_name: 'id',
              data_type: 'int',
              table_name: 'tbl_log',
              table_schema: 'fuzzy',
              table_type: 'Tables',
              is_nullable: 'no'
            }
          ]
        }
      },
      dataColumns: [
        {
          type: 'index',
          align: 'center'
        },
        {
          title: '客户编码',
          key: ''
        },
        {
          title: '保单号',
          key: ''
        },
        {
          title: '用户名称',
          key: ''
        },
        {
          title: '险种',
          key: ''
        },
        {
          title: '车牌号',
          key: ''
        },
        {
          title: '状态',
          key: ''
        },
        {
          title: '保费',
          key: ''
        }
      ],
      dataList: [],
      logs: [
        {
          content: '2017.09.09 12:20:20  运行正常'
        },
        {
          content: '2017.09.09 12:20:20  运行正常'
        },
        {
          content: '2017.09.09 12:20:20  运行正常'
        },
        {
          content: '2017.09.09 13:20:20  出现警告信息：SQL语法错误，请重新编辑!'
        }
      ]
    }
  },
  methods: {
    radioChecked (checked) {
      if (checked) {
        return {
          background: '#66b8f0',
          color: '#fff'
        }
      }
    },
    checkTBInfo (radioName) {
      for (let prop in this.radios) {
        if (this.radios.hasOwnProperty(prop)) {
          this.radios[prop].checked = false
        }
      }
      this.radios[radioName].checked = true
    },
    operationStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center'
      }
    },
    operate (action) {
      switch (action) {
        case 'new':
          let newSql = {
            id: 'sql' + new Date().getTime(),
            name: '新建语句',
            content: ''
          }
          this.sqlTabs.push(newSql)
          this.$nextTick(function () {
            this.setBrace(newSql.id)
          })
          break
        default:
          break
      }
    },
    showSql (sql) {
      alert(sql)
      // this.setBraces()
    },
    setBrace (id) {
      updateCompletions(this.schemaInfo)
      let editor = ace.edit(id)
      editor.getSession().setMode('ace/mode/sql')
      editor.setTheme('ace/theme/chrome')
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: true
      })
    },
    setBraces () {
      updateCompletions(this.schemaInfo)
      for (let tab of this.sqlTabs) {
        let editor = ace.edit(tab.id)
        editor.getSession().setMode('ace/mode/sql')
        editor.setTheme('ace/theme/chrome')
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: false,
          enableLiveAutocompletion: true
        })
      }
    }
  },
  /*
  watch: {
    sqlTabs: function (newTabs) {
      this.setBraces()
    }
  },
  */
  mounted () {
    this.setBraces()
  }
}
</script>

<style lang="scss" scoped>
  .side {
    max-width: 170px;
    text-align: left;
  }
  .dbSelect {
    display: flex;
    margin-top: 5px;
    margin-left: 5px;
    align-items: center;
  }
  .radios {
    display: flex;
    margin-top: 50px;
  }
  .radio-div {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    background: #dcdcdc;
  }
  .tree {
    margin-left: 5px;
  }
  .tbInfo__title {
    background: #f8f8f8;
  }
  .tbInfo__title,
  .tbInfo__content {
    display: flex;
  }
  .tbInfo__content:last-child {
    border-bottom: 1px solid #f0f0f0;
  }
  .tbInfoText {
    flex: 1;
    height: 30px;
    border: 1px solid #f0f0f0;
    border-bottom: none;
    border-right: none;
    line-height: 30px;
    text-align: center;
  }
  .sqlpad {
    flex-grow: 1;
    max-width: calc(100% - 170px);
    background: #f0f0f0;
  }
  .handlegroup {
    display: flex;
    padding-top: 1em;
    padding-bottom: 1em;
    cursor: pointer;
    background: #f8f8f8;
  }
  .handlegroup__item {
    padding-left: 20px;
    margin-left: 20px;
  }
  .sqlpad__mainPad {
    padding: 1em;
  }
  .sqlEditor {
    width: 100%;
    height: 150px;
    padding: 1em;
    font-size: 14px;
  }

  .logpad {
    height: 100%;
    padding: 1em;
    border: 1px solid #efefef;
    border-radius: 5px;
    text-align: left;
    background: #fff;
  }
  .logpad__log {
    margin-bottom: .5em;
  }
</style>
