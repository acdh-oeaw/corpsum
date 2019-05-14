import Vue from 'vue';
import Vuex from 'vuex';

// import corpus from "@/store/corpus-rae";
import corpus from '@/store/corpus-rae';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    corpus,
  },
});
