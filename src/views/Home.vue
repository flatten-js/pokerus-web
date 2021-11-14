<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Pokerus</h1>
      </v-col>
    </v-row>
    <v-row class="md-6">
      <v-col cols="12" md="6">
        <h2 class="mb-4">Counter</h2>
        <v-data-table
          class="elevation-1"
          :headers="counter_headers"
          :items="counter_items"
          hide-default-footer
        >
          <template v-slot:item.action="{ item }">
            <v-btn color="primary" @click="AddLog(item)" block>Add</v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="mb-4">Update Log</h2>
        <v-data-table
          class="elevation-1"
          v-model="$data._selected"
          :headers="log_headers"
          :items="log_items"
          item-key="uuid"
          disable-sort
          show-select
        >
          <template v-slot:top>
            <div class="d-flex pa-4">
              <v-spacer />
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="error"
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!selected.length"
                    depressed
                  >
                    Delete
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    Are you absolutely sure?
                  </v-card-title>
                  <v-card-text>
                    This operation cannot be undone.
                    It completely deletes the selected update log and also affects the counters.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      depressed
                      @click="closeDialog"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="error"
                      depressed
                      @click="deleteLogs(selected)"
                    >
                      Delete {{ selected.length }} logs
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>

          <template v-slot:body="{ items, isSelected, select }">
            <tbody
              v-model="log_items"
              is="draggable"
              tag="tbody"
            >
              <template v-for="(item, i) in items">
                <tr :key="i">
                  <td>
                    <v-simple-checkbox
                      class="v-data-table__checkbox"
                      :value="isSelected(item)"
                      @input="select(item, $event)"
                    />
                  </td>
                  <template v-for="header in log_headers">
                    <td :key="header.value">
                      {{ item[header.value] }}
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable'
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {
    draggable
  },
  data: () => ({
    dialog: false,
    _selected: [],

    _counter_headers: [
      { text: 'Name', value: 'name' },
      { text: 'Count', value: 'count' },
      { text: '', value: 'action' }
    ],
    counter_default: {
      'A': 0,
      'B': 0
    },

    _log_headers: [
      { text: 'Status', value: 'status' },
      { text: 'Name', value: 'name' },
      { text: 'Updated At', value: 'updated_at' }
    ],
    log_items: [
      { uuid: uuidv4(), status: 'auto', updated_at: new Date(), name: 'A' }
    ]
  }),
  computed: {
    selected() {
      return this.$data._selected.map(select => select.uuid)
    },
    counter_headers() {
      return this.formatHeaders(this.$data._counter_headers)
    },
    log_headers() {
      return this.formatHeaders(this.$data._log_headers)
    },
    counter_items() {
      const data = this.log_items.reduce((acc, cur) => {
        return { ...acc, [cur.name]: (acc[cur.name] || 0) + 1 }
      }, { ...this.counter_default })

      return Object.keys(data).reduce((acc, cur) => {
        return [...acc, { name: cur, count: data[cur] }]
      }, [])
    }
  },
  methods: {
    formatHeaders(headers) {
      return headers.map(header => {
        return { ...header, width: `${100 / headers.length}%` }
      })
    },
    closeDialog() {
      this.dialog = false
    },
    AddLog(item) {
      this.log_items.unshift({
        uuid: uuidv4(),
        status: 'edit',
        updated_at: new Date(),
        name: item.name
      })
    },
    deleteLogs(selected) {
      this.log_items = this.log_items.filter(item => !selected.includes(item.uuid))
      this.$data._selected = []
      this.closeDialog()
    }
  }
}
</script>
