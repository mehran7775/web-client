<script setup lang="ts">
import { BookmarkPosition, MenuItem, CreateBookmark } from '@/types';
import { computed, ref } from "#app";
import { useUser } from "~/composables";
const shourtcuts = computed(() => userManager.getShourtcuts);



const props = withDefaults(defineProps<{
    tag: 'li' | 'dd';
    value: MenuItem
}>(), {
    tag: 'li',
});
const bookmarks = computed(() => userManager.getBookmarks);
const userManager = useUser();
const isMarked = computed(() => (data: MenuItem) => {
    switch (data.bookmarkPosition) {
        case BookmarkPosition.ToolBar:
            return bookmarks.value.findIndex((val) => val.title == data.title) > -1;
        case BookmarkPosition.RightPanel:
            return shourtcuts.value.findIndex((val) => val.title == data.title) > -1;
    }
});
const home = computed(() => userManager.me.settings.home);

function toggleGroup() {
    open.value = !open.value
}
const open = ref(false)

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


</script>
<style lang="postcss" scoped>
.ada-list-item {
    @apply tw-flex tw-flex-grow tw-justify-between;
    @apply tw-transition-all tw-ease-in-out tw-duration-700;
    min-height: var(--row-height);
    max-height: var(--row-height);

    &--active {
        >.ada-title {
            color: var(--c-primary-rgb);

            &::after {
                @apply tw-absolute tw-inset-0 tw-w-full tw-h-full;
                content: '';
                background-color: rgba(var(--c-primary), 0.1);
            }
        }
    }

    >.ada-title {
        @apply tw-flex tw-flex-grow tw-items-center;
        @apply tw-px-[9px];
        position: relative;
        color: black;
        min-height: var(--row-height);
        border-radius: var(--border-radius-root);

        &::after {
            border-radius: var(--border-radius-root);
        }

    }

    &.group {
        @apply tw-flex-col tw-justify-start;
        overflow: hidden;
        cursor: pointer;

        >.ada-title {
            @apply tw-flex tw-w-full tw-justify-between;

            .icon {
                @apply tw-transition-all tw-ease-in-out tw-duration-300;
            }

            background-color: rgba(var(--c-primary), 0.1);
        }
    }

    &-open {
        &.group {
            max-height: 100%;

            .icon {
                @apply tw-rotate-180;
            }

            .ada-list-item::before {
                @apply tw-absolute tw-h-[34px] tw-w-[8px];
                content: '';
                border-right: solid 1px rgba(0, 0, 0, 0.1);
                border-bottom: solid 1px rgba(0, 0, 0, 0.1);
                margin-top: -16px;
                margin-inline-start: 8px;
                border-radius: 0 0 6px 0;
            }

        }
    }

    .ada-list {
        @apply tw-mx-5;
    }
}
</style>
//TODO multiple root element in vue 3
<template>
    <component :is="tag" class="ada-list-item" :class="[
        open ? 'ada-list-item-open' : 'ada-list-item-close',
        value.children ? 'group' : ''
    ]">
        <slot>
            <component @click="() => value.children ? toggleGroup() : null" :is="value.to ? 'router-link' : 'span'"
                :to="value.to" v-ada-ripple class="ada-title">
                <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
                    <div>{{ value.text ? value.text : $t(value.title) }}{{ value.expand }}</div>
                    <div v-if="value.children" class="tw-flex tw-items-center">
                        <ada-icon v-if="value.bookmarkPosition" size="1.5rem"
                            :color="isMarked(value) ? 'gray' : 'blue'">mdi-bookmark-outline
                        </ada-icon>
                        <ada-icon @click.prevent="
                            () => {
                                setHome(value);
                            }
                        " size="1.5rem" :color="value.to == home ? ' blue' : 'gray'">mdi-star-outline</ada-icon>

                    </div>
                    <div v-else class="tw-flex tw-items-center">
                        <template v-if="value.to && value.to != ''">
                            <ada-icon v-if="value.bookmarkPosition" size="1.5rem"
                                :color="isMarked(value) ? 'blue' : 'gray'" @click="() => {
                                    if (isMarked(value)) unmark(value);
                                    else mark(value);
                                
                                }">mdi-bookmark-outline
                            </ada-icon>
                            <ada-icon @click.prevent="
                                () => {
                                    setHome(value);
                                }
                            " size="1.5rem" :color="value.to == home ? ' blue' : 'gray'">mdi-star-outline</ada-icon>

                        </template>
                    </div>
                </div>
                <ada-icon v-if="value.children">
                    isax-arrow-down
                </ada-icon>
            </component>
        </slot>
        <ada-list v-if="value.children">
            <ada-list-item v-for="child in value.children.value" :key="child.title" :value="child">
            </ada-list-item>
        </ada-list>
    </component>
</template>