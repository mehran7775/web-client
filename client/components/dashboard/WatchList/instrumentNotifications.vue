<script setup lang="ts">
import { ref, reactive, computed } from "#app"
import { InstrumentCache, Notification } from "@/types"
import { useNotifications, useBottomPanel, useInstrument } from "@/composables";
import AdaIcon from "~~/components/adaIcon.vue";

const props = defineProps<{
    value: InstrumentCache
}>();

const notifManager = useNotifications();
const panelManager = useBottomPanel();
const instrumentManager = useInstrument();
const notifs = computed(() => notifManager.state.cache[props.value.instrumentCode])

function openMsg() {
    instrumentManager.select(props.value)
    panelManager.LeftPanelMini = false;
}

console.log(notifs.value)

</script>
<template>
    <div>
        <ada-icon v-if="notifs && notifs.length > 0" @click.stop="() => openMsg()" color="primary" :size="16">
            lotfi-sms
        </ada-icon>
    </div>
</template>