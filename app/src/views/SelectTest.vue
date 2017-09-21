<template>
  <div class="selecttest">
		<div class="opbuttons">
      <Button type="success" class="opbutton" icon="checkmark" size="small" @click="selectAll(true)">
        全选
      </Button>
      <Button type="error" class="opbutton" icon="close" size="small" @click="selectAll(false)">
        清空
      </Button>
    </div>
		<div class="main">
      <Table class="table" size="small" border stripe
			  :columns="columns"
			  :data="personList"
        @on-selection-change="selectPerson"
      ></Table>
      <div class="pagination">
        <div>
          当前第{{ pageInfo.pageNum }}页 共{{ pageInfo.totalPage }}页/{{ pageInfo.totalCount }}条记录
        </div>
        <Page show-elevator
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
        pageNum: 1 // 测试用 只有pageNum
      },
      selectNames: [],
      selectedPersons: [],
      selectAllFlag: false,
      columns: [
        {
          type: 'selection',
          width: 60
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
      ]
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
    selectAll (selected) {
      this.selectAllFlag = selected
      this.personList.forEach(person => {
        person._disabled = selected
        person._checked = selected
      })
    },
    selectPerson (selection) {
      // 正向查找
      for (let person of selection) {
        let targetPerson = this.selectedPersons.find(el => {
          return el.name === person.name
        })
        if (!targetPerson) {
          this.selectedPersons.push(person)
        }
        /*
        if (this.selectNames.indexOf(person.name) < 0) {
          this.selectNames.push(person.name)
        }
        */
      }

      // 没被选择的
      let unSelection = []
      for (let person of this.personList) {
        let targetPerson = selection.find(el => {
          return el.name === person.name
        })
        if (!targetPerson) {
          unSelection.push(person)
        }
      }

      // 去除没被选择的
      for (let person of unSelection) {
        this.selectedPersons = this.selectedPersons.filter(el => {
          return el.name !== person.name
        })
      }
      /*
      for (let person of unSelection) {
        let targetIndex = this.selectNames.indexOf(person.name)
        if (targetIndex >= 0) {
          this.selectNames.splice(targetIndex, 1)
        }
      }
      */
    },
    changePageSize (pageSize) {

    },
    changePageNum (pageNum) {
      this.searchParams.pageNum = pageNum
    },
    submitCreateParams () {
      console.log(JSON.stringify(this.selectedPersons))
    }
  },
  watch: {
    searchParams: {
      handler: function (newParams) {
        this.getPersonList(newParams).then(data => {
          this.selectAll(this.selectAllFlag)
          this.personList.forEach(person => {
            /*
            if (this.selectNames.indexOf(person.name) >= 0) {
              person._checked = true
            }
            */
            let targetPerson = this.selectedPersons.find(el => {
              return el.name === person.name
            })
            if (targetPerson) {
              person._checked = true
            }
          })
        })
      },
      deep: true
    }
  },
  created () {
    this.getPersonList(this.searchParams).then(data => {
    })
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
