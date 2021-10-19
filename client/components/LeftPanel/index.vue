<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="!rtl"
    width="260"
    absolute
    fixed
    app
  >
    <v-list dense>
      <v-tabs grow>
        <v-tab> {{ $t("general.me") }} </v-tab>
        <v-tab> {{ $t("general.all") }} </v-tab>
      </v-tabs>
      <filter-auto-complete class="px-1" />
      <v-list-item-group v-model="selected"> </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
  useContext,
} from "@nuxtjs/composition-api";
import filterAutoComplete from "./filterAutoComplete.vue";

export default defineComponent({
  components: { filterAutoComplete },
  name: "right-panel",
  emits: ["openWatchList"],
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const selected: Ref = ref(null);
    const rtl = computed(() => store.getters["rtl"]);

    const expand = ref(true);
    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
      },
    });
    return {
      rtl,
      drawer,
      expand,
      selected,
    };
  },
});
</script>
