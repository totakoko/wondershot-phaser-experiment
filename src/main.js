import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './registerServiceWorker'
import log from 'loglevel'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.performance = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = false

log.setLevel('info')
log.setLevel('debug')
log.getLogger('Player').setLevel('warn')
log.getLogger('Arena').setLevel('warn')

// window.addEventListener('gamepadconnected', function (e) {
//   console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
//     e.gamepad.index, e.gamepad.id,
//     e.gamepad.buttons.length, e.gamepad.axes.length)
// })

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
