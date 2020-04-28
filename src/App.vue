<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <!--<sideNav/>-->
        <topNav v-bind:tags="tags" class="v-step-0"/>
        <router-view name="Content"></router-view>
      </div>
    </div>
    <v-tour name="myTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
  </div>
</template>

<script>
// @ is an alias to /src
import topNav from '@/components/topNav.vue';
import sideNav from '@/components/sideNav.vue';

export default {
  name: 'App',
  components: {
    topNav, sideNav,
  },
  mixins: [],
  data() {
    return {
      tourCallbacks: {
        onStop: this.onTourComplete,
      },
      steps: [
        {
          target: '.v-step-0',
          content: 'Using this search bar you can make queries in the corpus by typing your query and hitting enter to search.',
        },
        {
          target: '.query-type-selector',
          content: 'The selected query type will be applied to your search. You can click this selector to see the descriptions of different type of queries.',
        },
        {
          target: '.sidebar-sticky',
          content: 'Using selectors on this sidebar you can select your active corpus and subcorpus. You can also switch between different pages such as Corpus Info and Corpus Analysis.',
          params: {
            placement: 'left-start',
          },
        },
        {
          target: '.feather-info',
          content: 'If you want to more know about a component click this info button to open the information window.',
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.feather-list',
          content: 'You can click this button to see the data behind the chart as a table.',
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.feather-download',
          content: 'You can click this button to download the data as CSV.',
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.feather-image',
          content: 'You can click this button to download the chart as an SVG.',
          params: {
            enableScrolling: false,
          },
        },
      ],
    };
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('getSubcorporaList');
    this.$store.dispatch('queryCorpusInfo');
    if (!localStorage.tourCompleted) {
      this.$tours.myTour.start();
    }
  },
  computed: {
    tags() {
      return this.$store.getters.queryTerms;
    },
  },
  watch: {
  },
  methods: {
    onTourComplete() {
      localStorage.tourCompleted = true;
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
/*
 * Dashboard CSS
 */
@import url('https://fonts.googleapis.com/css?family=Barlow&display=swap');
@import url('https://fonts.googleapis.com/css?family=Signika&display=swap');

body {
  font-size: .8rem;
  font-family: 'Barlow', sans-serif;
  background-color: #f5f6f9;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.highcharts-root {

  * {
    font-family: 'Barlow', sans-serif !important;
    font-weight: 400 !important;
  }

  .highcharts-point {
    opacity: 0.95;
  }

  .highcharts-tooltip-box {
    stroke-opacity: 0.5;
    fill: #f5f6f9;
  }

  .highcharts-shadow {
    display: none;
  }

  .highcharts-data-label * {
    font-size: 12px;
  }

}

.vis-component.tooltip-overflow {
  z-index: 99;

  .vis-component-inner {
    overflow: visible;

    .main-svg {
      overflow: visible;
    }

  }

}

.bg-series-color-0 {
  background-color: #4e79a7;
  fill: #4e79a7;
}
.stroke-series-color-0 {
  stroke: #4e79a7;
}
.bg-series-color-1 {
  background-color: #f28e2b;
  fill: #f28e2b;
}
.stroke-series-color-1 {
  stroke: #f28e2b;
}
.bg-series-color-2 {
  background-color: #e15759;
  fill: #e15759;
}
.stroke-series-color-2 {
  stroke: #e15759;
}
.bg-series-color-3 {
  background-color: #76b7b2;
  fill: #76b7b2;
}
.stroke-series-color-3 {
  stroke: #76b7b2;
}
.bg-series-color-4 {
  background-color: #edc948;
  fill: #edc948;
}
.stroke-series-color-4 {
  stroke: #edc948;
}
.bg-series-color-5 {
  background-color: #ff9da7;
}
.bg-series-color-6 {
  background-color: #FF9655;
}
.bg-series-color-7 {
  background-color: #FFF263;
}
.bg-series-color-8 {
  background-color: #6AF9C4;
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

/*
.sidebar, .navbar-brand {
  min-width: 135px;
}
*/

main {
  /*max-width: calc(100% - 135px) !important;*/
}

main {
  padding-top: 54px;
}

main, .navbar {
  /*width: calc(100% - 145px) !important;*/
}

.vis-component {
  padding: .25rem !important;

  .multi-map-child:nth-child(n+2) {
    margin-top: 15px;
  }

  .vis-component-inner {
    border-radius: 0.25rem;
    background-color: #fff;
    border: solid 1px #dde4ea;
    min-height: 300px;
    overflow: hidden;

    .actions {
      button {
        padding: 0 0.25rem;
        margin-left: 0.5rem;
      }
      &.move-component-btn {
        cursor: grab !important;
      }
    }

    .highcharts-data-table {
      max-height: 400px;
      overflow-y: auto;
    }

    .highcharts-table-caption {
      display: none;
    }

  }

  .head {
    border-bottom: 1px solid #dee2e6;
    padding: 0.30rem 0.5rem;
    background-color: #f0f7fd;
    align-items: center;
    min-height: 36px;

    .vis-title {
      font-weight: 500;
    }

  }

}

.no-min-height {
  .vis-component-inner {
    min-height: auto;
  }
}

.vis-intro-component {

  .vis-component-inner {
    min-height: auto !important;
  }

}

.vis-intro-wrapper {

  .vis-component-inner {
    min-height: auto !important;
  }

}

.vis-separator {
  padding: .5rem !important;
}

.v-step {
  z-index: 9999;
  font-size: 1.2rem;
}

.kwic-table {

  td.annotations {
    padding: 0.15rem;

    .multiselect {
      min-height: auto;
    }

    .multiselect__select {
      height: 27px;
      width: 22px;
    }

    .multiselect__tags {
      min-height: auto;
      padding: 0px 16px 0 4px;
      height: 26px;
    }

    .multiselect__tag {
      margin-bottom: 0;
      margin-right: 3px;
      margin-top: 3px;
      padding: 2px 16px 3px 5px;
      font-size: 12px;
    }

    .multiselect__tag-icon {
      width: 17px;
      line-height: 16px;
    }

    .multiselect__placeholder {
      margin-bottom: -1px;
      font-size: 12px;
    }

    .multiselect__input {
      font-size: 12px;
      padding: 0;
    }

    .multiselect__content-wrapper {
      font-size: 12px;
    }

    .multiselect__option {
      min-height: auto;
      padding: 6px;
    }

    .multiselect__option:after {
      font-size: 12px;
      padding: 6px 3px;
      line-height: 12px;
    }

  }

}

</style>
