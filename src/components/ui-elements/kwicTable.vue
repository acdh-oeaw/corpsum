<template>
  <div>
    <b-container :style="{'height':height}" fluid>
      {{ selectedDocs }}
      <!-- User Interface controls -->
      <b-row class="py-3">
        <b-col md="6" class="my-1">
          <b-form-group class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Type to Filter"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="my-0"
          ></b-pagination>
        </b-col>

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
          <input type="checkbox"/>
          {{ head.label }}
        </template>

        <template slot="selected" slot-scope="row">
          <b-form-group class="mb-0">
            <input type="checkbox" v-model="row.item.selected" @change="toggleSelectedDocs(row.item, row.index, $event.target)"/>
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

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <p v-html="modalTextContent"></p>
        <pre>{{ infoModal.content }}</pre>
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
      },
    },
    mounted() {
    },
    methods: {
      info(item, index, button) {
        // this.infoModal.title = `Row index: ${index}`
        this.infoModal.title = item.source + ' - ' + item.date;
        this.modalTextContent = '';
        this.$store.dispatch('modalTextQuery', item.toknum);
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
      toggleSelectedDocs(item, index, button) {
        // Loop all items and toggle other items with the same doc id
        // Add or remove docid from the selectedDocs array
        if (item.selected) {
          this.selectedDocs.push(item.docid)
        }
        console.log(item, index, button);
      },
    }
  }
</script>