<template>
  <meter
    class="fuel-gauge"
    :value="world.turtles[turtleId].fuelLevel"
    :min="0"
    :max="world.turtles[turtleId].fuelLimit"
  >
    TEST
  </meter>
</template>

<style scoped>
meter {
  height: 20px;
  width: 100%;
}

meter::after {
  position: relative;
  content: attr(value);
  top: -18px;
  transform: translateX(-50%);
  transform: translateY(-50%);
  color: lime;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    return { world };
  },
  props: {
    turtleId: {
      required: true,
      type: Number,
    },
  },
});
</script>
