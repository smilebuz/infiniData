<template lang="html">
  <div>
    <Sidebar></Sidebar>
    <router-view></router-view>
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
</style>
