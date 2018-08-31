import Vue from 'vue'
import Axios from 'axios'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

import App from './App.vue'
import Router from './router'
import Store from './store'
import Auth from './lib/auth'

const initApp = () => {
  Vue.config.productionTip = true
  const url = Store.getters.config.SiteHost
  const port = Store.getters.config.ports.node
  Vue.use(VueSocketio, io(`http://${url}:${port}/wand`))

  const token = localStorage.getItem('user-token')
  if (token) {
    Axios.defaults.headers.common.Authorization = Auth.getAuthHeader()
  }

  new Vue({
    router: Router,
    store: Store,
    render: h => h(App)
  }).$mount('#app')
}

const bootstrap = () => {
  const { events = {} } = Store.getters
  if (!events.length) {
    Axios.get('/api/config')
      .then(({ data }) => {
        Store.dispatch('setConfig', data)
        initApp()
      })
      .catch(() => {
        // console.error('[system]', 'Could not fetch config. Response: ', err)
      })
  }
}

bootstrap()

