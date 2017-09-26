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
        /*
        {
          name: '仪表盘',
          path: '/Integration/Dashboard',
          imgUrl: require('../assets/images/icon/menu1.png'),
          imgUrlBG: require('../assets/images/icon/menu01.png')
        },
        */
        {
          name: '离线导入',
          path: '/Integration/OffImport',
          isSelected: true,
          imgUrl: require('../assets/images/icon/menu2.png'),
          imgUrlBG: require('../assets/images/icon/menu02.png')
        },
        {
          name: '定时导入',
          path: '/Integration/IncImport',
          isSelected: false,
          imgUrl: require('../assets/images/icon/menu3.png'),
          imgUrlBG: require('../assets/images/icon/menu03.png')
        },
        {
          name: '离线导出',
          path: '/Integration/OffExport',
          isSelected: false,
          imgUrl: require('../assets/images/icon/menu4.png'),
          imgUrlBG: require('../assets/images/icon/menu04.png')
        },
        {
          name: '数据源',
          path: '/Integration/Source',
          isSelected: false,
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
