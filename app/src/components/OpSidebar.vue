<template lang="html">
  <div class="sidebar" v-bind:style="style">
    <div class="sidebar__trigger" v-show="showMenu" @click="triggerMenu">
      <Icon type="arrow-left-b" />
    </div>
    <div class="sidebar__trigger" v-show="!showMenu" @click="triggerMenu">
      <Icon type="arrow-right-b" />
    </div>
    <div class="sidebar__item"
      v-for="(item, index) in menu"
      :key="item.name"
      :class="{ sidebar__selected: item.isSelected }"
      @click="selectSidebar(item)">
      <img :src="item.imgUrl" :alt="item.name" v-show="showMenu" class="sidebar__icon">
      <img :src="item.imgUrlBG" :alt="item.name" v-show="!showMenu" class="sidebar__icon-bg">
      <span v-show="showMenu">{{ item.name }}</span>
    </div>
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
          isSelected: true,
          imgUrl: require('../assets/images/icon/log.png'),
          imgUrlBG: require('../assets/images/icon/logbg.png')
        },
        {
          name: '用户管理',
          path: '/Op/UserManage',
          isSelected: false,
          imgUrl: require('../assets/images/icon/user.png'),
          imgUrlBG: require('../assets/images/icon/userbg.png')
        },
        {
          name: '系统配置',
          path: '/Op/SystemResource',
          isSelected: false,
          imgUrl: require('../assets/images/icon/resource.png'),
          imgUrlBG: require('../assets/images/icon/resourcebg.png')
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
    },
    selectSidebar (sidebar) {
      this.menu.forEach(item => {
        item.isSelected = (item.name === sidebar.name)
      })
      this.$router.push(sidebar.path)
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
    height: 50px;
    border-bottom: 1px solid #2c2c2c;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    &:hover {
      background: #434d5f;
    }
  }
  .sidebar__selected {
    background: #434d5f;
  }
  .sidebar__icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
</style>
