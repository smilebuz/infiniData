<template lang="html">
  <div class="side-menu">
    <router-link :to="item.path" tag="span" class="side-menu-item" v-for="(item, index) in menu" :key="item.name">
      <img :src="item.imgUrl" :alt="item.name">
      {{ item.name }}
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: [
        {
          name: '离线导入',
          path: '/Integration/OffImport',
          imgUrl: require('../assets/images/icon/menu2.png')
        },
        {
          name: '定时导入',
          path: '/Integration/IncImport',
          imgUrl: require('../assets/images/icon/menu3.png')
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  .side-menu {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 50px;
    height: 100%;
    width: 150px;
    background: #525968;
    .side-menu-item {
      font-size: 14px;
      font-weight: 700;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      color: #fff;
    }
  }
</style>
