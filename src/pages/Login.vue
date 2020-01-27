<template>
  <div class="login-page">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { REQUEST_ACCESS_TOKEN } from '@/store/action-types'

export default {
  name: 'Login',
  async created () {
    try {
      const code = this.$route.query.code
      if (!this.isAuthenticated && code) {
        await this.$store.dispatch(REQUEST_ACCESS_TOKEN, {code})
        window.location = window.location.origin + '/dashboard'
      }
    } catch (error) {
      console.log(error)
    }
    this.$router.replace({name: 'Home'})
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
}
</style>
