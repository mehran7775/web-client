<template>
  <v-autocomplete
    :items="items"
    v-on="$listeners"
    v-bind="$attrs"
    class="board-search"
    height="28"
    :placeholder="$t('menu.boards')"
    dense
    hide-details
    rounded
  >
    <template #append>
      <v-icon class="ma-2 arrow" x-small> isax-arrow-down </v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  useStore,
} from "@nuxtjs/composition-api";

export default defineComponent({
  inheritAttrs: false,
  setup() {
    const store = useStore();
    const items = reactive([]);

    return {
      items,
    };
  },
});
</script>

<style lang="sass" scoped>
.board-search
  background-color: rgba($c-primary,0.05)
  border-radius: $border-radius-root
  max-width: 164px
  &.v-select
    &--is-menu-active
      .arrow
        transform: rotate(-180deg)
</style>

