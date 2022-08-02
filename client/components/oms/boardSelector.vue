<script setup lang="ts">
import { computed, reactive, ref, useRoute, useRouter, toRaw } from "#app";
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
const items2 = ref<AutoCompleteItem[]>()
const home = computed(() => userManager.me.settings?.home);
const router = useRouter()
const route = useRoute()

const val = ref<any>(props.value)


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
  items2.value = resp.data.data
})



function findItem() {
  return items2.value?.find((item) => {
    return parseInt(item.id) == props.value
  })
  // return items.find(el => parseInt(el.id) == props.value )
}
// console.log('item', findItem())
function selectItem(item: AutoCompleteItem) {
  router.push(`/watchlist/boards/${ item.id }`)
}
</script>

<template>
  <select-box :value="findItem()" v-bind="$attrs" class="board-search" height="28px"
    :placeholder="$t('menu.boards')" id="border-selector">
    <template #items>
      <ul class="tw-p-0 tw-m-0">
        <li v-for="item in items" :key="item.name" @click="selectItem(item)"
          class="tw-flex tw-items-center tw-justify-between tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100">
          <span v-text="item.name"></span>
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
        </li>
      </ul>
    </template>
  </select-box>


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
