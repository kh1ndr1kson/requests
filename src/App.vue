<template>
  <v-app class="box">
    <data-table />
    <snackbar-message :snackbar="getSnackbar" />
  </v-app>
</template>

<script>
import DataTable from './components/DataTable.vue';
import SnackbarMessage from './components/SnackbarMessage.vue';

export default {
  name: 'App',

  components: {
    DataTable,
    SnackbarMessage
  },

  computed: {
    getSnackbar() {
      return this.$store.getters.GET_SHACKBAR_INFO
    }
  }
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.box {
  width: 800px;
  max-width: 800px;
  max-height: 600px;
  background: #444;
}
</style>