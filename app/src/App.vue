<template>
  <div id="app">
    <Navbar v-show="this.$router.history.current.name !== 'Login'"></Navbar>
    <router-view class="container">
    </router-view>
  </div>
</template>

<script>
import Navbar from './components/Nav'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style lang='scss' scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    /* margin-top: 60px; */
  }
  .container {
    display: flex;
    min-height: calc(100% - 50px);
  }
</style>
