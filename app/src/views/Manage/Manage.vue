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
        :data="tbList"></Table>
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
          fixed: 'left',
          width: 80
        },
        {
          title: '表名',
          key: 'tbName',
          width: 120
        },
        {
          title: '类型',
          key: 'tbtype',
          width: 100
        },
        {
          title: '占用空间',
          key: 'spaceUsage',
          width: 120
        },
        {
          title: '字段数',
          key: 'totalFields',
          width: 120
        },
        {
          title: '记录数',
          key: 'totalRows',
          width: 120
        },
        {
          title: '分区字段',
          key: 'partitionField',
          width: 120
        },
        {
          title: '分桶字段',
          key: 'bucketField',
          width: 180
        },
        {
          title: '引擎',
          key: 'engine',
          width: 120
        },
        {
          title: '创建者',
          key: 'owner',
          width: 120
        },
        {
          title: '创建时间',
          key: 'create_time',
          width: 160
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
      ]
    }
  },
  computed: {
    ...mapGetters({
      dbList: 'dbList',
      tbList: 'tbList'
    })
  },
  methods: {
    ...mapActions({
      getDBList: 'getDBList',
      getTBList: 'getTBList'
    }),
    selectDb (pdbId) {
      this.tbParams.pdbId = pdbId
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

