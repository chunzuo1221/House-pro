<template>
  <div>
    <authenticated-view v-if="isAuthenticated" />
    <unauthenticated-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Login from './pages/Login'
import AuthenticatedView from './pages/AuthenticatedView'

export default {
  name: 'App',
  components: {
    'unauthenticated-view': Login,
    'authenticated-view': AuthenticatedView
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>

<style>
.application {
  font-family: 'Roboto';
  font-size: 16px;
}
.section-title {
  position: relative;
  padding-bottom: 5px;
}
.section-title::after {
  background-color: #528EC1;
  content: "";
  width: 60px;
  height: 3px;
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
