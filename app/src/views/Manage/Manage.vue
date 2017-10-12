<template>
  <div class="manage">
    <div class="side">
      <div class="dbSelect">
        <Select style="width: 140px;" size="small" 
          v-model="tbParams.pdbId" 
          @on-change="selectDb">
          <Option 
            v-for="(db, index) in dbList" 
            :key="db.pdbId" 
            :value="db.pdbId">
            {{ db.pdbName }}
          </Option>
        </Select>
        <Button type="text" shape="circle" icon="refresh"></Button>
      </div>
      <Tree class="tree"
        :data="tables"
      ></Tree>
    </div>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      tbParams: {
        pdbId: '',
        pageSize: 10,
        tbName: ''
      },
      tables: [
        {
          title: '',
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
          width: 120
        },
        {
          title: '分桶字段',
          key: 'bucketField',
          width: 120
        },
        {
          title: '引擎',
          key: 'engine',
          width: 110
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
        }
        /*
        {
          title: '操作',
          key: '',
          width: 120,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
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
                  this.$router.push('/Manage/Analysis/' + this.tbParams.pdbId + '/post/' + params.row.tbId)
                  // this.$router.push('/Manage/Analysis')
                }
              }
            }, '分析')
          }
        }
        */
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: -1,
        totalPage: -1
      }
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
      getTBList: 'getTBList'
    }),
    selectDb (pdbId) {
      this.tbParams.pdbId = pdbId
    },
    changePageNum (pageNum) {
      this.pageInfo.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.pageInfo.pageSize = pageSize
    }
  },
  watch: {
    tbParams: {
      handler: function (newParams) {
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
      },
      deep: true
    }
  },
  mounted () {
    this.getDBList().then(data => {
      this.tbParams.pdbId = this.dbList[0].pdbId
    })
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
    margin-top: 5px;
    margin-left: 5px;
    align-items: center;
  }
  .tree {
    margin-left: 5px;
    margin-bottom: 50px;
  }
  .tbcontainer {
    overflow: hidden;
  }
</style>

