import Vue from 'vue'
import VModal from 'vue-js-modal'
import Vuelidate from 'vuelidate'
import VueSnackbar from 'vue-snack'
import 'vue-snack/dist/vue-snack.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VueProgressBar from 'vue-progressbar'
import wysiwyg from 'vue-wysiwyg'
import 'vue-wysiwyg/dist/vueWysiwyg.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudUploadAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App'
import store from './store'
import router from './router'
import { getAuthFromStorage } from './utils'
import { SET_TOKENS } from './store/mutation-types'

Vue.use(VModal, { dynamic: true })
Vue.use(Vuelidate)
Vue.use(VueSnackbar, { close: true })
Vue.use(ElementUI, { locale })
Vue.use(VueProgressBar, {
  color: '#18924c',
  failedColor: 'red',
  height: '2px',
  position: 'absolute'
})
Vue.use(wysiwyg, {})

library.add(faCloudUploadAlt)
library.add(faPencilAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
Promise.resolve(getAuthFromStorage())
  .then(auth => {
    const result = auth === true ? "Success" : "Failed"
    store.commit(SET_TOKENS, result)
    new Vue({
      el: '#vue-root',
      store,
      router,
      render: h => h(App)
    })
  })
