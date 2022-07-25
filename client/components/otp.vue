<script lang="ts">
import { defineComponent, ref, Ref, computed } from "#app";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  emits: ["request"],
  props: ["value", "timer", "height"],
  inheritAttrs: false,
  setup(props, ctx) {
    const appManager = useAsrTrader();
    const otpref: Ref<any> = ref(null);

    const counter = ref(0);
    let timer: NodeJS.Timeout | null = null;

    const formatter = appManager.formatter;
    const otp = computed({
      get() {
        return props.value;
      },
      set(val) {
        ctx.emit("input", val);
      },
    });
    function setTimer() {
      counter.value = props.timer;
      timer = setInterval(() => {
        if (counter.value > 1) counter.value = counter.value - 1;
        else {
          if (timer) clearInterval(timer);
          counter.value = 0;
        }
      }, 1000);
    }
    function focus() {
      otpref.value.focus();
    }
    return { otp, otpref, formatter, counter, setTimer, focus };
  },
});
</script>

<style lang="postcss">
.otp {
  &.v-text-field {
    .v-input {
      &__append-inner {
        margin-top: 0 !important;
      }

      &__slot {
        padding: 4px 12px 4px 4px !important;
      }
    }
  }
}
</style>

<style lang="postcss" scoped>
.sms {
  color: var(--c-primary-rgb);
  background-color: rgba(0, 0, 0, 0.12) !important;

  &--disabled {
    color: var(--c-primary-rgb) !important;

    i.icon {
      color: var(--c-primary-rgb) !important;
    }
  }
}
</style>

<template>
  <div>
    <input-text ref="otpref" class="otp" v-bind="$attrs" v-on="$listeners">
      <template #append>
        <ada-btn class="sms" :width="100" :disabled="counter > 0" @click="() => $emit('request')" :height="height - 8">
          <span v-if="counter == 0">
            {{ $t("login.send-sms") }}
          </span>
          <span v-else>
            <ada-icon :size="17"> mdi-clock </ada-icon>
            {{ formatter.format(Math.floor(counter / 60)) }}:{{
                formatter.format(counter % 60)
            }}
          </span>
        </ada-btn>
      </template>
    </input-text>
    <div v-if="otpref && !otpref.valid" class="error--text" style="font-size: 10px">
      <div v-for="item in otpref.validations" :key="item" class="pt-2">
        <ada-icon color="error" :size="17"> mdi-alert-circle-outline</ada-icon>
        <span style="display: inline-block">
          {{ $t(item) }}
        </span>
      </div>
    </div>
  </div>
</template>
