<script setup lang="ts">
import { WatchListColumns, DefaultCols } from "@/types";
import { useUser } from "~/composables";

const props = defineProps<{
  headers: Array<WatchListColumns>;
}>();

const userManager = useUser();
const me = userManager.me;
let draggingCol: WatchListColumns | null = null;
function drag(item: WatchListColumns) {
  draggingCol = item;
}
async function drop(item: WatchListColumns) {
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
defineExpose({
  drag,
  drop
})
</script>

<style lang="postcss" scoped>
thead {
  >.headers {
    @apply tw-bg-primary tw-bg-opacity-10;
    /* background-color: rgba(var(--c-primary), 0.1); */

    >.header {
      position: relative;
      border: none !important;
      height: var(--row-height);
      white-space: nowrap;

      .icon {
        @apply tw-text-primary tw-cursor-pointer;
      }
    }
  }
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
        }" :class="['tw-text-' + header.align, header.class]" class="header">
        <slot :header="header" :name="'header.' + header.value">
          <h6>
            {{ header.text }}
          </h6>
          <ada-icon v-if="header.icon" :size="16">
            {{ header.icon }}
          </ada-icon>
          <div v-if="header.divider && index != headers.length - 1" class="bar"></div>
        </slot>
      </th>
    </tr>
  </thead>
</template>
