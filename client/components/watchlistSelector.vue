<template>
  <v-combobox
    height="32"
    v-model="model"
    :placeholder="$t('instrument.search')"
    :loading="loading"
    :items="entries"
    class="instrument-search no-translate"
    append-icon=""
    prepend-inner-icon="mdi-magnify"
    item-text="name"
    item-value="id"
    flat
    no-filter
    rounded
    hide-details
    return-object
    dense
  />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {},
});
</script>

<style lang="sass" scoped>
.instrument-search
  background-color: var(--v-common-base)
  border-radius: 8px
</style>
