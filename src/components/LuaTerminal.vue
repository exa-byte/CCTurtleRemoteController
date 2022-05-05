<template>
  <textarea @keydown.stop class="lua-code" v-model="cmd" placeholder="write lua code here"></textarea>
  <button @click="world.sendCommand(turtleId, cmd)">Execute</button>
</template>

<style scoped>
.lua-code {
  height: 24px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";

export default defineComponent({
  setup() {
    let world = useWorldStore();
    let cmd: string = "";
    return { world, cmd };
  },
  data() {
    return {
      message: "" as String,
    };
  },
  props:{
    turtleId: {
      required: true,
      type: Number,
    }
  },
  methods: {
    sendCommand() {

    }
  }
});
</script>
