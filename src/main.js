import Vue from 'vue'
import App from './App.vue'
import VueMoment from 'vue-moment'
import vuetify from './plugins/vuetify'
import store from './store'

import { VueMaskDirective } from 'v-mask'

Vue.config.productionTip = true

Vue.directive('mask', VueMaskDirective);
Vue.use(VueMoment, { moment })

const moment = require('moment')
require('moment/locale/ru')

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
