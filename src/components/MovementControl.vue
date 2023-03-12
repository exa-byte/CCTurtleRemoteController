<template>
  <div class="panel">
    <div class="move-btn-container">
      <button @click="world.sendCommand(turtleId, 'return tapi.down()')">Down (q)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.forward()')">Forward (w)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.up()')">Up (e)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.left()')">Turn Left (a)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.back()')">Back (s)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.right()')">Turn Right (d)</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.suckAll()')">Suck All</button>
      <!-- <button @click="world.sendCommand(turtleId, programRandomExplore)">Explore</button> -->
      <button @click="worldView.focusOnTurtle(turtleId)">Focus Camera</button>
      <button @click="worldView.followTurtle(turtleId)">Toggle Follow</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.digDown()')">Dig Down</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.dig()')">Dig</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.digUp()')">Dig Up</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.placeDown()')">Place Down</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.place()')">Place</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.placeUp()')">Place Up</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.dropDown()')">Drop Down</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.drop()')">Drop</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.dropUp()')">Drop Up</button>
      <button @click="world.sendCommand(turtleId, programVeinMiner)">Mine Vein</button>
      <button @click="world.sendCommand(turtleId, programTreeMiner)">Mine Tree</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.craft()')">Craft</button>
      <button @click="world.sendCommand(turtleId, 'return tapi.refuel()')">Refuel</button>
      <button @click="world.sendStopSignal(turtleId)">🛑 Stop 🛑</button>
      <!-- <button @click="world.sendCommand(turtleId, programStairsToLava)">Stairs Down</button>
      <button @click="world.sendCommand(turtleId, programMiningTunnel2)">Mining Tunnel 2</button>
      <button @click="world.sendCommand(turtleId, programMiningTunnel3)">Mining Tunnel 3</button> -->
      <!-- <button @click="world.sendCommand(turtleId, 'while turtle.attack() do end')">⚔️ATTACK⚔️</button> -->
      <button @click="world.sendCommand(turtleId, skynetExpander)">New Turtle</button>
    </div>
  </div>
</template>

<style scoped>
.move-btn-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

button {
  padding: 10% 0px;
  border-radius: 4px 4px;
  background-color: #383e42;
  color: darkgray;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import programRandomExplore from "../turtlePrograms/randomExplore.lua?raw"
import programVeinMiner from "../turtlePrograms/veinMiner.lua?raw"
import programTreeMiner from "../turtlePrograms/treeMiner.lua?raw"
import programStairsToLava from "../turtlePrograms/stairsToLava.lua?raw"
import programMiningTunnel2 from "../turtlePrograms/miningTunnel2.lua?raw"
import programMiningTunnel3 from "../turtlePrograms/miningTunnel3.lua?raw"
import skynetExpander from "../turtlePrograms/skynetExpander.lua?raw"

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView, programRandomExplore, programVeinMiner, programTreeMiner, programStairsToLava, programMiningTunnel2, programMiningTunnel3, skynetExpander };
  },
  props:{
    turtleId: {
      required: true,
      type: Number,
    }
  }
});
</script>
