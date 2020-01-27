<template>
  <v-app>
    <v-dialog
      v-model="dialog"
      fullscreen hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card :style="{backgroundImage: `url(${backgroundImage})`}" class="login-dialog-card">
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { REQUEST_ACCESS_TOKEN } from '@/store/action-types'
import { getQueryParam } from '../utils'

export default {
  name: 'Login',
  data () {
    return {
      dialog: true,
      backgroundImage: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  async mounted () {
    this.backgroundImage = require('@/assets/images/login-bg.svg')
    try {
      const code = this.$route.query.code || getQueryParam('code')
      if (!this.isAuthenticated) {
        if (!code) {
          throw new Error('No authorization code')
        }
        await this.$store.dispatch(REQUEST_ACCESS_TOKEN, {code})
      }
      this.$router.replace({name: 'Properties'})
    } catch (error) {
      console.log(error)
      this.goHome()
    }
  },
  methods: {
    goHome () {
      window.location = window.location.origin
    }
  }
}
</script>

<style scoped>
.login-dialog-card {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
