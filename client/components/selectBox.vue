<script setup lang="ts">

export interface selectProps {
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  items?: any;
  textPath?: string;
  keyPath?: string;
  value?: any;
  id: string
}

const props = withDefaults(defineProps<selectProps>(), {
  placeholder: "",
  label: "",
  items: () => [],
  readonly: false,
  textPath: "$.name",
  keyPath: "$.id",
  value: null,
  id: '1'
});

const active = ref(false);
const selectedText = ref("");
const val = ref<string | null>(props.value);
const inp = ref<HTMLInputElement | null>(null);

////////////

watch(()=> props.value, (newVal)=>{
  select(newVal)
})

////////////

const getText: (item: any) => string = eval(
  "(item)=>{\
    return " + props.textPath.replace(/^\$/, "item") + ".toString();\
  }"
);

const getValue: (item: any) => any = eval(
  "(item)=>{\
    return " + props.keyPath.replace(/^\$/, "item") + ";\
  }"
);

function select(item: any) {
  val.value = item
  selectedText.value = getText(item)
  active.value = false;

}
props.value ? select(props.value) : null

</script>
<style lang="postcss" scoped>
.rtl {
  .ada-select {
    &.has-label {
      .input {
        margin: 0 4px 0 0;
      }
    }
  }
}

.ada-select {
  @apply tw-flex tw-min-w-0 tw-whitespace-nowrap tw-rounded tw-relative tw-w-full;
  position: relative;

  &.has-label {
    .label {
      @apply tw-flex tw-items-center;
      max-width: 65px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

  }

  li,
  i {
    color: var(--c-primary-rgb);
  }
  .input {
    @apply tw-relative tw-flex tw-min-w-0 tw-whitespace-nowrap tw-justify-between;
    @apply tw-rounded tw-cursor-pointer;
    input {
      @apply tw-bg-transparent tw-outline-none tw-rounded;
      line-height: 0.83334rem !important;
      cursor: inherit;
      &::placeholder {
        color: var(--c-primary-rgb);
      }
    }
    .menu-global {
      max-width: calc(100% - 24px);
    }
    .ada-button {
      @apply tw-bg-transparent tw-w-[24px] tw-h-full;
    }
    /* .i {
      @apply tw-w-[24px] tw-h-[24px] tw-bg-error tw-text-error ;
    } */
  }
  &.active {
    border-bottom-right-radius: 0!important;
    border-bottom-left-radius: 0!important;
    .input {
      border-bottom-right-radius: 0!important;
      border-bottom-left-radius: 0!important;
      i {
      display: inline-block;
      transform: rotate(-180deg);
    }
    }
  }

  
}
</style>

<template>
  <label :class="[
    'ada-select',
    active ? 'active' : 'inactive',
    val == null ? '' : 'value',
    label == '' ? '' : 'has-label',
  ]">

  <!-- set outslide click directive -->
    <div class="label">
      {{ label }}
    </div>
    <div class="input" @click="active = !active" v-ada-click-outside="()=> active = false">
      <slot name="prepend"></slot>
      <ada-menu :mLeft="-24" :mTop="27.5" :mWidth="24" :active="active">
        <template #activator>
          <input type="text" class="tw-min-w-0 tw-max-w-full tw-h-full tw-flex-grow tw-px-2 tw-inline-block"
            :value="selectedText" readonly ref="inp" :aria-readonly="readonly"
            :placeholder="placeholder" v-bind="$attrs" />
        </template>
        <template #prepend-item>
          <slot name="prepend-item"></slot>
        </template>
        <template #items>
          <slot name="items"></slot>
        </template>
        <template #append-item>
          <slot name="append-item"></slot>
        </template>
      </ada-menu>
      <slot name="append">
        <ada-btn @click.stop="active = !active">
          <i class="isax isax-arrow-down tw-text-sm tw-my-auto tw-mx-2"></i>
        </ada-btn>
      </slot>
    </div>
  </label>
</template>
