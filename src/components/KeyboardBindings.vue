<template>
  
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView };
  },
  methods: {
    addKeyboardBindings() {
      document.addEventListener("keydown", this.handleKeyDown);
    },
    handleKeyDown(keyEvent: KeyboardEvent) {
      console.log(keyEvent.key);
      switch(keyEvent.key) {
        case 'w':   this.sendTurtleCmd('return tapi.forward()'); break;
        case 's':   this.sendTurtleCmd('return tapi.back()');    break;
        case 'a':   this.sendTurtleCmd('return tapi.left()');    break;
        case 'd':   this.sendTurtleCmd('return tapi.right()');   break;
        case 'q':   this.sendTurtleCmd('return tapi.down()');    break;
        case 'e':   this.sendTurtleCmd('return tapi.up()');      break;
        case 'Delete': this.clearCmdQueue();              break;
      }
    },
    sendTurtleCmd(cmd: string) {
      if (this.worldView.selectedTurtleId < 0) return;
      this.world.sendCommand(this.worldView.selectedTurtleId, cmd);
    },
    clearCmdQueue() {
      if (this.worldView.selectedTurtleId < 0) return;
      this.world.clearCommandQueue(this.worldView.selectedTurtleId);
    },
  },
  mounted() {
    this.addKeyboardBindings();
  },
});
</script>
