<template>
  <Table stripe border
    :columns="columns"
    :data="data">
  </Table>
</template>

<script>
import { dateFormatter2 } from '../utils/dateFormatter'

export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          title: '序号',
          align: 'center'
        },
        {
          title: '姓名',
          key: name,
          align: 'center'
        },
        {
          title: '日期',
          render: (h, params) => {
            return this.renderDatePicker(h, params)
          }
        },
        {
          title: '显示日期',
          render: (h, params) => {
            return h('Button', {
              props: {
                size: 'small',
                type: 'primary'
              },
              on: {
                click: () => {
                  console.log(this.dateSelected)
                }
              }
            }, '显示日期')
          }
        }
      ],
      data: [
        {
          name: '张三',
          date: ''
        },
        {
          name: '李四',
          date: ''
        }
      ]
    }
  },
  methods: {
    renderDatePicker (h, params) {
      return h('DatePicker', {
        props: {
          size: 'small',
          transfer: true,
          value: this.dateSelected
        },
        on: {
          input: (value) => {
            if (value) {
              if (typeof value === 'object') {
                this.dateSelected = dateFormatter2(value)
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>


