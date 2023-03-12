<template>
  <textarea
    @keydown.stop
    class="lua-code"
    v-model="cmd"
    placeholder="write lua code here, e.g. return 42"
  ></textarea>
  <button id="execute" @click="world.sendCommand(turtleId, cmd)">Execute</button>
  <div class="command-result">{{ world.commandResult[worldView.selectedTurtleId] }}</div>
</template>

<style scoped>
.lua-code {
  height: 24px;
  background-color: #383e42;
  color: darkgray;
}
#execute {
  background-color: #383e42;
  color: darkgray;
}
.command-result {
  background-color: #383e42;
  color: darkgray;
  word-wrap: break-word;
  width: 300px;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";

export default defineComponent({
  setup() {
    let world = useWorldStore();
    let worldView = useWorldViewStore();
    let cmd: string = "";
    return { world, worldView, cmd };
  },
  data() {
    return {
      message: "" as String,
    };
  },
  props: {
    turtleId: {
      required: true,
      type: Number,
    },
  },
});
</script>
