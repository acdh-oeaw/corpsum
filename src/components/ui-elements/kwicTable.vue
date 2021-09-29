<template>
  <div>
    <div :style="{'height':height}" class="vis-component-inner">
      <div class="loading-spinner text-center" v-show="this.chartProp.loadingStatus">
        <span>This component is waiting for the data, please wait.</span>
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-show="isBusy" class="component-loading-overlay">
        <div class="text-center text-success my-2 mt-5">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </div>

      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>

        <b-form-group class="head-buttons">
          <b-button @click="subcorpus($event.target)" variant="outline-primary" size="sm">Create Subcorpus</b-button>
        </b-form-group>

        <div class="head-buttons kwic-filter-input mr-auto ml-1">
          <b-form-group class="mb-0">
            <b-input-group size="sm">
              <b-form-input v-model="filter" placeholder="Type to Filter"></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>

        <div class="d-flex align-items-center">
          <div class="mr-2">{{ totalVisibleRows }} Rows</div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            limit="3"
            :hide-goto-end-buttons="true"
            size="sm"
            class="my-0"
          ></b-pagination>
        </div>

      </div>

      <!-- <div class="kwic-filters-head d-flex">
        Active Filters: {{ activeFilters }}
      </div> -->

      <div class="kwic-table" >

        <!-- Main table element -->
        <b-table
          show-empty
          small
          striped
          bordered
          class="text-nowrap"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
          ref="table"
        >

          <template v-slot:cell(actions)="row">
            <b-link @click="info(row.item, row.index, $event.target)" class="mr-1">
              <file-text-icon></file-text-icon>
            </b-link>
          </template>

          <template v-slot:head(selected)="head">
            <input type="checkbox" @change="toggleSelectAllDocs($event.target.checked)"/>
          </template>

          <template v-slot:cell(selected)="row">
            <b-form-group class="mb-0">
              <input type="checkbox" v-model="row.item.selected" @change="toggleSelectedDocs(row.item)"/>
            </b-form-group>
          </template>

          <template v-slot:cell(hitsNo)="row">
            {{row.item.hitsNo}}
          </template>

          <template v-slot:cell(row-details)="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>

        </b-table>

      </div>

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" size="xl" scrollable @hide="resetInfoModal">

        <div v-if="annotationFields" class="docviewer-anno-wrapper sticky-top bg-light">
          <h5>Annotations</h5>
          <b-table
            show-empty
            small
            bordered
            stacked="md"
            class="text-nowrap"
            :items="[sortedItemsKWIC[infoModal.rowId]]"
            :fields="annotationFields"
          >
            <template v-for="(field, key) in annotationFields" :slot="field.key" slot-scope="row">
              <div v-bind:key="key" v-if="field.type === 'html'">
                <span v-if="sortedItemsKWIC[infoModal.rowId][field.key]">Yes</span>
                <span v-else>No</span>
              </div>
              <div v-bind:key="key" v-else-if="field.type === 'boolean'">
                <b-form-checkbox
                  v-model="sortedItemsKWIC[infoModal.rowId][field.key]"
                  value="true"
                  unchecked-value="false"
                  @change="changeAnnotation($event, field.key, sortedItemsKWIC[infoModal.rowId].docid, infoModal.rowId, 'boolean')"
                >
                </b-form-checkbox>
              </div>
              <div v-bind:key="key" v-else-if="field.type === 'vocabulary'">
                <multiselect
                  v-model="sortedItemsKWIC[infoModal.rowId][field.key]"
                  tag-placeholder="Add annotation"
                  placeholder="Add annotation"
                  :options="field.options"
                  :multiple="true"
                  @select="addAnnotation($event.title, field.key, sortedItemsKWIC[infoModal.rowId].docid, infoModal.rowId, 'vocabulary')"
                  @remove="removeAnnotation($event, field.key, infoModal.rowId, sortedItemsKWIC[infoModal.rowId][field.key])"
                  track-by="title"
                  label="title"
                  :taggable="true"
                  @tag="addNewAnnoVocabulary($event, field.key, sortedItemsKWIC[infoModal.rowId].docid, infoModal.rowId, 'vocabulary')"
                />
              </div>
            </template>
          </b-table>

          <template v-for="(field, key) in annotationFields">
            <div v-bind:key="key" v-if="field.type === 'html'">
              <b-form-textarea
                v-model="sortedItemsKWIC[infoModal.rowId][field.key]"
                id="textarea-auto-height"
                placeholder="Enter your annotation comments here"
                rows="2"
                max-rows="5"
                @blur="addAnnotation(sortedItemsKWIC[infoModal.rowId][field.key], field.key, sortedItemsKWIC[infoModal.rowId].docid, infoModal.rowId, 'html')"
              ></b-form-textarea>
              <b-button @click="addAnnotation(sortedItemsKWIC[infoModal.rowId][field.key], field.key, sortedItemsKWIC[infoModal.rowId].docid, infoModal.rowId, 'html')" variant="info" class="mt-2" size="sm">Save Comments</b-button>
            </div>
          </template>

        </div>

        <p v-html="modalTextContent"></p>
        <pre>{{ infoModal.content }}</pre>

        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button-group class="mr-auto">
            <b-button variant="info" @click="prevDoc()">&lsaquo; Previous</b-button>
            <b-button variant="info" @click="nextDoc()">Next &rsaquo;</b-button>
          </b-button-group>
          <b-button variant="primary" @click="ok()">
            OK
          </b-button>
        </template>

      </b-modal>

      <!-- Create subcorpus modal -->
      <b-modal :id="subcorpusModal.id" :title="subcorpusModal.title" size="lg" ok-only scrollable>
        <b-form-group
          id="subcorpus-title-fieldset"
          label="Subcorpus Name"
          label-for="subcorpus-title-input"
          :invalid-feedback="invalidFeedback"
          :valid-feedback="validFeedback"
          :state="subcorpusTitleState"
        >
          <b-form-input id="subcorpus-title-input" v-model="subcorpusTitle" :state="subcorpusTitleState" trim></b-form-input>
        </b-form-group>
        You have selected {{ selectedDocs.length }} documents for this new subcorpus.
        <template slot="modal-footer">
          <b-button variant="primary" class="mr-auto d-block" @click="createSubcorpus()">Create Subcorpus</b-button>
          <b-toast id="example-toast" title="BootstrapVue" static no-auto-hide>
            Hello, world! This is a toast message.
          </b-toast>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { FileTextIcon, ExternalLinkIcon, InfoIcon } from 'vue-feather-icons';

export default {
  props: {
    chartProp: Object,
    elKey: Number,
  },
  components: {
    FileTextIcon, ExternalLinkIcon, InfoIcon,
  },
  mounted() {
    let regionName = null;
    this.bus.$on('onLineCircleClick', (payload) => {
      this.activeFilters.push(payload.year);
      this.activeFilters.push(payload.query);
      const { items } = this.chartProp;
      this.filteredItemsByCharts = [];
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].year === payload.year && items[i].queryTerm === payload.query) {
          this.filteredItemsByCharts.push(items[i]);
        }
      }
    });
    this.bus.$on('onMediaClick', (payload) => {
      this.activeFilters.push(payload.mediaName);
      this.activeFilters.push(payload.mediaQuery);
      const { items } = this.chartProp;
      this.filteredItemsByCharts = [];
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].source === payload.mediaName && items[i].queryTerm === payload.mediaQuery) {
          this.filteredItemsByCharts.push(items[i]);
        }
      }
    });
    this.bus.$on('onRegionClick', (payload) => {
      this.activeFilters.push(payload.regionName);
      this.activeFilters.push(payload.regionQuery);
      switch (payload.regionName) {
        case 'AT-Ost':
          regionName = 'aost';
          break;
        case 'AT-Südost':
          regionName = 'asuedost';
          break;
        case 'AT-Mitte':
          regionName = 'amitte';
          break;
        case 'AT-West':
          regionName = 'awest';
          break;
        case 'AT-Nationwide':
          regionName = 'agesamt';
          break;
        case 'Specific':
          regionName = 'spezifisch';
          break;
        default:
          regionName = '';
      }
      const { items } = this.chartProp;
      this.filteredItemsByCharts = [];
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].region === regionName && items[i].queryTerm === payload.regionQuery) {
          this.filteredItemsByCharts.push(items[i]);
        }
      }
    });

    if (regionName !== null) this.bus.$emit('onRegionClick', { regionName, regionQuery });
  },
  data() {
    return {
      selectedDocs: [],
      fields: this.chartProp.fields,
      height: `${this.chartProp.height}px`,
      annotationFields: this.chartProp.annotationFields,
      currentPage: 1,
      perPage: 22,
      pageOptions: [10, 15, 20],
      sortBy: 'null',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
        rowId: 0,
      },
      chartInfoModal: {
        id: `chart-info-modal-${this.elKey}`,
      },
      subcorpusModal: {
        id: 'create-subcorpus-modal',
        title: 'Create a subcorpus',
        content: '',
      },
      totalVisibleRows: this.chartProp.items.length,
      subcorpusTitle: '',
      filteredItemsByCharts: [],
      activeFilters: [],
    };
  },
  computed: {
    sortedItemsKWIC() {
      if (this.$refs.table) return this.$refs.table.sortedItems;
      return this.chartProp.items;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
    items() {
      if (this.filteredItemsByCharts.length > 0) {
        return this.filteredItemsByCharts;
      }
      return this.chartProp.items;

      (value) => console.log(value); // this.$state.commit('someMutation', value )
    },
    isBusy() {
      return this.chartProp.isBusy;
      (value) => console.log(value); // this.$state.commit('someMutation', value )
    },
    annotationOptions() {
      return this.chartProp.annotationOptions;
      (value) => console.log(value); // this.$state.commit('someMutation', value )
    },
    totalRows: {
      get() {
        return this.chartProp.totalRows;
      },
      set(value) {
        this.chartProp.totalRows = value;
      },
    },
    modalTextContent: {
      get() {
        return this.$store.getters.modalTextContent;
      (value) => console.log(value); // this.$state.commit('someMutation', value )
      },
      set(newVal) {
        return newVal
      }
    },
    tags() {
      return this.$store.getters.queryTerms;
    },
    subcorpusTitleState() {
      return this.subcorpusTitle.length >= 4;
    },
    invalidFeedback() {
      if (this.subcorpusTitle.length > 4) {
        return '';
      } if (this.subcorpusTitle.length > 0) {
        return 'Enter at least 4 characters';
      }
      return 'This field is required';
    },
    validFeedback() {
      return this.subcorpusTitleState === true ? '' : '';
    },
  },
  watch: {
    items(val) {
      this.totalVisibleRows = val.length;
    },
  },
  methods: {
    addNewAnnoVocabulary(annoContent, annoClass, docid, rowIndex, annoType) {
      this.$store.dispatch('addNewAnnoVocabulary', {
        annoContent, annoClass, docID: docid, rowIndex, annoType,
      });
    },
    changeAnnotation(checked, annoClass, docid, rowIndex, annoType) {
      this.addAnnotation(checked, annoClass, docid, rowIndex, annoType);
    },
    addAnnotation(annoContent, annoClass, docid, rowIndex, annoType) {
      if (annoContent === undefined) {
        annoContent = '';
      }
      this.$store.dispatch('addAnnotation', {
        annoContent, annoClass, docID: docid, rowIndex, annoType,
      });
    },
    removeAnnotation(event, annoClass, rowIndex, optionsArray) {
      let id = event.annoID;
      if (!id) {
        const optionKey = Object.keys(this.items[rowIndex][annoClass]).find((key) => this.items[rowIndex][annoClass][key].title === event.title);
        id = this.items[rowIndex][annoClass][optionKey].annoID;
      }
      this.$store.dispatch('removeAnnotation', { annoID: id });
    },
    createSubcorpus() {
      this.$store.dispatch('createSubcorpus', { docs: this.selectedDocs, title: this.subcorpusTitle });
      if (this.subcorpusTitleState && this.selectedDocs.length > 0) {
        this.$root.$emit('bv::hide::modal', this.subcorpusModal.id);
      } else {
        // Not validated
      }
    },
    nextDoc() {
      const curRow = this.infoModal.rowId;
      let nextRow = curRow;
      do {
        nextRow++;
      }
      while (this.$refs.table.sortedItems[[nextRow]] !== undefined && this.$refs.table.sortedItems[[nextRow]].docid === this.$refs.table.sortedItems[[curRow]].docid);
      if (this.$refs.table.sortedItems[[nextRow]] !== undefined) {
        const item = this.$refs.table.sortedItems[[nextRow]];
        this.infoModal.title = `${item.source} - ${item.date}`;
        this.infoModal.rowId = nextRow;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item);
        this.infoModal.content = JSON.stringify(item, null, 2);
      } else {
        console.log('no further document is availbale')
      }
    },
    prevDoc() {
      const curRow = this.infoModal.rowId;
      let prevRow = curRow;
      do {
        prevRow--;
      }
      while (this.$refs.table.sortedItems[[prevRow]] !== undefined && this.$refs.table.sortedItems[[prevRow]].docid === this.$refs.table.sortedItems[[curRow]].docid); // error reading docid of undefined
      if (this.$refs.table.sortedItems[[prevRow]] !== undefined) {
        const item = this.$refs.table.sortedItems[[prevRow]];
        this.infoModal.title = `${item.source} - ${item.date}`;
        this.infoModal.rowId = prevRow;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item);
        this.infoModal.content = JSON.stringify(item, null, 2);
      } else {
        console.log('no previous document is available.');
      }
    },
    info(item, index, button) {
      // this.infoModal.title = `Row index: ${index}`
      this.infoModal.title = `${item.source} - ${item.date}`;
      this.infoModal.rowId = (this.perPage * (this.currentPage - 1)) + index;
      this.modalTextContent = '';
      this.$store.dispatch('modalTextQuery', item);
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = '';
      this.infoModal.content = '';
    },
    onFiltered(filteredItems) {
      this.totalVisibleRows = filteredItems.length;
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    subcorpus(button) {
      this.$root.$emit('bv::show::modal', this.subcorpusModal.id, button);
    },
    toggleSelectAllDocs(checked) {
      console.log(checked);
      if (!checked) {
        this.selectedDocs = [];
        // Loop all items and deselect
        this.items.forEach((item) => {
          item.selected = false;
        });
      } else {
        // Loop all items and add them to selectedDocs (ignore duplicates)
          this.items.forEach((item) => {
          if (!this.selectedDocs.includes(item.docid)) {
            this.selectedDocs.push(item.docid);
          }
        });        
        // Loop all items and select
        this.items.forEach((item) => {
          item.selected = true;
        });
      }
    },
    toggleSelectedDocs(item) {
      // Add or remove docid from the selectedDocs array
      if (item.selected) {
        this.selectedDocs.push(item.docid);
      } else {
        for (let i = this.selectedDocs.length - 1; i >= 0; i--) {
          if (this.selectedDocs[i] === item.docid) {
            this.selectedDocs.splice(i, 1);
          }
        }
      }
      // Loop all items and toggle other items with the same doc id
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i].docid === item.docid) {
          this.items[i].selected = item.selected;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.kwic-table {
  overflow-y: auto;
  max-height: 700px;
  font-size: 0.8rem;
}

.input-group-sm > .form-control, .input-group-sm > .custom-select, .input-group-sm > .input-group-prepend > .input-group-text, .input-group-sm > .input-group-append > .input-group-text, .input-group-sm > .input-group-prepend > .btn, .input-group-sm > .input-group-append > .btn {
  border-radius: 0.2rem;
  padding: 0.158rem 0.4rem;
  height: auto !important;
  font-size: 0.8rem;
}

.kwic-filter-input {
  width: 110px;
}

.kwic-table, .docviewer-anno-wrapper {

  .multiselect__select {
    height: 32px;
    z-index: 9;
  }

  .multiselect__tags {
    min-height: 26px;
    padding: 4px 30px 0 4px;
  }

  .multiselect__option {
    min-height: auto;
    padding: 10px;
  }

  .multiselect__tag {
    padding: 4px 22px 4px 6px;
    margin-right: 5px;
  }

  .multiselect__placeholder {
    margin-bottom: 5px;
    padding-top: 1px;
    padding-left: 3px;
    font-size: 0.8rem;
  }

  .multiselect, .multiselect__input, .multiselect__single {
    font-size: 0.8rem;
  }

  .multiselect__tags-wrap {
    display: flex;
  }

  .multiselect__option--highlight::after {
    display: none;
  }

  .multiselect__option, .multiselect__input, .multiselect__single {
    line-height: 10px;
  }

  .multiselect {
    min-height: auto;
  }

}
.kw-highlight {
  background-color: #ffd600;
  padding: 2px 1px;
  border-radius: 3px;
}
.kwic-word {
  font-size: 0.85rem;
  font-weight: 600;
  color: #de0d0d;
}
.modal-body p {
  font-size: 1rem;
}

#info-modal___BV_modal_body_ {
  padding-top: 0;
}

.docviewer-anno-wrapper {
  margin-left: -1rem !important;
  margin-right: -1rem !important;
  padding: 1rem !important;
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
  overflow-x: scroll;
}

@media (min-width: 576px) {
  #info-modal .modal-dialog-scrollable {
    height: calc(100% - 3.5rem);
  }
}
</style>
