<template lang="html">
  <div class="handle">
    <div class="side">
      <div class="dbSelect">
        <Select style="width: 140px;" size="small" v-model="selectedpdbId" @on-change="selectDb">
          <Option v-for="(db, index) in dbList" :key="db.pdbId" :value="db.pdbId">
            {{ db.pdbName }}
          </Option>
        </Select>
        <Button type="text" shape="circle" icon="refresh"></Button>
      </div>
      <Tree :data="tables" class="tree" @on-select-change="selectTable"></Tree>
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
          <div class="tbInfoText">类型</div>
        </div>
        <div v-for="(partition, index) in partitions" :key="partition.partitionName" class="tbInfo__content">
          <div class="tbInfoText">
            {{ partition.partitionName }}
          </div>
          <div class="tbInfoText">
            {{ partition.partitionType }}
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
        <Tabs type="card" v-model="currentTabId" class="sqlpad__mainPad-editorPad">
          <TabPane v-for="(tab, index) in sqlTabs" :key="tab.name" :label="tab.name" :name="tab.id">
            <div :id="tab.id" class="sqlEditor"></div>
          </TabPane>
          <Modal title="保存sql"
            v-model="saveModal.showModal"
            @on-ok="saveSql"
            @on-cancel="cancelSave">
            <Input size="small" 
              v-model="saveModal.saveName"
              @on-enter="saveSql"
            ></Input>
          </Modal>
        </Tabs>
        <p class="sqlpad__mainPad-sqlInfo" v-show="executeSql">
          运行时间: {{ sqlInfo.time_consum }}  返回结果: {{ sqlInfo.count }}条
        </p>
        <Tabs type="card" class="sqlpad__mainPad-infoPad">
          <TabPane label="数据" class="tabpane">
            <Table border stripe :columns="dataColumns" :data="dataList"></Table>
          </TabPane>
          <TabPane label="日志">
            <div class="logpad">
              <p class="logpad__log">
                {{ log }}
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
import { mapGetters, mapActions } from 'vuex'

let ace = require('brace')
require('brace/mode/sql')
require('brace/theme/chrome')
require('brace/ext/language_tools.js') // 自动补全
ace.acequire('ace/ext/language_tools')

export default {
  data () {
    return {
      selectedpdbId: '',
      tbParams: {
        pdbId: '',
        pageSize: '',
        tbName: '' // 为什么有这个字段
      },
      tbInfoParams: {
        pdbId: '',
        tbId: ''
      },
      tables: [
        {
          title: '',
          children: [] // 树子节点
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
        }
        /*
        {
          name: '导出',
          action: 'export',
          imgUrl: require('../assets/images/icon/export.png')
        }
        */
      ],
      saveModal: {
        showModal: false,
        saveName: ''
      },
      sqlTabs: [],
      currentTabId: '',
      sqlEditor: {
        rows: 5
      },
      executeSql: false,
      schemaInfo: {
        fuzzy: {
          tbl_user: [
            {
              column_name: 'user_id',
              // data_type: 'int',
              table_name: 'tbl_user'
              // table_schema: 'fuzzy',
              // table_type: 'Tables',
              // is_nullable: 'no'
            }
          ],
          tbl_log: [
            {
              column_name: 'id',
              // data_type: 'int',
              table_name: 'tbl_log'
              // table_schema: 'fuzzy',
              // table_type: 'Tables',
              // is_nullable: 'no'
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
      log: '2017.09.09 12:20:20  运行正常'
    }
  },
  computed: {
    ...mapGetters({
      dbList: 'dbList',
      tbList: 'tbList',
      tbInfo: 'tbInfo',
      fields: 'fieldList',
      partitions: 'partitionList',
      sqlInfo: 'runSqlInfo'
    })
  },
  methods: {
    ...mapActions({
      getDBList: 'getDBList',
      getTBList: 'getTBList',
      getTBInfo: 'getTBInfo',
      runSql: 'runSql'
    }),
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
        case 'run':
          let targetTab = this.sqlTabs.find((tab) => {
            return tab.id === this.currentTabId
          })
          let params = {
            sql: targetTab.editor.getValue()
          }
          alert(params.sql)
          /*
          this.runSql(params).then(data => {
            this.executeSql = true
          })
          */
          break
        case 'stop':

          break
        case 'new':
          let newSqlTab = {
            id: 'sql' + new Date().getTime(),
            name: '新建语句',
            content: ''
          }
          this.sqlTabs.push(newSqlTab)
          this.$nextTick(function () {
            this.setBrace(newSqlTab)
          })
          break
        case 'save':
          this.saveModal.showModal = true
          break
        case 'export':

          break
        default:
          break
      }
    },
    saveSql () {
      console.log(this.saveModal.saveName)
      // 在sessionStorage中保存 成功后在回调函数中关闭弹窗
      let currentTab = this.sqlTabs.find(tab => {
        return tab.id === this.currentTabId
      })
      currentTab.name = this.saveModal.saveName
      currentTab.content = currentTab.editor.getValue()

      let sessionTabs = JSON.parse(sessionStorage.getItem('sqlTabs'))
      if (sessionTabs) {
        let targetTab = sessionTabs.find(el => {
          return el.id === currentTab.id
        })
        if (targetTab) {
          // 保存现有tab
          targetTab.name = currentTab.name
          targetTab.content = currentTab.content
          sessionStorage.setItem('sqlTabs', JSON.stringify(sessionTabs))
          this.$nextTick(function () {
            this.setBrace(currentTab)
          })
        } else {
          // 保存新tab
          sessionTabs.push({
            name: currentTab.name,
            content: currentTab.content,
            id: currentTab.id
          })
          sessionStorage.setItem('sqlTabs', JSON.stringify(sessionTabs))
          this.$nextTick(function () {
            this.setBrace(currentTab)
          })
        }
      } else {
        // sessionTab为空 保存第一个tab
        sessionStorage.setItem('sqlTabs', JSON.stringify([{
          name: currentTab.name,
          content: currentTab.content,
          id: currentTab.id
        }]))
        // 重新渲染页面
        this.$nextTick(function () {
          this.setBrace(currentTab)
        })
      }
      this.saveModal.showModal = false
    },
    cancelSave () {
      this.saveModal.saveName = ''
    },
    setBrace (newSqlTab) {
      updateCompletions(this.schemaInfo)
      let editor = ace.edit(newSqlTab.id)
      newSqlTab.editor = editor
      newSqlTab.editor.setValue(newSqlTab.content)
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
        tab.editor = editor
        tab.editor.setValue(tab.content)
        editor.getSession().setMode('ace/mode/sql')
        editor.setTheme('ace/theme/chrome')
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: false,
          enableLiveAutocompletion: true
        })
      }
    },
    selectDb (pdbId) {
      this.tbParams.pdbId = pdbId
    },
    selectTable (selection) {
      if (selection[0].tbId) {
        this.tbInfoParams.tbId = selection[0].tbId
      }
    }
  },
  watch: {
    tbParams: {
      handler: function (newParams) {
        this.getTBList(newParams).then(data => {
          this.tables[0].children.splice(0, this.tables[0].children.length)
          this.tables[0].title = this.dbList.find(db => {
            return db.pdbId === this.tbParams.pdbId
          }).pdbName
          // 填充this.tables.children 改变this.tbInfoParams
          for (let table of this.tbList) {
            this.tables[0].children.push({title: table.tbName, tbId: table.tbId})
          }
          this.tbInfoParams.pdbId = this.selectedpdbId
          this.tbInfoParams.tbId = this.tbList[0].tbId
        })
      },
      deep: true
    },
    tbInfoParams: {
      handler: function (newParams) {
        this.getTBInfo(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.getDBList().then(data => {
      this.selectedpdbId = this.dbList[0].pdbId
    })
    let sessionTabs = JSON.parse(sessionStorage.getItem('sqlTabs'))
    if (sessionTabs) {
      for (let tab of sessionTabs) {
        this.sqlTabs.push(tab)
      }
      this.currentTabId = this.sqlTabs[0].id
      this.$nextTick(function () {
        this.setBraces()
      })
    } else {
      let newSqlTab = {
        id: 'sqlnew',
        name: '新建语句',
        content: ''
      }
      this.sqlTabs.push(newSqlTab)
      this.currentTabId = newSqlTab.id
      this.$nextTick(function () {
        this.setBrace(newSqlTab)
      })
    }
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
  .tree {
    margin-left: 5px;
    margin-bottom: 50px;
  }
  .radios {
    display: flex;
  }
  .radio-div {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    background: #dcdcdc;
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
  .sqlpad__mainPad-editorPad {
    margin-bottom: 1em;
  }
  .sqlpad__mainPad-sqlInfo {
    text-align: left;
    margin-bottom: 1em;
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
