<template>
  <div
    dir="ltr"
    v-if="keyboard.active"
    class="en keyboard d-flex flex-column justify-center"
  >
    <div v-if="shift" class="d-flex flex-row flex-wrap justify-center">
      <v-btn
        v-for="key in alternate"
        :key="key.name"
        :class="{
          'ma-1': true,
          'default lighten-3': !key.active,
          'primary lighten-3': key.active,
        }"
        @click="
          () => {
            keyboard.call(key.name);
          }
        "
        width="42"
        height="42"
        large
        >{{ key.name }}</v-btn
      >
    </div>
    <div v-else class="d-flex flex-row flex-wrap justify-center">
      <v-btn
        v-for="key in normal"
        :key="key.name"
        :class="{
          'ma-1': true,
          'default lighten-3': !key.active,
          'primary lighten-3': key.active,
        }"
        @click="
          () => {
            keyboard.call(key.name);
          }
        "
        width="42"
        height="42"
        large
        >{{ key.name }}</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
  reactive,
} from "@nuxtjs/composition-api";
import {
  printableKeys,
  printableShiftKeys,
  useVirtualKeyBoard,
} from "@/utils/virtualKeyBoard";

export default defineComponent({
  props: ["value"],
  setup(props, ctx) {
    const keyboard = ref(useVirtualKeyBoard());
    const shift = ref(false);
    const normal = reactive(printableKeys.map((key) => ({ name: key, active: false })));
    const alternate = reactive(
      printableShiftKeys.map((key) => ({ name: key, active: false }))
    );

    if (process.client) {
      document.addEventListener("keydown", (ev: KeyboardEvent) => {
        shift.value = ev.shiftKey;
        let item = normal.find((item) => item.name == ev.key);
        if (!item) item = alternate.find((item) => item.name == ev.key);
        if (item) item.active = true;
      });
      document.addEventListener("keyup", (ev: KeyboardEvent) => {
        shift.value = ev.shiftKey;
        let item = normal.find((item) => item.name == ev.key);
        if (!item) item = alternate.find((item) => item.name == ev.key);
        if (item) item.active = false;
      });
    }

    return { shift, normal, alternate, keyboard };
  },
});
</script>

<style lang="postcss" scoped>
.keyboard {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
}
</style>
