<template>
  <div>
    <div class="data-table" :style="{'height':height}">
      <div class="highcharts-title text-center" data-z-index="4" style="color: rgb(51, 51, 51); font-size: 18px;">
        <span>Keyword In Context View</span>
      </div>
      <v-table :data="this.tableData.data" class="table table-sm"
        :currentPage.sync="currentPage"
        :pageSize="9"
        @totalPagesChanged="totalPages = $event"
      >
        <thead slot="head">
            <th>Year</th>
            <th>Doc</th>
            <th>Country</th>
            <th>Left</th>
            <th>Term</th>
            <th>Right</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
            <tr v-for="row in displayData" :key="row.id">
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }}</td>
              <td>{{ row[2] }}</td>
              <td class="kwic-left">{{ row[3] }}</td>
              <td class="kwic-center">{{ row[4] }}</td>
              <td>{{ row[5] }}</td>
            </tr>
        </tbody>
      </v-table>
      <smart-pagination
        :currentPage.sync="currentPage"
        :totalPages="totalPages"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Object
  },
  data() {
    return {
      height: this.tableData.height + 'px',
      currentPage: 1,
      totalPages: 0
    };
  }
};
</script>

<style lang="scss">
td.kwic-left {
  text-align: right;
}

td.kwic-center {
  font-weight: 600;
  color: #c70e0e;
}
</style>

