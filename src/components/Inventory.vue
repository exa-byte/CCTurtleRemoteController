<template>
  <div class="panel">
    <div class="inventory-container">
      <GenericInventorySlot
        v-for="slotIdx in inventorySize"
        :key="`${inventory[slotIdx-1] && inventory[slotIdx-1].name}${inventory[slotIdx-1] && inventory[slotIdx-1].count}`"
        :turtleId="-1"
        :invSlot="inventory[slotIdx-1]"
        :slotNum="slotIdx"
        :isSelected="false"
      />
    </div>
  </div>
</template>

<style scoped>
.inventory-container {
  height: px;
  width: 576px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  /* grid-gap: 3%; */
  background-color: lightgray;
}

.panel {
  background-color: lightgray;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import GenericInventorySlot from "./GenericInventorySlot.vue";
import { useWorldStore } from "../store/useWorld";
import { Inventory } from "../types/types";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    return { world };
  },
  components: { GenericInventorySlot },
  props: {
    inventory: {
      required: true,
      type: Object as PropType<Inventory>,
    },
    inventorySize: {
      required: true,
      type: Number,
    }
  }
});
</script>
