<template>
  <v-app>
    <v-app-bar
      class="transparent"
      app
      absolute
      flat
    >
      <v-btn
        class="mr-4"
        color="white"
        elevation="1"
        :ripple="false"
        fab
        small
        @click="drawer = !drawer"
      >
        <v-icon color="grey">
          mdi-dots-vertical
        </v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ $route.name }}
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
    >
      <v-list>
        <v-list subheader>
          <v-list-item>
            <v-list-item-title class="title">
              Pokerus Beta
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list nav dense>
          <v-list-item-group color="primary">
            <template v-for="item in items">
              <v-list-item :to="item.to" :key="item.title">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
  @import 'vuetify/src/styles/styles.sass';

  .v-application {
    &.theme--light {
      background-color: map-get($grey, 'lighten-3');
    }
  }
</style>

<script>
export default {
  data: () => ({
    _drawer: null,

    items: [
      { icon: 'mdi-view-dashboard', title: 'Dashboard', to: { name: 'Dashboard' } }
    ]
  }),
  computed: {
    drawer: {
      get () {
        return this.$data._drawer
      },
      set (state) {
        this.$data._drawer = state
      }
    }
  }
}
</script>
