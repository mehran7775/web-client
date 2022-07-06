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

const notifs = reactive<Array<Notification>>([]);

async function getNotifs() {
    const res = await notifManager.getInstrumentNotifications(props.value)
    console.log(res)
    notifs.push(...res);
}

function hasnotif() {
    return notifs.findIndex((item) => true) > -1
}

function openMsg() {
    instrumentManager.select(props.value)
    console.log(props.value)
    panelManager.LeftPanelMini = false;
}

getNotifs();

</script>
<template>
    <div>
        <ada-icon v-if="notifs.length > 0" @click.stop="() => openMsg()" color="primary" :size="16">
            lotfi-sms
        </ada-icon>
    </div>
</template>