<script lang="ts" setup>
import { OrderSearchModel, TabItem } from "@/types"
import loader from "../loader.vue";

const props = defineProps<{
    modelValue: TabItem,
    tabs: Array<TabItem>
}>();
</script>
  <template>
  <ada-tabs v-model="props.modelValue" class="tw-h-full tw-w-full">
    <ada-tab v-for="t in props.tabs" :key="t.title" :model="t" class="tw-overflow-y-auto">
      <loader v-if="t.component" :module="t.component" v-model="t.params"></loader>
    </ada-tab>
  </ada-tabs>
</template>