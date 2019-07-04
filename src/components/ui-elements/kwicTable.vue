<template>
  <div>
    <b-container :style="{'height':height}" fluid class="vis-component-inner">
      <!-- User Interface controls -->
      <b-row class="py-3">

        <div class="my-1 ml-3">
          <b-button @click="subcorpus($event.target)" variant="outline-primary" size="sm">Create Subcorpus with Selection</b-button>
        </div>

        <b-col md="3" class="mx-auto">
          <b-form-group class="mb-0">
            <b-input-group size="sm">
              <b-form-input v-model="filter" placeholder="Type to Filter"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <div class="my-1 mr-3">
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
          stacked="md"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <!--       <template slot="name" slot-scope="row">
            {{ row.value.first }} {{ row.value.last }}
          </template>

          <template slot="isActive" slot-scope="row">
            {{ row.value ? 'Yes :)' : 'No :(' }}
          </template>
          -->

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

          <template slot="row-details" slot-scope="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>
        </b-table>

      </div>

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" size="lg" scrollable @hide="resetInfoModal">
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
        {{ selectedDocs }}
      </b-modal>
    </b-container>
  </div>
</template>

<script>
  import { FileTextIcon } from 'vue-feather-icons'

  export default {
    props: {
      chartProp: Object
    },
    components: {
      FileTextIcon
    },
    data() {
      return {
        selectedDocs: [],
        items: this.chartProp.items,
        fields: this.chartProp.fields,
        height: this.chartProp.height + 'px',
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
          title: '',
          content: ''
        }
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
      totalRows() {
        return this.chartProp.items.length;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
      modalTextContent() {
        return this.$store.getters.modalTextContent;
        set: (value) => console.log(value) // this.$state.commit('someMutation', value )
      },
    },
    mounted() {
    },
    methods: {
      nextDoc() {
        const curRow = this.infoModal.rowId;
        let nextRow = curRow;
        do {
          nextRow++;
        }
        while (this.items[[nextRow]].docid == this.items[[curRow]].docid);
        const item = this.items[[nextRow]];
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
        while (this.items[[prevRow]].docid == this.items[[curRow]].docid);
        const item = this.items[[prevRow]];
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
  max-height: 500px;
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

@media (min-width: 576px) {
  #info-modal .modal-dialog-scrollable {
    height: calc(100% - 3.5rem);
  }
}
</style>
