<template>
  <div class="integration">
    <Sidebar></Sidebar>
    <div class="content">
      <router-view class="content__main"></router-view>
      <myFooter></myFooter>
    </div>
    <!--router-view class="content"></router-view>
    <myFooter></myFooter-->
  </div>
</template>

<script>
import '../../assets/css/common.scss'
import '../../assets/css/pagination.scss'

import Sidebar from '@/components/Sidebar'
import myFooter from '@/components/Footer'

export default {
  name: 'integration',
  props: {},
  data () {
    return {}
  },
  components: {
    Sidebar, myFooter
  }
}
</script>

<style lang='scss' scoped>
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
