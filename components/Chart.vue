<template>
  <section class="chart">
    <bars
      class="bar"
      :data="stats.values"
      :label-size="0.1"
      :auto-draw="true"
      :width="75"
      :height="75"
      :padding="2"
    >
    </bars>

    <ul class="legend">
      <li
        v-for="(stat, idx) in stats.values"
        :key="stat.id"
        class="legend__item"
      >
        {{ stats.labels[idx] }}: {{ stat }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import Bars from 'vuebars'
Vue.use(Bars)

export default Vue.extend({
  name: 'Charts',
  props: {
    stats: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
})
</script>

<style lang="scss">
.chart {
  @apply grid tablet-portrait:grid-cols-1 grid-cols-2;
}
svg.bar {
  @apply tablet-portrait:mb-4;

  width: 150px;

  .container {
    min-height: unset;
    max-width: none;
    width: unset;
    margin: unset;
  }

  @apply pl-1 pb-1 border-l-2 border-b-2 border-gray-500 rounded-sm;

  #bar-id-0 {
    fill: var(--color-primary);
  }
  #bar-id-1 {
    fill: var(--color-primary-alt);
  }
  #bar-id-2 {
    fill: var(--color-secondary);
  }
  #bar-id-3 {
    fill: var(--color-secondary-alt);
  }
}

.legend__item {
  display: flex;
  align-items: center;

  &::before {
    @apply rounded-sm mr-2 h-4 w-4;

    content: '';
    display: inline-block;
  }

  &:nth-child(1)::before {
    @apply bg-primary;
  }
  &:nth-child(2)::before {
    @apply bg-primary-alt;
  }
  &:nth-child(3)::before {
    @apply bg-secondary;
  }
  &:nth-child(4)::before {
    @apply bg-secondary-alt;
  }
}
</style>
