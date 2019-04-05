import Vue from 'vue';
import Vs from 'd3-vs';
import App from './App.vue';
import router from './router';

// install globally all d3-vs components
Vue.use(Vs);

Vue.config.productionTip = false;

new Vue({
  router,
  render(h) { return h(App); },
}).$mount('#app');
