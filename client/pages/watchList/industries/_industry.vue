<script setup lang="ts">
import { ref, useRoute, watch } from "#app";
import { InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import Watchlist from "@/components/dashboard/WatchList/index.vue";
import IndustrySearch from "~~/components/oms/industrySearch.vue";


const route = useRoute();
const searchModel = ref(new InstrumentSearchModel());
searchModel.value.length = 105;
const secId= ref(0)
if(route.params.industry){
  searchModel.value.secIds = [parseInt(route.params.industry)]
  secId.value = searchModel.value.secIds[0];
}


watch(
      () => route.params.industry,
      (sec) => {
        searchModel.value.secIds = [parseInt(sec)];
      }
    );
</script>
<template>
    <v-container class="ma-0 pa-0" fluid>
          <v-row class="ma-0 pa-0" dense>
            <v-col class="ma-0 pa-0">
            <focus-board>
              <template #toolbar>
                <IndustrySearch :secId="secId" class="ms-1" style="max-width: 164px"/>
              </template>
            </focus-board>
            </v-col>
          </v-row>
           <v-row class="ma-0 pa-0" dense>
            <v-col class="ma-0 pa-0" style="position: relative">
                <Watchlist :searchModel.sync="searchModel" paginated />
            </v-col>
          </v-row> 
          
    </v-container>
</template>

<style lang="postcss" scoped>
.menu {
  max-width: 164px;
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>