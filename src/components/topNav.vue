<template>
  <nav class="navbar navbar-dark fixed-top flex-md-nowrap shadow ml-auto px-2">
    <search-icon class="topnav-search-icon" @click="$bvModal.show(chartInfoModal.id)" v-b-tooltip.hover title="See query examples"></search-icon>
    <multiselect
      class="ml-2"
      v-model="queryAttribute"
      :options="queryAttributeOptions"
      :searchable="false"
      :close-on-select="true"
      :show-labels="false"
      :allow-empty="false"
      track-by="name"
      label="name" 
      placeholder="Query attribute"
    >
      <template slot="option" slot-scope="{ option }">
        {{ option.name }} <span class="ml-auto">{{ option.desc }}</span>
      </template>
    </multiselect>

    <vue-tags-input element-id="queryTerms" class="w-100"
      v-model="tag"
      :tags="tags"
      placeholder="Type a keyword or query and hit enter"
      :add-from-paste="false"
      :add-on-blur="false"
      :max-tags="6"
      @before-adding-tag="tagAdded"
      @before-deleting-tag="tagRemoved"/>
    
<!--     <ul class="navbar-nav px-3 topbar-rightnav">
      <li class="nav-item text-nowrap">
        <b-link href="https://github.com/asilcetin/corpsum">
          <github-icon></github-icon>
        </b-link>
      </li>
    </ul> -->

    <div class="topnav-spinner text-center" v-show="loadingStatus">
      <span>Querying the corpus, please wait.</span>
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>

    <b-modal :id="chartInfoModal.id" :title="chartInfoModal.title" size="lg" ok-only scrollable>{{chartInfoModal.content}}</b-modal>

  </nav>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { SearchIcon } from 'vue-feather-icons'
import { GithubIcon } from 'vue-feather-icons'

export default {
  name: 'topNav',
  props: {
    tags: Array
  },
  components: {
    VueTagsInput, SearchIcon, GithubIcon
  },
  data() {
    return {
      tag: '',
      toggleSpinner: false,
      chartInfoModal: {
        id: 'info-modal-query-examples',
        title: 'Query Examples',
        content: 'Here are some examples',
      },
      queryAttribute: { name: '[word="keyword"]', value: 'word', desc: 'A word form, case sensitive' },
      queryAttributeOptions: [
        { name: 'Custom query', value: 'custom', desc: 'Write your own query in CQL' },
        { name: '[word="keyword"]', value: 'word', desc: 'A word form, case sensitive' },
        { name: '[lemma="keyword"]', value: 'lemma', desc: 'A lemma, case sensitive' },
        { name: '[lc="keyword"]', value: 'lc', desc: 'Lowercase word form, case insensitve', },
        { name: '[lc=".*keyword.*"]', value: 'lc-comp', desc: 'Lc. keyword incl. compositions, case insensitve', },
      ],
    };
  },
  computed: {
  },
  methods: {
    tagAdded(val) {
      this.tag = '';
      switch (this.queryAttribute.value) {
        case 'word':
          val.tag.text = `[word="${val.tag.text}"]`;
          break;
        case 'lemma':
          val.tag.text = `[lemma="${val.tag.text}"]`;
          break;
        case 'lc':
          val.tag.text = `[lc="${val.tag.text.toLowerCase()}"]`;
          break;
        case 'lc-comp':
          val.tag.text = `[lc=".*${val.tag.text.toLowerCase()}.*"]`;
          break;
        case 'custom':
          val.tag.text = val.tag.text;
          break;
        default:
          val.tag.text = `[word="${val.tag.text}"]`;
      }
      if (this.$router.currentRoute.name !== 'analysis') {
        this.$router.push({ name: 'analysis' });
      }
      this.$store.commit('queryTermAdded', val.tag);
      this.$store.dispatch('corpusQuery', val.tag.text);
    },
    tagRemoved(val) {
      this.tag = '';
      if (this.$router.currentRoute.name !== 'analysis') {
        this.$router.push({ name: 'analysis' });
      }
      this.$store.commit('queryTermRemoved', val.tag);
    },
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
  min-height: 37px;
  align-content: center;
  display: flex;
}

.ti-input {
  border: 0 !important;
  padding: 0 0.5rem 0 0.5rem !important;
  flex-basis: 100%;
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

  .multiselect {
    flex-basis: 150px;

    .multiselect__select {
      padding: 4px 8px 4px 6px;
      width: auto;
    }

    .multiselect__tags {
      min-height: auto;
      padding: 8px 22px 0 4px;
      margin-top: 2px;
    }

    .multiselect__input, .multiselect__single, .multiselect__element {
      font-size: 0.9rem;
    }

    .multiselect__content-wrapper {
      width: 450px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    .multiselect__option {
      min-height: auto;
      padding: 8px 6px;
      display: flex;
    }

  }

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
  cursor: pointer;
}

.topbar-rightnav .feather {
  width: 1.25rem;
  height: 1.25rem;
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
