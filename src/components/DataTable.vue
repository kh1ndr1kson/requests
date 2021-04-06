<template>
  <v-data-table
    :headers="headers"
    :items="sportsmen"
    dense
    locale="ru-in"
    sort-by="calories"
    class="elevation-2"
    :footer-props="{
      itemsPerPageText: 'Строк на странице',
      itemsPerPageAllText: 'Все',
      pageText: '{0} из {1}',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Спортсмены</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" scrollable max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              small
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              >Добавить спортсмена</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container class="p-0">
                <v-row class="pt-5">
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.last_name"
                      label="Фамилия *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.first_name"
                      label="Имя *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.middle_name"
                      label="Отчество"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.phone"
                      v-mask="'+7 (###) ###-##-##'"
                      label="Номер телефона *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.email"
                      label="Email *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      v-model="editedItem.location"
                      label="Город, населенный пункт *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      outlined
                      dense
                      type="date"
                      v-model="editedItem.birthday"
                      label="Дата рождения *"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="discharges"
                      v-model="editedItem.discharge_id"
                      name="editedItem.discharge_id"
                      item-value="id"
                      item-text="name"
                      label="Спортивный разряд *"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col class="d-flex" cols="12">
                    <v-select
                      :items="disciplines"
                      v-model="editedItem.discipline_id"
                      name="editedItem.discipline_id"
                      item-value="id"
                      item-text="name"
                      label="Дисциплина *"
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
                      label="Класс *"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                  <v-radio-group class="mt-0" v-model="editedItem.vroo">
                    <template v-slot:label>
                      <div>Являетесь ли вы членом ВРОО "ВолФес"?</div>
                    </template>
                    <v-radio value="1">
                      <template v-slot:label>
                        <div>Да</div>
                      </template>
                    </v-radio>
                    <v-radio value="0">
                      <template v-slot:label>
                        <div>Нет</div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="editedItem.status"
                      label="Активный"
                      :true-value="'1'"
                      :false-value="'0'"
                      color="primary"
                      hide-details
                      class="mt-0 pb-5"
                    ></v-checkbox>
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
      </v-toolbar>
    </template>
    <template v-slot:item.last_name="{ item }">
      <v-badge
        dot
        inline
        left
        bordered
        :color="
          item.status == 1 || item.status == true
            ? 'green lighten-3'
            : 'red lighten-3'
        "
      >
        {{ item.last_name }}</v-badge
      >
    </template>
    <template v-slot:item.birthday="{ item }">
      {{ formatDate(item.birthday) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2 success--text" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small class="error--text" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <div class="text-caption">Список пуст</div>
    </template>
  </v-data-table>
</template>

<script>
import { HTTP } from '@/plugins/api'
import moment from 'moment'

export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Фамилия', value: 'last_name' },
      { text: 'Имя', value: 'first_name' },
      { text: 'Телефон', value: 'phone' },
      { text: 'Дата рождения', value: 'birthday' },
      { text: '', value: 'actions', sortable: false, align: 'right' },
    ],
    sportsmen: [],
    discharges:[], // v-select
    disciplines: [], // v-select
    classes: [], // v-select
    editedIndex: -1,
    editedItem: {
      id: null,
      first_name: null,
      last_name: null,
      middle_name: null,
      phone: null,
      email: null,
      location: null,
      birthday: null,
      discharge_id: 0,
      discipline_id: 0,
      class_id: 0,
      vroo: 0,
      status: 0,
    },
    defaultItem: {
      id: null,
      first_name: null,
      last_name: null,
      middle_name: null,
      phone: null,
      email: null,
      location: null,
      birthday: null,
      discharge_id: 0,
      discipline_id: 0,
      class_id: 0,
      vroo: 0,
      status: 0,
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Добавить спортсмена' : 'Изменить спортсмена'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.$root.$moment.locale("ru");
    this.initialize()
  },

  methods: {
    initialize () {
      HTTP.get('get_all.php')
      .then( response => {
        this.sportsmen = response.data
      })
      .catch( error => {
        console.log('Hello error', error)
      })

      // push discharges (v-select)
      HTTP.get('select/discharges.php')
      .then( response => this.discharges = response.data )
      // push discharges (v-select)
      HTTP.get('select/disciplines.php')
      .then( response => this.disciplines = response.data )
      // push classes (v-select)
      HTTP.get('select/classes.php')
      .then( response => this.classes = response.data )
    },

    editItem (item) {
      this.editedIndex = this.sportsmen.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.sportsmen.indexOf(item.id)
      const id = item.id

      let ask = confirm('Вы действительно хотите удалить спортсмена?')
      
      if (ask) {
        HTTP.post('delete.php', { id }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then( response => {
          this.$store.commit('SET_SNACKBAR', response.data)

          if (response.data.status === 'success') {
            this.sportsmen.splice(index, 1)
            this.close()
          }
        })
        .catch( error => {
          console.log('Hello error', error)
        })
      }  
    },

    close () {
      this.dialog = false
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
            Object.assign(this.sportsmen[this.editedIndex], this.editedItem)
            this.close()
          }
        })
        .catch( error => {
          console.log('Hello error', error)
        })
      } else {
        HTTP.post('add.php', this.editedItem, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then( response => {
          this.$store.commit('SET_SNACKBAR', response.data)

          if (response.data.status === 'success') {
            this.editedItem.id = response.data.id
            this.sportsmen.push(this.editedItem)
            this.close()
          }
        })
        .catch( error => {
          console.log('Hello error', error)
        })
      }
    },
    formatDate(dat) {
      return moment(dat).format('D MMMM YYYY')
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
</style>