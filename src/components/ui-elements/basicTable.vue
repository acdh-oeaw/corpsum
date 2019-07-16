<template>
  <div :key="componentKey">
    <div class="vis-component-inner" :style="{'height':height}">
      <div class="head d-flex">
        <b-link class="mr-1" @click="$bvModal.show(chartInfoModal.id)">
          <info-icon></info-icon>
        </b-link>
        <span class="vis-title">{{ chartProp.title }}</span>
        <div class="actions ml-auto">
        </div>
      </div>
      <b-modal :id="chartInfoModal.id" :title="this.chartProp.title" ok-only scrollable>{{this.chartProp.subtitle}}</b-modal>
      <b-table striped :items="items" :fields="fields"></b-table>
    </div>
  </div>
</template>

<script>
import { InfoIcon } from 'vue-feather-icons'

  export default {
    components: {
      InfoIcon
    },
    props: {
      chartProp: Object
    },
    data() {
      return {
        items: this.chartProp.items,
        fields: this.chartProp.fields,
        height: this.chartProp.height + 'px',
        chartInfoModal: {
          id: 'chart-info-modal-'+this.elKey,
        },
      }
    }
  }
</script>