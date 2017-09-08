<template lang="html">
  <div class="handle">
    <div class="side">
      <div class="">

      </div>
    </div>
    <div class="sqlpad">
      <div class="opgroup">
        <div class="opgroup__item" v-for="(item, index) in operations" :key="item.name" :style="operationStyle(item.imgUrl)">
          <!-- img :src="item.imgUrl" :alt="item.name" -->
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="sqlpad__mainPad">
        <Tabs type="card">
          <TabPane v-for="(tab, index) in sqlTabs" :key="tab.name" :label="tab.name">
            <!--textarea :rows="sqlEditor.rows" v-model="tab.content" placeholder="请输入" class="sqlEditor" :id="tab.id"></textarea-->
            <!--Input type="textarea" :rows="sqlEditor.rows" v-model="sqlEditor.content" placeholder="请输入..."></Input-->
            <div :id="tab.id" class="sqlEditor"></div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      operations: [
        {
          name: '运行',
          imgUrl: require('../assets/images/icon/run.png')
        },
        {
          name: '停止',
          imgUrl: require('../assets/images/icon/stop.png')
        },
        {
          name: '新建',
          imgUrl: require('../assets/images/icon/new.png')
        },
        {
          name: '保存',
          imgUrl: require('../assets/images/icon/save.png')
        },
        {
          name: '导出',
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
      }
    }
  },
  methods: {
    operationStyle (imgUrl) {
      return {
        background: 'url(' + imgUrl + ') no-repeat left center'
      }
    }
  },
  mounted () {
    let ace = require('brace')
    // require('brace/mode/javascript')
    require('brace/mode/sql')
    // require('brace/theme/monokai')
    require('brace/theme/chrome')

    let editor = ace.edit('sql-build')
    // editor.getSession().setMode('ace/mode/javascript')
    editor.getSession().setMode('ace/mode/sql')
    // editor.setTheme('ace/theme/monokai')
    editor.setTheme('ace/theme/chrome')
  }
}
</script>

<style lang="scss" scoped>
  .handle {
    display: flex;
    min-height: calc(100% - 50px);
  }
  .side {
    flex-basis: 170px;
    background-color: #008080;
  }
  .sqlpad {
    flex-grow: 1;
    background: #f0f0f0;
  }
  .opgroup {
    display: flex;
    padding-top: 1em;
    padding-bottom: 1em;
    cursor: pointer;
    background: #f8f8f8;
  }
  .opgroup__item {
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
</style>
