<template lang="html">
  <div class="login">
    <div class="login__form">
      <img src="../assets/images/icon/loginlogo.png" alt="logo" class="login__logo">
      <Card class="card">
        <p slot="title">用户登录</p>
        <Input v-model="login.username" placeholder="用户名/邮箱" class="login__item"></Input>
        <Input v-model="login.password" placeholder="密码" class="login__item"></Input>
        <Button class="login__item" type="info" long>登录</Button>
        <Checkbox v-model="login.rememberPW" class="login__item-checkbox">记住密码</Checkbox>
      </Card>
    </div>
    <div class="copyright">
      <p>版权所有 &copy; 中坤天行信息科技有限公司</p>
      <p>Copyright &copy; Spacewalk Company Limited.. All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login: {
        username: '',
        password: '',
        rememberPW: false
      }
    }
  }
}
</script>

<style lang="scss">
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-bottom: 20px;
    background: url('../assets/images/icon/loginbg.png');
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
  .copyright {
    margin-top: 50px;
    color: #fff;
  }
</style>
