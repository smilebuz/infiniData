<template lang="html">
  <div class="side-menu" v-bind:style="style">
    <div class="menu-trigger" v-show="showMenu" @click="triggerMenu">
      <Icon type="arrow-left-b" />
    </div>
    <div class="menu-trigger" v-show="!showMenu" @click="triggerMenu">
      <Icon type="arrow-right-b" />
    </div>
    <router-link :to="item.path" tag="div" class="side-menu-item" v-for="(item, index) in menu" :key="item.name">
      <img :src="item.imgUrl" :alt="item.name" v-show="showMenu">
      <img :src="item.imgUrlBG" :alt="item.name" v-show="!showMenu">
      <span v-show="showMenu">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showMenu: true,
      menu: [
        {
          name: '仪表盘',
          path: '/Integration/Dashboard',
          imgUrl: require('../assets/images/icon/menu1.png'),
          imgUrlBG: require('../assets/images/icon/menu01.png')
        },
        {
          name: '离线导入',
          path: '/Integration/OffImport',
          imgUrl: require('../assets/images/icon/menu2.png'),
          imgUrlBG: require('../assets/images/icon/menu02.png')
        },
        {
          name: '定时导入',
          path: '/Integration/IncImport',
          imgUrl: require('../assets/images/icon/menu3.png'),
          imgUrlBG: require('../assets/images/icon/menu03.png')
        },
        {
          name: '离线导出',
          path: '/Integration/OffExport',
          imgUrl: require('../assets/images/icon/menu4.png'),
          imgUrlBG: require('../assets/images/icon/menu04.png')
        },
        {
          name: '数据源',
          path: '/Integration/Source',
          imgUrl: require('../assets/images/icon/menu5.png'),
          imgUrlBG: require('../assets/images/icon/menu05.png')
        }
      ]
    }
  },
  computed: {
    style () {
      return this.showMenu ? {'flex-basis': '170px'} : {'flex-basis': '70px'}
    }
  },
  methods: {
    triggerMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style lang="scss">
  
</style>
