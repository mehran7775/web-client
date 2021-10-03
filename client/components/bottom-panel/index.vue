<template>
  <v-footer :absolute="true" :class="{ expanded: expanded }">
    <v-card :class="{ expanded: expanded }" width="100%" elevation="1">
      <v-card-title v-if="tab != 0">
        <h4 class="font-weight-bold pt-1">
          {{ title }}
        </h4>
        <v-spacer />
        <v-btn icon @click="expand()">
          <v-icon size="1em"> {{ icon }}</v-icon>
        </v-btn>
        <v-btn icon @click="close()">
          <v-icon size="1em">mdi-minus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider v-if="tab != 0" class="mt-4 px-0 mx-1"></v-divider>
      <v-card-text v-if="tab != 0" :class="{ expanded: expanded }">
        <default-order-list v-if="tab == 1" />
        <bests v-if="tab == 2" />
        <deep-information v-if="tab == 3" />
        <further-information v-if="tab == 4" />
      </v-card-text>
      <v-card-actions>
        <v-btn-toggle v-model="tab" borderless dense color="blue">
          <v-btn :value="1" class="white">
            {{ $t("bottom-panel.orders") }}
          </v-btn>
          <v-btn :value="2" class="white">
            {{ $t("bottom-panel.bests") }}
          </v-btn>

          <v-btn :value="3" class="white">
            {{ $t("bottom-panel.depth") }}
          </v-btn>

          <v-btn :value="4" class="white">
            {{ $t("bottom-panel.more") }}
          </v-btn>
        </v-btn-toggle>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import furtherInformation from "./further-information.vue";
import { Tabs } from "@/types/panels";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation.vue";
import Bests from "./bests.vue";

//TODO not working on small displays

export default defineComponent({
  components: { furtherInformation, DeepInformation, DefaultOrderList, Bests },
  setup() {
    const store = useStore();
    const tab = computed({
      get(): Tabs {
        return store.getters["bottom-panel/activeTab"] as Tabs;
      },
      set(value: Tabs) {
        store.commit("bottom-panel/setActiveTab", value);
        store.dispatch("bottom-panel/getMessage", 1);
      },
    });
    const expand = () => {
      store.commit("bottom-panel/toggleExpand");
    };
    const close = () => {
      if (expanded.value) store.commit("bottom-panel/toggleExpand");
      store.commit("bottom-panel/setActiveTab", Tabs.none);
    };
    const icon = computed(() =>
      store.getters["bottom-panel/expanded"]
        ? "mdi-arrow-collapse"
        : "mdi-arrow-expand"
    );
    const expanded = computed(() => store.getters["bottom-panel/expanded"]);
    const title = computed(() => store.getters["bottom-panel/title"]);
    return {
      expand,
      close,
      icon,
      tab,
      title,
      expanded,
    };
  },
});
</script>

<style scoped>
.expanded {
  height: 100%;
}
</style>
