<script lang="ts" setup>
import { TradesHistorySerachModel, TabItem } from "@/types"

const props = defineProps<{
    modelValue: TabItem,
    tabs: Array<TabItem>
}>();
const queries:{ [ key: string ]: any } = useRoute().query
</script>
    <template>
    <ada-tabs v-model="props.modelValue" class="tw-h-full tw-w-full">
        <ada-tab v-for="t in props.tabs" :key="t.title" :model="t" class="tw-overflow-y-auto">
            <component v-if="t.component" :is="t.component" v-model="queries"></component>
        </ada-tab>
    </ada-tabs>
</template>