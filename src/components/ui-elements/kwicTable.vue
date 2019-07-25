<template>
  <div>
    <b-container :style="{'height':height}" fluid class="vis-component-inner">

      <div v-show="isBusy" class="component-loading-overlay">
        <div class="text-center text-success my-2 mt-5">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </div>

      <!-- User Interface controls -->
      <b-row class="py-3">

<!--         <div class="ml-3">
          <b-button @click="subcorpus($event.target)" variant="outline-primary" size="sm">Create Subcorpus with Selection</b-button>
        </div> -->

        <div class="ml-3 mr-auto d-flex align-items-center">
          <b-form-group class="mb-0">
            <b-input-group size="sm">
              <b-form-input v-model="filter" placeholder="Type to Filter"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>

        <div class="mr-3 d-flex align-items-center">
          <div class="mr-2">Total rows: {{ totalVisibleRows }}</div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="my-0"
          ></b-pagination>
        </div>

<!--         <b-col md="6" class="my-1">
          <b-form-group label-cols-sm="3" label="Sort" class="mb-0">
            <b-input-group>
              <b-form-select v-model="sortBy" :options="sortOptions">
                <option slot="first" :value="null">-- none --</option>
              </b-form-select>
              <b-form-select v-model="sortDesc" :disabled="!sortBy" slot="append">
                <option :value="false">Asc</option>
                <option :value="true">Desc</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col> -->

<!--         <b-col md="6" class="my-1">
          <b-form-group label-cols-sm="3" label="Sort direction" class="mb-0">
            <b-input-group>
              <b-form-select v-model="sortDirection" slot="append">
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
                <option value="last">Last</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col> -->

<!--         <b-col md="6" class="my-1">
          <b-form-group label-cols-sm="3" label="Per page" class="mb-0">
            <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
          </b-form-group>
        </b-col> -->
      </b-row>

      <div class="kwic-table">

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

          <template slot="actions" slot-scope="row">
            <b-link @click="info(row.item, row.index, $event.target)" class="mr-1">
              <file-text-icon></file-text-icon>
            </b-link>
          </template>

          <template slot="HEAD_selected" slot-scope="head">
            <input type="checkbox" @change="toggleSelectAllDocs($event.target.checked)"/>
          </template>

          <template slot="selected" slot-scope="row">
            <b-form-group class="mb-0">
              <input type="checkbox" v-model="row.item.selected" @change="toggleSelectedDocs(row.item)"/>
            </b-form-group>
          </template>

          <template slot="hitsNo" slot-scope="row">
            {{row.item.hitsNo}}
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>

          <template v-for="(field, key) in annotationFields" :slot="field.key" slot-scope="row">
            <div v-bind:key="key" v-if="field.type === 'html'">
              <span v-if="row.item[field.key]">
                Yes
                <b-link @click="info(row.item, row.index, $event.target)" class="mr-1">
                  <external-link-icon></external-link-icon>
                </b-link>
              </span>
              <span v-else>No</span>
            </div>
            <div v-bind:key="key" v-else-if="field.type === 'boolean'">
              <b-form-checkbox
                v-model="row.item[field.key]"
                value="true"
                unchecked-value="false"
                @change="changeAnnotation($event, field.key, row.item.docid, row.index, 'boolean')"
              >
              </b-form-checkbox>
            </div>
            <div v-bind:key="key" v-else-if="field.type === 'vocabulary'">
              <multiselect
                v-model="row.item[field.key]"
                tag-placeholder="Add annotation"
                placeholder="Add annotation"
                :options="field.options"
                :multiple="true"
                @select="addAnnotation($event.title, field.key, row.item.docid, row.index, 'vocabulary')"
                @remove="removeAnnotation($event, field.key, row.index, row.item[field.key])"
                track-by="title"
                label="title"
                :taggable="true"
                @tag="addNewAnnoVocabulary($event, field.key, row.item.docid, row.index, 'vocabulary')"
              />
            </div>
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
            :items="[items[infoModal.rowId]]"
            :fields="annotationFields"
          >
            <template v-for="(field, key) in annotationFields" :slot="field.key" slot-scope="row">
              <div v-bind:key="key" v-if="field.type === 'html'">
                <span v-if="items[infoModal.rowId][field.key]">Yes</span>
                <span v-else>No</span>
              </div>
              <div v-bind:key="key" v-else-if="field.type === 'boolean'">
                <b-form-checkbox
                  v-model="items[infoModal.rowId][field.key]"
                  value="true"
                  unchecked-value="false"
                  @change="changeAnnotation($event, field.key, items[infoModal.rowId].docid, infoModal.rowId, 'boolean')"
                >
                </b-form-checkbox>
              </div>
              <div v-bind:key="key" v-else-if="field.type === 'vocabulary'">
                <multiselect
                  v-model="items[infoModal.rowId][field.key]"
                  tag-placeholder="Add annotation"
                  placeholder="Add annotation"
                  :options="field.options"
                  :multiple="true"
                  @select="addAnnotation($event.title, field.key, items[infoModal.rowId].docid, infoModal.rowId, 'vocabulary')"
                  @remove="removeAnnotation($event, field.key, infoModal.rowId, items[infoModal.rowId][field.key])"
                  track-by="title"
                  label="title"
                  :taggable="true"
                  @tag="addNewAnnoVocabulary($event, field.key, items[infoModal.rowId].docid, infoModal.rowId, 'vocabulary')"
                />
              </div>
            </template>
          </b-table>

          <template v-for="(field, key) in annotationFields">
            <div v-bind:key="key" v-if="field.type === 'html'">
              <b-form-textarea
                v-model="items[infoModal.rowId][field.key]"
                id="textarea-auto-height"
                placeholder="Enter your annotation comments here"
                rows="2"
                max-rows="5"
                @blur="addAnnotation(items[infoModal.rowId][field.key], field.key, items[infoModal.rowId].docid, infoModal.rowId, 'html')"
              ></b-form-textarea>
              <b-button @click="addAnnotation(items[infoModal.rowId][field.key], field.key, items[infoModal.rowId].docid, infoModal.rowId, 'html')" variant="info" class="mt-2" size="sm">Save Comments</b-button>
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
    </b-container>
  </div>
</template>

<script>
  import { FileTextIcon } from 'vue-feather-icons'
  import { ExternalLinkIcon } from 'vue-feather-icons'

  export default {
    props: {
      chartProp: Object
    },
    components: {
      FileTextIcon, ExternalLinkIcon
    },
    data() {
      return {
        selectedDocs: [],
        fields: this.chartProp.fields,
        height: this.chartProp.height + 'px',
        annotationFields: this.chartProp.annotationFields,
        currentPage: 1,
        perPage: 15,
        pageOptions: [10, 15, 20],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        infoModal: {
          id: 'info-modal',
          title: '',
          content: '',
          rowId: 0,
        },
        subcorpusModal: {
          id: 'create-subcorpus-modal',
          title: 'Create a subcorpus',
          content: ''
        },
        totalVisibleRows: this.chartProp.items.length,
        subcorpusTitle: '',
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      },
      items() {
        return this.chartProp.items;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
      isBusy() {
        return this.chartProp.isBusy;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
      annotationOptions() {
        return this.chartProp.annotationOptions;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
      totalRows: {
        get: function() {
          return this.chartProp.totalRows;
        },
        set: function(value) {
          this.chartProp.totalRows = value;
        }
      },
      modalTextContent() {
        return this.$store.getters.modalTextContent;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
      tags() {
        return this.$store.getters.queryTerms;
      },
      subcorpusTitleState() {
        return this.subcorpusTitle.length >= 4 ? true : false
      },
      invalidFeedback() {
        if (this.subcorpusTitle.length > 4) {
          return ''
        } else if (this.subcorpusTitle.length > 0) {
          return 'Enter at least 4 characters'
        } else {
          return 'This field is required'
        }
      },
      validFeedback() {
        return this.subcorpusTitleState === true ? '' : ''
      }
    },
    mounted() {
    },
    watch: {
      items(val) {
        this.totalVisibleRows = val.length;
      },
    },
    methods: {
      addNewAnnoVocabulary(annoContent, annoClass, docid, rowIndex, annoType) {
        this.$store.dispatch('addNewAnnoVocabulary', { annoContent: annoContent, annoClass: annoClass, docID: docid, rowIndex: rowIndex, annoType: annoType } );
      },
      changeAnnotation(checked, annoClass, docid, rowIndex, annoType) {
        this.addAnnotation(checked, annoClass, docid, rowIndex, annoType);
      },
      addAnnotation(annoContent, annoClass, docid, rowIndex, annoType) {
        if (annoContent === undefined) {
          annoContent = '';
        }
        this.$store.dispatch('addAnnotation', { annoContent: annoContent, annoClass: annoClass, docID: docid, rowIndex: rowIndex, annoType: annoType } );
      },
      removeAnnotation(event, annoClass, rowIndex, optionsArray) {
        let id = event.annoID;
        if (!id) {
          const optionKey = Object.keys(this.items[rowIndex][annoClass]).find(key => this.items[rowIndex][annoClass][key].title === event.title);
          id = this.items[rowIndex][annoClass][optionKey].annoID;
        }
        this.$store.dispatch('removeAnnotation', { annoID: id } );
      },
      createSubcorpus() {
        this.$store.dispatch('createSubcorpus', {docs: this.selectedDocs, title: this.subcorpusTitle} );
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
        while (this.$refs.table.sortedItems[[nextRow]].docid == this.$refs.table.sortedItems[[curRow]].docid);
        const item = this.$refs.table.sortedItems[[nextRow]];
        this.infoModal.title = item.source + ' - ' + item.date;
        this.infoModal.rowId = nextRow;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item);
        this.infoModal.content = JSON.stringify(item, null, 2)
      },
      prevDoc() {
        const curRow = this.infoModal.rowId;
        let prevRow = curRow;
        do {
          prevRow--;
        }
        while (this.$refs.table.sortedItems[[prevRow]].docid == this.$refs.table.sortedItems[[curRow]].docid);
        const item = this.$refs.table.sortedItems[[prevRow]];
        this.infoModal.title = item.source + ' - ' + item.date;
        this.infoModal.rowId = prevRow;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item);
        this.infoModal.content = JSON.stringify(item, null, 2)
      },
      info(item, index, button) {
        // this.infoModal.title = `Row index: ${index}`
        this.infoModal.title = item.source + ' - ' + item.date;
        this.infoModal.rowId = index;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item);
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        this.totalVisibleRows = filteredItems.length;
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      subcorpus(button) {
        this.$root.$emit('bv::show::modal', this.subcorpusModal.id, button)
      },
      toggleSelectAllDocs(checked) {
        console.log(checked)
        if(!checked) {
          this.selectedDocs = [];
          // Loop all items and deselect
          for (let i = 0; i < this.items.length; i += 1) {
            this.items[i].selected = false;
          }
        } else {
          // Loop all items and add them to selectedDocs (ignore duplicates)
          for (let i = 0; i < this.items.length; i += 1) {
            if (!this.selectedDocs.includes(this.items[i].docid)) {
              this.selectedDocs.push(this.items[i].docid)
            }
          }
          // Loop all items and select
          for (let i = 0; i < this.items.length; i += 1) {
            this.items[i].selected = true;
          }
        }
      },
      toggleSelectedDocs(item) {
        // Add or remove docid from the selectedDocs array
        if (item.selected) {
          this.selectedDocs.push(item.docid)
        } else {
          for (let i = this.selectedDocs.length - 1; i >= 0; i--) {
            if (this.selectedDocs[i] === item.docid) {
              this.selectedDocs.splice(i, 1);
            }
          } 
        }
        // Loop all items and toggle other items with the same doc id
        for (let i = 0; i < this.items.length; i += 1) {
          if (this.items[i].docid == item.docid) {
            this.items[i].selected = item.selected;
          }
        }
      },
    }
  }
</script>

<style lang="scss">
.kwic-table {
  overflow-y: auto;
  max-height: 700px;
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
  font-size: 0.9rem;
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
}

@media (min-width: 576px) {
  #info-modal .modal-dialog-scrollable {
    height: calc(100% - 3.5rem);
  }
}
</style>
