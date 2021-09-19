<template>
  <v-container fluid v-click-outside="onClickOutside"> 
    <v-col class="ma-0 pa-0" >
      <v-row class="ma-1" v-if="text == '4'">
        <further-information/>
      </v-row>
        <v-row class="white">
          <v-btn-toggle 
          v-model="text"
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
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    let text = ref('')
    const onClickOutside = () => {text.value = ''}
    return {
      text,
      onClickOutside
    }
  },
})
</script>
