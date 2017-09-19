<template lang="html">
  <div class="op">
    <OpSidebar></OpSidebar>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import '../../assets/css/common.scss'
import '../../assets/css/pagination.scss'

import OpSidebar from '../../components/OpSidebar'

export default {
  name: 'Op',
  props: {},
  data () {
    return {}
  },
  components: {
    OpSidebar
  }
}
</script>

<style lang="scss" scoped>
  .content {
    flex: 1;
    overflow: hidden;
  }
</style>
