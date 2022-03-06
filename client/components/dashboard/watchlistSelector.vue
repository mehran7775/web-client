<template>
  <v-select
    height="28"
    :menu-props="{
      bottom: true,
      'offset-y': true,
      'content-class': 'watchlist-select__content',
    }"
    :placeholder="$t('watchList.title')"
    :items="watchList"
    class="watchlist-select"
    item-text="text"
    item-value="id"
    v-model="selected"
    flat
    no-filter
    hide-details
    return-object
    single-line
    dense
  >
    <template #append>
      <v-icon class="ma-2 arrow" color="white" x-small> isax-arrow-down </v-icon>
    </template>
    <template #append-item>
      <v-list-item style="width: 164px" class="px-2">
        <v-text-field
          style="width: 116px"
          class="ma-0 pa-0"
          height="28"
          v-model="newName"
          @keyup.enter.stop="create"
          dense
          hide-details
        />
        <v-btn @click.stop="create" class="ms-1" color="primary" height="28" width="28">
          <v-icon small> mdi-plus </v-icon>
        </v-btn>
      </v-list-item>
    </template>
    <template #item="{ item, on }">
      <v-list-item
        draggable="true"
        @dragstart="drag"
        :style="{ height: '28px', width: '164px' }"
        class="item px-2"
        v-on="on"
      >
        <span v-if="!item.onEdit">{{ item.text }}</span>
        <v-spacer v-if="!item.onEdit" />
        <v-icon
          v-if="!item.onEdit"
          @click.stop="remove(item.id)"
          color="error"
          class="px-1"
          x-small
        >
          isax-trash
        </v-icon>
        <v-icon
          v-if="!item.onEdit"
          @click.stop="
            () => {
              item.onEdit = true;
            }
          "
          color="default"
          class="px-1"
          x-small
        >
          isax-edit-2
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
  ref,
  Ref,
  reactive,
  watch,
} from "@nuxtjs/composition-api";
import { useUser } from "~/composables";

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
    const userManager = useUser(store);
    const selected: Ref<any> = ref(null);
    const newName = ref("");
    const watchList: any[] = reactive([]);
    const wls = userManager.watchList;

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
        watchList.find((item) => item.id == route.value.params.name) ?? watchList[0];
    }
    async function create() {
      if (!newName.value || newName.value == "") return;
      await userManager.update_settings({
        path: "/watch_lists/" + newName.value,
        value: [],
      });
      newName.value = "";
      refresh();
    }
    async function remove(name: string) {
      await userManager.update_settings({
        path: "/watch_lists/" + name,
        value: null,
      });
      if (name == route.value.params.name) router.push(watchList[0].to);
      refresh();
    }
    async function rename(item: any) {
      const tmp: any = {};
      Object.keys(wls.value).forEach((i) => {
        if (i == item.id) tmp[item.newName] = wls.value[item.id];
        else tmp[i] = wls.value[i];
      });
      await userManager.update_settings({
        path: "/watch_lists",
        value: tmp,
      });
      if (item.id == route.value.params.name) router.push("/watchList/" + item.newName);
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

<style lang="postcss" scoped>
.watchlist-select {
  background-color: var(--c-primary-rgb) !important;
  border-radius: var(--border-radius-root);
  &.v-select {
    &--is-menu-active {
      .arrow {
        transform: rotate(-180deg);
      }
    }
  }
  &__content {
    background-color: rgba(var(--c-primary), 0.1) !important;
  }
  .item {
    border-bottom-width: 1px;
    border-bottom-color: var(--v-default-lighten4);
    border-bottom-style: dashed;
    font-size: 0.6667rem;
  }
}
</style>
<style lang="postcss">
.watchlist-select {
  &__content {
    .v-input__slot {
      input {
        background-color: rgba(var(--c-primary), 0.1) !important;
        border-radius: var(--border-radius-root);
      }
      &::after,
      &::before {
        border: none !important;
      }
    }
  }
  &.v-text-field {
    & > .v-input__control {
      & > .v-input__slot {
        .v-select__selections {
          color: white !important;
          font-size: 0.75rem !important;
        }
        &::after,
        &::before {
          border: none !important;
        }
      }
    }
  }
}
</style>
