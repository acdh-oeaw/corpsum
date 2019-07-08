<template>
  <nav class="d-none d-md-block sidebar">
    <div class="sidebar-sticky p-0">
      <a class="navbar-brand text-center m-0" href="#">corpsum</a>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center mt-4 mb-1">
        <span>Data Provider:</span>
      </h6>
      <b-form-select v-model="selectedProvider" :options="optionsProviders" @change="changeProvider" size="sm" class="corpus-selector"></b-form-select>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center mt-3 mb-1">
        <span>Active Corpus:</span>
      </h6>
      <b-form-select v-model="selectedCorpus" :options="optionsCorpora" @change="changeCorpus" size="sm" class="corpus-selector"></b-form-select>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center mt-3 mb-1">
        <span>Subcorpus:</span>
      </h6>
      <b-form-select v-model="selectedSubcorpus" :options="subcorporaList" @change="changeSubcorpus" size="sm" class="corpus-selector"></b-form-select>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center mt-4 mb-1">
        <span>Anaylsis:</span>
      </h6>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{ name: 'analysis', params: { id: selectedProvider } }" class="nav-link active">
            <activity-icon></activity-icon>
            Corpus Analysis
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'info', params: { id: selectedProvider } }" class="nav-link">
            <hard-drive-icon></hard-drive-icon>
            Corpus Info
          </router-link>
        </li>
      </ul>

      <h6 class="sidebar-heading d-flex justify-content-between align-items-center mt-3 mb-1">
        <span>Settings:</span>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <b-link class="nav-link" href="" disabled>
            <user-icon></user-icon>
            Profile
          </b-link>
        </li>
        <li class="nav-item">
          <b-link class="nav-link" href="" disabled>
            <settings-icon></settings-icon>
            Settings
          </b-link>
        </li>
        <li class="nav-item">
          <b-link class="nav-link" href="" disabled>
            <rotate-ccw-icon></rotate-ccw-icon>
            History
          </b-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { HardDriveIcon, ActivityIcon, UserIcon, SettingsIcon, RotateCcwIcon } from 'vue-feather-icons'

export default {
  name: 'sideNav',
  components: {
    HardDriveIcon, ActivityIcon, UserIcon, SettingsIcon, RotateCcwIcon
  },
  data() {
    return {
      selectedProvider: this.$route.params.id,
      optionsProviders: [
        { value: 'acdh', text: 'ACDH - ÖAW' },
        { value: 'rae', text: 'R.A.Espańola', disabled: true },
      ],
      optionsCorpora: [
        { value: 'amc3_demo', text: 'AMC3 (demo)' },
        { value: 'amc_60M', text: 'AMC3 (60M)' },
        { value: 'amc_3.1', text: 'AMC3 (Full)' },
      ],
    }
  },
  mounted() {
    if (localStorage.selectedCorpus) {
      this.$store.commit('changeSelectedCorpus', localStorage.selectedCorpus);
    }
    if (localStorage.selectedSubcorpus) {
      this.$store.commit('changeSelectedSubcorpus', localStorage.selectedSubcorpus);
    }
  },
  computed: {
    subcorporaList() {
      return this.$store.getters.subcorporaList;
    },
    selectedCorpus() {
      if (localStorage.selectedCorpus) {
        return localStorage.selectedCorpus;
      }
      return this.$store.getters.corpusName;
    },
    selectedSubcorpus() {
      if (localStorage.selectedSubcorpus) {
        return localStorage.selectedSubcorpus;
      }
      return this.$store.getters.subcorpusName;
    },
  },
  methods: {
    changeProvider(val) {
      this.$router.push({ name: 'info', params: { id: val } })
    },
    changeCorpus(val) {
      this.$store.commit('changeSelectedCorpus', val);
      localStorage.selectedCorpus = val;
    },
    changeSubcorpus(val) {
      this.$store.commit('changeSelectedSubcorpus', val);
      localStorage.selectedSubcorpus = val;
    }
  }
};
</script>

<style lang="scss">
/*
 * Sidebar
 */
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0;
  -webkit-box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  background: linear-gradient(to top, #3187b6, #17a2b8);
  width: 145px !important;

  .navbar-brand {
    width: 100%;
    font-size: 1.6rem;
    font-family: 'Signika', sans-serif;
    color: #fff;
    padding: 8px 0 8px 0;
    background-color: #0000002e;
  }

  .sidebar-heading {
    font-size: .75rem;
    text-transform: uppercase;
    padding-left: 0.75rem;
    padding-right: 0.25rem;
    color: #ffffffb8;
  }

  .corpus-selector {
    margin: 0 1rem 0 1rem;
    width: calc(100% - 2rem);
    padding-right: 0.3rem;
    background-color: transparent;
    color: #fff;
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid #ffffff38;
    padding-left: 0;
    background-image: linear-gradient(45deg, transparent 50%, white 60%), linear-gradient(135deg, white 40%, transparent 50%) !important;
    background-position: calc(100% - 18px) 12px, calc(100% - 10px) 12px, 100% 0;
    background-size: 8px 8px, 8px 8px;
    background-repeat: no-repeat;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .nav {

    .nav-item {
      border-bottom: 1px solid #fff3;

      &:first-child {
        border-top: 1px solid #fff3;
      }

      .nav-link {
        font-size: 0.8rem;
        padding: 0.5rem 0.25rem 0.5rem 0.75rem;
        font-weight: 500;
        color: #fff;
        background-color: #ffffff17;

        &:hover {
          background-color: #00000024;
        }

        &.router-link-active {
          background-color: #f4f5f8;
          color: #2a37da;
        }

        &:hover .feather, &.router-link-active .feather {
          color: inherit;
        }

        .feather {
          margin-right: 2px;
          color: #fff;
        }

      }

    }

  }

}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: 100vh;
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

</style>
