<template>
  <div v-if="Object.keys(this.request).length > 0">
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Заявка №{{ request.id }} от {{ formatDate(request.date) }}
            <span class="subtitle-1" v-if="request.vroo == 1"
              >({{ request.federation }})</span
            >
          </span>
          <v-spacer></v-spacer>
          <v-btn icon right @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <div>
            <v-icon dense left>mdi-calendar-cursor</v-icon>
            <span>Мероприятие </span>
            <div class="subtitle-2 text--primary">
              {{ request.event.title }}
            </div>
            <p>
              с {{ formatDate(request.event.start) }} по
              {{ formatDate(request.event.end) }}
            </p>
          </div>
          <div>
            <v-icon dense left>mdi-account</v-icon>
            <span>Спортсмен</span>
            <div class="subtitle-2 text--primary">
              {{ request.sportsman.last_name }}
              {{ request.sportsman.first_name }}
              {{ request.sportsman.middle_name }}
            </div>
            <p>{{ request.sportsman.discharge.name }}</p>
          </div>

          <div>
            <span>Дисциплина</span>
            <p class="subtitle-2 text--primary">
              {{ request.discipline.name }}
            </p>
          </div>
          <div>
            <span>Класс</span>
            <p class="subtitle-2 text--primary">
              {{ request.class.name }}
            </p>
          </div>

          <div>
            <div>Собаки</div>
            <span
              class="subtitle-2 text--primary"
              v-for="(dog, index) in request.dogs"
              :key="dog.id"
            >
              {{ dog.name }}<i v-if="index === request.dogs.length - 1"></i
              ><i v-else>, </i>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { HTTP } from '@/plugins/api'
import moment from 'moment'

export default {
  name: 'DialogShow',
  data() {
    return {
      request: {}
    }
  },
  props: {
    dialog: {
      type: Boolean
    }
  },
  methods: {
    initialize(id) {
      HTTP.get('get_request_info.php?id=' + id)
      .then( response => { this.request = response.data; } )
      .catch( error => console.log('Hello error', error) )
    },
    closeDialog() {
      this.$emit('get-by-emit', false)
    },
    formatDate(dat) {
      return moment(dat).format('D MMMM YYYY')
    }
  }
}
</script>
