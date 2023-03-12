<template>
  <div class="hud">
    <h1 v-if="world.isLoading" class="centered">
      LOADING ... (depending on the number of blocks this might take some
      seconds)
    </h1>
    <div>
      <select v-model="worldView.selectedTurtleId" @change="worldView.followTurtle(worldView.selectedTurtleId)">
        <option v-for="id in world.getTurtleIds" :key="id" :value="id">Turtle {{ id }} : {{ world.turtles[id].label }}</option>
      </select>
      <TurtlePanel
        v-if="Number(worldView.selectedTurtleId) != -1"
        :turtleId="Number(worldView.selectedTurtleId)"
      />
    </div>
    <Inventory
      v-if="worldView.selectedInventory"
      :inventory="worldView.selectedInventory"
      :inventorySize="worldView.selectedInventorySize"
      style="grid-column: 2"
    />
    <Scene />
    <KeyboardBindings />
    <BlockNameDisplay />
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  display: grid;
}
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

select {
  padding: 4px;
  border-radius: 4px;
  background-color: rgb(52, 52, 52);
  color: darkgray;
  font-weight: bold;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import TurtlePanel from "./TurtlePanel.vue";
import Inventory from "./Inventory.vue";
import BlockNameDisplay from "./BlockNameDisplay.vue";
import Scene from "./Scene.vue";
import KeyboardBindings from "./KeyboardBindings.vue";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView };
  },
  data() {
    return {
      turtleId: -1 as Number,
    };
  },
  components: {
    TurtlePanel,
    Scene,
    BlockNameDisplay,
    Inventory,
    KeyboardBindings,
  },
  methods: {
    pollStatus() {
      const world = useWorldStore();
      const worldView = useWorldViewStore();

      fetch(world.apiURL + "getStateUpdate", {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastTransactionId: world.lastTransactionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.state) {
            world.setTurtleStatus(data.state.turtle);
            world.blocks = data.state.world.blocks;
            worldView.regenerateSceneFromBlocks();
            world.lastTransactionId = data.state.lastTransactionId;
            world.isLoading = false;
          } else {
            world.applyTransactions(data.transactions);
          }
          worldView.render();
        })
        .finally(() => setTimeout(() => this.pollStatus(), 400));

      fetch(world.apiURL + "getCommandResult", {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          turtleId: worldView.selectedTurtleId,
          getOnlyLatest: true,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            world.commandResult[data.turtleId] = data.result.ret;
          }
        });
    },
  },
  mounted() {
    this.pollStatus();
  },
});
</script>
