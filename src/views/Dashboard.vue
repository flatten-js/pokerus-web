<template>
  <v-container>
    <v-row class="md-6" justify="center">
      <v-col cols="12" lg="3" md="4">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3>Counter</h3>
          <v-menu>
            <template v-slot:activator="{ attrs, on }">
              <v-icon
                v-bind="attrs"
                v-on="on"
              >
                mdi-dots-vertical
              </v-icon>
            </template>

            <v-list>
              <template v-for="menu in counter_menus">
                <v-list-item :key="menu.title" link>
                  <template v-if="menu.popout">
                    <a @click="openPopout(menu.to)">
                      <v-list-item-title>{{ menu.title }}</v-list-item-title>
                    </a>
                  </template>
                  <template v-else>
                    <router-link :to="menu.to">
                      <v-list-item-title>{{ menu.title }}</v-list-item-title>
                    </router-link>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </div>
        <v-data-table
          class="elevation-1"
          :headers="counter_headers"
          :items="counters"
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
          :items="logs"
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
              v-model="logs"
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
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data: () => ({
    dialog: false,
    popout: null,
    _selected: [],

    _counter_headers: [
      { text: 'Name', value: 'name' },
      { text: 'Count', value: 'count' },
      { text: '', value: 'action' }
    ],
    counter_menus: [
      { popout: true, title: 'Popout Counter', to: 'counter' }
    ],

    _log_headers: [
      { text: 'Status', value: 'status' },
      { text: 'Frame', value: 'frame_path' },
      { text: 'Name', value: 'name' },
      { text: 'Updated At', value: 'updated_at' }
    ]
  }),
  async created() {
    await this.$store.dispatch('init')
  },
  computed: {
    ...mapGetters([
      'logs',
      'counters'
    ]),
    selected() {
      return this.$data._selected.map(select => select.uuid)
    },
    counter_headers() {
      return this.formatHeaders(this.$data._counter_headers)
    },
    log_headers() {
      return this.formatHeaders(this.$data._log_headers)
    }
  },
  methods: {
    formatHeaders(headers) {
      return headers.map(header => {
        return { ...header, width: `${100 / headers.length}%` }
      })
    },
    openPopout(to) {
      const { popout } = this
      if (popout == null || popout.closed) {
        this.popout = window.open(to, '', 'width=800,height=150')
      } else {
        popout.focus()
      }
    },
    closeDialog() {
      this.dialog = false
    },
    addLog(frame_path, name, status) {
      this.$store.commit('add_log', { frame_path, name, status })
    },
    deleteLogs(selected) {
      this.$store.commit('delete_logs', { selected })
      this.$data._selected = []
      this.closeDialog()
    }
  }
}
</script>
