<template>
  <div class="integration">
    <Sidebar></Sidebar>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  name: 'integration',
  props: {},
  data () {
    return {}
  },
  components: {
    Sidebar
  }
}
</script>
<style lang='scss' scoped>
  .integration {
    height: 100%;
    display: flex;
    .content {
      flex-grow: 1;
    }
  }
</style>
