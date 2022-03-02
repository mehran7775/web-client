<script lang="ts">
import { defineComponent, ref} from "@nuxtjs/composition-api";

export default defineComponent({
  components: {},
  setup() {
    const value = ref<string | null>(null);
    return {
      value,
    };
  },
});
</script>

<template>
  <label>
    <input type="text" v-model="value" />
  </label>
</template>
