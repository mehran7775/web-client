<script setup lang="ts">
import { ref, computed } from "#app";
import { useSnacks } from "~~/composables";

const snackManager = useSnacks();

const show = computed({
  get: () => snackManager.state.show,
  set(val: boolean) {
    snackManager.state.show = val;
  },
});
const message = computed(() => snackManager.state.content);
const color = computed(() => snackManager.state.color);
const timeout = ref(5000);
</script>

<template>
  <v-snackbar v-model="show" :top="true" :color="color" :timeout="timeout">
    <h4>{{ $t(message) }}</h4>
    <template v-slot:action="{ attrs }">
      <ada-btn color="primary" v-bind="attrs" @click="show = false">
        {{ $t("general.ok") }}
      </ada-btn>
    </template>
  </v-snackbar>
</template>
