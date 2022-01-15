<template>
  <v-select
    height="32"
    :menu-props="{
      bottom: true,
      'offset-y': true,
    }"
    :placeholder="$t('watchList.title')"
    :items="watchList"
    class="watchlist-select"
    item-text="text"
    item-value="id"
    v-model="selected"
    flat
    no-filter
    rounded
    hide-details
    return-object
    single-line
    dense
  >
    <template #append-item>
      <v-list-item class="px-2">
        <v-text-field
          style="width: 116px"
          class="ma-0 pa-0"
          height="32"
          v-model="newName"
          @keyup.enter.stop="create"
          dense
          hide-details
        />
        <v-btn
          @click.stop="create"
          class="ms-1"
          color="primary"
          height="28"
          width="28"
        >
          <v-icon small> mdi-plus </v-icon>
        </v-btn>
      </v-list-item>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item
        draggable="true"
        @dragstart="drag"
        :class="{ item: true, 'px-2': item.onEdit }"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="!item.onEdit">{{ item.text }}</span>
        <v-spacer v-if="!item.onEdit" />
        <v-icon
          v-if="!item.onEdit"
          @click.stop="remove(item.id)"
          color="error"
          small
        >
          adaico-trash
        </v-icon>
        <v-icon
          v-if="!item.onEdit"
          @click.stop="
            () => {
              item.onEdit = true;
            }
          "
          color="default"
          small
        >
          adaico-edit-2
        </v-icon>

        <v-text-field
          v-if="item.onEdit"
          style="width: 116px"
          class="ma-0 pa-0"
          height="28"
          v-model="item.newName"
          @click.stop=""
          @keyup.enter.stop="() => rename(item)"
          dense
          hide-details
        />
        <v-btn
          v-if="item.onEdit"
          @click.stop="() => rename(item)"
          class="ms-1"
          color="success"
          height="28"
          width="28"
        >
          <v-icon small> mdi-check </v-icon>
        </v-btn>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  useRoute,
  useRouter,
  computed,
  ref,
  Ref,
  reactive,
  watch,
} from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    autoRoute: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const selected: Ref<any> = ref(null);
    const newName = ref("");
    const watchList: any[] = reactive([]);
    const wls = computed(() => store.getters["sso/user/watchList"]);

    function refresh() {
      watchList.splice(0, watchList.length);
      Object.keys(wls.value).forEach((k) => {
        watchList.push({
          onEdit: false,
          newName: k,
          text: k,
          id: k,
          to: "/watchList/" + k,
        });
      });
      selected.value =
        watchList.find((item) => item.id == route.value.params.name) ??
        watchList[0];
    }
    async function create() {
      store.commit("sso/user/setWatchlist", {
        name: newName.value,
        watchlist: [],
      });
      await store.dispatch("sso/user/update_watchlist");
      newName.value = "";
      refresh();
    }
    async function remove(name: string) {
      const tmp: any = {};
      Object.keys(wls.value)
        .filter((key) => key != name)
        .forEach((i) => {
          tmp[i] = wls.value[i];
        });
      store.commit("sso/user/updateWatchlist", tmp);
      await store.dispatch("sso/user/update_watchlist");
      if (name == route.value.params.name) router.push(watchList[0].to);
      refresh();
    }
    async function rename(item: any) {
      const tmp: any = {};
      Object.keys(wls.value)
        .filter((key) => key != item.id)
        .forEach((i) => {
          tmp[i] = wls.value[i];
        });
      tmp[item.newName] = wls.value[item.id];
      store.commit("sso/user/updateWatchlist", tmp);
      await store.dispatch("sso/user/update_watchlist");
      if (item.id == route.value.params.name)
        router.push("/watchList/" + item.newName);
      refresh();
    }

    function select(val: any) {
      if (props.autoRoute) router.push(val.to);
    }
    refresh();
    function drag(ev: DragEvent) {}

    watch(selected, select);

    return {
      drag,
      select,
      create,
      remove,
      rename,
      selected,
      watchList,
      newName,
    };
  },
});
</script>

<style lang="sass" scoped>
.watchlist-select
  background-color: rgba($c-primary,0.1)
  border-radius: 8px
.item
  border-bottom-width: 1px
  border-bottom-color: var(--v-default-lighten4)
  border-bottom-style: dashed
</style>
