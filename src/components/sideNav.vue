<template>
  <nav class="col-md-1 d-none d-md-block sidebar">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Active Corpus:</span>
      </h6>
      <b-form-select v-model="selectedCorpus" :options="optionsCorpora" @change="changeCorpus" size="sm" class="corpus-selector"></b-form-select>
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Anaylsis:</span>
      </h6>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{ name: 'info', params: { id: selectedCorpus } }" class="nav-link">
            <hard-drive-icon></hard-drive-icon>
            Corpus Info
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'analysis', params: { id: selectedCorpus } }" class="nav-link active">
            <activity-icon></activity-icon>
            Corpus Analysis
          </router-link>
        </li>
      </ul>

      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Settings</span>
      </h6>
      <ul class="nav flex-column mb-2">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <user-icon></user-icon>
            Profile
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            <settings-icon></settings-icon>
            Settings
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            <rotate-ccw-icon></rotate-ccw-icon>
            History
          </a>
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
      selectedCorpus: this.$route.params.id,
      optionsCorpora: [
        { value: 'amc3demo', text: 'AMC3 (demo)' },
        { value: 'corpes', text: 'CORPES by RAE' },
      ]
    }
  },
  mounted() {
  },
  methods: {
    changeCorpus(val) {
      this.$router.push({ name: 'info', params: { id: val } })
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
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  background-color: #bfebf5;
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
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

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.router-link-active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.router-link-active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
  text-transform: uppercase;
}

.corpus-selector {
  margin: 0 1rem;
  width: calc(100% - 2rem);
}

.sidebar .nav-link {
  font-size: 0.8rem;
}

</style>
