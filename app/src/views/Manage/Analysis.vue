<template>
  <div class="analysis">
    <!--h3 class="analysis__title">表{{ tbName }}的数据画像</h3-->
    <div class="sideMenu">
      <Card dis-hover class="card card-basic">
        <p slot="title" class="card__title">表基本信息</p>
        <div class="card__item">
          <span class="card__item-name">表名:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.tbName">
            {{ analysisResult.tbInfo.tbName }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">中文名:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.tbNameCN">
            {{ analysisResult.tbInfo.tbNameCN }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">项目名称:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.projectName">
            {{ analysisResult.tbInfo.projectName }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">负责人:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.principal">
            {{ analysisResult.tbInfo.principal }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">描述:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.des">
            {{ analysisResult.tbInfo.des }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">权限状态:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.permissionState">
            {{ analysisResult.tbInfo.permissionState }}
          </span>
        </div>
      </Card>
      <Card dis-hover class="card card-storage">
        <p slot="title" class="card__title">表存储信息</p>
        <div class="card__item">
          <span class="card__item-name">物理存储量:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.storage">
            {{ analysisResult.tbInfo.storage }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">生命周期:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.lifeCycle">
            {{ analysisResult.tbInfo.lifeCycle }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">是否区分表:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.partition">
            {{ analysisResult.tbInfo.partition }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">表创建时间:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.createTime">
            {{ analysisResult.tbInfo.createTime }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">DDL最后变更时间:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.DDLChangeTime">
            {{ analysisResult.tbInfo.DDLChangeTime }}
          </span>
        </div>
        <div class="card__item">
          <span class="card__item-name">数据最后变更时间:&nbsp;&nbsp;</span>
          <span class="card__item-value"
            :title="analysisResult.tbInfo.DataChangeTime">
            {{ analysisResult.tbInfo.DataChangeTime }}
          </span>
        </div>
      </Card>
    </div>
    <div class="tabContainer">
      <Tabs value="fieldInfo" class="tabs">
        <TabPane label="字段信息" name="fieldInfo" class="tabpane">
          <div class="tbcontainer">
            <h3 class="tableTitle">数值</h3>
            <Table border stripe class="table" size="default"
              :columns="numberColumns"
              :data="analysisResult.numberList"
            ></Table>
            <!--Modal
              v-model="modal.show"
              :title="modal.title"
              @on-ok="hideModal"
              @on-cancel="hideModal">
              <div id="chart" class="chartContainer"></div>
            </Modal>
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
            </div-->
          </div>
          <div class="tbcontainer">
            <h3 class="tableTitle">字符串</h3>
            <Table border stripe class="table" size="default"
              :columns="stringColumns"
              :data="analysisResult.stringList"
            ></Table>
          </div>
          <div class="tbcontainer">
            <h3 class="tableTitle">布尔值</h3>
            <Table border stripe class="table" size="default"
              :columns="booleanColumns"
              :data="analysisResult.booleanList"
            ></Table>
          </div>
        </TabPane>
        <TabPane label="分区信息" name="partitionInfo" class="tabpane">
          <div class="tbcontainer">
            <Table border stripe class="table" size="default"
              :columns="partitionColumns"
              :data="analysisResult.partitionList"
            ></Table>
          </div>
        </TabPane>
        <TabPane label="数据统计" name="statistics" class="tabpane">
          <div class="tbcontainer">
            <Table border stripe class="table" size="default"
              :columns="dataColumns"
              :data="analysisResult.statistics"
            ></Table>
          </div>
        </TabPane>
        <TabPane label="建表语句" name="createSql" class="tabpane">
          <Input type="textarea" readonly class="sqlPanel"
            :autosize="{minRows: 15}"
            v-model="analysisResult.createSql"></Input>
        </TabPane>
      </Tabs>
      <myFooter class="footer-grey"></myFooter>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import myFooter from '@/components/Footer'

// const echarts = require('echarts')
let chart

export default {
  data () {
    return {
      searchParams: {
        pdbName: '',
        tbName: ''
      },
      tbName: '',
      numberColumns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '名称',
          key: 'name',
          width: 80
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: '空值个数',
          key: 'nullValNum',
          width: 90
        },
        {
          title: '唯一值',
          key: 'unique',
          width: 90
        },
        {
          title: '最小值',
          key: 'minValue',
          width: 80
        },
        {
          title: '最大值',
          key: 'maxValue',
          width: 80
        }
        // {
        //   title: '操作',
        //   key: '',
        //   width: 120,
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('Button', {
        //       props: {
        //         size: 'small',
        //         type: 'primary'
        //       },
        //       'class': {
        //         table__button: true
        //       },
        //       on: {
        //         click: () => {
        //           console.log(JSON.stringify(params.row.topten))
        //           for (let data of params.row.topten) {
        //             this.chartOption.xAxis.data.push(data.name)
        //             this.chartOption.series[0].data.push(data.value)
        //           }
        //           this.modal.show = true
        //           chart = echarts.init(document.getElementById('chart'))
        //           chart.setOption(this.chartOption)
        //         }
        //       }
        //     }, '查看top10')
        //   }
        // }
      ],
      stringColumns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '名称',
          key: 'name',
          width: 80
        },
        {
          title: '唯一值',
          key: 'unique',
          width: 90
        },
        {
          title: '平均长度',
          key: 'avgLength',
          width: 80
        },
        {
          title: '最大长度',
          key: 'maxLength',
          width: 80
        }
      ],
      booleanColumns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '名称',
          key: 'name',
          width: 80
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: 'true数量',
          key: 'trueNum',
          width: 80
        },
        {
          title: 'false数量',
          key: 'falseNum',
          width: 80
        }
      ],
      partitionColumns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        },
        {
          title: '分区名',
          key: 'name',
          width: 80
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 150
        },
        {
          title: '存储量',
          key: 'storage',
          width: 80
        },
        {
          title: '记录数',
          key: 'totalRows',
          width: 80
        }
      ],
      dataColumns: [
        {
          type: 'index',
          title: '序号',
          width: 70
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalCount: -1,
        totalPage: -1
      },
      modal: {
        show: false,
        title: 'top10'
      },
      chartOption: {
        color: ['#66b8ef'],
        title: { text: 'Top10' },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '出现次数',
          type: 'bar',
          data: []
        }]
      }
    }
  },
  computed: {
    ...mapGetters({
      analysisResult: 'analysisResult'
      // analysisList: 'analysisList'
      // pageInfo: 'analysisPageInfo'
    }),
    tableList () {
      if (this.pageInfo.pageNum * this.pageInfo.pageSize >= this.pageInfo.totalCount) {
        // 当前页为最后一页
        return this.analysisList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize
        })
      } else {
        // 当前页不是最后一页
        return this.analysisList.filter((el, index, arr) => {
          return (index + 1) > (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize &&
            (index + 1) <= this.pageInfo.pageNum * this.pageInfo.pageSize
        })
      }
    }
  },
  methods: {
    ...mapActions({
      getAnalysisList: 'getAnalysisList'
    }),
    hideModal () {
      this.chartOption.xAxis.data = []
      this.chartOption.series[0].data = []
      chart.dispose()
      this.modal.show = false
    },
    changePageNum (pageNum) {
      this.pageInfo.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.pageInfo.pageSize = pageSize
    }
  },
  mounted () {
    this.searchParams.pdbName = this.$route.params.pdbName
    this.searchParams.tbName = this.$route.params.tbName
    this.tbName = this.$route.params.tbName
    this.getAnalysisList(this.searchParams).then(data => {})
    // this.pageInfo.totalCount = this.analysisList.length
    // this.pageInfo.totalPage = Math.ceil(this.pageInfo.totalCount / this.pageInfo.pageSize)
  },
  components: {
    myFooter
  }
}
</script>

<style lang="scss">
  .analysis__title {
    padding: 10px;
    text-align: left;
  }
  .sideMenu {
    min-width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .card {
    border-radius: 0!important;
    .card__item {
      .card__item-name {
        min-width: 75px;
      }
      .card__item-value {
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .card-storage {
    .card__item {
      .card__item-name {
        min-width: 125px;
      }
      .card__item-value {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .card__title {
    text-align: left;
  }
  .card__item {
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #c9c9c9;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: left;
  }
  .tabContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: calc(100% - 300px);
  }
  .tabs {
    height: 100%;
    background: #f9f9f9;
  }
  .sqlPanel {
    padding-left: 5px;
    padding-right: 5px;
  }
  .tableTitle {
    text-align: left;
  }
  .chartContainer {
    margin: 0 auto;
    width: 500px;
    height: 300px;
  }
  .footer-grey {
    background: #f9f9f9;
  }
</style>



