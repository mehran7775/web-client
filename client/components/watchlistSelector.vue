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
    flat
    no-filter
    rounded
    hide-details
    return-object
    dense
  />
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  useContext,
  ref,
  Ref,
  computed,
  reactive,
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
    const ctx = useContext();
    const watchList = computed(() => {
      const lists = store.getters["sso/user/watchList"];
      const res = [];
      for (let k in lists) {
        res.push({
          text: k,
          id: k,
          to: "/watchList/" + k,
        });
      }
      return res;
    });
    function select(val: any) {
      if (props.autoRoute) ctx.redirect(val.to);
    }
    return {
      select,
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
