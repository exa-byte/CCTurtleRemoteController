<template>
  <div class="panel">
    <TurtleInventory :turtleId="turtleId"/>
    <FuelGauge :turtleId="turtleId"/>
    <MovementControl :turtleId="turtleId"/>
    <LuaTerminal :turtleId="turtleId"/>
  </div>
</template>

<style scoped>
.panel {
  display: grid;
  grid-gap: 1%;
  justify-content: center;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import MovementControl from "./MovementControl.vue";
import TurtleInventory from "./TurtleInventory.vue";
import LuaTerminal from "./LuaTerminal.vue"
import { useWorldStore } from "../store/useWorld";
import FuelGauge from "./FuelGauge.vue";
import { useWorldViewStore } from "../store/useWorldView";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView }
  },
  components: { MovementControl, TurtleInventory, LuaTerminal, FuelGauge },
  props: {
    turtleId: {
      required: true,
      type: Number
    },
  },
});
</script>
