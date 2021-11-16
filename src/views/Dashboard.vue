<template>
  <v-container>
    <v-row class="md-6" justify="center">
      <v-col cols="12" lg="3" md="4">
        <h3 class="mb-4">Counter</h3>
        <v-data-table
          class="elevation-1"
          :headers="counter_headers"
          :items="counter_items"
          mobile-breakpoint="0"
          hide-default-footer
        >
          <template v-slot:item.action="{ item }">
            <v-btn
              color="primary"
              @click="addLog('', item.name, 'edit')"
              depressed
              block
            >
              Add
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" lg="7" md="8">
        <h3 class="mb-4">Update Log</h3>
        <v-data-table
          class="elevation-1"
          v-model="$data._selected"
          :headers="log_headers"
          :items="log_items"
          item-key="uuid"
          mobile-breakpoint="0"
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

          <template
            v-slot:body="{ items, headers, isSelected, select }"
          >
            <tbody
              v-model="log_items"
              is="draggable"
              tag="tbody"
            >
              <template v-if="!items.length">
                <tr class="v-data-table__empty-wrapper">
                  <td :colspan="headers.length">
                    No data available
                  </td>
                </tr>
              </template>
              <template v-else>
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
                        <template v-if="header.value.includes('path')">
                          <v-img
                            :src="item[header.value]"
                            max-width="120"
                          />
                        </template>
                        <template v-else>
                          {{ item[header.value] }}
                        </template>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

import draggable from 'vuedraggable'

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
      // test: 0
    },

    _log_headers: [
      { text: 'Status', value: 'status' },
      { text: 'Frame', value: 'frame_path' },
      { text: 'Name', value: 'name' },
      { text: 'Updated At', value: 'updated_at' }
    ],
    log_items: [
      // {
      //   uuid: uuidv4(),
      //   status: 'auto',
      //   frame_path: 'https://cdn.pixabay.com/photo/2021/09/15/15/48/seals-6627197_960_720.jpg',
      //   name: 'test',
      //   updated_at: moment().format()
      // }
    ]
  }),
  mounted() {
    const eel = window.eel
    eel.set_host('ws://localhost:8000')

    window.eel.expose((counter, items) => {
      this.counter_default = counter
      this.log_items = items
    }, 'init_js')

    window.eel.expose(this.addLog, 'update_js')
  },
  watch: {
    log_items(log) {
      window.eel.update_py(log)
    }
  },
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
    addLog(frame_path, name, status = 'auto') {
      this.log_items.unshift({
        uuid: uuidv4(),
        status,
        frame_path,
        name,
        updated_at: moment().format()
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
