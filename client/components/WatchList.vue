
<template>
  <v-list>
    <template v-for="(watchlist, name) in watchlists">
      <v-list-item two-line :key="name">
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>
            <template v-for="(instrument, index) in watchlist">
              <v-list-item :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{instrument}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["watchlists"],
  setup() {},
});
</script>
