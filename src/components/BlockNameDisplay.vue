<template>
  <div class="pos-abs">
    <h2 class="hovered-block-text" v-if="worldView.hoveredBlock">
      {{ worldView.hoveredBlock.name }}:{{ worldView.hoveredBlock.metadata }}
    </h2>
    <h2 class="hovered-block-text" v-if="worldView.hoveredBlockPos">
      {{ worldView.hoveredBlockPos.x }}:{{ worldView.hoveredBlockPos.y }}:{{ worldView.hoveredBlockPos.z }}
    </h2>
  </div>
</template>

<style scoped>

.hovered-block-text {
    color: lightgray;
    user-select: none;
    white-space: nowrap;
}
.pos-abs {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldViewStore } from "../store/useWorldView";

export default defineComponent({
  setup() {
    const worldView = useWorldViewStore();
    return { worldView };
  },
});
</script>
