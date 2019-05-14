<template>
  <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-sm-2 col-md-1 mr-0" href="#">corpsum</a>
    <tags-input element-id="queryTerms" class="w-100"
      v-model="queryTerms"
      @tag-added="tagAdded"
      @tag-removed="tagRemoved"
      placeholder="Type another term to query">
    </tags-input>
    <ul class="navbar-nav px-3">
      <li class="nav-item text-nowrap">
        <a class="nav-link" href="#">Sign out</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import store from '@/store/store';

export default {
  name: 'topNav',
  data() {
    return {
      queryTerms: this.$store.getters.queryTerms,
    };
  },
  methods: {
    tagAdded(queryTerm) {
      //this.$store.commit('queryTermAdded', queryTerm);
      this.$store.dispatch('corpusQuery', queryTerm);
      //this.$emit('onQueryTermAdded', queryTerm);
    },
    tagRemoved(queryTerm) {
      //this.$store.commit('queryTermRemoved', queryTerm);
      //this.$emit('onQueryTermRemoved', queryTerm);
    }
  },
};
</script>

<style lang="scss">
/*
 * Tagsinput CSS
 */

 /* The input */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tags-input input {
  flex: 1;
  background: transparent;
  border: none;
}

.tags-input input:focus {
  outline: none;
}

.tags-input input[type="text"] {
  color: #495057;
}

.tags-input-wrapper-default {
  padding: .5rem .25rem;

  background: #fff;

  border: 1px solid transparent;
  border-radius: .25rem;
  border-color: #dbdbdb;
}

/* The tag badges & the remove icon */
.tags-input span {
  margin-right: 0.3rem;
}

.tags-input-remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
}

.tags-input-remove:before, .tags-input-remove:after {
  content: '';
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: #5dc282;

  height: 2px;
  margin-top: -1px;
}

.tags-input-remove:before {
  transform: rotate(45deg);
}
.tags-input-remove:after {
  transform: rotate(-45deg);
}

/* Tag badge styles */
.tags-input-badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.tags-input-badge-pill {
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;
}

.tags-input-badge-selected-default {
  color: #212529;
  background-color: #f0f1f2;
}

/* Typeahead - badges */
.typeahead-badges > span {
  cursor: pointer;
  margin-right: 0.3rem;
}

/* Typeahead - dropdown */
.typeahead-dropdown {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
}

.typeahead-dropdown li {
  padding: .25rem 1rem;
  cursor: pointer;
}

/* Typeahead elements style/theme */
.tags-input-typeahead-item-default {
  color: #fff;
  background-color: #343a40;
}

.tags-input-typeahead-item-highlighted-default {
  color: #fff;
  background-color: #007bff;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .form-control {
  padding: .75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}


/* App Styles * /

/* Tags input overwrites */
.tags-input-badge {
  font-size: 100%;
}

.tags-input-badge-pill {
  padding: 0.5rem 0.5rem;
  border-radius: .25rem;
}

.tags-input-wrapper-default {
  border: 0;
  background: #ffffff;
  padding: .25rem .5rem;
}

.tags-input span {
  margin-right: 0.4rem;
}

.tags-input-badge-selected-default {
  background-color: #eff2f5;
  box-shadow: 1px 1px 0px 0px #afafafba;
}

.tags-input-remove {
  width: 0.75rem;
  height: 0.75rem;
  vertical-align: middle;
}

</style>
