<template>
  <div
    draggable
    @drop="onDrop($event)"
    @dragstart="startDrag($event)"
    @dragover.prevent
    @dragenter.prevent
    :class="{ 'inventory-slot': true, 'inventory-selected-slot': isSelected }"
    :title="invSlot ? invSlot.name : ''"
  >
    <img
      class="item-icon"
      :src="
        invSlot
          ? world.textureURL + 'items/' + invSlot.name.replace(':', '/') + '.png'
          : 'https://dummyimage.com/64x64/383e42/383e42.jpg'
      "
      @error="getDefaultItemImage"
    />
    <div v-if="invSlot" class="caption BR">
      {{ invSlot ? invSlot.count : "" }}
    </div>
  </div>
</template>

<style scoped>
.inventory-slot { 
  background-color: #666666;
  color: darkgray;
  min-width: 0;
  min-height: 0;
  padding: 10%;

  display: block;
  position: relative;
  cursor: pointer;

  /* border-style: solid;
  border-width: 10%;
  border-right-color: lightgray;
  border-bottom-color: lightgray;
  vertical-align: middle;
  background-color: gray; */
}
.inventory-selected-slot {
  background-color: rgb(49, 172, 1);
}
.caption {
  font-size: 100%;
  font-weight: bolder;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  user-select: none;
}
.BR {
  position: absolute;
  bottom: 10%;
  right: 15%;
}

img.item-icon {
  max-width: 100%;
  width: 100%;
  /* IE, only works on <img> tags */
  -ms-interpolation-mode: nearest-neighbor;
  /* Firefox */
  image-rendering: crisp-edges;
  /* Chromium + Safari */
  image-rendering: pixelated;
}
</style>


<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useWorldStore } from "../store/useWorld";
import { ItemStack } from "../types/types";

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
    isSelected: Boolean,
    invSlot: Object as PropType<ItemStack>,
    slotNum: Number,
  },
  methods: {
    startDrag(evt: any) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("slotFrom", this.slotNum);
    },
    onDrop(evt: any) {
      const slotFrom = evt.dataTransfer.getData("slotFrom");
      console.log(`Transfer from slot ${slotFrom} to ${this.slotNum}`);
      this.world.sendCommand(
        this.turtleId,
        `local oldSelected = turtle.getSelectedSlot();
        tapi.select(${slotFrom});
        turtle.transferTo(${this.slotNum}, ${evt.ctrlKey ? 64 : 1});
        tapi.select(oldSelected);
        tapi.send_status_update();`
      );
    },
    getDefaultItemImage(evt: any) {
      evt.target.src = "https://dummyimage.com/64x64/000/aaa.jpg&text=Item";
    },
  },
});
</script>
