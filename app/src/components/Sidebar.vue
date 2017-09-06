<template lang="html">
  <div class="side-menu" v-bind:style="style">
    <div class="menu-trigger" v-show="showMenu" @click="triggerMenu">
      <
    </div>
    <div class="menu-trigger" v-show="!showMenu" @click="triggerMenu">
      >
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
          path: '',
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
          path: '',
          imgUrl: require('../assets/images/icon/menu4.png'),
          imgUrlBG: require('../assets/images/icon/menu04.png')
        },
        {
          name: '数据源',
          path: '',
          imgUrl: require('../assets/images/icon/menu5.png'),
          imgUrlBG: require('../assets/images/icon/menu05.png')
        }
      ]
    }
  },
  computed: {
    style () {
      return this.showMenu ? {'width': '170px'} : {'width': '70px'}
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
  .side-menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    left: 0;
    top: 50px;
    height: 100%;
    background: #343B44;
    .menu-trigger {
      width: 100%;
      cursor: pointer;
      color: #fff;
      background: #434D5F;
    }
    .side-menu-item {
      width: 100%;
      height: 50px;
      text-align: left;
      margin-left: 20px;
      font-size: 14px;
      font-weight: 700;
      line-height: 50px;
      cursor: pointer;
      color: #fff;
    }
  }
  .menu-xs {
    width: 50px;
  }
</style>
