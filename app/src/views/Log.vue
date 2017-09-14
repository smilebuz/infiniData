<template lang="html">
  <div class="">
    <Table :data="loglist"></Table>
  </div>
</template>

<script>
import { ...mapGetters, ...mapActions } from 'vuex'

export default {
  data () {},
  methods: {
    ...mapActions({
      getList: 'getLogList'
    })
  },
  computed: {
    ...mapGetters([
      'loglist'
    ])
  }
  mounted () {
    this.getList()
  }
}
</script>

<style lang="css">
</style>
