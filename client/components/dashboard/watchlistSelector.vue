<script setup lang="ts">
import { ref, Ref, reactive, watch, computed } from "#app";
import { useUser } from "~/composables";
import { useRoute, useRouter } from "#app";

const props = withDefaults(
  defineProps<{
    autoRoute: boolean;
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
      to: "/watchList/" + k,
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
function drag(ev: DragEvent) { }

watch(selected, select);
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
    &>.v-input__control {
      &>.v-input__slot {
        .v-select__selections {
          color: white !important;
          font-size: 1rem !important;
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


<template>
  <v-select height="28" :menu-props="{
    bottom: true,
    'offset-y': true,
    'content-class': 'watchlist-select__content',
  }" :placeholder="$t('watchList.title')" :items="watchList" class="watchlist-select" item-text="text" item-value="id"
    v-model="selected" flat no-filter hide-details return-object single-line dense>
    <template #append>
      <ada-icon class="ma-2 arrow" color="white" :size="12"> isax-arrow-down </ada-icon>
    </template>
    <template #append-item>
      <v-list-item style="width: 164px" class="px-2">
        <text-input v-model:value="newName" style="width: 164px;" class="tw-h-9" @keyup="create">
        </text-input>
        <ada-btn dark @click.stop="create" class="ms-1" color="primary" :height="28" :width="28">
          <ada-icon :size="16"> mdi-plus </ada-icon>
        </ada-btn>
      </v-list-item>
    </template>
    <template #item="{ item, on }">
      <v-list-item draggable="true" @dragstart="drag" :style="{ height: '28px', width: '164px' }" class="item px-2"
        v-on="on">
        <div class="tw-flex tw-flex-grow" v-if="!item.onEdit">
          <span>{{ item.text }}</span>
          <ada-spacer />
          <ada-btn key="delete" color="transparent" @click.stop="remove(item.id)" class="px-1">
            <ada-icon color="error" :size="14">
              isax-trash
            </ada-icon>
          </ada-btn>
          <ada-btn key="edit" color="transparent" class="tw-px-1" @click.stop="
            () => {
              item.onEdit = true;
            }
          ">
            <ada-icon color="gray" :size="14">
              isax-edit-2
            </ada-icon>
          </ada-btn>
        </div>
        <div class="tw-flex tw-flex-grow" v-else>
          <v-text-field style="width: 116px" class="ma-0 pa-0" height="28" v-model="item.newName" @click.stop=""
            @keyup.enter.stop="() => rename(item)" dense hide-details color="var(--c-blue-rgb)"/>
          <ada-btn key="save" dark @click.stop="() => rename(item)" class="ms-1" :height="28" :width="28">
            <ada-icon :size="16"> mdi-check </ada-icon>
          </ada-btn>
        </div>
      </v-list-item>
    </template>
  </v-select>
</template>

