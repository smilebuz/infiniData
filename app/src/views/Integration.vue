<template lang="html">
  <div>
    <Sidebar></Sidebar>
    <router-view class="content"></router-view>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar'

export default {
  components: {
    Sidebar
  }
}
</script>

<style lang="scss">
  .content {
    margin-left: 170px;
  }
</style>
