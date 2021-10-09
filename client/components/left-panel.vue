<template class="white">
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-badge :value="false" left dot color="error">
            <v-icon v-if="isExpanded" @click.stop="onClick('open')">
              mdi-bell
            </v-icon>
            <v-icon v-if="!isExpanded" @click.stop="onClick('close')">
              mdi-close
            </v-icon>
          </v-badge>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item v-if="!isExpanded">
        <v-list-item-content class="d-block">
          <v-tabs
            fluid
            v-model="tab"
            background-color="white"
            color="black"
            grow
          >
            <v-tab v-for="(tabItem, tabIndex) in tabList" :key="tabIndex">
              {{ tabItem.title }}
            </v-tab>
          </v-tabs>
          <v-card flat>
            <v-text-field
              v-model="searchInput"
              label="جستجو"
              solo
              dense
              @keyup.enter="searchTag()"
            ></v-text-field>
            <v-chip
              v-for="(chip, chipIndex) in chipList"
              :key="chipIndex"
              class="ma-2"
              close
              @click:close="onChipClose(chip)"
            >
              {{ chip }}
            </v-chip>
          </v-card>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(tabItem, tabIndex) in tabList" :key="tabIndex">
              <v-card flat>
                <v-list>
                  <v-card-text
                    v-for="(notificatonItem, notificatonIndex) in tabItem.list"
                    :key="notificatonIndex"
                    >{{ notificatonItem }}</v-card-text
                  >
                </v-list>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "@vue/composition-api";

export default defineComponent({
  props: {
    isExpanded: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const tabList = ref([
      { title: "من", list: ["پیام اول"] },
      { title: "همه", list: ["پیام اول", " پیام دوم"] },
    ]);
    const tab = ref(null);
    const searchInput = ref("");
    const chipList: Array<object> = reactive([]);

    function onClick(type: string) {
      emit(type);
    }
    function onChipClose(chip: any) {
      let index = chipList.indexOf(chip);
      if (index !== -1) {
        chipList.splice(index, 1);
      }
    }
    function addChips(chip: any) {
      chipList.push(chip);
    }
    function searchTag() {
      // if (searchInput.value.length > 3) {
      addChips(searchInput.value);
      // }
    }

    return {
      tabList,
      tab,
      searchInput,
      chipList,
      onClick,
      onChipClose,
      searchTag,
    };
  },
});
</script>
