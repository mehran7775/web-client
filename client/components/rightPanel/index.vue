<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="r-panel ps-0"
    width="152"
    mobile-breakpoint="960"
    fixed
    app
  >
    <v-tabs class="ma-0 pa-0" v-model="selected" vertical hide-slider center-active>
      <div class="tabs pt-1">
        <v-tab
          v-for="item in items"
          :key="item.title"
          @click="
            () => {
              $emit('update:mini', !mini);
            }
          "
        >
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn width="32" height="32" color="transparent" depressed>
                <v-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
                  {{ item.icon }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ item.text ? item.text : $t(item.title) }}</span>
          </v-tooltip>
        </v-tab>
        <v-divider />
        <v-tab
          v-for="item in shourtcuts"
          :key="item.title"
          :to="item.to"
          @click="
            () => {
              $emit('update:mini', true);
            }
          "
        >
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn width="32" height="32" color="transparent" depressed>
                <v-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
                  {{ item.icon }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ item.text ? item.text : $t(item.title) }}</span>
          </v-tooltip>
        </v-tab>
      </div>
    </v-tabs>

    <v-tabs-items v-model="selected">
      <v-tab-item v-for="item in items" :key="item.title">
        <div class="details">
          <h4 class="text-center mt-1">
            {{ $t(item.title) }}
          </h4>
          <v-list dense>
            <v-list-item-group>
              <div v-for="child in item.children ? item.children : []" :key="child.title">
                <v-list-group
                  class="item mx-1 group"
                  v-if="child.children"
                  append-icon.size="12"
                >
                  <template #appendIcon>
                    <v-icon x-small> isax-arrow-down </v-icon>
                  </template>
                  <v-list-item-title slot="activator">
                    {{ child.text ? child.text : $t(child.title) }}
                  </v-list-item-title>
                  <v-tooltip
                    v-for="sub in child.children
                      ? child.children.value
                        ? child.children.value
                        : child.children
                      : []"
                    :key="sub.title"
                    left
                  >
                    <template #activator="{ on, attrs }">
                      <div v-on="on" v-bind="attrs" class="sub-item ps-4">
                        <div class="path ms-n2"></div>
                        <v-list-item :to="sub.to ? sub.to : '#'">
                          <v-list-item-title>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {{ sub.text ? sub.text : $t(sub.title) }}
                          </v-list-item-title>
                          <div class="d-flex flex-row my-0">
                            <v-btn
                              @click.prevent="
                                (ev) => {
                                  if (isMarked(sub)) unmark(sub);
                                  else mark(sub);
                                }
                              "
                              v-if="sub.bookmarkPosition"
                              icon
                              x-small
                            >
                              <v-icon
                                :color="isMarked(sub) ? 'secondary' : 'default'"
                                x-small
                              >
                                mdi-star
                              </v-icon>
                            </v-btn>
                            <v-btn
                              @click.prevent="
                                (ev) => {
                                  setHome(sub);
                                }
                              "
                              v-if="sub.bookmarkPosition"
                              icon
                              x-small
                            >
                              <v-icon
                                :color="sub.to == home ? 'info' : 'default'"
                                x-small
                              >
                                mdi-home
                              </v-icon>
                            </v-btn>
                          </div>
                        </v-list-item>
                      </div>
                    </template>
                    {{ sub.text ? sub.text : $t(sub.title) }}
                  </v-tooltip>
                </v-list-group>
                <v-tooltip v-else left>
                  <template #activator="{ on, attrs }">
                    <v-list-item
                      v-on="on"
                      v-bind="attrs"
                      class="item mx-1"
                      :to="child.to ? child.to : '#'"
                    >
                      <v-list-item-title>
                        {{ child.text ? child.text : $t(child.title) }}
                      </v-list-item-title>
                      <div v-if="child.to && child.to != ''" class="d-flex flex-row my-0">
                        <v-btn
                          @click.prevent="
                            (ev) => {
                              if (isMarked(child)) unmark(child);
                              else mark(child);
                            }
                          "
                          v-if="child.bookmarkPosition"
                          icon
                          x-small
                        >
                          <v-icon
                            :color="isMarked(child) ? 'secondary' : 'default'"
                            x-small
                          >
                            mdi-star
                          </v-icon>
                        </v-btn>
                        <v-btn
                          @click.prevent="
                            (ev) => {
                              setHome(child);
                            }
                          "
                          v-if="child.bookmarkPosition"
                          icon
                          x-small
                        >
                          <v-icon :color="child.to == home ? 'info' : 'default'" x-small>
                            mdi-home
                          </v-icon>
                        </v-btn>
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

<script lang="ts">
import { defineComponent, ref, Ref, computed, watch, ComputedRef } from "#app";
import { useShortcut } from "@/utils/shortcutManager";
import { BookmarkPosition, CreateBookmark, MenuItem } from "~/types";
import { useAsrTrader, useUser } from "~/composables";
import { getMenuItems } from "./items";
import { useNuxtApp, useRouter } from "#app";

export default defineComponent({
  name: "right-panel",
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const userManager = useUser();
    const appManager = useAsrTrader();
    const router = useRouter();
    const sh = useShortcut();
    const selected = computed(() => appManager.menu);
    const rtl = appManager.rtl;
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
      return res;
    });
    const items = getMenuItems(watchList);
    const home = computed(() => userManager.me.settings.home);

    const expand: Ref<boolean> = ref(true);
    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
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
      if (bk.to.indexOf("?") > -1) {
        bk.to = bk.to + "&s=maked";
      } else {
        bk.to = bk.to + "?s=maked";
      }
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
        context.emit("update:mini", false);
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
    return {
      mark,
      unmark,
      setHome,
      home,
      isMarked,
      bookmarks,
      rtl,
      drawer,
      expand,
      selected,
      items,
      shourtcuts,
    };
  },
});
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
    &--vertical {
      > .v-tabs-bar {
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
