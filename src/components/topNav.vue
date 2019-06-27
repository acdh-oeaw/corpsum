<template>
  <nav class="navbar navbar-dark fixed-top flex-md-nowrap shadow ml-auto px-2">
    <search-icon class="topnav-search-icon"></search-icon>
    <vue-tags-input element-id="queryTerms" class="w-100"
      v-model="tag"
      :tags="tags"
      placeholder="Type your query and hit enter"
      @before-adding-tag="tagAdded"
      @before-deleting-tag="tagRemoved"/>
    
    <ul class="navbar-nav px-3">
      <li class="nav-item text-nowrap">
        <a class="nav-link" href="#">Sign out</a>
      </li>
    </ul>

    <div class="topnav-spinner text-center" v-show="loadingStatus">
      <span>Querying the corpus, please wait.</span>
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>

  </nav>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { SearchIcon } from 'vue-feather-icons'

export default {
  name: 'topNav',
  components: {
    VueTagsInput, SearchIcon
  },
  data() {
    return {
      tag: '',
      tags: this.$store.getters.queryTerms,
      toggleSpinner: false,
    };
  },
  computed: {
  },
  methods: {
    tagAdded(val) {
      this.tag = '',
      this.$store.commit('queryTermAdded', val.tag);
      this.$store.dispatch('corpusQuery', val.tag.text);
    },
    tagRemoved(val) {
      this.tag = '',
      this.$store.commit('queryTermRemoved', val.tag);
    }
  },
  computed: {
    loadingStatus() {
      return this.$store.getters.loadingStatus;
      set: (value) => console.log(value) // this.$state.commit('someMutation', value )
    },
  },
  watch: {
  },
};
</script>

<style lang="scss">
/*
 * Tagsinput Styles
 */
.vue-tags-input {
  max-width: initial !important;
  background: #ffffff;
  border-radius: 0.25rem;
}

.ti-input {
  border: 0 !important;
  padding: 0 0.5rem 0 0.5rem !important;
}

.ti-new-tag-input-wrapper {
  font-size: 1rem !important;
}

.ti-tag {
  font-size: 1rem !important;
  background-color: #eff2f5 !important;
  -webkit-box-shadow: 1px 1px 0px 0px #afafafba;
  box-shadow: 1px 1px 0px 0px #afafafba;
  padding: 0.5rem 0.5rem !important;
  margin: 0 0.4rem 0 0 !important;
  border-radius: 0.25rem !important;
  color: inherit !important;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
}

.ti-icon-close:before {
  color: #e04949 !important;
}

/*
 * Navbar
 */
.navbar {
  background-color: #fff;
}

.navbar .form-control {
  padding: 0.75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.topnav-search-icon.feather {
  margin-left: 0.75rem;
  height: 1.25rem;
  width: 1.25rem;
  color: #17a2b8;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.topnav-spinner {
  position: absolute;
  width: 100%;
  background-color: #ffffffad;
  height: 100%;
  top: 0;
  padding: 13px;
}

.topnav-spinner > span {
  vertical-align: middle;
  padding: 0 10px;
  font-weight: 500;
}
</style>
