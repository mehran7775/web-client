<template>
  <v-snackbar v-model="show" :top="true" :color="color" :timeout="timeout">
    <h4>{{ $t(message) }}</h4>
    <template v-slot:action="{ attrs }">
      <v-btn color="primary" v-bind="attrs" @click="show = false">
        {{ $t("general.ok") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: "",
    color: "",
    timeout: 5000,
  }),
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snacks/showMessage") {
        this.message = state.snacks.content;
        this.color = state.snacks.color;
        this.show = true;
      }
    });
  },
  methods: {},
};
</script>
