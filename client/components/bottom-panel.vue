<template>
  <v-container fluid> 
    <v-col class="ma-0 pa-0" >
      <v-row class="ma-1" v-if="panel == '4'">
        <further-information/>
      </v-row>
        <v-row class="white">
          <v-btn-toggle 
          v-model="panel"
          borderless
          dense
          color="blue"
          >
            <v-btn value="1" width="7rem" class="white">
              سفارشات
            </v-btn>

            <v-btn value="2" width="7rem" class="white">
              برترین ها
            </v-btn>

            <v-btn value="3" width="7rem" class="white">
              عمق بازار
            </v-btn>

            <v-btn value="4" width="7rem" class="white">
              اطلاعات تکمیلی
            </v-btn>
          </v-btn-toggle>
        </v-row>
        
        </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const store = useStore()
    const panel = computed ({
            get() {
                return store.getters["bottom-panel/activeTab"]
            },
            set(value: string) {
                store.commit("bottom-panel/setActiveTab",value)
                store.dispatch("bottom-panel/getMessage", 1)
            }
        })
    return {
      panel
    }
  },
})
</script>
