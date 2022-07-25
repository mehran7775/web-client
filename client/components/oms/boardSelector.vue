<script setup lang="ts">
import { computed, reactive } from "#app";
import { AutoCompleteItem, Bookmark } from "@/types";
import { getBoards } from "@/repositories/oms/board_manager";
import { useAxios, useUser } from "~/composables";

const props = defineProps<{
  value: number;
}>();
const emit = defineEmits(["input"]);

const userManager = useUser();
const axios = useAxios().createInstance();
const bookmarks = computed(() => userManager.getBookmarks);
const items: Array<AutoCompleteItem> = reactive([]);
const home = computed(() => userManager.me.settings?.home);
function generateAddress(id: string): string {
  return "/watchlist/boards/" + id;
}

const isMarked = computed(() => (data: AutoCompleteItem) => {
  return bookmarks.value.findIndex((val) => val.to == generateAddress(data.id)) > -1;
});
function setHome(item: AutoCompleteItem) {
  userManager.update_settings({
    path: "/home",
    value: generateAddress(item.id),
  });
}
function mark(item: AutoCompleteItem) {
  const bk: Bookmark = {
    to: generateAddress(item.id),
    title: item.name,
    text: item.name,
    icon: "mdi-bulletin-board",
  };
  const tmp = [...bookmarks.value, bk];
  userManager.update_settings({
    path: "/bookmarks",
    value: tmp,
  });
}
function unmark(item: AutoCompleteItem) {
  const to = generateAddress(item.id);
  let tmp = [...bookmarks.value];
  tmp.splice(
    tmp.findIndex((item) => item.to == to),
    1
  );
  userManager.update_settings({
    path: "/bookmarks",
    value: tmp,
  });
}

getBoards(axios).then((resp) => {
  items.push(...resp.data.data);
  if (props.value != -1) {
    emit(
      "input",
      items.find((item) => item.id == props.value?.toString())
    );
  }
});
</script>

<template>
  <v-select :items="items" item-value="id" item-text="name" :value="value" v-bind="$attrs" class="board-search"
    :menu-props="{
      bottom: true,
      'offset-y': true,
    }" height="28" :placeholder="$t('menu.boards')" @input="
  (val) => {
    $emit('input', val);
  }
" flat no-filter rounded hide-details return-object dense>
    <template #append>
      <ada-icon class="tw-m-2 arrow" :size="12"> isax-arrow-down </ada-icon>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item v-on="on" v-bind="attrs">
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
        <div class="tw-flex tw-flex-row tw-justify-end tw-my-0">
          <ada-icon @click.stop.prevent="
            (ev) => {
              if (isMarked(item)) unmark(item);
              else mark(item);
            }
          " :color="isMarked(item) ? 'secondary' : 'default'" :size="12">
            isax-frame-4
          </ada-icon>
          <ada-icon @click.stop.prevent="
            (ev) => {
              setHome(item);
            }
          " :color="generateAddress(item.id) == home ? 'info' : 'default'" x-small>
            isax-star-1-bold
          </ada-icon>
        </div>
      </v-list-item>
    </template>
  </v-select>
</template>

<style lang="postcss" scoped>
.board-search {
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
  font-size: 0.75rem;
  max-width: 164px;

  &.v-select {
    &--is-menu-active {
      .arrow {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
<style lang="postcss">
.board-search {
  &.v-select {
    * {
      color: var(--c-primary-rgb) !important;
    }
  }

  input {
    color: var(--c-primary-rgb) !important;

    &::placeholder {
      color: var(--c-primary-rgb) !important;
    }
  }
}
</style>
