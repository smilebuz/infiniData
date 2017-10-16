<template>
  <div class="footer">
    <span>版权所有 &copy; 2016-2017 {{ companyName }}</span>
    <!--img src="../assets/images/1.png" alt="公司图标"-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      companyName: 'companyName'
    })
  },
  methods: {
    ...mapActions({
      getCompanyName: 'getCompanyName'
    })
  },
  created () {
    this.getCompanyName().then(data => {})
  }
}
</script>

<style lang="scss">
  .footer {
    display: flex;
    height: 30px;
    padding-left: 15px;
    line-height: 30px;
    background: #fff;
    color: #cdcdcd;
  }
</style>
