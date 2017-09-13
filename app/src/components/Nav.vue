<template lang="html">
  <div class="nav">
    <div class="nav__logo">
    </div>
    <div class="nav__menu">
      <router-link tag="span" class="nav__menu-item" v-for="(item, index) in menu" :key="item.name" :to="item.path">
        {{ item.name }}
      </router-link>
    </div>
    <div class="nav__user">
      <Avatar icon="person" />
      <div class="user__info">
        <p class="user__info-name">{{ user.name }}</p>
        <p class="user__info-position">{{ user.position }}</p>
      </div>
      <div class="user__logout" @click="logout">
        <Icon type="power" />
        <span>退出</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      menu: [
        {
          name: '数据集成',
          path: '/Integration/Dashboard'
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
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ])
  }
}
</script>

<style lang="scss">
  .nav {
    height: 50px;
    position: relative;
    background: #17191e;
  }
  .nav__logo {
    position: absolute;
    height: 100%;
    width: 180px;
    left: 10px;
    background: url('../assets/images/icon/logo.png') no-repeat left center;
  }
  .nav__menu {
    position: absolute;
    left: 220px;
    display: flex;
    height: 100%;
    color: #fff;
  }
  .nav__menu-item {
    width: 70px;
    line-height: 50px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    &:hover {
      background: #66b8f0;
    }
  }
  .nav__user {
    position: absolute;
    right: 30px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #fff;
  }
  .user__info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  .user__logout {
    margin-left: 30px;
    font-size: 14px;
    cursor: pointer;
    color: #8e9093;
  }
</style>
