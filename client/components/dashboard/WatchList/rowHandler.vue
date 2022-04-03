<template>
  <tr v-on="$listeners" v-bind="$attrs" class="row-border">
    <td
      v-for="header in model.headers"
      :key="header.value"
      scope="col"
      :class="['header', 'col-border', 'text-' + header.align, header.class]"
    >
      <slot :item="model.item" :name="'item.' + header.value">
        {{ model.item[header.value] }}
      </slot>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "#app";

export default defineComponent({
  inheritAttrs: false,
  props: ["model"],
  setup() {},
});
</script>

<style lang="postcss" scoped>
.row-border {
  border: none;
  border-color: none;
}
.col-border {
  border: none;
  border-color: none;
  border-bottom: 1px solid #e0e0e0;
}
</style>
