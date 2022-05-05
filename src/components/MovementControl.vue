<template>
  <div class="panel">
    <div class="move-btn-container">
      <button @click="world.sendCommand(turtleId, 'tapi.down()')">Down</button>
      <button @click="world.sendCommand(turtleId, 'tapi.forward()')">Forward</button>
      <button @click="world.sendCommand(turtleId, 'tapi.up()')">Up</button>
      <button @click="world.sendCommand(turtleId, 'tapi.left()')">Turn Left</button>
      <button @click="world.sendCommand(turtleId, 'tapi.back()')">Back</button>
      <button @click="world.sendCommand(turtleId, 'tapi.right()')">Turn Right</button>
      <button @click="world.sendCommand(turtleId, 'tapi.suckAll()')">Suck All</button>
      <!-- <button @click="world.sendCommand(turtleId, programRandomExplore)">Explore</button> -->
      <button @click="worldView.focusOnTurtle(turtleId)">Focus Camera</button>
      <button @click="worldView.followTurtle(turtleId)">Toggle Follow</button>
      <button @click="world.sendCommand(turtleId, 'tapi.digDown()')">Dig Down</button>
      <button @click="world.sendCommand(turtleId, 'tapi.dig()')">Dig</button>
      <button @click="world.sendCommand(turtleId, 'tapi.digUp()')">Dig Up</button>
      <button @click="world.sendCommand(turtleId, 'tapi.placeDown()')">Place Down</button>
      <button @click="world.sendCommand(turtleId, 'tapi.place()')">Place</button>
      <button @click="world.sendCommand(turtleId, 'tapi.placeUp()')">Place Up</button>
      <button @click="world.sendCommand(turtleId, 'tapi.dropDown()')">Drop Down</button>
      <button @click="world.sendCommand(turtleId, 'tapi.drop()')">Drop</button>
      <button @click="world.sendCommand(turtleId, 'tapi.dropUp()')">Drop Up</button>
      <button @click="world.sendCommand(turtleId, programVeinMiner)">Mine Vein</button>
      <button @click="world.sendCommand(turtleId, programTreeMiner)">Mine Tree</button>
      <button @click="world.sendCommand(turtleId, 'tapi.craft()')">Craft</button>
      <button @click="world.sendCommand(turtleId, 'tapi.refuel()')">Refuel</button>
      <button @click="world.sendCommand(turtleId, programStairsToLava)">Stairs Down</button>
      <button @click="world.sendCommand(turtleId, programMiningTunnel2)">Mining Tunnel 2</button>
      <button @click="world.sendCommand(turtleId, programMiningTunnel3)">Mining Tunnel 3</button>
      <button @click="world.sendCommand(turtleId, 'while turtle.attack() do end')">⚔️ATTACK⚔️</button>
    </div>
  </div>
</template>

<style scoped>
.move-btn-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

button {
  padding: 35% 0px;
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

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView, programRandomExplore, programVeinMiner, programTreeMiner, programStairsToLava, programMiningTunnel2, programMiningTunnel3 };
  },
  props:{
    turtleId: {
      required: true,
      type: Number,
    }
  }
});
</script>
