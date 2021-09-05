<template>
  <v-card>
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
    <v-draggable-treeview
      v-model="watchlist"
      group="test"
    >
    </v-draggable-treeview>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, useStore, ref, Ref, watch } from '@nuxtjs/composition-api'
import {KeyValuePaire} from '@/types/collection'
import { Instrument } from '@/types/oms'
import VuetifyDraggableTreeview from 'vuetify-draggable-treeview'

export default defineComponent({
  components: {
    'v-draggable-treeview': VuetifyDraggableTreeview
  },
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
      let i = 0
      for(let key in current) {
        res.push({
          id: i++,
          name: key,
          children: [...current[key]]
        })
      }
      console.log(res)
      return res;
    }

    function editableToMap(edited: any) {
      const res: any = {}
      for(let index in edited) {
        res[edited[index].name] = edited[index].children
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
