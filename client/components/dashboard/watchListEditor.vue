<template>
  <v-card>
    <v-row>
      <v-col>
        <v-toolbar color="primary">
          <v-btn icon @click="$emit('close', $event.target.value)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("watchList.editor.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="save"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in watchlist" :key="item.id" md="3">
        <v-card>
          <v-card-title>
            <v-text-field v-model="item.name" />
            <instrument-search
              @input="
                (val) => {
                  if (val) {
                    model = null;
                    if (item.children.indexOf(val) == -1)
                      item.children.push(val);
                  }
                }
              "
            />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <draggable :list="item.children" group="instruments">
              <v-card
                color="info"
                v-for="(child, index) in item.children"
                :key="child.id"
              >
                <v-row>
                  <v-col md="8" sm="6">
                    <instrument-view :code="child.name" />
                  </v-col>
                  <v-col md="4" sm="6">
                    <v-btn
                      color="error"
                      @click="
                        () => {
                          item.children.splice(index, 1);
                        }
                      "
                    >
                      -
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
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
  Ref,
  reactive,
  useContext,
} from "@nuxtjs/composition-api";
import draggable from "vuedraggable";
import instrumentView from "../oms/instrumentCardCompact.vue";
import InstrumentSearch from "../oms/instrumentSearch.vue";

export default defineComponent({
  name: "watchListEditor",
  emits: ["close"],
  props: ["value"],
  components: {
    draggable,
    "instrument-view": instrumentView,
    InstrumentSearch,
  },
  setup(props, { emit }) {
    const store = useStore();
    const context = useContext();
    const watchlist = mapToEditable(store.getters["user/watchList"]);
    const model: Ref<any> = ref(null);

    async function save() {
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
      watchlist,
      model,
    };
  },
});
</script>
