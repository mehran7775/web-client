<template>
  <thead>
    <tr>
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
        :v-on="$on"
        :v-bind="$attrs"
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
        <div>
          {{ header.text }}
          <v-icon color="primary" v-if="header.icon" small>
            {{ header.icon }}
          </v-icon>
          <div
            v-if="header.value != 'actions' && header.value != 'more'"
            class="divider"
          >
            |
          </div>
        </div>
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
import {
  WatchlistColumns,
  DefaultCols,
  InstrumentCache,
  Side,
  User,
} from "@/types";

export default defineComponent({
  props: ["headers", "props"],
  setup() {
    const store = useStore();
    const me: ComputedRef<User> = computed(() => store.getters["sso/user/me"]);
    let draggingCol: WatchlistColumns | null = null;
    function drag(item: WatchlistColumns) {
      draggingCol = item;
    }
    function drop(item: WatchlistColumns) {
      if (draggingCol && draggingCol.draggable && draggingCol != item) {
        const hrs = [...(me.value.settings.columns ?? DefaultCols())];
        const ind = hrs.findIndex((i) => i.value == draggingCol?.value);
        draggingCol = hrs[ind];
        hrs.splice(ind, 1);
        const target = hrs.findIndex((i) => i.value == item.value);
        hrs.splice(ind > target ? target : target + 1, 0, draggingCol);
        store.commit("sso/user/setCols", hrs);
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
.header
  position: relative
.divider
  position: absolute
  top: calc(50% - 6px)
  left: -4px
</style>
