<template>
  <div class="manage">
    <div class="side">
      <div class="dbSelect">
        <span>库</span>
        <Select class="dbSelect__select" style="width: 140px;" size="small" 
          v-model="tbParams.pdbId" 
          @on-change="selectDb">
          <Option 
            v-for="(db, index) in dbList" 
            :key="db.pdbId" 
            :value="db.pdbId">
            {{ db.pdbName }}
          </Option>
        </Select>
        <Button type="text" shape="circle" icon="refresh"
          @click="refreshDbList"></Button>
      </div>
      <Tree class="tree"
        v-if="tables[0].children.length"
        :data="tables"
      ></Tree>
    </div>
    <div class="content">
      <div class="tbcontainer">
        <Table class="table" size="small" border stripe
          :columns="columns"
          :data="tableList"></Table>
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
      <myFooter class="footer-light"></myFooter>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import myFooter from '@/components/Footer'

export default {
  data () {
    return {
      tbParams: {
        pdbId: '',
        pageNum: 1,
        pageSize: 10
      },
      analysisParams: {
        dbName: '',
        tableName: ''
      },
      tables: [
        {
          title: '',
          expand: true,
          children: []
        }
      ],
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '表名',
          key: 'tbName',
          width: 80
        },
        {
          title: '类型',
          key: 'tbtype',
          width: 100
        },
        {
          title: '占用空间',
          key: 'spaceUsage',
          width: 90
        },
        {
          title: '字段数',
          key: 'totalFields',
          width: 80
        },
        {
          title: '记录数',
          key: 'totalRows',
          width: 80
        },
        {
          title: '分区字段',
          key: 'partitionField',
          width: 90
        },
        {
          title: '分桶字段',
          key: 'bucketField',
          width: 90
        },
        {
          title: '引擎',
          key: 'engine',
          width: 80
        },
        {
          title: '分析状态',
          key: 'analysis_status',
          width: 90,
          render: (h, params) => {
            return h('span', {}, this.statusList[params.row.analysis_status])
          }
        },
        {
          title: '创建者',
          key: 'owner',
          width: 80
        },
        {
          title: '创建时间',
          key: 'create_time',
          width: 150
        },
        {
          title: '操作',
          key: '',
          width: 160,
          align: 'center',
          render: (h, params) => {
            switch (params.row.analysis_status) {
              case 0:
              case -1:
                return h('Button', {
                  props: {
                    size: 'small',
                    type: 'primary'
                  },
                  'class': {
                    table__button: true
                  },
                  on: {
                    click: () => {
                      this.analysisParams.tableName = params.row.tbName
                      this.analysis(this.analysisParams).then(data => {
                        params.row.analysis_status = 1
                      })
                    }
                  }
                }, '分析')
              case 2:
                return h('div', [
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'primary'
                    },
                    'class': {
                      table__button: true
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.setAnalysisList(JSON.parse(params.row.analysis_info))
                        this.$router.push('/Analysis/' + this.tbParams.pdbName + '/' + params.row.tbName)
                      }
                    }
                  }, '查看结果'),
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'primary'
                    },
                    'class': {
                      table__button: true
                    },
                    on: {
                      click: () => {
                        this.analysisParams.tableName = params.row.tbName
                        this.analysis(this.analysisParams).then(data => {
                          this.stopPolling()
                          this.timer = setInterval(() => {
                            this.polling(this.tbParams)
                          }, 5000)
                        })
                      }
                    }
                  }, '分析')
                ])
              default:
                break
            }
          }
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: -1,
        totalPage: -1
      },
      statusList: {
        0: '未分析',
        1: '正在分析',
        2: '分析完成',
        '-1': '分析失败'
      },
      timer: ''
    }
  },
  computed: {
    ...mapGetters({
      dbList: 'dbList',
      tbList: 'tbList'
    }),
    // 分页
    tableList: function () {
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
      getDBList: 'getDBList',
      getTBList: 'getTBList',
      analysis: 'analysis',
      setAnalysisList: 'setAnalysisList'
    }),
    selectDb (pdbId) {
      this.tbParams.pdbId = pdbId
      this.analysisParams.dbName = this.dbList.find((el, index, arr) => {
        return el.pdbId === pdbId
      }).pdbName
    },
    refreshDbList () {
      this.stopPolling()
      this.getDBList().then(data => {
        this.tbParams.pdbId = this.dbList[0].pdbId
        this.analysisParams.dbName = this.dbList[0].pdbName
      })
    },
    changePageNum (pageNum) {
      this.pageInfo.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.pageInfo.pageSize = pageSize
    },
    stopPolling () {
      console.log('停止轮询', this.timer)
      clearInterval(this.timer)
    },
    polling () {
      console.log('轮询', this.timer)
      this.getTBList(this.tbParams).then(data => {
        this.tables[0].title = this.dbList.find(db => {
          return db.pdbId === this.tbParams.pdbId
        }).pdbName
        this.tables[0].children.splice(0, this.tables[0].children.length)
        for (let table of this.tbList) {
          this.tables[0].children.push({title: table.tbName, tbId: table.tbId})
        }
        this.pageInfo.totalCount = this.tbList.length
        this.pageInfo.totalPage = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize)
      })
    }
  },
  watch: {
    tbParams: {
      handler: function (newParams) {
        this.stopPolling()
        this.polling()
        /*
        this.getTBList(newParams).then(data => {
          this.tables[0].title = this.dbList.find(db => {
            return db.pdbId === this.tbParams.pdbId
          }).pdbName
          this.tables[0].children.splice(0, this.tables[0].children.length)
          for (let table of this.tbList) {
            this.tables[0].children.push({title: table.tbName, tbId: table.tbId})
          }
          this.pageInfo.totalCount = this.tbList.length
          this.pageInfo.totalPage = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize)
        })
        */
        this.timer = setInterval(() => {
          this.polling(this.tbParams)
        }, 5000)
      },
      deep: true
    }
  },
  created () {
    this.getDBList().then(data => {
      this.tbParams.pdbId = this.dbList[0].pdbId
      this.tbParams.pdbName = this.dbList[0].pdbName
    })
  },
  beforeDestroy () {
    this.stopPolling()
  },
  components: {
    myFooter
  }
}
</script>

<style lang="scss" scoped>
  .side {
    max-width: 170px;
    min-width: 170px;
    text-align: left;
  }
  .dbSelect {
    display: flex;
    padding: 5px;
    align-items: center;
  }
  .dbSelect__select {
    padding-left: 5px;
    text-align: center;
  }
  .tree {
    padding-left: 5px;
    max-height: 200px;
    overflow: scroll;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
  .tbcontainer {
    overflow: hidden;
  }
  .footer-light {
    color: #000;
    background: #f9f9f9;
  }
</style>
