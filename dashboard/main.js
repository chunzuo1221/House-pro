import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/fonts/index.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as VueGoogleMaps from 'vue2-google-maps'
import wysiwyg from 'vue-wysiwyg'
import 'vue-wysiwyg/dist/vueWysiwyg.css'

import App from './App'
import store from './store'
import router from './router'
import { getAuthFromStorage } from './utils'
import { SET_TOKENS } from './store/mutation-types'

library.add(faSpinner)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Vuetify, {
  theme: {
    primary: '#528EC1',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.google.GOOGLE_API_KEY,
    libraries: 'places'
  }
})
Vue.use(wysiwyg, {})

Vue.config.productionTip = false

/* eslint-disable no-new */
Promise.resolve(getAuthFromStorage())
  .then(session => {
    store.commit(SET_TOKENS, session)
    new Vue({
      el: '#app',
      store,
      router,
      render: h => h(App)
    })
  })
