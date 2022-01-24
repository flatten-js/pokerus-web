<template>
  <div class="counter">
    <div class="counter-wrapper">
      <template v-for="counter in counters">
        <div
          :key="counter.name"
          class="text-h2 font-weight-bold"
        >
          {{ counter.name }}遭遇数: {{ counter.count }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  async created() {
    await this.$store.dispatch('init')
  },
  computed: {
    ...mapGetters([
      'counters'
    ])
  }
}
</script>
