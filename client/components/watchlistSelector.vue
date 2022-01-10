<template>
  <v-select
    height="32"
    :menu-props="{
      bottom: true,
      'offset-y': true,
    }"
    :placeholder="$t('watchList.title')"
    :items="watchList"
    class="watchlist-select"
    item-text="text"
    item-value="id"
    @input="
      (val) => {
        select(val);
      }
    "
    v-model="selected"
    flat
    no-filter
    rounded
    hide-details
    return-object
    single-line
    dense
  />
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  useRoute,
  useRouter,
  computed,
  ref,
  Ref,
} from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    autoRoute: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const selected: Ref<any> = ref(null);
    const watchList = computed(() => {
      const lists = store.getters["sso/user/watchList"];
      const res = Object.keys(lists).map((k) => {
        return {
          text: k,
          id: k,
          to: "/watchList/" + k,
        };
      });
      return res;
    });
    function select(val: any) {
      if (props.autoRoute) router.push(val.to);
    }
    selected.value = watchList.value.find(
      (item) => item.id == route.value.params.name
    );

    return {
      select,
      selected,
      watchList,
    };
  },
});
</script>

<style lang="sass" scoped>
.watchlist-select
  background-color: var(--v-common-base)
  border-radius: 8px
</style>
