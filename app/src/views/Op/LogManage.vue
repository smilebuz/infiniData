<template lang="html">
  <div class="logmanage">
    <div class="form-inline">
      <Form ref="filterForm" inline
        :model="filterForm"
        :label-width="80">
        <FormItem prop="info" label="关键字" class="form__item">
          <Input type="text"
            v-model="filterForm.info"
          ></Input>
        </FormItem>
        <FormItem prop="logLevel" label="日志等级" class="form__item">
          <Select placeholder="请选择" style="width: 120px;"
            v-model="filterForm.logLevel">
            <Option v-for="(level, index) in logLevelList" :value="level" :key="level">
              {{ level }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="form__item form__item-button">
          <Button type="primary" size="small"
            @click="changeSearchParams"
          >筛选</Button>
        </FormItem>
      </Form>
    </div>
    <div class="tbcontainer">
      <Table border stripe class="table" size="small"
        :columns="columns"
        :data="logList"></Table>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-sizer show-elevator
          :total="pageInfo.totalCount"
          :current="pageInfo.currentPage"
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
      searchParams: {
        info: '',
        logLevel: '',
        pageNum: '',
        pageSize: '',
        orderBy: 'id',
        sort: 'desc'
      },
      filterForm: {
        info: '',
        logLevel: ''
      },
      columns: [
        {
          type: 'index',
          width: 80
        },
        {
          title: '日志等级',
          key: 'logLevel',
          width: 120
        },
        {
          title: 'IP',
          key: 'ipAddress',
          width: 120
        },
        {
          title: '创建时间',
          key: 'create_time',
          width: 150
        },
        {
          title: '创建用户',
          key: 'userName',
          width: 120
        },
        {
          title: '日志信息',
          key: 'message',
          width: 150
        }
      ],
      logLevelList: ['info', 'warning', 'error']
    }
  },
  computed: {
    ...mapGetters({
      logList: 'logList',
      pageInfo: 'logPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getLogList: 'getLogList'
    }),
    changeSearchParams () {
      for (let key in this.filterForm) {
        if (this.filterForm.hasOwnProperty(key)) {
          this.searchParams[key] = this.filterForm[key]
        }
      }
    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    changePageSize (pageSize) {
      this.searchParams.pageSize = pageSize
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getLogList(newParams).then(data => {})
      },
      deep: true
    }
  },
  mounted () {
    this.getLogList(this.searchParams).then(data => {})
  }
}
</script>

<style lang="scss" scoped>
</style>
