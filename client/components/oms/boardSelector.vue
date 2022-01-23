<template>
  <v-autocomplete
    :items="items"
    item-value="id"
    item-text="name"
    v-on="$listeners"
    v-bind="$attrs"
    class="board-search"
    height="28"
    :placeholder="$t('menu.boards')"
    @input="
      (val) => {
        $emit('input', val);
      }
    "
    flat
    no-filter
    rounded
    hide-details
    return-object
    dense
  >
    <template #append>
      <v-icon class="ma-2 arrow" x-small> isax-arrow-down </v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from "@nuxtjs/composition-api";
import { AutoCompleteItem } from "@/types";
import { getBoards } from "@/repositories/oms/board_manager";

export default defineComponent({
  inheritAttrs: false,
  setup() {
    const context = useContext();
    const items: Array<AutoCompleteItem> = reactive([]);
    getBoards(context.$axios).then((resp) => {
      items.push(...resp.data.data);
    });
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

