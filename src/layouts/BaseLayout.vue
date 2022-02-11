<template>
  <v-app>
    <slot name="header" />

    <v-main>
      <router-view />
    </v-main>

    <template v-if="close">
      <div class="alert-zone">
        <v-alert
          prominent
          type="error"
        >
          <v-row align="center">
            <v-col class="grow">
              The connection has been lost. Please close the window and try again.
            </v-col>
            <v-col class="shrink">
              <v-btn @click="_close">Close</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </div>
      <v-overlay z-index="9" />
    </template>
  </v-app>
</template>

<style lang="scss" scoped>
  .alert-zone {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 12px;
    z-index: 10;

    .v-alert {
      margin: 0;
    }
  }
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'close'
    ])
  },
  methods: {
    _close() {
      window.close()
    }
  }
}
</script>
