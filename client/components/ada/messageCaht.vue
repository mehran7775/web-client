<script lang="ts" setup>
import { useChat } from '~/composables'
import { MessageChatType } from "~/types/message";

////////////

const props = defineProps<{
  msg: MessageChatType;
}>();

///////////

const chat = useChat()
const activeOptionMessage = ref<boolean>(false);
const optionMessage = ref<boolean>(false);


</script>

<style lang="postcss" scoped>
p {
  @apply tw-block tw-relative tw-rounded-xl tw-pb-3 tw-pt-4 tw-px-3 tw-my-2;
  @apply tw-whitespace-normal tw-break-all tw-w-fit tw-bg-primary tw-bg-opacity-10 tw-text-primary;
  max-width: 75%;
  line-height: 1.8;

  .ada-button {
    @apply tw-bg-transparent tw-absolute tw-top-0 tw-left-0 tw-w-fit tw-h-fit;

    .ada-menu {
      & :deep(.ada-list-item) {
        @apply tw-cursor-pointer;
      }
    }

    .icon {
      @apply tw-text-primary tw-text-opacity-60;
    }
  }
  small {
    @apply tw-block tw-mt-1 tw-mr-[3px] tw-text-primary tw-text-opacity-70;
    .icon {
        @apply tw-text-primary tw-text-opacity-60;
      }
  }
  &.supporter {
    @apply tw-bg-success tw-bg-opacity-10 tw-text-success;
    > small {
      @apply tw-text-success tw-text-opacity-70;

      .icon {
        @apply tw-text-success tw-text-opacity-60;
      }
    }
  }
}
</style>
<style lang="postcss">
.menu {
  .ada-list.option-chat {
    .ada-list-item {
      @apply tw-cursor-pointer tw-transition hover:tw-bg-primary hover:tw-bg-opacity-10;
      @apply tw-pr-2;
      .ada-button {
         @apply tw-bg-transparent tw-font-medium;
      }
    }
  }
}
</style>

<template>
  <p
    @mouseover="activeOptionMessage = true"
    @mouseleave="activeOptionMessage = false"
    :class="{ supporter: !msg.self }"
  >
    <ada-btn
      v-show="activeOptionMessage">
      <ada-menu :active="optionMessage" :mWidth="55" :mLeft="-80" :mTop="-3">
        <template #activator>
          <ada-icon size="1.8rem"  @click.stop="optionMessage = !optionMessage">mdi-menu-down</ada-icon>
        </template>
        <template #items>
          <ada-list
            v-ada-click-outside="() => (optionMessage = false)"
            class="option-chat"
          >
            <ada-list-item>
              <ada-btn>
                <span v-text="$t('general.edit')"></span>
              </ada-btn>
            </ada-list-item>
            <!-- <ada-list-item @click.stop="chat.remove(msg)">
              <ada-btn>
                <span v-text="$t('general.delete')"></span>
              </ada-btn>
            </ada-list-item> -->
          </ada-list>
        </template>
      </ada-menu>
    </ada-btn>

    {{ msg.body }}
    <small>
      <ada-icon>mdi-check</ada-icon>
      <!-- <ada-icon>mdi-clock-outline</ada-icon> -->
      {{ msg.time }}
    </small>
  </p>
</template>
