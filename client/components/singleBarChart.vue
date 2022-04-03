<template >
<div class="single-bar-chart" :style="style">
</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "#app";

export default defineComponent({
  props: {
    xPosition: {
      type: String,
      default: "left",
    },
    yPosition: {
      type: String,
      default: "top",
    },
    x: {
      type: [Number, String],
      default: 0,
    },
    y: {
      type: [Number, String],
      default: 0,
    },
    vartical: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      require: true,
    },
  },
  setup(props) {
    const style = computed(() => {
      return (
        "background-color: " +
        (props.success ? "#00BD79" : "#FF3B30") +
        ";" +
        props.xPosition +
        ": " +
        props.x +
        ";" +
        props.yPosition +
        ": " +
        props.y +
        ";" +
        "width: " +
        props.value +
        "%;"
        // +
        // (props.xPosition == "left"
        //   ? "border-radius: 0px 6px 6px 0px;"
        //   : "border-radius: 6px 0px 0px 6px;")
      );
    });
    return {
      style,
    };
  },
});
</script>

<style lang="postcss" scoped>
.single-bar-chart {
  position: absolute;
  content: "";
  height: 100%;
  opacity: 0.15;
}
</style>
