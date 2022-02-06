<template>
  <v-select
    :items="items"
    item-value="id"
    item-text="name"
    :value="value"
    v-on="$listeners"
    v-bind="$attrs"
    class="board-search"
    :menu-props="{
      bottom: true,
      'offset-y': true,
    }"
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
  </v-select>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from "@nuxtjs/composition-api";
import { AutoCompleteItem } from "@/types";
import { getBoards } from "@/repositories/oms/board_manager";

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: {
      type: Number
    },
  },
  setup(props, ctx) {
    const context = useContext();
    const items: Array<AutoCompleteItem> = reactive([]);
    getBoards(context.$axios).then((resp) => {
      items.push(...resp.data.data);
      if (props.value != -1) {
        ctx.emit(
          "input",
          items.find((item) => item.id == props.value?.toString())
        );
      }
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
  font-size: 0.75rem
  max-width: 164px
  &.v-select
    &--is-menu-active
      .arrow
        transform: rotate(-180deg)
</style>
<style lang="sass">
.board-search
  &.v-select
    *
      color: $c-primary !important
  input
    color: $c-primary !important
    &::placeholder
      color: $c-primary !important
</style>
