<script setup lang="ts">
import { ref, reactive, computed } from "#app"
import { InstrumentCache, Notification } from "@/types"
import { useNotifications } from "@/composables";
import AdaIcon from "~~/components/adaIcon.vue";

const props = defineProps<{
    value: InstrumentCache
}>();

const notifManager = useNotifications();
const notifs = reactive<Array<Notification>>([]);

async function getNotifs() {
    const res = await notifManager.getInstrumentNotifications(props.value)
    notifs.push(...res);
}

getNotifs();

</script>
<template>
    <div>
        <ada-icon v-for="notif in notifs" :key="notif.type" color="success">
            mdi-message
        </ada-icon>
    </div>
</template>