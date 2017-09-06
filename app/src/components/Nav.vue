<template lang="html">
  <div class="nav">
    <div class="logo">
    </div>
    <div class="nav-menu">
      <router-link tag="span" class="nav-menu-item" v-for="(item, index) in menu" :key="item.name" :to="item.path">
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: [
        {
          name: '数据集成',
          path: '/Integration'
        },
        {
          name: '数据处理',
          path: '/Handle'
        },
        {
          name: '数据管理',
          path: '/Manage'
        },
        {
          name: '运维管理',
          path: '/Op'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  .nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    background: #17191E;
    .logo {
      float: left;
      height: 100%;
      min-width: 200px;
      margin-left: 20px;
      background: url('../assets/images/icon/logo.png') no-repeat left center;
    }
    .nav-menu {
      display: inline-flex;
      float: left;
      height: 100%;
      align-items: center;
      .nav-menu-item {
        padding-left: 1em;
        padding-right: 1em;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        color: #fff;
      }
    }
  }
</style>
