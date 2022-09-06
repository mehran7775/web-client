<script setup lang="ts">
import { Ref } from "vue";
import { useUser } from "~/composables";

const props = withDefaults(
  defineProps<{
    autoRoute?: boolean;
  }>(),
  {
    autoRoute: false,
  }
);

const route = useRoute();
const router = useRouter();
const userManager = useUser();
const selected: Ref<any> = ref(null);
const newName = ref("");
const watchList: any[] = reactive([]);
const wls = computed(() => userManager.watchList);

function refresh() {
  watchList.splice(0, watchList.length);
  Object.keys(wls.value).forEach((k) => {
    watchList.push({
      onEdit: false,
      newName: k,
      text: k,
      id: k,
      to: "/watchList/" + decodeURIComponent(k),
    });
  });
  selected.value = watchList.find((item) => item.id == route.params.name) ?? watchList[0];
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
  await userManager.delete_settings({
    path: "/watch_lists/" + name,
  });
  if (name == route.params.name) router.push(watchList[0].to);
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
  if (item.id == route.params.name) router.push("/watchList/" + item.newName);
  refresh();
}

function select(val: any) {
  if (props.autoRoute) router.push(val.to);
}
refresh();
function drag(ev: DragEvent) {}

watch(selected, select);
</script>

<style lang="postcss" scoped>
#btn-trash .icon{
  @apply tw-text-error;
}
#btn-trash, #btn-edit {
  @apply tw-bg-transparent tw-mx-[2px];
}
</style>

<style lang="postcss">
.ada-select-watchlist {
  @apply tw-bg-primary tw-text-white tw-h-[28px];
}

.menu {
  .watchlist-selector-input {
    @apply tw-ml-[6px] tw-w-[158px];
  }
  .verify-btn {
    @apply tw-w-14 tw-text-white;
    .icon{
      @apply tw-text-white;
    }
  }
}
</style>

<template>
  <select-box
    :value="selected"
    :placeholder="$t('watchList.title')"
    textPath="$.newName"
    id="watchlist-selector"
    class="ada-select-watchlist"
  >
    <template #items>
      <ul class="tw-p-0 tw-m-0">
        <li
          v-for="item in watchList"
          :key="item.id"
          @click="select(item)"
          class="tw-p-2 hover:tw-bg-primary hover:tw-bg-opacity-10 tw-cursor-pointer"
        >
          <div class="tw-flex tw-flex-grow tw-justify-between" v-if="!item.onEdit">
            <span>{{ item.text }}</span>
           <div>
             <ada-btn key="delete" @click.stop="remove(item.id)" id="btn-trash">
              <ada-icon :size="14"> isax-trash </ada-icon>
            </ada-btn>
              <ada-btn
                id="btn-edit"
                key="edit"
                @click.stop="
                  () => {
                    item.onEdit = true;
                  }
                "
              >
                <ada-icon :size="14"> isax-edit-2 </ada-icon>
            </ada-btn>
           </div>
          </div>
          <div class="tw-flex tw-flex-grow" v-else>
            <ada-input
              v-model="item.newName"
              activeBorder
              class="watchlist-selector-input"
              @keyup.enter.stop="() => rename(item)"
              @click.stop=""
            >
            </ada-input>
            <ada-btn
              key="save"
              dark
              @click.stop="() => rename(item)"
              class="verify-btn"
            >
              <ada-icon :size="16"> mdi-check </ada-icon>
            </ada-btn>
          </div>
        </li>
      </ul>
    </template>
    <template #append-item>
      <ada-list class="tw-p-0 tw-m-0" @click.stop="">
        <ada-list-item
          class="tw-px-2 tw-flex tw-items-center tw-mt-2 tw-mb-1"
          :value="{ icon: '', title: '' }"
        >
          <ada-input
            class="tw-text-primary watchlist-selector-input"
            v-model="newName"
            @keyup.enter="create"
          >
          </ada-input>
          <ada-btn
            dark
            @click.stop="create"
            class="verify-btn tw-bg-primary"
          >
            <ada-icon :size="16"> mdi-plus </ada-icon>
          </ada-btn>
        </ada-list-item>
      </ada-list>
    </template>
  </select-box>
</template>
