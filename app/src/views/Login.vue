<template lang="html">
  <div class="login">
    <div class="login__form">
      <img src="../assets/images/icon/loginlogo.png" alt="logo" class="login__logo">
      <Card class="card">
        <p slot="title">用户登录</p>
        <Input placeholder="用户名/邮箱" size="large" class="login__item"
          v-model="loginParams.userName"
          @on-enter="submitLoginParams"
        ></Input>
        <Input placeholder="密码" type="password" size="large" class="login__item"
          v-model="loginParams.password"
          @on-enter="submitLoginParams"
        ></Input>
        <Button class="login__item-button" type="info" long
          @click="submitLoginParams"
        >登录</Button>
        <!--Checkbox v-model="loginParams.rememberPW" class="login__item-checkbox">记住密码</Checkbox-->
      </Card>
    </div>
    <div class="copyright">
      <p>版权所有 &copy; 2016-2017 {{ companyName }}</p>
      <!--p>Copyright &copy; Spacewalk Company Limited.. All Rights Reserved</p-->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loginParams: {
        userName: '',
        password: ''
        // rememberPW: false
      }
    }
  },
  computed: {
    ...mapGetters({
      companyName: 'companyName'
    })
  },
  methods: {
    ...mapActions({
      login: 'login',
      getCompanyName: 'getCompanyName'
    }),
    submitLoginParams () {
      this.login(this.loginParams).then(data => {
        this.$router.push('/Integration/Dashboard')
      }).catch(error => {
        this.$Message.warning({
          content: error.message,
          top: 50,
          duration: 1.5
        })
      })
    }
  },
  created () {
    this.getCompanyName().then(data => {})
  }
}
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-bottom: 20px;
    background: url('../assets/images/icon/loginbg.png') no-repeat center;
    background-color: #091327;
    //background-size: 100% 100%;
  }
  .login__logo {
    width: 300px;
  }
  .card {
    padding-bottom: 20px;
  }
  .login__form {
    width: 300px;
  }
  .login__item {
    margin-bottom: 20px;
  }
  .login__item-checkbox {
    float: right;
  }
  .login__item-button {
    background: #66b8ef;
    margin-bottom: 0;
  }
  .copyright {
    padding-top: 30px;
    color: #fff;
  }
</style>
