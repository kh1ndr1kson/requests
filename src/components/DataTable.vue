<template>
  <v-data-table
    :headers="headers"
    :items="requests"
    dense
    locale="ru-in"
    sort-by="calories"
    class="elevation-2"
    :hide-default-footer="true"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Ваши заявки</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" scrollable max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container class="p-0">
                <v-row class="pt-5">
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="sportsmen"
                      v-model="editedItem.sportsman_id"
                      name="editedItem.sportsman_id"
                      item-value="id"
                      item-text="setSportsmanTitle"
                      label="Спортсмены *"
                      dense
                      outlined
                    >
                      <template slot="selection" slot-scope="data">
                        {{ data.item.first_name }} {{ data.item.last_name }}
                      </template>
                      <template slot="item" slot-scope="data">
                        {{ data.item.first_name }} {{ data.item.last_name }}
                      </template>
                    </v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="disciplines"
                      v-model="editedItem.discipline_id"
                      name="editedItem.discipline_id"
                      item-value="id"
                      item-text="name"
                      label="Дисциплины *"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="classes"
                      v-model="editedItem.class_id"
                      name="editedItem.class_id"
                      item-value="id"
                      item-text="name"
                      label="Классы *"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="dogsAll"
                      v-model="editedItem.dogs"
                      name="editedItem.dogs"
                      item-value="id"
                      item-text="name"
                      label="Собаки *"
                      append-icon="mdi-dog-side"
                      multiple
                      dense
                      outlined
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-checkbox
                      v-model="editedItem.vroo"
                      label="Являюсь членом региональной федерации"
                      :true-value="'1'"
                      :false-value="'0'"
                      color="primary"
                      hide-details
                      class="mt-0 pb-5"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" v-if="editedItem.vroo == 1">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.federation"
                      label="Федерация *"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <p class="muted font-italic mb-0">
                * Обязательные для заполнения поля
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="close">Закрыть</v-btn>
              <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <dialog-show
          :dialog.sync="dialogShow"
          ref="dialogShow"
          @get-by-emit="getDialogShowState($event)"
        />
      </v-toolbar>
    </template>
    <template v-slot:item.id="{ item }">
      {{ requestTitle(item.id, item.date) }}
    </template>
    <template v-slot:item.event_id="{ item }">
      {{ item.event.title }}
    </template>
    <template v-slot:item.status="{ item }">
      <span :style="item.id ? 'color: green' : 'color: red'">
        {{ requestStatus(item.status) }}
      </span>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small color="success" class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small color="info" @click="showItem(item)"> mdi-eye </v-icon>
    </template>
    <template v-slot:no-data>
      <div class="text-caption">Список пуст</div>
    </template>
  </v-data-table>
</template>

<script>
import { HTTP } from '@/plugins/api'
import moment from 'moment'

import DialogShow from './DialogShow'

export default {
  components: {
    DialogShow
  },
  data() {
    return {
      dialog: false,
      dialogShow: false,
      headers: [
        { text: 'Номер заявки, дата', value: 'id' },
        { text: 'Мероприятие', value: 'event_id' },
        { text: 'Статус заявки', value: 'status' },
        { text: '', value: 'actions', sortable: false, align: 'right' },
      ],
      requests: [],
      sportsmen:[], // v-select
      disciplines:[], // v-select
      classes:[], // v-select
      dogsAll:[], // v-select
      editedIndex: -1,
      editedItem: {
        id: null,
        sportsman_id: null,
        discipline_id: null,
        class_id: null,
        dogs: null,
        vroo: null,
        federation: null,
      },
      defaultItem: {
        id: null,
        sportsman_id: null,
        discipline_id: null,
        class_id: null,
        dogs: null,
        vroo: null,
        federation: null,
      },
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Добавить заявку' : 'Изменить заявку'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      HTTP.get('get_all.php')
      .then( response => { this.requests = response.data } )
      .catch( error => console.log('Hello error', error) )
      
      // push sportsmen (v-select)
      HTTP.get('select/sportsmen.php')
      .then( response => this.sportsmen = response.data )
      // push disciplines (v-select)
      HTTP.get('select/disciplines.php')
      .then( response => this.disciplines = response.data )
      // push classes (v-select)
      HTTP.get('select/classes.php')
      .then( response => this.classes = response.data )
      // push dogs (v-select)
      HTTP.get('select/dogs.php')
      .then( response => this.dogsAll = response.data )
    },

    editItem (item) {
      this.editedIndex = this.requests.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    showItem (item) {
      this.editedIndex = this.requests.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogShow = true

      this.$refs.dialogShow.initialize(item.id)
    },

    close () {
      this.dialog = false
      this.dialogShow = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        HTTP.post('edit.php', this.editedItem, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then( response => {
          this.$store.commit('SET_SNACKBAR', response.data)

          if (response.data.status === 'success') {
            Object.assign(this.requests[this.editedIndex], this.editedItem)
            this.close()
          }
        })
        .catch( error => {
          console.log('Hello error', error)
        })
      }
    },
    requestTitle(id, date) {
      return '№' + id + ' от ' + this.formatDate(date)
    },
    requestStatus(status) {
      return status ? 'Активная' : 'Не активная'
    },
    formatDate(dat) {
      return moment(dat).format('D MMMM YYYY')
    },
    setSportsmanTitle(sportsman) {
      return sportsman.first_name + sportsman.last_name
    },
    getDialogShowState(status) {
      this.dialogShow = status
    }
  }
}
</script>

<style>
.v-card__title {
  padding-bottom: 20px !important;
}
.col {
  padding: 0 !important;
}
.mx-datepicker {
  width: 100% !important;
  margin-bottom: 25px;
}
.v-text-field--outlined fieldset {
  border-color: #ccc !important;
}
</style>