<template>
  <div class="panel">
    <div class="inventory-container">
      <InventorySlot
        v-for="[index, slot] in world.turtles[turtleId].inv.entries()"
        :key="index + 1"
        :turtleId="turtleId"
        :invSlot="slot"
        :slotNum="index + 1"
        :isSelected="index === world.turtles[turtleId].selectedSlot - 1"
        @click="
          world.sendCommand(
            turtleId,
            'tapi.select(' + (index + 1).toString() + ')'
          )
        "
      />
    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  height: 256px;
  width: 256px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3%;
  background-color: #383e42;
  color: darkgray;
}

.panel {
  background-color: #383e42;
  color: darkgray;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import InventorySlot from "./InventorySlot.vue";
import { useWorldStore } from "../store/useWorld";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    return { world };
  },
  components: { InventorySlot },
  props: {
    turtleId: {
      required: true,
      type: Number,
    },
  },
});
</script>
