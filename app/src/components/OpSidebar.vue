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
export default {
  data () {
    return {
      showMenu: true,
      menu: [
        {
          name: '日志管理',
          path: '/Op/LogManage',
          imgUrl: require('../assets/images/icon/menu1.png'),
          imgUrlBG: require('../assets/images/icon/menu01.png')
        },
        {
          name: '用户管理',
          path: '/Op/UserManage',
          imgUrl: require('../assets/images/icon/menu2.png'),
          imgUrlBG: require('../assets/images/icon/menu02.png')
        },
        {
          name: '系统资源',
          path: '/Op/SystemResource',
          imgUrl: require('../assets/images/icon/menu3.png'),
          imgUrlBG: require('../assets/images/icon/menu03.png')
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
</style>
