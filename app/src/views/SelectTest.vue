<template>
  <div class="selecttest">
		<div class="opbuttons">
      <Button type="success" class="opbutton" icon="checkmark" size="small"
        @click="changeSelectAllinDBStatus(true)">
        全选
      </Button>
      <Button type="error" class="opbutton" icon="close" size="small"
        @click="changeSelectAllinDBStatus(false)">
        清空
      </Button>
    </div>
		<div class="main">
      <Table class="table" size="small" border stripe
			:columns="columns"
			:data="personList"
      ></Table>
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
    <div class="btncontainer">
      <Button type="primary" class="button" @click="submitCreateParams">提交</Button>
      <router-link to="OffImport" tag="Button" class="button">取消</router-link>
    </div>
	</div>
</template>

<script>
import '../assets/css/common.scss'
import '../assets/css/pagination.scss'

import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchParams: {
        pageNum: 1
      },
      createParams: {
        tbNames: [],
        exceptTbNames: []
      },
      columns: [
        {
          width: 80,
          renderHeader: (h, params) => {
            return h('Checkbox', {
              props: {
                size: 'small',
                value: this.pageSelectInfo.selectAll
              },
              on: {
                input: (isChecked) => {
                  this.pageSelectInfo.selectAll = isChecked
                }
              }
            })
          },
          render: (h, params) => {
            let targetPerson = this.personList.find(person => {
              return person.name === params.row.name
            })
            return h('Checkbox', {
              props: {
                size: 'small',
                value: targetPerson.select
              },
              on: {
                input: (isChecked) => {
                  targetPerson.select = isChecked
                }
              }
            })
          }
        },
        {
          type: 'index',
          title: '序号',
          width: 100
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age'
        }
      ],
      dbSelectInfo: {
        selectAll: false
      },
      pageSelectInfo: {
        selectAll: false
      }
    }
  },
  computed: {
    ...mapGetters({
      personList: 'testPersonList',
      pageInfo: 'testPageInfo'
    })
  },
  methods: {
    ...mapActions({
      getPersonList: 'getTestPersonList'
    }),
    changeSelectAllinDBStatus (isChecked) {
      this.dbSelectInfo.selectAll = isChecked
    },
    changePageSize (pageSize) {

    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    submitCreateParams () {
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getPersonList(newParams)
      },
      deep: true
    }
  },
  mounted () {
    this.getPersonList(this.searchParams)
    this.pageSelectInfo.selectAll = true
  }
}
</script>

<style lang="scss" scoped>
  .selecttest {
    display: flex;
    flex-direction: column;
  }
  .opbuttons {
    width: 100%;
  }
  .main {
    padding: 15px 10px;
    background: #f0f0f0;
  }
  .btncontainer {
    padding: 30px;
    background: #f0f0f0;
  }
  .button {
    margin-right: 20px;
  }
</style>
