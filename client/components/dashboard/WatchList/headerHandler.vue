<template lang="vue">
<thead>
    <tr v-on="$listeners" v-bind="$attrs" class="headers">
      <th
        :draggable="header.draggable"
        @dragstart="() => drag(header)"
        @dragover="
          (ev) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'move';
          }
        "
        dropzone="true"
        @drop="
          (ev) => {
            ev.preventDefault();
            drop(header);
          }
        "
        v-for="header in props.headers"
        :key="header.value"
        :aria-label="header.text"
        role="columnheader"
        scope="col"
        :style="{
          width: header.width ? header.width : '',
          'min-width': header.width ? header.width : '',
        }"
        :class="['header', 'text-' + header.align, header.class]"
      >
        <slot :header="header" :name="'header.' + header.value">
          <h5>
            {{ header.text }}
          </h5>
          <v-icon color="primary" v-if="header.icon" small>
            {{ header.icon }}
          </v-icon>
          <bar v-if="header.value != 'actions' && header.value != 'more'" />
        </slot>
      </th>
    </tr>
  </thead>
</template>
<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  computed,
  ComputedRef,
} from "@nuxtjs/composition-api";
import { WatchlistColumns, DefaultCols, InstrumentCache, Side, User } from "@/types";
import { useUser } from "~/composables";

export default defineComponent({
  inheritAttrs: false,
  props: ["headers", "props"],
  setup(props) {
    const store = useStore();
    const userManager = useUser(store);
    const me = userManager.me;
    let draggingCol: WatchlistColumns | null = null;
    function drag(item: WatchlistColumns) {
      draggingCol = item;
    }
    async function drop(item: WatchlistColumns) {
      if (draggingCol && draggingCol.draggable && draggingCol != item) {
        const hrs = [...(me.value.settings.columns ?? DefaultCols())];
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
    return {
      drag,
      drop,
    };
  },
});
</script>

<style lang="sass" scoped>
.headers
  background-color: rgba($c-primary,0.1)
.header
  position: relative
  background-color: none
  border: none !important
</style>
