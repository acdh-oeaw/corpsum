<template>
  <div>
    <div>
      <v-table :data="this.tableData" class="table">
        <thead slot="head">
            <th>Name</th>
            <th>Age</th>
        </thead>
        <tbody slot="body" slot-scope="{displayData}">
            <tr v-for="row in displayData" :key="row.id">
              <td>{{ row[0] }}</td>
              <td>{{ row[1] }}</td>
            </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array
  },
  data() {
    return {
    };
  }
};
</script>
