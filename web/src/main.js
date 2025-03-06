import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios';
import './plugins/sse'; // Import the SSE plugin
import copyCode from './directives/copyCode'; // Import the custom directive

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "highlight.js/styles/github-dark.css"

Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(ElementUI);
Vue.directive('copy-code', copyCode); // Register the custom directive

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
