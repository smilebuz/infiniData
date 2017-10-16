<template lang="html">
  <div class="op">
    <OpSidebar></OpSidebar>
    <div class="content">
      <router-view class="content__main"></router-view>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import '../../assets/css/common.scss'
import '../../assets/css/pagination.scss'

import OpSidebar from '../../components/OpSidebar'
import myFooter from '../../components/Footer'

export default {
  name: 'Op',
  props: {},
  data () {
    return {}
  },
  components: {
    OpSidebar, myFooter
  }
}
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
  .content__main {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
