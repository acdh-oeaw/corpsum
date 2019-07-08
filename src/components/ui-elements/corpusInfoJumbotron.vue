<template>
  <div>
    <div class="vis-component-inner">
      <b-jumbotron bg-variant="white" header-level="4" class="p-4 mb-0">
        <div class="d-flex">
          <b-col md="2" class="p-0 mr-4">
            <b-card-img :src="logo" class="rounded-0"></b-card-img>
          </b-col>
          <b-col md="10" class="lead pl-0 pr-4">
            {{ desc }}
          </b-col>
        </div>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      chartProp: Object
    },
    data() {
      return {
        logo: this.chartProp.logo,
        desc: this.chartProp.desc,
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    }
  }
</script>