<template>
  <div id="app">
    <topNav/>
    <div class="container-fluid">
      <div class="row">
        <sideNav/>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import topNav from '@/components/topNav.vue';
import sideNav from '@/components/sideNav.vue';

export default {
  name: 'App',
  components: {
    topNav, sideNav
  },
  mixins: [],
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style lang="scss">
/*
 * Dashboard CSS
 */
body {
  font-size: .875rem;
  background-color: #F1F1F1;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Content
 */
[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}

@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}

</style>
