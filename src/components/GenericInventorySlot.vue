<template>
  <div class="inventory-slot" :title="invSlot ? invSlot.name : ''">
    <img
      class="item-icon"
      :src="
        invSlot
          ? world.textureURL +
            'items/' +
            invSlot.name.replace(':', '/') +
            '.png'
          : 'https://dummyimage.com/64x64/aaa/aaa.jpg'
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
  background-color: gray;
  min-width: 0;
  min-height: 0;
  padding: 10%;

  display: block;
  position: relative;
  color: white;
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
    invSlot: Object as PropType<ItemStack>,
    slotNum: Number,
  },
  methods: {
    getDefaultItemImage(evt: any) {
      evt.target.src = "https://dummyimage.com/64x64/000/aaa.jpg&text=Item";
    },
  },
});
</script>
