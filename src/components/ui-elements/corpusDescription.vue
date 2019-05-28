<template>
  <div>
    <b-card no-body class="overflow-hidden" style="min-height: 100px;">
      <b-row no-gutters>
        <b-col md="2" class="p-3">
          <b-card-img :src="corpusLogo" class="rounded-0"></b-card-img>
        </b-col>
        <b-col md="10">
          <b-card-body :title="corpusName">
            <b-card-text>
              CORPES is a reference corpus for 21st century Spanish language with a total of 285.000 documents and 286 million words.
              <br/><br/>
              RAE, with its affiliations in 22 hispanophone nations, offers the most extensive knowledge and data regarding the Spanish language.
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  export default {
    props: {
      chartProp: Object
    },
    data() {
      return {
        corpusName: this.chartProp.corpusName,
        corpusLogo: this.chartProp.corpusLogo,
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