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
    notifs.push(...res);
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
        <ada-icon v-for="notif in notifs" :key="notif.type" @click.stop="() => openMsg()" color="success">
            mdi-email-fast-outline
        </ada-icon>
    </div>
</template>