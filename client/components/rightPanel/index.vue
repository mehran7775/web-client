<script setup lang="ts">
import { defineComponent, ref, Ref, computed, watch, ComputedRef } from "#app";
import { useShortcut } from "@/utils/shortcutManager";
import { BookmarkPosition, CreateBookmark, MenuItem } from "~/types";
import { useAsrTrader, useUser } from "~/composables";
import { getMenuItems } from "./items";
import { useRouter } from "#app";

const props = defineProps<{
  value: boolean;
  mini: boolean;
  clipped: boolean;
}>();

const emit = defineEmits(["input", "update:mini"]);

const userManager = useUser();
const appManager = useAsrTrader();
const router = useRouter();
const sh = useShortcut();
const selected = computed({
  get() {
    return appManager.menu;
  },
  set(val: string | number | null) {
    appManager.setMenu(val);
  },
});
const rtl = computed(() => appManager.rtl);
const bookmarks = computed(() => userManager.getBookmarks);
const shourtcuts = computed(() => userManager.getShourtcuts);
const isMarked = computed(() => (data: MenuItem) => {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      return bookmarks.value.findIndex((val) => val.title == data.title) > -1;
    case BookmarkPosition.RightPanel:
      return shourtcuts.value.findIndex((val) => val.title == data.title) > -1;
  }
});
const watchList: ComputedRef<Array<MenuItem>> = computed(() => {
  const lists = computed(() => userManager.watchList);
  const res = [];
  for (let k in lists.value) {
    res.push({
      icon: "isax-eye",
      title: k,
      text: k,
      to: "/watchList/" + k,
      bookmarkPosition: BookmarkPosition.ToolBar,
    });
  }
  if (res.length == 0) {
    res.push({
      icon: "isax-eye",
      title: "new",
      text: "new",
      to: "/watchList/new",
      bookmarkPosition: BookmarkPosition.ToolBar,
    })
  }
  return res;
});
const items = getMenuItems(watchList);
const home = computed(() => userManager.me.settings.home);

const drawer = computed({
  get() {
    return props.value;
  },
  set(value: boolean) {
    emit("input", value);
  },
});
function setHome(item: MenuItem) {
  if (item.to)
    userManager.update_settings({
      path: "/home",
      value: item.to,
    });
}
function mark(data: MenuItem) {
  const bk = CreateBookmark(data);
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      {
        const tmp = [...bookmarks.value, bk];
        userManager.update_settings({
          path: "/bookmarks",
          value: tmp,
        });
      }
      break;
    case BookmarkPosition.RightPanel:
      {
        const tmp = [...shourtcuts.value, bk];
        userManager.update_settings({
          path: "/shourtcuts",
          value: tmp,
        });
      }
      break;
  }
}
function unmark(data: MenuItem) {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      {
        let tmp = [...bookmarks.value];
        tmp.splice(
          tmp.findIndex((item) => item.to == data.to),
          1
        );
        userManager.update_settings({
          path: "/bookmarks",
          value: tmp,
        });
      }
      break;
    case BookmarkPosition.RightPanel:
      {
        let tmp = [...shourtcuts.value];
        tmp.splice(
          tmp.findIndex((item) => item.to == data.to),
          1
        );
        userManager.update_settings({
          path: "/shourtcuts",
          value: tmp,
        });
      }
      break;
  }
}
watch(selected, (n, o) => {
  if (typeof n == "string" || typeof n != null) {
    emit("update:mini", false);
  }
});
if (process.client) {
  for (let i = 1; i < 10; i++) {
    sh.addShortcut({
      key: "alt+Digit" + i.toString(),
      action: () => {
        if (i <= watchList.value.length) {
          router.push(watchList.value[i - 1].to ?? "#");
        }
      },
    });
  }
}
</script>

<style lang="postcss" scoped>
.sub-item:first-child {
  .path {
    height: 28px;
    top: -12px;
  }
}

.sub-item {
  position: relative;

  .path {
    content: "";
    top: -20px;
    height: 37px;
    width: 12px;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0 0 var(--border-radius-root) 0;
    position: absolute;
  }
}

.tabs {
  background-color: rgba(var(--c-primary), 0.05);
  overflow-y: auto;
  height: 100vh;
  padding-bottom: 54px;
  width: 48px;
}

.tab-items {
  background-color: rgba(var(--c-primary), 0.01);
}

.details {
  overflow-y: auto;
}
</style>

<style lang="postcss">
.r-panel {
  .tabs {
    &::-webkit-scrollbar {
      display: block;
    }
  }

  &.v-navigation-drawer--mini-variant {
    width: 48px !important;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: row;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .v-tabs-items {
    height: 100%;
    width: calc(100% - 42px);
    display: block;

    .v-list-item {
      border-radius: var(--border-radius-root);
    }

    .v-item--active {
      color: var(--c-primary-rgb);

      &::before {
        border-radius: var(--border-radius-root);
      }
    }
  }

  .v-tabs {
    width: 48px;
    vertical-align: top;
    box-shadow: -4px 0 4px rgba(0, 0, 0, 0.05);

    &--vertical {
      >.v-tabs-bar {
        .v-tabs-bar__content {
          display: block;
        }

        .v-tab {
          padding: 0;
          display: block;
          vertical-align: middle;
          justify-content: center !important;
          min-width: 48px;
          height: 32px !important;

          &--active {
            &::before {
              background-color: rgba(0, 0, 0, 0) !important;
            }

            .v-btn {
              color: var(--c-primary-rgb);
              background-color: rgba(var(--c-primary), 0.1) !important;
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <v-navigation-drawer v-model="drawer" :mini-variant="mini" :clipped="clipped" :right="rtl" class="r-panel ps-0"
    width="256" mobile-breakpoint="960" fixed app>
    <v-tabs class="ma-0 pa-0" v-model="selected" vertical hide-slider center-active>
      <div class="tabs pt-1">
        <v-tab v-for="item in items" :key="item.title" @click="
          () => {
            $emit('update:mini', !mini);
          }
        ">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <ada-btn :width="32" :height="32" color="transparent">
                <ada-icon :size="18" :color="item.color" v-bind="attrs" v-on="on">
                  {{ item.icon }}
                </ada-icon>
              </ada-btn>
            </template>
            <span>{{ item.text ? item.text : $t(item.title) }}</span>
          </v-tooltip>
        </v-tab>
        <v-divider />
        <v-tab v-for="item in shourtcuts" :key="item.title" :to="item.to" @click="
          () => {
            $emit('update:mini', true);
          }
        ">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <ada-btn :width="32" :height="32" color="transparent">
                <ada-icon :size="18" :color="item.color" v-bind="attrs" v-on="on">
                  {{ item.icon }}
                </ada-icon>
              </ada-btn>
            </template>
            <span>{{ item.text ? item.text : $t(item.title) }}</span>
          </v-tooltip>
        </v-tab>
      </div>
    </v-tabs>

    <v-tabs-items class="tab-items" v-model="selected">
      <v-tab-item v-for="item in items" :key="item.title">
        <div class="details">
          <h4 class="text-center mt-1">
            {{ $t(item.title) }}
          </h4>
          <v-list dense>
            <v-list-item-group>
              <div v-for="child in item.children ? item.children : []" :key="child.title">
                <v-list-group class="item mx-1 group" v-if="child.children" append-icon.size="12">
                  <template #appendIcon>
                    <ada-icon :size="12"> isax-arrow-down </ada-icon>
                  </template>
                  <v-list-item-title slot="activator" class="tw-text-">
                    {{ child.text ? child.text : $t(child.title) }}
                  </v-list-item-title>
                  <v-tooltip v-for="sub in child.children
                  ? child.children.value
                    ? child.children.value
                    : child.children
                  : []" :key="sub.title" left>
                    <template #activator="{ on, attrs }">
                      <div v-on="on" v-bind="attrs" class="sub-item ps-4">
                        <div class="path ms-n2"></div>
                        <v-list-item :to="sub.to ? sub.to : '#'">
                          <v-list-item-title class="tw-text-xs">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {{ sub.text ? sub.text : $t(sub.title) }}
                          </v-list-item-title>
                          <div class="d-flex flex-row my-0">
                            <ada-btn width="14px" height="16px" color="transparent" :ripple="false" @click="
                            (ev) => {
                              if (isMarked(sub)) unmark(sub);
                              else mark(sub);
                            }
                            " v-if="sub.bookmarkPosition">
                                <svg width="14px" height="14px" viewBox="0 0 10 11" xmlns="http://www.w3.org/2000/svg" class="tw-mt-1">
                                <path d="M7.41016 0H2.59016C1.52516 0 0.660156 0.87 0.660156 1.93V8.975C0.660156 9.875 1.30516 10.255 2.09516 9.82L4.53516 8.465C4.79516 8.32 5.21516 8.32 5.47016 8.465L7.91016 9.82C8.70016 10.26 9.34516 9.88 9.34516 8.975V1.93C9.34016 0.87 8.47516 0 7.41016 0Z" :fill="isMarked(sub) ? '#3554D1' : '#E5E9FA'"/>
                                </svg>
                            </ada-btn>
                             <ada-btn width="14px" height="16px" color="transparent" :ripple="false" @click.prevent="
                              (ev) => {
                                setHome(sub);
                              }
                            " v-if="sub.bookmarkPosition">
                                <svg width="14px" height="14px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.00887 1.04754L8.03554 3.10087C8.17554 3.38671 8.54887 3.66087 8.86387 3.71337L10.7247 4.02254C11.9147 4.22087 12.1947 5.0842 11.3372 5.93587L9.89054 7.38254C9.64554 7.62754 9.51137 8.10004 9.5872 8.43837L10.0014 10.2292C10.328 11.6467 9.57554 12.195 8.32137 11.4542L6.5772 10.4217C6.2622 10.235 5.74304 10.235 5.4222 10.4217L3.67804 11.4542C2.4297 12.195 1.67137 11.6409 1.99804 10.2292L2.4122 8.43837C2.48804 8.10004 2.35387 7.62754 2.10887 7.38254L0.662203 5.93587C-0.189464 5.0842 0.0847029 4.22087 1.2747 4.02254L3.13554 3.71337C3.4447 3.66087 3.81804 3.38671 3.95804 3.10087L4.9847 1.04754C5.5447 -0.0666275 6.4547 -0.0666275 7.00887 1.04754Z" :fill="sub.to == home ? '#3554D1' : '#E5E9FA'"/>
                                </svg>
                             </ada-btn>
                          </div>
                        </v-list-item>
                      </div>
                    </template>
                    {{ sub.text ? sub.text : $t(sub.title) }}
                  </v-tooltip>
                </v-list-group>
                <v-tooltip v-else left>
                  <template #activator="{ on, attrs }">
                    <v-list-item v-on="on" v-bind="attrs" class="item mx-1" :to="child.to ? child.to : '#'">
                      <v-list-item-title>
                        {{ child.text ? child.text : $t(child.title) }}
                      </v-list-item-title>
                      <div v-if="child.to && child.to != ''" class="d-flex flex-row my-0">
                      <ada-btn width="14px" height="16px" color="transparent" :ripple="false" @click="
                          (ev) => {
                            if (isMarked(child)) unmark(child);
                            else mark(child);
                          }
                        " v-if="child.bookmarkPosition" icon x-small>
                          <svg width="14px" height="14px" viewBox="0 0 10 11" xmlns="http://www.w3.org/2000/svg" class="tw-mt-1">
                          <path d="M7.41016 0H2.59016C1.52516 0 0.660156 0.87 0.660156 1.93V8.975C0.660156 9.875 1.30516 10.255 2.09516 9.82L4.53516 8.465C4.79516 8.32 5.21516 8.32 5.47016 8.465L7.91016 9.82C8.70016 10.26 9.34516 9.88 9.34516 8.975V1.93C9.34016 0.87 8.47516 0 7.41016 0Z" :fill="isMarked(child) ? '#3554D1' : '#E5E9FA'"/>
                          </svg>
                        </ada-btn>
                        <ada-btn width="14px" height="16px" color="transparent" :ripple="false"  @click=" 
                          (ev) => {
                            setHome(child);
                          }
                        " v-if="child.bookmarkPosition" icon x-small>
                          <svg width="14px" height="14px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.00887 1.04754L8.03554 3.10087C8.17554 3.38671 8.54887 3.66087 8.86387 3.71337L10.7247 4.02254C11.9147 4.22087 12.1947 5.0842 11.3372 5.93587L9.89054 7.38254C9.64554 7.62754 9.51137 8.10004 9.5872 8.43837L10.0014 10.2292C10.328 11.6467 9.57554 12.195 8.32137 11.4542L6.5772 10.4217C6.2622 10.235 5.74304 10.235 5.4222 10.4217L3.67804 11.4542C2.4297 12.195 1.67137 11.6409 1.99804 10.2292L2.4122 8.43837C2.48804 8.10004 2.35387 7.62754 2.10887 7.38254L0.662203 5.93587C-0.189464 5.0842 0.0847029 4.22087 1.2747 4.02254L3.13554 3.71337C3.4447 3.66087 3.81804 3.38671 3.95804 3.10087L4.9847 1.04754C5.5447 -0.0666275 6.4547 -0.0666275 7.00887 1.04754Z" :fill="child.to == home ? '#3554D1' : '#E5E9FA'"/>
                          </svg>
                        </ada-btn>
                      </div>
                    </v-list-item>
                  </template>
                  {{ child.text ? child.text : $t(child.title) }}
                </v-tooltip>
              </div>
            </v-list-item-group>
          </v-list>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>
