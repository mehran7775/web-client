<template>
  <v-card>
    <v-row>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click='$emit("close", $event.target.value)'
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{$t("watchList.editor.title")}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-row>
    <v-row v-for="item in watchlist" :key="item.key">
      <v-col xs="1" sm="2" md="3" />
      <v-col xs="10" sm="8" md="6" >
        <v-card>
          <v-card-title>
            <v-col>
              <v-text-field v-model="item.key" />
            </v-col>
            <v-col />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-autocomplete
              v-model="item.value"
              :items="items"
              :loading="loading"
              :search-input.sync="search"
              item-text="value"
              item-value="key"
              multiple
              chips
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
  </v-card>
</template>

<script lang="ts">
import { defineComponent, useStore, ref, Ref, watch } from '@nuxtjs/composition-api'
import {KeyValuePaire} from '@/types/collection'
import { Instrument } from '@/types/oms'

export default defineComponent({
  emits: ["close"],
  setup(props, {emit}) {
    const store = useStore();
    const watchlist = mapToEditable(store.getters['user/watchList'])
    const loading = ref(false);
    let search = ref(null)
    let items: Ref<KeyValuePaire<BigInt,Instrument>[]> = ref([]);
    items.value = loadCache()
    
    function save() {
      console.log(editableToMap(watchlist))
      //emit("close")
    }

    watch(search, (fresh, old) => {
      console.log(old, fresh)
    })

    function loadCache() :KeyValuePaire<BigInt,Instrument>[] {
      return []
    }

    function mapToEditable(current: any) {
      const res = []
      for(let key in current) {
        res.push({
          key: key,
          value: [...current[key]]
        })
      }
      return res;
    }

    function editableToMap(edited: Array<KeyValuePaire<any,any>>) {
      const res: any = {}
      for(let index in edited) {
        res[edited[index].key] = edited[index].value
      }
      return res
    }

    return {
      save,
      search,
      loading,
      items,
      watchlist
    }
  },
})
</script>
