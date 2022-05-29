<script setup lang="ts">
import { WatchlistColumns, DefaultCols } from "@/types";
import { useUser } from "~/composables";

const props = defineProps<{
  headers: Array<WatchlistColumns>;
}>();

const userManager = useUser();
const me = userManager.me;
let draggingCol: WatchlistColumns | null = null;
function drag(item: WatchlistColumns) {
  draggingCol = item;
}
async function drop(item: WatchlistColumns) {
  if (draggingCol && draggingCol.draggable && draggingCol != item) {
    const hrs = [...(me.settings.columns ?? DefaultCols())];
    const ind = hrs.findIndex((i) => i.value == draggingCol?.value);
    draggingCol = hrs[ind];
    hrs.splice(ind, 1);
    const target = hrs.findIndex((i) => i.value == item.value);
    hrs.splice(ind > target ? target : target + 1, 0, draggingCol);
    userManager.setCols(hrs);
    await userManager.update_settings({
      path: "/columns",
      value: hrs,
    });
  }
  draggingCol = null;
}
</script>

<style lang="postcss" scoped>
.headers {
  background-color: rgba(var(--c-primary), 0.1);
}

.header {
  position: relative;
  border: none !important;
  height: var(--tabel-row-height);
  white-space: nowrap;
}
</style>

<template>
  <thead>
    <tr v-bind="$attrs" class="headers">
      <th :draggable="header.draggable" @dragstart="() => drag(header)" @dragover="
        (ev) => {
          ev.preventDefault();
          if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
        }
      " dropzone="true" @drop="
  (ev) => {
    ev.preventDefault();
    drop(header);
  }
" v-for="(header, index) in props.headers" :key="header.value" :aria-label="header.text" role="columnheader"
        scope="col" :style="{
          width: header.width ? header.width : '',
          'min-width': header.width ? header.width : '',
        }" :class="['header', header.class]">
        <slot :header="header" :name="'header.' + header.value">
          <h5>
            {{ header.text }}
          </h5>
          <ada-icon color="primary" v-if="header.icon" :size="16">
            {{ header.icon }}
          </ada-icon>
          <bar v-if="header.divider && index != headers.length - 1" />
        </slot>
      </th>
    </tr>
  </thead>
</template>
