<template>
  <v-card>
    <v-row>
      <v-col>
        <v-toolbar dark color="primary">
          <v-btn icon @click="$emit('close', $event.target.value)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("watchList.editor.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="save"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in watchlist" :key="item.id" md="3">
        <v-card>
          <v-card-title>
            <v-text-field v-model="item.name" />
            <v-autocomplete 
              :placeholder="$t('global.new')"
            />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <draggable :list="item.children" group="instruments">
              <v-row v-for="child in item.children" :key="child.id">
                <v-col>
                  <v-card>
                    <v-row>
                      <v-col md="8" sm="6">
                        <instrument-view :code="child.name" />
                      </v-col>
                      <v-col md="4" sm="6">
                        <v-btn color="error"> - </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  reactive,
} from "@nuxtjs/composition-api";
import draggable from "vuedraggable";
import instrumentView from "@/components/oms/instrument.vue";

export default defineComponent({
  emits: ["close"],
  props: ["value"],
  components: {
    draggable,
    "instrument-view": instrumentView,
  },
  setup(props, { emit }) {
    const store = useStore();
    const watchlist = mapToEditable(store.getters["user/watchList"]);
    const loading = ref(false);

    async function save() {
      console.log(editableToMap(watchlist));
      await store.dispatch("user/update_watchlist", editableToMap(watchlist));
      emit("close");
    }

    function mapToEditable(current: any) {
      const res = [];
      let i = 0;
      for (let key in current) {
        res.push({
          id: i++,
          name: key,
          children: current[key].map((inst: number) => ({
            id: i++,
            name: inst,
          })),
        });
      }
      return reactive(res);
    }

    function editableToMap(edited: any) {
      const res: any = {};
      for (let index in edited) {
        res[edited[index].name] = edited[index].children.map(
          (inst: any) => inst.name
        );
      }
      return res;
    }
    return {
      save,
      loading,
      watchlist,
    };
  },
});
</script>
