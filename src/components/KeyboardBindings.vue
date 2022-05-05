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
        case 'w':   this.sendTurtleCmd('tapi.forward()'); break;
        case 's':   this.sendTurtleCmd('tapi.back()');    break;
        case 'a':   this.sendTurtleCmd('tapi.left()');    break;
        case 'd':   this.sendTurtleCmd('tapi.right()');   break;
        case 'q':   this.sendTurtleCmd('tapi.down()');    break;
        case 'e':   this.sendTurtleCmd('tapi.up()');      break;
        case 'Delete': this.clearCmdQueue();              break;
        // case 's':   this.sendTurtleCmd('tapi.forward()'); break;
        // case 's':   this.sendTurtleCmd('tapi.forward()'); break;
        // case 's':   this.sendTurtleCmd('tapi.forward()'); break;
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
