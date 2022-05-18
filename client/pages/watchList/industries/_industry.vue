<script setup lang="ts">
import { ref, useNuxtApp, reactive, useRoute, useRouter } from "#app";
import { AutoCompleteItem, InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import Watchlist from "@/components/dashboard/WatchList/index.vue";
import IndustrySearch from "~~/components/oms/industrySearch.vue";

const route = useRoute();
const router = useRouter();
const load = ref(false);
const searchModel = ref(new InstrumentSearchModel());
searchModel.value.length = 15;
const industry = ref(-1);
const instruments: Array<string> = reactive([]);
industry.value = parseInt((route.params["industry"] as string | null) ?? "-1");



</script>
<template>
    <v-container class="ma-0 pa-0" fluid>
          <v-row class="ma-0 pa-0" dense>
            <v-col class="ma-0 pa-0">
            <focus-board>
              <template #toolbar>
                <IndustrySearch class="ms-1" style="max-width: 164px"/>
              </template>
            </focus-board>
            </v-col>
          </v-row>
           <v-row class="ma-0 pa-0" dense>
            <v-col class="ma-0 pa-0" style="position: relative">
                <Watchlist :searchModel.sync="searchModel" paginated />
            </v-col>
          </v-row> 
          <loading :loading="load" /> 
    </v-container>
</template>

<style lang="postcss" scoped>
.menu {
  max-width: 164px;
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>