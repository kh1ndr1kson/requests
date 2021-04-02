<template>
  <div>
    <v-snackbar
      top
      class="mt-5"
      v-model="snackbar.show"
      :color="snackbar.status"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}

      <template v-slot:action="{ attrs }">
        <v-icon v-bind="attrs" @click="snackbar.show = false">
          mdi-close
        </v-icon>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'snackbar-message',
  props: {
    snackbar: {
      type: Object
    }
  }
}
</script>