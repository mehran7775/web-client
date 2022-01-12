<template>
  <tr v-on="$listeners" v-bind="$attrs">
    <td
      v-for="header in model.headers"
      :key="header.value"
      scope="col"
      :class="['header', 'text-' + header.align, header.class]"
    >
      <slot :item="model.item" :name="'item.' + header.value">
        {{ model.item[header.value] }}
      </slot>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  inheritAttrs: false,
  props: ["model"],
  setup() {},
});
</script>

