import Vue from 'vue';
import Vuex from 'vuex';

import corpus from '@/store/corpus-amc';
import info from '@/store/info-amc';
// import corpus from '@/store/corpus-rae';
// import info from '@/store/info-rae';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    corpus, info,
  },
});
