<template lang="html">
  <div class="sidebar" v-bind:style="style">
    <div class="sidebar__trigger" v-show="showMenu" @click="triggerMenu">
      <Icon type="arrow-left-b" />
    </div>
    <div class="sidebar__trigger" v-show="!showMenu" @click="triggerMenu">
      <Icon type="arrow-right-b" />
    </div>
    <router-link :to="item.path" tag="div" class="sidebar__item" v-for="(item, index) in menu" :key="item.name">
      <img :src="item.imgUrl" :alt="item.name" v-show="showMenu" class="sidebar__icon">
      <img :src="item.imgUrlBG" :alt="item.name" v-show="!showMenu" class="sidebar__icon-bg">
      <span v-show="showMenu">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script>
import bus from '../bus'

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
      return this.showMenu ? {'flex-basis': '170px', 'min-width': '170px'} : {'flex-basis': 'auto'}
    }
  },
  methods: {
    triggerMenu () {
      this.showMenu = !this.showMenu
      bus.$emit('triggerMenu', this.showMenu)
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar {
    background: #343b44;
    color: #fff;
  }
  .sidebar__trigger {
    cursor: pointer;
    &:hover {
      background: #434d5f;
    }
  }
  .sidebar__item {
    display: flex;
    align-items: center;
    height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background: #434d5f;
    }
  }
  .sidebar__icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  .sidebar__icon-bg {

  }
</style>
